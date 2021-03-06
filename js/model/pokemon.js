class StatListV2 {
    constructor (hp, atk, def, spA, spD, spe) {
        this.hp = hp;
        this.atk = atk;
        this.def = def;
        this.spA = spA;
        this.spD = spD;
        this.spe = spe;
    }

    static MaxIvs () {
        return new StatListV2(31, 31, 31, 31, 31, 31);
    }

    static Zero () {
        return new StatListV2(0, 0, 0, 0, 0, 0);
    }
}

const MALE = "male";
const FEMALE = "female";
const GENDERLESS = "genderless";

class PokemonV2 {
    constructor (species, variety, form, moves, ability, level, gender, nature, ivs, evs, happiness, shininess) {
        this.species = species;
        this.variety = variety;
        this.form = form;
        this.moves = moves;
        this.ability = ability;
        this.level = level;
        this.gender = gender;
        this.nature = nature;
        this.ivs = ivs;
        this.evs = evs;
        this.happiness = happiness;
        this.shininess = shininess ?? false;
    }

    getStat (stat) {
        return this.variety.stats.find(stat => stat.stat.name === stat || stat.stat.id === stat);
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