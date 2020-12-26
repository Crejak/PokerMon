import { PokeApiClient } from "./0-retrieve/pokeApiClient";
/**
 * Script de récupération des données brutes depuis l'API
 */

import { DataRetriever } from "./0-retrieve/dataRetriever";
import { writeJson } from "./utils/fileUtils";
import { RAW_DATA_FILENAME } from "./utils/consts";

(async () => {
    let pokeApiClient = new PokeApiClient({
        logging: true
    });
    let retriever = new DataRetriever(pokeApiClient);
    let rawData = await retriever.retrieve();
    await writeJson(rawData, RAW_DATA_FILENAME);
})();