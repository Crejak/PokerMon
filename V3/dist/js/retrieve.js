var __create = Object.create;
var __defProp = Object.defineProperty;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __exportStar = (target, module2, desc) => {
  __markAsModule(target);
  if (module2 && typeof module2 === "object" || typeof module2 === "function") {
    for (let key of __getOwnPropNames(module2))
      if (!__hasOwnProp.call(target, key) && key !== "default")
        __defProp(target, key, {get: () => module2[key], enumerable: !(desc = __getOwnPropDesc(module2, key)) || desc.enumerable});
  }
  return target;
};
var __toModule = (module2) => {
  if (module2 && module2.__esModule)
    return module2;
  return __exportStar(__defProp(module2 != null ? __create(__getProtoOf(module2)) : {}, "default", {value: module2, enumerable: true}), module2);
};

// src/utils/envUtils.ts
var Environment;
(function(Environment2) {
  Environment2[Environment2["NODE"] = 0] = "NODE";
  Environment2[Environment2["BROWSER"] = 1] = "BROWSER";
})(Environment || (Environment = {}));
function getEnvironment() {
  if (typeof window !== "undefined" && typeof window.document !== "undefined") {
    return 1;
  } else if (typeof process !== "undefined" && process.versions != null && process.versions.node != null) {
    return 0;
  }
  throw new Error("Unknown environment");
}
var env = getEnvironment();
var isBrowser = env === 1;
var isNode = env === 0;

// src/utils/httpUtils.ts
var nodeHttps = isNode ? require("https") : void 0;
if (isNode) {
  nodeHttps.globalAgent.maxSockets = 20;
}
var DEFAULT_OPTIONS = {
  logging: false,
  params: void 0
};
async function httpGet(url, options) {
  options = Object.assign({}, DEFAULT_OPTIONS, options);
  let urlObject = new URL(url);
  if (!!options.params) {
    urlObject.search = new URLSearchParams(options.params).toString();
  }
  if (isNode) {
    return new Promise((resolve, reject) => {
      nodeHttpGet(urlObject.toString(), options).then(resolve, (error) => {
        console.error("============== Error node");
        console.error(error);
        reject(error);
      });
    });
  } else if (isBrowser) {
    return browserHttpGet(urlObject.toString(), options);
  }
  throw new Error("Unknown environment: unable to send http request");
}
async function browserHttpGet(url, options) {
  if (!isBrowser) {
    throw new Error("Wrong environment: this function call only be called in browser");
  }
  let response = await fetch(url);
  let json = await response.json();
  if (options.logging) {
    console.info(`GET ${url}`);
  }
  return json;
}
async function nodeHttpGet(url, options) {
  if (!isNode) {
    throw new Error("Wrong environment: this function call only be called in browser");
  }
  return new Promise((resolve, reject) => {
    nodeHttps.get(url, (res) => {
      let responseText = "";
      res.on("data", (data) => {
        responseText += data;
      });
      res.on("error", (error) => {
        console.error("============== Error message : " + error.message);
        console.error(error);
        reject(error);
      });
      res.on("end", () => {
        if (res.statusCode !== 200) {
          reject(res);
          return;
        }
        let json = JSON.parse(responseText);
        if (options.logging) {
          console.info(`GET ${url}`);
        }
        resolve(json);
      });
    }).on("error", (error) => {
      console.error("============== Error request : " + error.message);
      console.error(error);
      reject(error);
    });
  });
}

// src/0-retrieve/pokeApiClient.ts
var BASE_URL = "https://pokeapi.co/api/v2/";
var ENDPOINTS = {
  generation: "generation",
  version: "version",
  versionGroup: "version-group",
  stat: "stat",
  type: "type",
  ability: "ability",
  nature: "nature",
  move: "move",
  pokemon: "pokemon",
  pokemonSpecies: "pokemon-species",
  pokemonForm: "pokemon-form",
  evolutionChain: "evolution-chain"
};
var DEFAULT_OPTIONS2 = {
  logging: false
};
var PokeApiClient = class {
  constructor(options) {
    this.options = Object.assign({}, DEFAULT_OPTIONS2, options);
    this.resourceCache = new Map();
    this.resourceListCache = new Map();
  }
  async get(apiResource) {
    return await this.fetchResource(apiResource.url);
  }
  async getList(endpoint) {
    return await this.fetchResourceList(BASE_URL + endpoint);
  }
  async getGenerationList() {
    return await this.getList(ENDPOINTS.generation);
  }
  async getVersionList() {
    return await this.getList(ENDPOINTS.version);
  }
  async getVersionGroupList() {
    return await this.getList(ENDPOINTS.versionGroup);
  }
  async getStatList() {
    return await this.getList(ENDPOINTS.stat);
  }
  async getTypeList() {
    return await this.getList(ENDPOINTS.type);
  }
  async getAbilityList() {
    return await this.getList(ENDPOINTS.ability);
  }
  async getNatureList() {
    return await this.getList(ENDPOINTS.nature);
  }
  async getMoveList() {
    return await this.getList(ENDPOINTS.move);
  }
  async getPokemonList() {
    return await this.getList(ENDPOINTS.pokemon);
  }
  async getPokemonSpeciesList() {
    return await this.getList(ENDPOINTS.pokemonSpecies);
  }
  async getPokemonFormList() {
    return await this.getList(ENDPOINTS.pokemonForm);
  }
  async getEvolutionChainList() {
    return await this.getList(ENDPOINTS.evolutionChain);
  }
  async call(url, params) {
    return httpGet(url, {
      params,
      logging: this.options.logging
    });
  }
  async fetchResource(url) {
    if (this.resourceCache.has(url)) {
      return this.resourceCache.get(url);
    }
    var resource = await this.call(url);
    this.resourceCache.set(url, resource);
    return resource;
  }
  async fetchResourceList(url) {
    if (this.resourceListCache.has(url)) {
      return this.resourceListCache.get(url);
    }
    let preview = await this.call(url);
    let count = preview.count;
    let list = await this.call(url, {
      limit: count
    });
    this.resourceListCache.set(url, list);
    return list;
  }
  log(text) {
    if (!this.options.logging) {
      return;
    }
    console.info(text);
  }
};

// src/0-retrieve/dataRetriever.ts
var DataRetriever = class {
  constructor(pokeApiClient) {
    this.pokeApiClient = pokeApiClient;
    this.retrievingPromise = null;
    this.rawDataModel = {
      generations: {},
      versionGroups: {},
      versions: {},
      evolutionChains: {},
      species: {},
      varieties: {},
      forms: {},
      abilities: {},
      moves: {},
      natures: {},
      stats: {},
      types: {}
    };
  }
  async retrieve() {
    if (!!this.retrievingPromise) {
      return this.retrievingPromise;
    }
    this.retrievingPromise = new Promise(async (resolve, reject) => {
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
  async retrieveFromListFunction(resourceListFunction) {
    let result = {};
    let resourceList = await resourceListFunction.apply(this.pokeApiClient);
    let promises = resourceList.results.map(async (ar) => {
      let promise = this.pokeApiClient.get(ar);
      result[ar.url] = await promise;
      return promise;
    });
    await Promise.all(promises);
    return result;
  }
};

// src/utils/fileUtils.ts
var fs = __toModule(require("fs"));
var path = __toModule(require("path"));
if (!isNode) {
  throw new Error("File operations can only be performed in Node environment");
}
var GENERATED_FOLDER_RELATIVE_PATH = "../../generated";
function processFilename(fileName) {
  if (!fileName.endsWith(".json")) {
    fileName += ".json";
  }
  return fileName;
}
function getFolderPath(fileName) {
  return path.join(__dirname, GENERATED_FOLDER_RELATIVE_PATH, fileName);
}
async function writeJson(json, fileName) {
  let text = JSON.stringify(json);
  let filePath = getFolderPath(processFilename(fileName));
  return new Promise((resolve, reject) => {
    fs.writeFile(filePath, text, {
      encoding: "utf8"
    }, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
  return;
}

// src/utils/consts.ts
var RAW_DATA_FILENAME = "rawData";

// src/retrieve.ts
(async () => {
  let pokeApiClient = new PokeApiClient({
    logging: true
  });
  let retriever = new DataRetriever(pokeApiClient);
  let rawDataMap = await retriever.retrieve();
  await writeJson(rawDataMap, RAW_DATA_FILENAME);
})();
