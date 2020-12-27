import { PokeApiClient } from "./pokeApiClient";
import { RawDataObject } from "../model/rawDataModel";
import * as PokeApi from "../model/pokeApiModel";

export class DataRetriever {
    pokeApiClient: PokeApiClient;
    rawDataModel: RawDataObject;
    retrievingPromise: Promise<RawDataObject>;

    constructor(pokeApiClient: PokeApiClient) {
        this.pokeApiClient = pokeApiClient;
        this.retrievingPromise = null;
        this.rawDataModel = {
            generations: [],
            versionGroups: [],
            versions: [],
            evolutionChains: [],
            species: [],
            varieties: [],
            forms: [],
            abilities: [],
            moves: [],
            natures: [],
            stats: [],
            types: []
        };
    }

    async retrieve(): Promise<RawDataObject> {
        if (!!this.retrievingPromise) {
            return this.retrievingPromise;
        }
        
        this.retrievingPromise = new Promise<RawDataObject>(async (resolve, reject) => {
            try {
                let generations = this.retrieveFromListFunction(this.pokeApiClient.getGenerationList);
                let versionGroups = this.retrieveFromListFunction(this.pokeApiClient.getVersionGroupList);
                let versions = this.retrieveFromListFunction(this.pokeApiClient.getVersionList);
                let evolutionChains = this.retrieveFromListFunction(this.pokeApiClient.getEvolutionChainList);
                let species = this.retrieveFromListFunction(this.pokeApiClient.getPokemonSpeciesList);
                let varieties = this.retrieveFromListFunction(this.pokeApiClient.getPokemonList);
                let forms = this.retrieveFromListFunction(this.pokeApiClient.getPokemonFormList);
                let abilities = this.retrieveFromListFunction(this.pokeApiClient.getAbilityList);
                let moves = this.retrieveFromListFunction(this.pokeApiClient.getMoveList);
                let natures = this.retrieveFromListFunction(this.pokeApiClient.getNatureList);
                let stats = this.retrieveFromListFunction(this.pokeApiClient.getStatList);
                let types = this.retrieveFromListFunction(this.pokeApiClient.getTypeList);

                this.rawDataModel.generations = await generations;
                this.rawDataModel.versionGroups = await versionGroups;
                this.rawDataModel.versions = await versions;
                this.rawDataModel.evolutionChains = await evolutionChains;
                this.rawDataModel.species = await species;
                this.rawDataModel.varieties = await varieties;
                this.rawDataModel.forms = await forms;
                this.rawDataModel.abilities = await abilities;
                this.rawDataModel.moves = await moves;
                this.rawDataModel.natures = await natures;
                this.rawDataModel.stats = await stats;
                this.rawDataModel.types = await types;
            } catch (error) {
                reject(error);
                return;
            }

            resolve(this.rawDataModel);
        });

        return this.retrievingPromise;
    }

    //#region private methods

    private async retrieveFromListFunction<T extends PokeApi.Resource>(resourceListFunction: () => Promise<PokeApi.APIResourceList<T>>): Promise<T[]> {
        let resourceList = await resourceListFunction.apply(this.pokeApiClient);

        let promises = resourceList.results.map(ar => {
            return this.pokeApiClient.get(ar);
        });

        return await Promise.all(promises);
    }

    //#endregion
}
