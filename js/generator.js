const MALE = "male";
const FEMALE = "female";
const GENDERLESS = "genderless"

//////////////////////
//  Pokémon generation

/**
 * Random species, default variety of that species
 */
const PK_SPECIES = "pk_species";
/**
 * Random variety
 */
const PK_PKMN = "pk_pkmn";


/////////////////
//  IV generation

/**
 * Max IV for each stat (31)
 */
const IV_MAX = "iv_max";
/**
 * Random IV for each stat (0-31)
 */
const IV_RANDOM = "iv_random";
/**
 * Zero IV for each stat
 */
const IV_ZERO = "iv_zero";

/////////////////
//  EV generation

/**
 * Random EVs for each stat, only multiples of 4,
 * with a total between 0 and 508
 */
const EV_RANDOM = "ev_random";
/**
 * Random EVs for each stat, with a total between 0 and 510
 */
const EV_TRUE_RANDOM = "ev_true_random";
/**
 * Random EVs for each stat, only multiples of 4,
 * with a total of exactly 508
 */
const EV_RANDOM_MAX = "ev_random_max";
/**
 * Random EVs for each stat, with a total of exactly 510
 */
const EV_TRUE_RANDOM_MAX = "ev_true_random_max";
/**
 * Zero IV for each stat
 */
const EV_ZERO = "ev_zero";

///////////////////
//  Move generation

/**
 * Random moves
 */
const MV_RANDOM = "mv_random";
/**
 * Random moves among the moves the pokemon can learn
 */
const MV_PKMN_MOVES = "mv_pmkn_moves";
/**
 * Random moves with the same type as the pokemon
 */
const MV_PKMN_TYPE = "mv_pkmn_type";
/**
 * Random moves with the same type as the pokemon, plus the normal type
 */
const MV_PKMN_TYPE_N = "mv_pkmn_type_n";
/**
 * Random moves with the same type as the moves the pokemon can learn
 */
const MV_MOVES_TYPE = "mv_moves_type";

//////////////////////
//  Ability generation

/**
 * Random ability
 */
const AB_RANDOM = "ab_random";
/**
 * Random ability with some exceptions :
 * - Shedinja can only get Wonder Guard
 */
const AB_RANDOM_EXCEPT = "ab_random_except";
/**
 * Random ability among the Pokémon's possible abilities
 */
const AB_PKMN = "ab_pkmn";


const EV_MAX = 508;
const EV_TRUE_MAX = 510;
const EV_STAT_CAP = 252;
const EV_STEP = 4;

class StatList {
    constructor (hp, atk, def, spA, spD, spe) {
        this.hp = hp;
        this.atk = atk;
        this.def = def;
        this.spA = spA;
        this.spD = spD;
        this.spe = spe;
    }

    static MaxIvs () {
        return new StatList(31, 31, 31, 31, 31, 31);
    }

    static Zero () {
        return new StatList(0, 0, 0, 0, 0, 0);
    }
}

class Pokemon {
    constructor (species, pokemon, level, gender, nature, ivs, evs, ability, moves) {
        this.species = species;
        this.pokemon = pokemon;
        this.level = level;
        this.gender = gender;
        this.nature = nature;
        this.ivs = ivs;
        this.evs = evs;
        this.ability = ability;
        this.moves = moves;
    }

    getStat (name) {
        return this.pokemon.stats.find(stat => stat.stat.name === name);
    }

    getHp () {
        return this.getStat("hp");
    }

    getAtk () {
        return this.getStat("attack");
    }

    getDef () {
        return this.getStat("defense");
    }

    getSpA () {
        return this.getStat("special-attack");
    }

    getSpD () {
        return this.getStat("special-defense");
    }

    getSpe () {
        return this.getStat("speed");
    }
}

class Generator {
    constructor (pokeApiClient) {
        this.pokeApiClient = pokeApiClient;

        // Generation options
        this.pokemonLevel = 50;
        this.setGenerationId(7); //TODO! générer par groupe de versions plutôt que par génération
        this.setIvGenerationMethod(IV_RANDOM);
        this.setEvGenerationMethod(EV_RANDOM);
        this.setMoveGenerationMethod(MV_RANDOM);
    }

    ///////////////////
    //  Utility methods

    _shuffle (a) {
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
        indexes = this._shuffle(indexes);
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

    //////////////////////
    //  Generation methods

    _generateVariety () {
        //TODO!
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

    _generateIvs () {
        if (this.ivGenMethod === IV_MAX) {
            return StatList.MaxIvs();
        }
        if (this.ivGenMethod === IV_ZERO) {
            return StatList.Zero();
        }
        if (this.ivGenMethod === IV_RANDOM) {
            return new StatList(
                this._randInt(32),
                this._randInt(32),
                this._randInt(32),
                this._randInt(32),
                this._randInt(32),
                this._randInt(32),
            );
        }
        throw "Invalid method for IV generation : " + this.ivGenMethod;
    }
    
    _generateEvs () {
        if (this.evGenMethod === EV_ZERO) {
            return StatList.Zero();
        }
        if (this.evGenMethod === EV_RANDOM || this.evGenMethod === EV_RANDOM_MAX ||
            this.evGenMethod === EV_TRUE_RANDOM || this.evGenMethod === EV_TRUE_RANDOM_MAX) {
            let evs = StatList.Zero();
            let pool, step;
            if (this.evGenMethod === EV_RANDOM) {
                pool = this._randInt(EV_MAX + 1);
                step = EV_STEP;
            } else if (this.evGenMethod === EV_RANDOM_MAX) {
                pool = EV_MAX;
                step = EV_STEP;
            }
            if (this.evGenMethod === EV_TRUE_RANDOM) {
                pool = this._randInt(EV_TRUE_MAX + 1);
                step = 1;
            } else {
                pool = EV_TRUE_MAX;
                step = 1;
            }
            let choices = ["hp", "atk", "def", "spA", "spD", "spe"];
            while (pool > 0) {
                let stat = this._choose(choices);
                evs[stat] += step;
                pool -= step;
                if (evs[stat] >= EV_STAT_CAP) {
                    choices.splice(choices.indexOf(stat), 1);
                }
            }
            return evs;
        }
        throw "Invalid method for EV generation : " + this.evGenMethod;
    }

    _generateMoves (species, pokemon) {

    }

    //////////////////////
    //  Generation options

    setGenerationId (generationId) {
        this.generationId = generationId;
    }

    setPokemonLevel (pokemonLevel) {
        this.pokemonLevel = pokemonLevel;
    }

    setIvGenerationMethod (method) {
        if (method !== IV_MAX && method !== IV_RANDOM && method !== IV_ZERO) {
            throw "Invalid method for IV generation : " + method;
        }
        this.ivGenMethod = method;
    }

    setEvGenerationMethod (method) {
        if (method !== EV_RANDOM && method !== EV_TRUE_RANDOM && method !== EV_ZERO
            && method !== EV_RANDOM_MAX && method !== EV_TRUE_RANDOM_MAX) {
            throw "Invalid method for EV generation : " + method;
        }
        this.evGenMethod = method;
    }

    setMoveGenerationMethod (method) {
        if (method !== MV_RANDOM && method !== MV_PKMN_MOVES && method !== MV_PKMN_TYPE
            && method !== MV_PKMN_TYPE_N && method !== MV_MOVES_TYPE) {
                throw "Invalid method for EV generation : " + method;
        }
        this.moveGenMethod = method;
    }

    async generatePokemon () {
        let gen = this.pokeApiClient.getGen(this.generationId);
        
        //TODO! changer cette logique ? Une espèce peut parfois avoir des variantes d'après la doc (ex: wormadam)
        // objectif : choisir soit selon l'espèce, soit selon la variété (voir options)
        // --> _generateVariety()
        let species = await this._chooseGet(gen.pokemon_species);
        let pokemon = await this.pokeApiClient.getPokemon(species.id);

        let natures = (await this.pokeApiClient.getNature()).results;
        let nature = await this._chooseGet(natures);

        let ability = gen.abilities.length > 0
            ? this._choose(gen.abilities)
            : undefined;
        console.log("Ability : ");
        console.log(ability);

        let moves = await this._chooseGetMultiple(gen.moves, 4);
        
        return new Pokemon(
            species,
            pokemon,
            this.pokemonLevel,
            this._randGender(species.gender_rate),
            nature,
            this._generateIvs(),
            this._generateEvs(),
            ability,
            moves
        );
    }
}