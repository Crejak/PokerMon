import { PokeApiClient } from "./pokeApiClient";
import { RawDataObject } from "../model/rawDataModel";
import * as PokeApi from "../model/pokeApiModel";

export class DataRetriever {
    pokeApiClient: PokeApiClient;
    rawDataModel: RawDataObject;
    retrievingPromise: Promise<PokeApi.APIResourceList<PokeApi.Resource>>;

    constructor(pokeApiClient: PokeApiClient) {
        this.pokeApiClient = pokeApiClient;
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
        // La structure est totalement inutile pour l'instant mdr.
        // Trouver un moyen de la faire fonctionner
        let promises: Promise<PokeApi.Resource[]>[] = [
            (async () => this.rawDataModel.generations = await this.retrieveFromListFunction(this.pokeApiClient.getGenerationList))(),
            (async () => this.rawDataModel.versionGroups = await this.retrieveFromListFunction(this.pokeApiClient.getVersionGroupList))(),
            (async () => this.rawDataModel.versions = await this.retrieveFromListFunction(this.pokeApiClient.getVersionList))(),
            (async () => this.rawDataModel.evolutionChains = await this.retrieveFromListFunction(this.pokeApiClient.getEvolutionChainList))(),
            (async () => this.rawDataModel.species = await this.retrieveFromListFunction(this.pokeApiClient.getPokemonSpeciesList))(),
            (async () => this.rawDataModel.varieties = await this.retrieveFromListFunction(this.pokeApiClient.getPokemonList))(),
            (async () => this.rawDataModel.forms = await this.retrieveFromListFunction(this.pokeApiClient.getPokemonFormList))(),
            (async () => this.rawDataModel.abilities = await this.retrieveFromListFunction(this.pokeApiClient.getAbilityList))(),
            (async () => this.rawDataModel.moves = await this.retrieveFromListFunction(this.pokeApiClient.getMoveList))(),
            (async () => this.rawDataModel.natures = await this.retrieveFromListFunction(this.pokeApiClient.getNatureList))(),
            (async () => this.rawDataModel.stats = await this.retrieveFromListFunction(this.pokeApiClient.getStatList))(),
            (async () => this.rawDataModel.types = await this.retrieveFromListFunction(this.pokeApiClient.getTypeList))(),
        ];

        await Promise.all(promises);

        return this.rawDataModel;
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
/*
async function construct (resourceName, indexOnly = false) {
    _log("BEGIN " + resourceName)

    let preview = await _call(_url(resourceName));
    let count = preview.count;
    _log("[" + resourceName + "] " + count + " found");
    let summary = await _call(_url(resourceName), {
        limit: count + 1 //+1 may not be necessary
    });
    _gl_data.resourceList[resourceName] = summary;

    if (!indexOnly) {
        let i = 0;
        for (let ra of summary.results) {
            i += 1;
            _log("[" + resourceName + " " + i + "/" + count + "] GET " + ra.name + " AT " + ra.url);
            let resource = await _get(ra);
            _gl_data.resource[ra.url] = resource;
        }
    }

    _log("DONE " + resourceName);
}

async function constructData (indexOnly = false) {
    let promiseArray = [];
    for (let resourceName of _USEFUL_RESOURCES) {
        promiseArray.push(construct(resourceName, indexOnly));
    }
    await Promise.all(promiseArray);
    return _gl_data;
}

function download (fileName, json) {
    let string = JSON.stringify(json);
    let file = new Blob([string], {type: "application/json"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function downloadAccess (fileName, json, variableName) {
    let string = "var _gl_" + variableName + " = " + JSON.stringify(json) + ";";
    let file = new Blob([string], {type: "application/json"});
    let a = document.createElement("a");
    a.href = URL.createObjectURL(file);
    a.download = fileName;
    a.click();
}

function filter (resourceName) {
    let filteredObject = {};
    let filteredKeys = Object.keys(_gl_data.resource).filter(k =>
        k.includes("/" + resourceName + "/"));
    for (let key of filteredKeys) {
        filteredObject[key] = _gl_data.resource[key];
    }
    return filteredObject;
}

function resourceFile (resourceName) {
    let json = filter(resourceName);
    let fileName = resourceName + ".json";
    download(fileName, json);
}

function accessFile (resourceName) {
    let json = filter(resourceName);
    let fileName = resourceName + ".js";
    let varName = resourceName.replace("-", "_");
    downloadAccess(fileName, json, varName);
}
*/