import { PokeApiClient } from "./pokeApiClient";
import { RawDataObject } from "../model/rawDataModel";

export class DataRetriever {
    pokeApiClient: PokeApiClient;
    rawDataModel: RawDataObject;

    constructor (pokeApiClient: PokeApiClient) {
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
        }
    }


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