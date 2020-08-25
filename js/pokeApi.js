class Generation {
    constructor(id, name, versionGroups, moves, pokemons, pokemon_species, abilities, items) {
        this.id = id;
        this.name = name; //string
        this.versionGroups = versionGroups; //resource + attribute "versions" resource
        this.moves = moves; //ra
        this.pokemons = pokemons; //resource
        this.pokemon_species = pokemon_species; //resource
        this.abilities = abilities; //resource
        this.items = items;
    }
}

class VersionGroup {
    constructor(id, order, generationId, pokemons, versions) {
        this.id = id;
        this.order = order;
        this.generationId = generationId;
        this.pokemons = pokemons;
        this.versions = versions;
    }
}

class PokeApiClient {
    constructor() {
        this.baseUrl = "https://pokeapi.co/api/v2/";
        this.language = "fr";
        this.fallbackLanguage = "en";
        this.gens = []; //TODO! récupérer aussi les groupes de version
        this.vgs = [];
        this.cache = {};

        this.readyPromise = this._getGeneration()
        .then(async (response) => {
            let genCount = response.count;
            let genRas = response.results;
            let lastGen = undefined;
    
            for (let genRa of genRas) { // Loop the gens, to create the corresponding objects
                let gen = await this.get(genRa);

                let pokemon_species = lastGen ? lastGen.pokemon_species.concat(gen.pokemon_species) : gen.pokemon_species.slice();

                let pokemons = lastGen ? lastGen.pokemons.slice() : [];
                for (let [index, speciesRa] of gen.pokemon_species.entries()) { //Extract pokemons from the species
                    let species = await this.get(speciesRa);
                    gen.pokemon_species[index] = species;
                    for (let variety of species.varieties) {
                        let pokemon = await this.get(variety.pokemon);
                        pokemons.push(pokemon);
                    }
                }

                let abilities = [];
                for (let ra of gen.abilities) { // Get and filter abilities (main series only)
                    let ability = await this.get(ra);
                    if (ability.is_main_series) {
                        abilities.push(ability);
                    }
                }

                let versionGroups = [];
                for (let ra of gen.version_groups) { // Construction des groupes de versions
                    let versionGroup = await this.get(ra);

                    let versions = [];
                    for (let versionRa of versionGroup.versions) {
                        let version = await this.get(versionRa);
                        versions.push(version);
                    }

                    this.vgs.push(new VersionGroup(
                        versionGroup.id,
                        versionGroup.order,
                        gen.id,
                        [], // On rempli les Pokémon après
                        versions
                    ));
                    
                    versionGroup.versions = versions;
                    versionGroups.push(versionGroup);
                }

                lastGen = new Generation(
                    gen.id,
                    this._name(gen),
                    versionGroups,
                    lastGen ? lastGen.moves.concat(gen.moves) : gen.moves.slice(), //TODO! filtrer les moves sur la série principale (ex: 10001)
                    pokemons,
                    pokemon_species,
                    lastGen ? lastGen.abilities.concat(abilities) : abilities.slice(),
                    //items
                );
                this.gens.push(lastGen);
            }

            //Second step : loop all Pokémons to fit them into version groups
            // By construction, lastGen contains all Pokémon, we can loop over it :
            for (let pokemon of lastGen.pokemons) {
                // We need to add this pokémon to all versionGens it belong.
                let forms = pokemon.forms;
                if (forms.length !== 1) {
                    console.error("Alerte ! Pokémon avec " + forms.length + " formes !");
                    console.log(pokemon);
                }
            }
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
        let url = this.baseUrl + endpoint + id;
        if (!url.endsWith("/")) {
            url += "/";
        }
        return url;
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