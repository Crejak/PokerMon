/**
 * Voir @see https://pokepast.es/syntax.html pour le format
 */

const SHOWDOWN_TEMPLATE =
`%name% %gender%
Shiny: %shiny%
Ability: %ability%
Level: %level%
Happiness: %happiness%
EVs: %evHp% HP / %evAtk% Atk / %evDef% Def / %evSpA% SpA / %evSpD% SpD / %evSpe% Spe
%nature% Nature
IVs: %ivHp% HP / %ivAtk% Atk / %ivDef% Def / %ivSpA% SpA / %ivSpD% SpD / %ivSpe% Spe
%moves%`;

const SHOWDOWN_MOVE_TEMPLATE = "- %name%\n";

class Formatter {
    constructor () {

    }

    /**
     * 
     * @param {PokemonV2} pokemon 
     * 
     * @returns {string}
     */
    static getShowdownString (pokemon) {
        var moves = pokemon.moves.reduce((acc, move) => acc + this._format(SHOWDOWN_MOVE_TEMPLATE, {
            name: this._capitalize(move.name)
        }), '');

        return this._format(SHOWDOWN_TEMPLATE, {
            name: this._capitalize(pokemon.species.name),
            gender: this._formatGender(pokemon.gender),
            shiny: this._formatShiny(pokemon.shininess),
            ability: this._capitalize(pokemon.ability.name),
            level: pokemon.level,
            happiness: pokemon.happiness,
            evHp: pokemon.evs.hp,
            evAtk: pokemon.evs.atk,
            evDef: pokemon.evs.def,
            evSpA: pokemon.evs.spA,
            evSpD: pokemon.evs.spD,
            evSpe: pokemon.evs.spe,
            nature: this._capitalize(pokemon.nature.name),
            ivHp: pokemon.ivs.hp,
            ivAtk: pokemon.ivs.atk,
            ivDef: pokemon.ivs.def,
            ivSpA: pokemon.ivs.spA,
            ivSpD: pokemon.ivs.spD,
            ivSpe: pokemon.ivs.spe,
            moves: moves
        });
    }

    static getShowdownHtml (pokemon) {
        return this.getShowdownString(pokemon).replace(/\n/g, "<br>");
    }

    static _formatGender (gender) {
        if (gender === GENDERLESS){
            return "";
        }
        if (gender === FEMALE) {
            return "(F)";
        }
        return "(M)";
    }

    static _formatShiny (shininess) {
        return shininess ? "Yes" : "No";
    }

    static _capitalize (sentence) {
        const words = sentence.split(" ");

        return words.map((word) => { 
            return word[0].toUpperCase() + word.substring(1); 
        }).join(" ");
    }

    static _format (template, params) {
        for (let key in params) {
            template = template.replaceAll("%" + key + "%", params[key]);
        }
        return template;
    }
}