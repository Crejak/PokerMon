import { RawDataMapObject } from "../model/rawDataModel";
import { FilteredDataMapObject, FilteredDataObject } from "../model/filteredDataModel";
import * as PokeApi from "../model/pokeApiModel";
import { versions } from "process";
import { types } from "util";

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
     * 
     * Excluding a version group will exclude the corresponding pokemon
     * move learnsets.
     * 
     * @default undefined
     */
    excludeVersionGroups?: PokeApi.Identifier[];
    /**
     * Exclude generations from the specified ID onwards. From example, excluding
     * generation 7 will also exclude generation 8. It is not possible to only exclude
     * some generations without excluding the following ones.
     * 
     * Excluding a generation will exclude the associated types, moves, abilities and
     * species.
     * 
     * Excluding a generation will also exclude the corresponing version groups.
     * 
     * @default 8 - Excluding Sword and Shield
     */
    excludeGenerationsFrom?: PokeApi.Identifier;
    /**
     * Exclude specified types from the raw data.
     * 
     * Excluding a types will also exclude all Pokémon and moves of that type.
     * 
     * @default 19 - Excluding the Shadow type from Colosseum and XD
     */
    excludeTypes?: PokeApi.Identifier[];

    //#region private fields - non destinés à être configurés

    /**
     * CHANGING THIS VALUE MAY HAS HAZARDOUS CONSEQUENCES
     * 
     * Exclude specified moves from the raw data.
     * 
     * @default undefined
     */
    excludeMoves?: PokeApi.Identifier[];
    /**
     * CHANGING THIS VALUE MAY HAS HAZARDOUS CONSEQUENCES
     * 
     * Exclude specified abilities from the raw data.
     */
    excludeAbilities?: PokeApi.Identifier[];
    /**
     * CHANGING THIS VALUE MAY HAS HAZARDOUS CONSEQUENCES
     * 
     * Exclude specified Pokémon species from the raw data.
     * 
     * @default undefined
     */
    excludeSpecies?: PokeApi.Identifier[];
    /**
     * CHANGING THIS VALUE MAY HAS HAZARDOUS CONSEQUENCES
     * 
     * Exclude specified Pokémon varieties from the raw data.
     * 
     * @default undefined
     */
    excludeVarieties?: PokeApi.Identifier[];
    /**
     * CHANGING THIS VALUE MAY HAS HAZARDOUS CONSEQUENCES
     * 
     * Exclude specified Pokémon forms from the raw data.
     * 
     * @default undefined
     */
    excludeForms?: PokeApi.Identifier[];
    /**
     * CHANGING THIS VALUE MAY HAS HAZARDOUS CONSEQUENCES
     * 
     * Exclude specified evolution chains from the raw data.
     * 
     * @default undefined
     */
    excludeEvolutionChains?: PokeApi.Identifier[];

    //#endregion
}

const DEFAULT_OPTIONS: DataFiltererOptions = {
    excludeVersions: [19, 20], // Colosseum et XD
    excludeGenerationsFrom: 8,
    excludeTypes: [19] // Shadow
}

export class DataFilterer {
    readonly rawDataMap: RawDataMapObject;
    filteredDataMap: FilteredDataMapObject;
    filteringPromise: Promise<FilteredDataMapObject>;
    options: DataFiltererOptions;

    constructor(rawDataMap: RawDataMapObject, options?: DataFiltererOptions) {
        this.rawDataMap = rawDataMap;
        this.filteredDataMap = {
            generations: {}, // ok
            versionGroups: {}, // ok
            versions: {}, // ok
            evolutionChains: {},
            species: {}, // ok
            varieties: {}, // ok (dont learnset et abilities possibles)
            forms: {}, // ok
            abilities: {}, // ok
            moves: {}, // ok
            natures: {}, // pas de filtre
            stats: {}, // pas de filtre
            types: {} // ok
        };
        this.filteringPromise = null;
        this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    }

    async filter(): Promise<FilteredDataMapObject> {
        if (!!this.filteringPromise) {
            return this.filteringPromise;
        }

        this.filteringPromise = new Promise<FilteredDataMapObject>((resolve, reject) => {
            // Filtrer les données
            this.filterGVGV();
            this.filterTypes();
            this.filterMoves();
            this.filterAbilities();
            this.filterSVF();
            this.filterEvolutionChains();

            // Données transmises telles quelles
            this.filteredDataMap.natures = this.rawDataMap.natures;
            this.filteredDataMap.stats = this.rawDataMap.stats;
        });

        return this.filteringPromise;
    }

    private filterGVGV() {
        let excludeGenerationsFrom = this.options.excludeGenerationsFrom ?? Object.keys(this.rawDataMap.generations).length + 1;
        let versionGroupsToExclude = new Set<PokeApi.Identifier>(this.options.excludeVersionGroups ?? []);
        let versionsToExclude = new Set<PokeApi.Identifier>(this.options.excludeVersions ?? []);

        // Première passe sur les groupes de version : on exclut ceux dont toutes les versions sont exclues
        for (const versionGroup of Object.values(this.rawDataMap.versionGroups)) {
            const versions = versionGroup.versions.map(ar => this.rawDataMap.versions[ar.url]);
            if (versions.every(v => versionsToExclude.has(v.id))) {
                versionGroupsToExclude.add(versionGroup.id);
            }
        }
        
        // Passe sur les générations : on exclut celles qui n'ont plus de groupe de version
        for (const generation of Object.values(this.rawDataMap.generations)) {
            const versionGroups = generation.version_groups.map(ar => this.rawDataMap.versionGroups[ar.url]);
            if (versionGroups.every(vg => versionGroupsToExclude.has(vg.id))) {
                excludeGenerationsFrom = Math.min(excludeGenerationsFrom, generation.id);
            }
        }
        
        // Deuxième passe sur les groupes de version : on exclut ceux qui n'ont plus de génération
        for (const versionGroup of Object.values(this.rawDataMap.versionGroups)) {
            const generation = this.rawDataMap.generations[versionGroup.generation.url];
            if (generation.id >= excludeGenerationsFrom) {
                versionGroupsToExclude.add(versionGroup.id);
            }
        }

        // Passe sur les versions : on exclut celles qui n'ont plus leur groupe de version
        for (const version of Object.values(this.rawDataMap.versions)) {
            const versionGroup = this.rawDataMap.versionGroups[version.version_group.url];
            if (versionGroupsToExclude.has(versionGroup.id)) {
                versionsToExclude.add(version.id);
            }
        }

        // On peut maintenant appliquer le filtre
        this.options.excludeGenerationsFrom = excludeGenerationsFrom;
        this.options.excludeVersionGroups = Array.from(versionGroupsToExclude);
        this.options.excludeVersions = Array.from(versionsToExclude);
        
        for (const [key, generation] of Object.entries(this.rawDataMap.generations)) {
            if (generation.id >= excludeGenerationsFrom) {
                continue;
            }

            let generationClone = Object.assign({}, generation);

            // On filtre les groupes de version
            generationClone.version_groups = generation.version_groups
                .filter(versionGroupAr => !this.options.excludeVersionGroups.includes(this.rawDataMap.versionGroups[versionGroupAr.url].id));

            this.filteredDataMap.generations[key] = generationClone;
        }

        for (const [key, versionGroup] of Object.entries(this.rawDataMap.versionGroups)) {
            if (versionGroupsToExclude.has(versionGroup.id)) {
                continue;
            }

            let versionGroupClone = Object.assign({}, versionGroup);

            // On filtre les versions
            versionGroupClone.versions = versionGroup.versions
                .filter(versionAr => !this.options.excludeVersions.includes(this.rawDataMap.versions[versionAr.url].id));

            this.filteredDataMap.versionGroups[key] = versionGroupClone;
        }

        for (const [key, version] of Object.entries(this.rawDataMap.versions)) {
            if (versionsToExclude.has(version.id)) {
                continue;
            }
            this.filteredDataMap.versions[key] = version;
        }
    }

    private filterTypes() {
        let typesToExclude = new Set<PokeApi.Identifier>(this.options.excludeTypes ?? []);

        for (const [key, type] of Object.entries(this.rawDataMap.types)) {
            const generation = this.rawDataMap.generations[type.generation.url];

            if (typesToExclude.has(type.id) || generation.id >= this.options.excludeGenerationsFrom) {
                typesToExclude.add(type.id);
                continue;
            }

            this.filteredDataMap.types[key] = type;
        }

        this.options.excludeTypes = Array.from(typesToExclude);

        // Il faut repasser sur les générations pour exclure les types
        for (const [key, generation] of Object.entries(this.filteredDataMap.generations)) {
            generation.types = generation.types
                .filter(typeAr => !this.options.excludeTypes.includes(this.rawDataMap.types[typeAr.url].id));
        }
    }

    private filterMoves() {
        let movesToExclude = new Set<PokeApi.Identifier>(this.options.excludeMoves ?? []);

        for (const [key, move] of Object.entries(this.rawDataMap.moves)) {
            const generation = this.rawDataMap.generations[move.generation.url];
            const type = this.rawDataMap.types[move.type.url];

            if (movesToExclude.has(move.id) || generation.id >= this.options.excludeGenerationsFrom || this.options.excludeTypes.includes(type.id)) {
                movesToExclude.add(move.id);
                continue;
            }

            this.filteredDataMap.moves[key] = move;
        }

        this.options.excludeMoves = Array.from(movesToExclude);
    }

    private filterAbilities() {
        let abilitiesToExclude = new Set<PokeApi.Identifier>(this.options.excludeAbilities ?? []);

        for (const [key, ability] of Object.entries(this.rawDataMap.abilities)) {
            const generation = this.rawDataMap.generations[ability.generation.url];

            if (abilitiesToExclude.has(ability.id) || generation.id >= this.options.excludeGenerationsFrom) {
                abilitiesToExclude.add(ability.id);
                continue;
            }

            this.filteredDataMap.abilities[key] = ability;
        }

        this.options.excludeAbilities = Array.from(abilitiesToExclude);
    }

    private filterSVF() {
        let speciesToExclude = new Set<PokeApi.Identifier>(this.options.excludeSpecies ?? []);
        let varietiesToExclude = new Set<PokeApi.Identifier>(this.options.excludeVarieties ?? []);
        let formsToExclude = new Set<PokeApi.Identifier>(this.options.excludeForms ?? []);

        // Première passe sur les espèces : filtre sur la génération
        for (const species of Object.values(this.rawDataMap.species)) {
            const generation = this.rawDataMap.generations[species.generation.url];

            if (generation.id >= this.options.excludeGenerationsFrom) {
                speciesToExclude.add(species.id);
            }
        }

        // Première passe sur les variétés : filtre sur les espèces et les types
        for (const variety of Object.values(this.rawDataMap.varieties)) {
            const species = this.rawDataMap.species[variety.species.url];
            const types = variety.types.map(pokemonType => this.rawDataMap.types[pokemonType.type.url]);

            if (speciesToExclude.has(species.id) || types.some(type => this.options.excludeTypes.includes(type.id))) {
                varietiesToExclude.add(variety.id);
            }
        }

        // Première passe sur les formes : filtes sur les variétés et les groupes de version
        for (const form of Object.values(this.rawDataMap.forms)) {
            const variety = this.rawDataMap.varieties[form.pokemon.url];
            const versionGroup = this.rawDataMap.versionGroups[form.version_group.url];

            if (varietiesToExclude.has(variety.id) || this.options.excludeVersionGroups.includes(versionGroup.id)) {
                formsToExclude.add(form.id);
            }
        }

        // Deuxième passe sur les variétés : filtre sur celles qui n'ont plus de forme associée
        for (const variety of Object.values(this.rawDataMap.varieties)) {
            const forms = variety.forms.map(ar => this.rawDataMap.forms[ar.url]);

            if (forms.every(form => formsToExclude.has(form.id))) {
                varietiesToExclude.add(variety.id);
            }
        }

        // Deuxième passe sur les espèces : filtre sur celles qui n'ont plus de variété associée
        for (const species of Object.values(this.rawDataMap.species)) {
            const varieties = species.varieties.map(speciesVariety => this.rawDataMap.varieties[speciesVariety.pokemon.url]);

            if (varieties.every(variety => varietiesToExclude.has(variety.id))) {
                speciesToExclude.add(species.id);
            }
        }
        
        // On peut maintenant appliquer le filtre
        this.options.excludeSpecies = Array.from(speciesToExclude);
        this.options.excludeVarieties = Array.from(varietiesToExclude);
        this.options.excludeForms = Array.from(formsToExclude);

        for (const [key, species] of Object.entries(this.rawDataMap.species)) {
            if (speciesToExclude.has(species.id)) {
                continue;
            }

            // On doit filtrer les variétés possibles
            let speciesClone = Object.assign({}, species);
            speciesClone.varieties = species.varieties
                .filter(speciesVariety => !this.options.excludeVarieties.includes(this.rawDataMap.varieties[speciesVariety.pokemon.url].id));

            this.filteredDataMap.species[key] = speciesClone;
        }

        for (const [key, variety] of Object.entries(this.rawDataMap.varieties)) {
            if (varietiesToExclude.has(variety.id)) {
                continue;
            }

            // Filtrer les pokemonMoves
            // On doit cloner l'objet pour modifier les learnsets (on clone aussi le tableau du coup)
            let varietyClone = Object.assign({}, variety);
            varietyClone.moves = variety.moves
                .filter(pokemonMove => !this.options.excludeMoves.includes(this.rawDataMap.moves[pokemonMove.move.url].id))
                .map(pokemonMove => Object.assign({}, pokemonMove, {
                    version_group_details: pokemonMove.version_group_details.filter(moveVersion => !this.options.excludeVersionGroups.includes(this.rawDataMap.versionGroups[moveVersion.version_group.url].id))
                }));
            // Il faut aussi filtrer les abilités possibles
            varietyClone.abilities = variety.abilities
                .filter(pokemonAbility => !this.options.excludeAbilities.includes(this.rawDataMap.abilities[pokemonAbility.ability.url].id));
                
            //Enfin, on filtre les formes
            varietyClone.forms = variety.forms
                .filter(formAr => !this.options.excludeForms.includes(this.rawDataMap.forms[formAr.url].id));

            this.filteredDataMap.varieties[key] = varietyClone;
        }

        for (const [key, forms] of Object.entries(this.rawDataMap.forms)) {
            if (formsToExclude.has(forms.id)) {
                continue;
            }
            this.filteredDataMap.forms[key] = forms;
        }

        // Il faut repasser sur les générations pour exclures les espèces qui n'y sont plus
        for (const [key, generation] of Object.entries(this.filteredDataMap.generations)) {
            generation.pokemon_species = generation.pokemon_species
                .filter(speciesAr => !this.options.excludeSpecies.includes(this.rawDataMap.species[speciesAr.url].id));
        }
    }

    private filterEvolutionChains() {
        // C'est compliqué mdr !
        // On a des arbres qui représentent l'évolution dans une famille de Pokémon
        // Sauf que ces arbres ne sont pas versionés
        // => C'est à dire que pour un Pokémon de Génération I, son arbre d'évolution peut contenir
        //    des Pokémon de Générations ultérieures (ex: Evolitions, Pokémon bébés)
        // Exemple type : Kicklee / Tygnon : deux arbres d'évolution différentes en génération I mais 
        //    en génération II sont réunis dans le même arbre (débugant -> kicklee / tygnon / kapoera)

        let evolutionChainsToExclude = new Set<PokeApi.Identifier>(this.options.excludeEvolutionChains ?? []);
        let nextId = Object.values(this.rawDataMap.evolutionChains)
            .map(evolutionChain => evolutionChain.id)
            .reduce((max, current) => Math.max(max, current), 0) + 1;
        let newEvolutionChainsMap: {[key: string]: PokeApi.EvolutionChain} = {};

        const that = this;
        function browseTree(chainLink: PokeApi.ChainLink): PokeApi.ChainLink {
            let chainLinkClone = Object.assign({}, chainLink);
            const children = chainLink.evolves_to
                .filter(childLink => !that.options.excludeSpecies.includes(that.rawDataMap.species[childLink.species.url].id))
                .map(childLink => Object.assign({}, childLink));

            if (!that.options.excludeSpecies.includes(that.rawDataMap.species[chainLink.species.url].id)) {
                chainLinkClone.species = undefined;

                for (const childLink of children) {
                    newEvolutionChainsMap[`custom-evolution-chain-${nextId}`] = {
                        id: nextId,
                        baby_trigger_item: undefined,
                        chain: childLink
                    }
                }
            }

            chainLinkClone.evolves_to = children.map(childLink => browseTree(childLink));

            return chainLinkClone;
        }
        for (const [key, evolutionChain] of Object.entries(this.rawDataMap.evolutionChains)) {
            const chainLink = browseTree(evolutionChain.chain);

            if (!chainLink.species) {
                evolutionChainsToExclude.add(evolutionChain.id);
                continue;
            }

            this.filteredDataMap.evolutionChains[key] = Object.assign({}, evolutionChain, {
                chain: chainLink
            });
        }

        function assignNewTree(chainLink: PokeApi.ChainLink, evolutionChainKey: string) {
            let species = that.filteredDataMap.species[chainLink.species.url];
            species.evolution_chain = {
                url: evolutionChainKey
            }
            for (const childLink of chainLink.evolves_to) {
                assignNewTree(childLink, evolutionChainKey);
            }
        }
        for (const [key, newEvolutionChain] of Object.entries(newEvolutionChainsMap)) {
            this.filteredDataMap.evolutionChains[key] = newEvolutionChain;

            // Update des espèces de Pokémon
            assignNewTree(newEvolutionChain.chain, key);
        }

        this.options.excludeEvolutionChains = Array.from(evolutionChainsToExclude);
    }
}