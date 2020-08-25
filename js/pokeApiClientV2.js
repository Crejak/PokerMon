const PAC2_BASE_URL = "https://pokeapi.co/api/v2/";

class PokeApiClientV2 {
    constructor () {
        this.cache = {};
        this.language = undefined;
        this.fallbackLanguage = "en";
        this.flavorVersionGroup = undefined;
        this.flavorVersion = undefined;
    }

    _name (namedResource) {
        let localName = namedResource.names.find((n) =>
            n.language.name === this.language
        );
        if (!!localName) {
            return localName.name;
        }
        let fallbackName = namedResource.names.find((n) =>
            n.language.name === this.fallbackLanguage
        );
        if (!!fallbackName) {
            return fallbackName;
        }
        return namedResource.name;
    }

    _flavorTexts (flavorTextResource) {
        let flavorTexts = flavorTextResource.flavor_text_entries.filter(entry =>
            entry.language.name === this.language
        );
        if (flavorTexts.length === 0) {
            flavorTexts = flavorTextResource.flavor_text_entries.filter(entry =>
                entry.language.name === this.fallbackLanguage
            );
        }
        if (!!this.flavorVersion) {
            let filteredByVersion = flavorTexts.filter(entry =>
                (!!entry.version && entry.version.name === this.flavorVersion)
                || (!!entry.version_group && entry.version_group.name === this.flavorVersionGroup)
            );
            if (filteredByVersion.length > 0) {
                flavorTexts = filteredByVersion;
            }
        }
        return flavorTexts;
    }

    _url (endpoint, id) {
        if (!endpoint.endsWith("/")) {
            endpoint += "/";
        }
        if (!id) {
            id = "";
        }
        let url = this.baseUrl + endpoint + id;
        if (!url.endsWith("/")) {
            url += "/";
        }
        return url;
    }

    async _call (url) {
        let cachedResource = this.cache[url];

        if (cachedResource !== undefined) {
            return Utils.clone(cachedResource);
        }

        let response = await fetch(url);
        let json = await response.json();
        this.cache[url] = Utils.clone(json);
        return json;
    }

    async get (access, includeFields = []) {
        let url;
        if (typeof(access) === "string") {
            url = access;
        } else if (!!access.url) {
            url = access.url;
        } else {
            throw "Invalid access object : " + access;
        }

        let resource = await this._call(url);
        for (let fieldDesc of includeFields) {
            let fieldPath;
            let fieldArPath;
            let nestedIncludeFields = [];
            
            if (typeof(fieldDesc) === "string") {
                fieldPath = fieldDesc;
            } else if (!!fieldDesc.path) {
                fieldPath = fieldDesc.path;
                if (!!fieldDesc.includeFields) {
                    nestedIncludeFields = fieldDesc.includeFields;
                }
                if (!!fieldDesc.arPath) {
                    fieldArPath = fieldDesc.arPath;
                }
            } else {
                throw "Invalid field in includeFields : " + fieldDesc;
            }

            let field = Utils.access(resource, fieldPath);
            let fieldAr = field;
            
            if (Array.isArray(field)) {
                for (let i = 0; i < field.length; ++i) {
                    let item = field[i];
                    fieldAr = item;
                    if (!!fieldArPath) {
                        fieldAr = Utils.access(item, fieldArPath);
                    }
                    let itemResource = await this.get(fieldAr, nestedIncludeFields);
                    if (!!fieldArPath) {
                        Utils.update(item, fieldArPath, itemResource);
                    } else {
                        field[i] = itemResource;
                    }
                }
            } else {
                if (!!fieldArPath) {
                    fieldAr = Utils.access(field, fieldArPath);
                }
                let fieldResource = await this.get(fieldAr, nestedIncludeFields);
                if (!!fieldArPath) {
                    Utils.update(field, fieldArPath, fieldResource);
                } else {
                    Utils.update(resource, fieldPath, fieldResource);
                }
            }
        }

        if (!!this.language) {
            if (!!resource.names) {
                resource._pac_name = this._name(resource);
            }
            if (!!resource.flavor_text_entries) {
                resource._pac_flavorTexts = this._flavorTexts(resource);
            }
        }

        return resource;
    }
};

_gl_pokeApi = new PokeApiClientV2 ();