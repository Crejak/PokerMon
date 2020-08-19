class Generation {
    constructor(id, name, moves, pokemon_species, abilities, items) {
        this.id = id;
        this.name = name;
        this.moves = moves;
        this.pokemon_species = pokemon_species;
        this.abilities = abilities;
        this.items = items;
    }
}

class PokeApiClient {
    constructor() {
        this.baseUrl = "https://pokeapi.co/api/v2/";
        this.language = "fr";
        this.fallbackLanguage = "en";
        this.gens = [];
        this.cache = {};

        this.readyPromise = this._getGeneration()
        .then(async (response) => {
            let genCount = response.count;
            let genRefs = response.results;
            let lastGen = undefined;
    
            for (let genRef of genRefs) {
                let gen = await this._call(genRef.url);
                lastGen = new Generation(
                    gen.id,
                    this._name(gen),
                    lastGen ? lastGen.moves.concat(gen.moves) : gen.moves.slice(),
                    lastGen ? lastGen.pokemon_species.concat(gen.pokemon_species) : gen.pokemon_species.slice(),
                    lastGen ? lastGen.abilities.concat(gen.abilities) : gen.abilities.slice(),
                    //items
                );
                this.gens.push(lastGen);
            }

            console.log(this);
        });
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
        if (flavorTexts.length > 0) {
            return flavorTexts;
        }
        flavorTexts = flavorTextResource.flavor_text_entries.filter(entry =>
            entry.language.name === this.fallbackLanguage
        );
        return flavorTexts;
    }
    
    _url (endpoint, id) {
        if (!endpoint.endsWith("/")) {
            endpoint += "/";
        }
        if (!id) {
            id = "";
        }
        return this.baseUrl + endpoint + id;
    }

    async _call (url) {
        let cachedResource = this.cache[url];

        if (cachedResource !== undefined) {
            return cachedResource;
        }

        let response = await fetch(url);
        let json = await response.json();
        this.cache[url] = json;
        return json;
    }
    
    async _getGeneration (id) {
        let response = await this._call(this._url("generation", id));
        return response;
    }

    async ready () {
        return await this.readyPromise; 
    }

    getName (namedResource) {
        return this._name(namedResource);
    }

    getFlavorTexts (flavorTextResource) {
        return this._flavorTexts(flavorTextResource);
    }

    getGen (id) {
        if (!id) {
            return this.gens;
        }

        return this.gens.find(gen => gen.id === id);
    }

    async get (resourceAccess) {
        return await this._call(resourceAccess.url);
    }

    async getPokemon (id) {
        return await this._call(this._url("pokemon", id));
    }

    async getMove (id) {
        return await this._call(this._url("move", id));
    }

    async getAbility (id) {
        return await this._call(this._url("ability", id));
    }

    async getType (id) {
        return await this._call(this._url("type", id));
    }

    async getNature (id) {
        return await this._call(this._url("nature", id));
    }
}