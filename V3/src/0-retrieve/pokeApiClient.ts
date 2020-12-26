import * as PokeApi from "../model/pokeApiModel";

const BASE_URL: string = "https://pokeapi.co/api/v2/";
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
}

export class PokeApiClient {
    resourceCache: Map<PokeApi.Url, PokeApi.Resource>;
    resourceListCache: Map<string, PokeApi.APIResourceList<PokeApi.NamedResource>>;

    constructor() {
        this.resourceCache = new Map<PokeApi.Url, PokeApi.Resource>();
        this.resourceListCache = new Map<string, PokeApi.APIResourceList<PokeApi.NamedResource>>();
    }

    async get<T extends PokeApi.Resource>(apiResource: PokeApi.APIResource<T>) : Promise<T> {
        return await this.fetchResource(apiResource.url) as T;
    }

    async getList<T extends PokeApi.Resource>(endpoint: string) : Promise<PokeApi.APIResourceList<T>> {
        return await this.fetchResourceList(BASE_URL + endpoint) as PokeApi.APIResourceList<T>;
    }

    //#region resource lists

    async getGenerationList() : Promise<PokeApi.APIResourceList<PokeApi.Generation>> {
        return await this.getList<PokeApi.Generation>(ENDPOINTS.generation);
    }

    async getVersionList() : Promise<PokeApi.APIResourceList<PokeApi.Version>> {
        return await this.getList<PokeApi.Version>(ENDPOINTS.version);
    }

    async getVersionGroupList() : Promise<PokeApi.APIResourceList<PokeApi.VersionGroup>> {
        return await this.getList<PokeApi.VersionGroup>(ENDPOINTS.versionGroup);
    }

    async getStatList() : Promise<PokeApi.APIResourceList<PokeApi.Stat>> {
        return await this.getList<PokeApi.Stat>(ENDPOINTS.stat);
    }

    async getTypeList() : Promise<PokeApi.APIResourceList<PokeApi.Type>> {
        return await this.getList<PokeApi.Type>(ENDPOINTS.type);
    }

    async getAbilityList() : Promise<PokeApi.APIResourceList<PokeApi.Ability>> {
        return await this.getList<PokeApi.Ability>(ENDPOINTS.ability);
    }

    async getNatureList() : Promise<PokeApi.APIResourceList<PokeApi.Nature>> {
        return await this.getList<PokeApi.Nature>(ENDPOINTS.nature);
    }

    async getMoveList() : Promise<PokeApi.APIResourceList<PokeApi.Move>> {
        return await this.getList<PokeApi.Move>(ENDPOINTS.move);
    }

    async getPokemonList() : Promise<PokeApi.APIResourceList<PokeApi.Pokemon>> {
        return await this.getList<PokeApi.Pokemon>(ENDPOINTS.pokemon);
    }

    async getPokemonSpeciesList() : Promise<PokeApi.APIResourceList<PokeApi.PokemonSpecies>> {
        return await this.getList<PokeApi.PokemonSpecies>(ENDPOINTS.pokemonSpecies);
    }

    async getPokemonFormList() : Promise<PokeApi.APIResourceList<PokeApi.PokemonForm>> {
        return await this.getList<PokeApi.PokemonForm>(ENDPOINTS.pokemonForm);
    }

    async getEvolutionChainList() : Promise<PokeApi.APIResourceList<PokeApi.EvolutionChain>> {
        return await this.getList<PokeApi.EvolutionChain>(ENDPOINTS.evolutionChain);
    }

    //#endregion

    //#region méthodes privées

    private processUrl(url: string) : PokeApi.Url {
        if (url.endsWith("/")) {
            url = url.substring(0, url.length - 1);
        }

        return url as PokeApi.Url;
    }

    private async call(url: PokeApi.Url, params?: any): Promise<any> {
        let urlObject = new URL(this.processUrl(url));
        if (!!params) {
            urlObject.search = new URLSearchParams(params).toString();
        }

        let response = await fetch(urlObject.toString());
        let json = await response.json();

        return json;
    }

    private async fetchResource(url: PokeApi.Url): Promise<PokeApi.Resource> {
        if (this.resourceCache.has(url)) {
            return this.resourceCache.get(url);
        }

        var resource = await this.call(url) as PokeApi.Resource;

        this.resourceCache.set(url, resource);

        return resource;
    }

    private async fetchResourceList<T extends PokeApi.NamedResource>(url: PokeApi.Url): Promise<PokeApi.APIResourceList<T>> {
        if (this.resourceListCache.has(url)) {
            return this.resourceListCache.get(url);
        }

        let preview = await this.call(url) as PokeApi.APIResourceList<T>;
        let count = preview.count;

        let list = await this.call(url, {
            limit: count
        });

        this.resourceListCache.set(url, list);

        return list;
    }

    //#endregion
}