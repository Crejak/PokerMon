import { RawDataObject } from "../model/rawDataModel";
import { FilteredDataObject } from "../model/filteredDataModel";
import * as PokeApi from "../model/pokeApiModel";

export interface DataFiltererOptions {
    /**
     * Exclude specified versions from the raw data. If all versions from a
     * version group are excluded, then the version group is also excluded.
     * 
     * @default [19, 20] - Excluding Colosseum and XD
     */
    excludeVersions?: PokeApi.Identifier[];
    /**
     * Exclude specified version groups from the raw data. Excluding a version 
     * group also exclude the corresponding versions. If all version groups
     * from a generation are excluded, then the generation is also excluded.
     */
    excludeVersionGroups?: PokeApi.Identifier[];
    /**
     * Exclude generations from the specified ID onwards. From example, excluding
     * generation 7 will also exclude generation 8. It is not possible to only exclude
     * some generations without excluding the following ones.
     * Excluding a generation will also exclude the corresponing version groups.
     * 
     * @default 8 - Excluding Sword and Shield
     */
    excludeGenerationsFrom?: PokeApi.Identifier
}

const DEFAULT_OPTIONS: DataFiltererOptions = {
    excludeVersions: [19, 20], // Colosseum et XD
    excludeGenerationsFrom: 8
}

export class DataFilterer {
    readonly rawData: RawDataObject;
    filteredData: FilteredDataObject;
    filteringPromise: Promise<FilteredDataObject>;

    constructor(rawData: RawDataObject) {
        this.rawData = rawData;
        this.filteredData = null;
        this.filteringPromise = null;
    }

    async filter(): Promise<FilteredDataObject> {
        if (!!this.filteringPromise) {
            return this.filteringPromise;
        }

        this.filteringPromise = new Promise<FilteredDataObject>((resolve, reject) => {
            // Filtrer les données
            // 
        });

        return this.filteringPromise;
    }
}