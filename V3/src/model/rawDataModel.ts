import * as PokeApi from "./pokeApiModel";

/**
 * Un ensemble de données brutes provenant de PokéAPI.
 * Destiné à être filtré puis transformé
 */
export interface RawDataObject {
    generations: PokeApi.Generation[];
    versionGroups: PokeApi.VersionGroup[];
    versions: PokeApi.Version[];

    evolutionChains: PokeApi.EvolutionChain[];
    species: PokeApi.PokemonSpecies[];
    varieties: PokeApi.Pokemon[];
    forms: PokeApi.PokemonForm[];

    abilities: PokeApi.Ability[];
    
    moves: PokeApi.Move[];
    
    natures: PokeApi.Nature[];
    types: PokeApi.Type[];
    stats: PokeApi.Stat[];
}