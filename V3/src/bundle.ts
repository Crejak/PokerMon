import { PokeApiClient } from "./0-retrieve/pokeApiClient";
import { DataRetriever } from "./0-retrieve/dataRetriever";

// Declarations globales
const _global = window as any;

_global.PokeApiClient = PokeApiClient;
_global.DataRetriever = DataRetriever;