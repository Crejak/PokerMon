async function main () {
    let pokeApiClient = new PokeApiClient();
    await pokeApiClient.ready();

    console.log(pokeApiClient);

    let generator = new Generator(pokeApiClient);
    
    console.log(generator);

    let pokemon = await generator.generatePokemon();

    console.log(pokemon);

    let renderer = new Renderer(pokeApiClient);

    console.log(renderer);

    renderer.append(pokemon);
}

main ();