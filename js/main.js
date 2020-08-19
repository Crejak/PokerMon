async function main () {
    let pokeApiClient = new PokeApiClient();
    await pokeApiClient.ready();
    let generator = new Generator(pokeApiClient);

    console.log(generator);

    console.log(await generator.generatePokemon());
}

main ();