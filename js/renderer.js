const PKMN_HTML = html```
<div class="pkmn">
    <div class="picture">

    </div>
    <div class="infos">
        <div class="name"></div>
        <div class="gender"></div>
        <div class="level"></div>
    </div>
    <div class="nature"></div>
    <div class="ability"></div>
    <ul class="moves">
        <li class="move1"></li>
        <li class="move2"></li>
        <li class="move3"></li>
        <li class="move4"></li>
    </ul>
</div>
```;

class Renderer {
    constructor () {
        this.listElement = this._$(".generated");
        this.pokemonCount = 0;
    }

    _$ (selector) {
        return document.querySelector(selector);
    }

    append (pokemon) {
        this.pokemonCount += 1;
        let li = document.createElement("li");
        li.innerHTML = PKMN_HTML;
        li.setAttribute("data-id", this.pokemonCount);
        this.listElement.appendChild(li);

        this._$('li[data-id="' + this.pokemonCount + '" .name')
    }
}