var _gl_settingsForm = document.querySelector(".js-settingsForm");
var _gl_generationSelect = document.querySelector(".js-generation");
var _gl_versionGroupSelect = document.querySelector(".js-versionGroup");
var _gl_versionSelect = document.querySelector(".js-version");
var _gl_pokemonDiv = document.querySelector(".js-generatedPokemon");

var _gl_api = new PokeApiClientV2();
var _gl_generator = new GeneratorV2(_gl_api);

_gl_settingsForm.addEventListener("submit", async event => {
    event.preventDefault();

    let data = new FormData(_gl_settingsForm);

    _gl_generator.setPokemonGenerationMethod(data.get("pokemonGM"));
    _gl_generator.setMoveGenerationMethod(data.get("moveGM"));
    _gl_generator.setAbilityGenerationMethod(data.get("abilityGM"));
    _gl_generator.setEvGenerationMethod(data.get("evGM"));
    _gl_generator.setIvGenerationMethod(data.get("ivGM"));
    _gl_generator.setHappinessGenerationMethod(data.get("happinessGM"));
    _gl_generator.setPokemonLevel(data.get("level"));

    let pokemon = await _gl_generator.generate();

    _gl_pokemonDiv.innerHTML = Formatter.getShowdownHtml(pokemon);
});

_gl_generationSelect.addEventListener("change", event => {
    _gl_generator.setTargetGeneration(Number(event.target.value));

    _gl_versionGroupSelect.value = _gl_generator.getTargetVersionGroup().id;
    _gl_versionSelect.value = _gl_generator.getTargetVersion().id;
});

_gl_versionGroupSelect.addEventListener("change", event => {
    _gl_generator.setTargetVersionGroup(Number(event.target.value));

    _gl_generationSelect.value = _gl_generator.getTargetGeneration().id;
    _gl_versionGroupSelect.value = _gl_generator.getTargetVersionGroup().id;
});

_gl_versionSelect.addEventListener("change", event => {
    _gl_generator.setTargetVersion(Number(event.target.value));

    _gl_generationSelect.value = _gl_generator.getTargetGeneration().id;
    _gl_versionGroupSelect.value = _gl_generator.getTargetVersionGroup().id;
});
