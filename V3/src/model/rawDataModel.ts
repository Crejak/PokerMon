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

/**
 * Des données brutes sous forme de map, permettant la navigation
 */
export interface RawDataMapObject {
    generations: {[key: string]: PokeApi.Generation};
    versionGroups: {[key: string]: PokeApi.VersionGroup};
    versions: {[key: string]: PokeApi.Version};

    evolutionChains:{[key: string]:  PokeApi.EvolutionChain};
    species: {[key: string]: PokeApi.PokemonSpecies};
    varieties: {[key: string]: PokeApi.Pokemon};
    forms: {[key: string]: PokeApi.PokemonForm};

    abilities: {[key: string]: PokeApi.Ability};
    
    moves: {[key: string]: PokeApi.Move};
    
    natures: {[key: string]: PokeApi.Nature};
    types: {[key: string]: PokeApi.Type};
    stats: {[key: string]: PokeApi.Stat};
}