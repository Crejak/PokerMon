const PKMN_HTML = `
<div class="pkmn" data-id="%id%">
    <div class="picture">
        <img src="%picture%" />
    </div>
    <div class="infos">
        <div class="name">%name%</div>
        <div class="gender">%gender%</div>
        <div class="level">%level%</div>
    </div>
    <div class="nature">%nature%</div>
    <div class="stats">
    </div>
    <div class="ability">%ability%</div>
    <ul class="moves">
    </ul>
</div>
`;


const STATS_HTML = `
<table>
    <thead>
        <tr>
            <th>Stat</th>
            <th>Base</th>
            <th>IV</th>
            <th>EV</th>
            <th>Calc</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <th>HP</th>
            <th>%hpBase%</th>
            <th>%hpIv%</th>
            <th>%hpEv%</th>
            <th></th>
        </tr>
        <tr>
            <th>Attack</th>
            <th>%atkBase%</th>
            <th>%atkIv%</th>
            <th>%atkEv%</th>
            <th></th>
        </tr>
        <tr>
            <th>Defense</th>
            <th>%defBase%</th>
            <th>%defIv%</th>
            <th>%defEv%</th>
            <th></th>
        </tr>
        <tr>
            <th>Sp. Atk.</th>
            <th>%spABase%</th>
            <th>%spAIv%</th>
            <th>%spAEv%</th>
            <th></th>
        </tr>
        <tr>
            <th>Sp. Def.</th>
            <th>%spDBase%</th>
            <th>%spDIv%</th>
            <th>%spDEv%</th>
            <th></th>
        </tr>
        <tr>
            <th>Speed</th>
            <th>%speBase%</th>
            <th>%speIv%</th>
            <th>%speEv%</th>
            <th></th>
        </tr>
    </tbody>
</table>
`;

const MOVE_HTML = `
<div class="move">
    %move%
</div>
`;

class Renderer {
    constructor (pokeApiClient) {
        this.pokeApiClient = pokeApiClient;

        this.listElement = this._$("#generated");
        this.pokemonCount = 0;
    }

    _format (html, params) {
        for (let key in params) {
            html = html.replace("%" + key + "%", params[key]);
        }
        return html;
    }

    _$ (selector) {
        return document.querySelector(selector);
    }

    _$pkmn (id, selector) {
        return this._$('.pkmn[data-id="' + id + '"] ' + selector);
    }

    append (pokemon) {
        this.pokemonCount += 1;
        let id = this.pokemonCount;
        let li = document.createElement("li");
        let pictureUrl = !!pokemon.pokemon.sprites.front_female  && pokemon.gender === FEMALE
            ? pokemon.pokemon.sprites.front_female
            : pokemon.pokemon.sprites.front_default;
        li.innerHTML = this._format(PKMN_HTML, {
            id: id,
            picture: pictureUrl,
            name: this.pokeApiClient.getName(pokemon.species),
            gender: pokemon.gender,
            level: pokemon.level,
            nature: this.pokeApiClient.getName(pokemon.nature),
            ability: !!pokemon.ability ? this.pokeApiClient.getName(pokemon.ability) : ""
        });
        this.listElement.appendChild(li);

        this._$pkmn(id, ".stats").innerHTML = this._format(STATS_HTML, {
            hpBase: pokemon.getHp().base_stat,
            hpIv: pokemon.ivs.hp,
            hpEv: pokemon.evs.hp,
            atkBase: pokemon.getAtk().base_stat,
            atkIv: pokemon.ivs.atk,
            atkEv: pokemon.evs.atk,
            defBase: pokemon.getDef().base_stat,
            defIv: pokemon.ivs.def,
            defEv: pokemon.evs.def,
            spABase: pokemon.getSpA().base_stat,
            spAIv: pokemon.ivs.spA,
            spAEv: pokemon.evs.spA,
            spDBase: pokemon.getSpD().base_stat,
            spDIv: pokemon.ivs.spD,
            spDEv: pokemon.evs.spD,
            speBase: pokemon.getSpe().base_stat,
            speIv: pokemon.ivs.spe,
            speEv: pokemon.evs.spe,
        });

        for (let move of pokemon.moves) {
            let moveLi = document.createElement("li");
            moveLi.innerHTML = this._format(MOVE_HTML, {
                move: this.pokeApiClient.getName(move)
            });
            this._$pkmn(id, ".moves").appendChild(moveLi);
        }
    }
}