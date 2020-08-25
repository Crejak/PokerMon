const MALE = "male";
const FEMALE = "female";
const GENDERLESS = "genderless"

const DEFAULT_LANGUAGE = "en";

//////////////////////
//  Pokémon generation

/**
 * Random species, default variety, default form
 */
const PK_SPECIES = "pk_species";
/**
 * Random species, random variety, default form
 */
const PK_SPECIES_PKMN = "pk_species_pkmn";
/**
 * Random species, random variety, random form
 */
const PK_SPECIES_PKMN_FORM = "pk_species_pkmn_form";
/**
 * Random variety, default form
 */
const PK_PKMN = "pk_pkmn";
/**
 * Random variety, random form
 */
const PK_PKMN_FORM = "pk_pkmn_form";
/**
 * Random form
 */
const PK_FORM = "pk_form";

const PK_OPTIONS = [PK_SPECIES, PK_SPECIES_PKMN, PK_SPECIES_PKMN_FORM, PK_PKMN, PK_PKMN_FORM, PK_FORM];


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

const IV_OPTIONS = [IV_MAX, IV_RANDOM, IV_ZERO];

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

const EV_OPTIONS = [EV_RANDOM, EV_TRUE_RANDOM, EV_RANDOM_MAX, EV_TRUE_RANDOM_MAX, EV_ZERO];

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
 * Random moves among the moves the pokemon can learn at its current level
 */
const MV_PKMN_MOVES_LEVEL = "mv_pkmn_moves_level";
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

const MV_OPTIONS = [MV_RANDOM, MV_PKMN_MOVES, MV_PKMN_TYPE, MV_PKMN_TYPE_N, MV_MOVES_TYPE];

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

const AB_OPTIONS = [AB_RANDOM, AB_RANDOM_EXCEPT, AB_PKMN]

class GeneratorV2 {
    constructor (pokeApi) {
        /**
         * @type {PokeApiClientV2}
         */
        this.pokeApi = pokeApi;

        this.pokemonGM = PK_OPTIONS[0];
        this.ivGM = IV_OPTIONS[0];
        this.evGM = EV_OPTIONS[0];
        this.moveGM = MV_OPTIONS[0];
        this.abilityGM = MV_OPTIONS[0];
        
        this.allowedGenerations = Utils.clone(_gl_generation);
        this.allowedVersionGroups = Utils.clone(_gl_version_group);
        this.allowedVersions = Utils.clone(_gl_version);

        this.targetGeneration = Object.keys(this.allowedGenerations)[0];
        this.targetVersionGroup = Object.keys(this.allowedVersionGroups)[0];
        this.targetVersion = Object.keys(this.allowedVersions)[0];

        this.allowedLanguages = Utils.clone(_gl_language);
        
        this.language = Object.entries(this.allowedLanguages).find(([k, v]) => v.name === DEFAULT_LANGUAGE)[0];
        this.fallbackLanguage = this.language;

        this.pokemonLevel = 50;

        // data
        this.speciesEntries = _gl_speciesEntries;
        this.varietyEntries = [];
        this.formEntries = [];

        // preprocess
        this._computeEntries();
    }

    ////////////
    //  Settings

    setPokemonGenerationMethod (pokemonGM) {
        if (!PK_OPTIONS.includes(pokemonGM)) {
            throw "Invalid pokemon generation method : " + pokemonGM;
        }
        this.pokemonGM = pokemonGM;
    }
    
    setIvGenerationMethod (ivGM) {
        if (!IV_OPTIONS.includes(ivGM)) {
            throw "Invalid IV generation method : " + ivGM;
        }
        this.ivGM = ivGM;
    }
    
    setEvGenerationMethod (evGM) {
        if (!EV_OPTIONS.includes(evGM)) {
            throw "Invalid IV generation method : " + evGM;
        }
        this.evGM = evGM;
    }
    
    setMoveGenerationMethod (moveGM) {
        if (!MV_OPTIONS.includes(moveGM)) {
            throw "Invalid IV generation method : " + moveGM;
        }
        this.moveGM = moveGM;
    }
    
    setAbilityGenerationMethod (abilityGM) {
        if (!AB_OPTIONS.includes(abilityGM)) {
            throw "Invalid IV generation method : " + abilityGM;
        }
        this.abilityGM = abilityGM;
    }

    setTargetGeneration (targetGeneration) {
        let entry = Object.entries(this.allowedGenerations).find(([k, v]) =>
            v.id === targetGeneration || v.name === targetGeneration
        );
        let found = entry ? entry[0] : undefined;
        if (!found) {
            let url = targetGeneration.url ? targetGeneration.url : targetGeneration;
            if (!this.allowedGenerations[url]) {
                throw "Invalid generation : " + url;
            }
            found = url;
        }

        this.targetGeneration = found;

        if (!this.allowedGenerations[found].version_groups.some(ar => ar.url === this.targetVersionGroup)) {
            this.setTargetVersionGroup(this.allowedGenerations[found].version_groups[0]);
        }
    }

    setTargetVersionGroup (targetVersionGroup) {
        let entry = Object.entries(this.allowedVersionGroups).find(([k, v]) =>
            v.id === targetVersionGroup || v.name === targetVersionGroup
        );
        let found = entry ? entry[0] : undefined;
        if (!found) {
            let url = targetVersionGroup.url ? targetVersionGroup.url : targetVersionGroup;
            if (!this.allowedVersionGroups[url]) {
                throw "Invalid version group : " + url;
            }
            found = url;
        }

        if (this.allowedVersionGroups[found].generation.url !== this.targetGeneration) {
            this.setTargetGeneration(this.allowedVersionGroups[found].generation);
        }

        this.targetVersionGroup = found;

        if (!this.allowedVersionGroups[found].versions.some(ar => ar.url === this.targetVersion)) {
            this.setTargetVersion(this.allowedVersionGroups[found].versions[0]);
        }
    }

    setTargetVersion (targetVersion) {
        let entry = Object.entries(this.allowedVersions).find(([k, v]) =>
            v.id === targetVersion || v.name === targetVersion
        );
        let found = entry ? entry[0] : undefined;
        if (!found) {
            let url = targetVersion.url ? targetVersion.url : targetVersion;
            if (!this.allowedVersions[url]) {
                throw "Invalid version : " + url;
            }
            found = url;
        }

        if (this.allowedVersions[found].version_group.url !== this.targetVersionGroup) {
            this.setTargetVersionGroup(this.allowedVersions[found].version_group);
        }

        this.targetVersion = found;
    }

    setLanguage (language) {
        let entry = Object.entries(this.allowedLanguages).find(([k, v]) =>
            v.id === language || v.name === language
        );
        let found = entry ? entry[0] : undefined;
        if (!found) {
            let url = language.url ? language.url : language;
            if (!this.allowedLanguages[url]) {
                throw "Invalid language : " + url;
            }
            found = url;
        }

        this.language = found;
    }

    setPokemonLevel (pokemonLevel) {
        if (pokemonLevel < 1 || pokemonLevel > 100) {
            throw "Invalid level : " + pokemonLevel;
        }

        this.pokemonLevel = pokemonLevel;
    }

    //////////////////
    //  Public methods

    async generate () {
        let [species, variety, form] = await this._generatePokemon();

        return new PokemonV2 (
            species,
            variety,
            form,
            //...
        )
    }

    /////////////////////
    //  Generator methods

    async _generatePokemon () {
        let species;
        let variety;
        let form;

        if (this._pkSpeciesFirst()) {
            let validSpeciesEntries = this.speciesEntries.filter(s =>
                this._validateVersionGroupEntry(s));
            let speciesEntry = Utils.choose(validSpeciesEntries);
            species = await this.pokeApi.get(speciesEntry.accessUrl);

            let validVarietyEntries = speciesEntry.varieties.filter(v =>
                this._validateVersionGroupEntry(v));
            let varietyEntry;
            if (this._pkRandomVariety()) {
                varietyEntry = (Utils.choose(validVarietyEntries));
                variety = await this.pokeApi.get(varietyEntry.accessUrl);
            } else {
                for (let validVarietyEntry of validVarietyEntries) { //TODO! réduire le nombre de requêtes en passant par species.varieties (PokemonSpeciesVariety)
                    varietyEntry = validVarietyEntry;
                    variety = await this.pokeApi.get(validVarietyEntry.accessUrl);
                    if (variety.is_default) {
                        break;
                    }
                }
            }

            let validFormEntries = varietyEntry.forms.filter(f =>
                this._validateVersionGroupEntry(f));
            let formEntry;
            if (this._pkRandomForm()) {
                formEntry = (Utils.choose(validFormEntries));
                form = await this.pokeApi.get(formEntry.accessUrl);
            } else {
                for (let validFormEntry of validFormEntries) {
                    formEntry = validFormEntry;
                    form = await this.pokeApi.get(validFormEntry.accessUrl);
                    if (form.is_default) {
                        break;
                    }
                }
            }
                
        } else if (this._pkVarietyFirst()) {
            let validVarietyEntries = this.varietyEntries.filter(v =>
                this._validateVersionGroupEntry(v));
            let varietyEntry = Utils.choose(validVarietyEntries);
            species = await this.pokeApi.get(varietyEntry.species.accessUrl);

            variety = await this.pokeApi.get(varietyEntry.accessUrl);

            let validFormEntries = varietyEntry.forms.filter(f =>
                this._validateVersionGroupEntry(f));
            let formEntry;
            if (this._pkRandomForm()) {
                formEntry = (Utils.choose(validFormEntries));
                form = await this.pokeApi.get(formEntry.accessUrl);
            } else {
                for (let validFormEntry of validFormEntries) {
                    formEntry = validFormEntry;
                    form = await this.pokeApi.get(validFormEntry.accessUrl);
                    if (form.is_default) {
                        break;
                    }
                }
            }

        } else if (this._pkFormFirst()) {
            let validFormEntries = this.formEntries.filter(f =>
                this._validateVersionGroupEntry(f));
            let formEntry = Utils.choose(validFormEntries);
            let varietyEntry = formEntry.variety;
            species = await this.pokeApi.get(varietyEntry.species.accessUrl);

            variety = await this.pokeApi.get(varietyEntry.accessUrl);

            form = await this.pokeApi.get(formEntry.accessUrl);
        }

        return [species, variety, form];
    }

    /////////////////////////
    //  Other private methods

    _pkSpeciesFirst () {
        return this.pokemonGM === PK_SPECIES || this.pokemonGM === PK_SPECIES_PKMN || this.pokemonGM === PK_SPECIES_PKMN_FORM;
    }

    _pkRandomVariety () {
        return this.pokemonGM === PK_SPECIES_PKMN || this.pokemonGM === PK_SPECIES_PKMN_FORM;
    }

    _pkVarietyFirst () {
        return this.pokemonGM === PK_PKMN || this.pokemonGM === PK_PKMN_FORM;
    }

    _pkRandomForm () {
        return this.pokemonGM === PK_SPECIES_PKMN_FORM || this.pokemonGM === PK_PKMN_FORM;
    }

    _pkFormFirst () {
        return this.pokemonGM === PK_FORM;
    }

    _validateVersionGroup (orders) {
        let targetOrder = this.allowedVersionGroups[this.targetVersionGroup].order;
        if (Array.isArray(orders)) {
            return orders.includes(targetOrder);
        }
        return orders === targetOrder;
    }

    _getVersionGroupOrders (entry) {
        if (!!entry.versionGroupOrder) {
            return [entry.versionGroupOrder];
        }
        let subEntries = entry.forms ? entry.forms : entry.varieties;
        let vgOrders = [];
        for (let subEntry of subEntries) {
            vgOrders = vgOrders.concat(this._getVersionGroupOrders(subEntry));
        }
        return [...new Set(vgOrders)];
    }

    _validateVersionGroupEntry (entry) {
        return this._validateVersionGroup(this._getVersionGroupOrders(entry));
    }

    ///////////////////
    //  Preprocess data

    _computeEntries () {
        for (let speciesEntry of this.speciesEntries) {
            for (let varietyEntry of speciesEntry.varieties) {
                varietyEntry.species = speciesEntry;
                this.varietyEntries.push(varietyEntry);
                for (let formEntry of varietyEntry.forms) {
                    formEntry.variety = varietyEntry;
                    this.formEntries.push(formEntry);
                }
            }
        }
    }
}