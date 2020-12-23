var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PokeApiClient = void 0;
    const BASE_URL = "https://pokeapi.co/api/v2/";
    const ENDPOINTS = {
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
    class PokeApiClient {
        constructor() {
            this.resourceCache = new Map();
        }
        get(apiResource) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.fetchResource(apiResource.url);
            });
        }
        getList(endpoint) {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.fetchResourceList(this.url(endpoint));
            });
        }
        //#region resource lists
        getGenerationList() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.getList(ENDPOINTS.generation);
            });
        }
        getVersionList() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.getList(ENDPOINTS.version);
            });
        }
        getVersionGroupList() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.getList(ENDPOINTS.versionGroup);
            });
        }
        getStatList() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.getList(ENDPOINTS.stat);
            });
        }
        getTypeList() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.getList(ENDPOINTS.type);
            });
        }
        getAbilityList() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.getList(ENDPOINTS.ability);
            });
        }
        getNatureList() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.getList(ENDPOINTS.nature);
            });
        }
        getMoveList() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.getList(ENDPOINTS.move);
            });
        }
        getPokemonList() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.getList(ENDPOINTS.pokemon);
            });
        }
        getPokemonSpeciesList() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.getList(ENDPOINTS.pokemonSpecies);
            });
        }
        getPokemonFormList() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.getList(ENDPOINTS.pokemonForm);
            });
        }
        getEvolutionChainList() {
            return __awaiter(this, void 0, void 0, function* () {
                return yield this.getList(ENDPOINTS.evolutionChain);
            });
        }
        //#endregion
        //#region méthodes privées
        url(endpoint, id) {
            if (!endpoint.endsWith("/")) {
                endpoint += "/";
            }
            if (!id) {
                id = "";
            }
            let url = BASE_URL + endpoint + id;
            if (!url.endsWith("/")) {
                url += "/";
            }
            return url;
        }
        call(url) {
            return __awaiter(this, void 0, void 0, function* () {
                let response = yield fetch(new Request(url));
                let json = yield response.json();
                return json;
            });
        }
        fetchResource(url) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.resourceCache.has(url)) {
                    return this.resourceCache.get(url);
                }
                var resource = yield this.call(url);
                this.resourceCache.set(url, resource);
                return resource;
            });
        }
        fetchResourceList(url) {
            return __awaiter(this, void 0, void 0, function* () {
                if (this.resourceListCache.has(url)) {
                    return this.resourceListCache.get(url);
                }
                var list = yield this.call(url);
                this.resourceListCache.set(url, list);
                return list;
            });
        }
    }
    exports.PokeApiClient = PokeApiClient;
});
