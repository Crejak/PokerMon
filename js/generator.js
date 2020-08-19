const MALE = "male";
const FEMALE = "female";
const GENDERLESS = "genderless"

class Pokemon {
    constructor (species, level, gender, nature, ability, moves) {
        this.species = species;
        this.level = level;
        this.gender = gender;
        this.nature = nature;
        this.ability = ability;
        this.moves = moves;
    }
}

class Generator {
    constructor (pokeApiClient) {
        this.pokeApiClient = pokeApiClient;
        this.generationId = 1;
        this.pokemonLevel = 50;
    }

    
    shuffle (a) {
        for (let i = a.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [a[i], a[j]] = [a[j], a[i]];
        }
        return a;
    }

    _randInt (max) {
        return Math.floor(Math.random() * max);
    }

    _choose (list) {
        let randomIndex = this._randInt(list.length);
        return list[randomIndex];
    }

    async _chooseGet (list) {
        let ra = this._choose(list);
        return await this.pokeApiClient.get(ra);
    }

    _chooseMultiple (list, count) {
        let indexes = [...Array(list.length).keys()];
        indexes = this.shuffle(indexes);
        return indexes.slice(0, count).map(index => list[index]);
    }

    async _chooseGetMultiple (list, count) {
        let raList = this._chooseMultiple(list, count);
        let resources = [];
        for (let ra of raList) {
            resources.push(await this.pokeApiClient.get(ra));
        }
        return resources;
    }

    _randGender (genderRate) {
        if (genderRate === -1) {
            return GENDERLESS;
        }

        if (genderRate === 8) {
            return FEMALE;
        }
        if (genderRate === 0) {
            return MALE;
        }

        let treshold = genderRate / 8;
        let isFemale = Math.random() < treshold;
        return isFemale
            ? FEMALE
            : MALE;
    }

    setGenerationId (generationId) {
        this.generationId = generationId;
    }

    setPokemonLevel (pokemonLevel) {
        this.pokemonLevel = pokemonLevel;
    }

    async generatePokemon () {
        let gen = this.pokeApiClient.getGen(this.generationId);
        
        let species = await this._chooseGet(gen.pokemon_species);

        let natures = (await this.pokeApiClient.getNature()).results;
        let nature = await this._chooseGet(natures);

        let ability = gen.abilities.length > 0
            ? await this._chooseGet(gen.abilities)
            : undefined;

        let moves = await this._chooseGetMultiple(gen.moves, 4);
        
        return new Pokemon(
            species,
            this.pokemonLevel,
            this._randGender(species.gender_rate),
            nature,
            ability,
            moves
        );
    }
}