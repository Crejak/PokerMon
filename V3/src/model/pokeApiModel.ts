export type Unspecified = any;

export type Url = string;
export type Identifier = number;
export type ResourceName = string;
export type TranslatedName = string;

export type Order = number;

export type ISO639 = string;
export type ISO3166 = string;

//#region Common

export interface Resource {
    id: Identifier;
}

export interface NamedResource extends Resource {
    name: ResourceName;
}

export interface APIResource<T extends Resource> {
    url: Url;
}

export interface APIResourceList<T extends Resource> {
    count: number;
    next?: Url;
    previous?: Url;
    results: APIResource<T>[];
}

export interface NamedAPIResource<T extends NamedResource> extends APIResource<T> {
    name: ResourceName;
    url: Url;
}

export interface NamedAPIResourceList<T extends NamedResource> extends APIResourceList<T> {
    count: number;
    next?: Url;
    previous?: Url;
    results: NamedAPIResource<T>[];
}

export interface Language extends NamedResource {
    official: boolean;
    iso639: ISO639;
    iso3166: ISO3166;
    names: Name[];
}

export interface Name {
    name: TranslatedName;
    language: NamedAPIResource<Language>;
}

export interface VerboseEffect {
    effect: string;
    short_effect: string;
    language: NamedAPIResource<Language>;
}

export interface Effect {
    effect: string;
    language: NamedAPIResource<Language>;
}

export interface FlavorText {
    flavor_text: string;
    language: NamedAPIResource<Language>;
    version: NamedAPIResource<Version>;
}

export interface Description {
    description: string;
    language: NamedAPIResource<Language>;
}

//#endregion

//#region Generation - VersionGroup - Version

export interface Version extends NamedResource {
    names: Name[];
    version_group: NamedAPIResource<VersionGroup>;
}

export interface VersionGroup extends NamedResource {
    order: Order;
    generation: NamedAPIResource<Generation>;
    versions: NamedAPIResource<Version>[];
    //#region unspecified
    move_learn_methods: Unspecified;
    pokedexes: Unspecified;
    regions: Unspecified
    //#endregion
}

export interface Generation extends NamedResource {
    abilities: NamedAPIResource<Ability>[];
    names: Name[];
    moves: NamedAPIResource<Move>[];
    pokemon_species: NamedAPIResource<PokemonSpecies>[];
    types: NamedAPIResource<Type>[];
    version_groups: NamedAPIResource<VersionGroup>[];
    //#region unspecified
    main_region: Unspecified;
    //#endregion
}

//#endregion

//#region Ability

export interface Ability extends NamedResource {
    is_main_series: boolean;
    generation: NamedAPIResource<Generation>;
    names: Name[];
    effect_entries: VerboseEffect[];
    effect_changes: AbilityEffectChange[];
    flavor_text_entries: AbilityFlavorText[];
    pokemon: AbilityPokemon[];
}

export interface AbilityEffectChange {
    effect_entries: Effect[];
    version_group: NamedAPIResource<VersionGroup>;
}

export interface AbilityFlavorText {
    flavor_text: string;
    language: NamedAPIResource<Language>;
    version_group: NamedAPIResource<VersionGroup>;
}

export interface AbilityPokemon {
    is_hidden: boolean;
    slot: number;
    pokemon: NamedAPIResource<Pokemon>;
}

//#endregion

//#region Type

export interface Type extends NamedResource {
    generation: NamedAPIResource<Generation>;
    names: Name[];
    pokemon: TypePokemon[];
    moves: NamedAPIResource<Move>[];
    //#region unspecified
    damage_relations: Unspecified;
    game_indices: Unspecified;
    move_damage_class: Unspecified;
    //#endregion
}

export interface TypePokemon {
    slot: number;
    pokemon: NamedAPIResource<Pokemon>;
}

//#endregion

//#region Move

export interface Move extends NamedResource {
    accuracy: number;
    effect_chance: number;
    pp: number;
    priority: number;
    power: number;
    effect_entries: VerboseEffect[];
    flavor_text_entries: MoveFlavorText[];
    generation: NamedAPIResource<Generation>;
    names: Name[];
    type: NamedAPIResource<Type>;
    //#region unspecified
    contest_combos: Unspecified;
    contest_type: Unspecified;
    contest_effect: Unspecified;
    damage_class: Unspecified;
    effect_changes: Unspecified;
    machines: Unspecified;
    meta: Unspecified;
    past_values: Unspecified;
    stat_changes: Unspecified;
    super_contest_effect: Unspecified;
    target: Unspecified;
    //#endregion
}

export interface MoveFlavorText {
    flavor_text: string;
    language: NamedAPIResource<Language>;
    version_group: NamedAPIResource<VersionGroup>;
}

//#endregion

//#region Pokemon

export interface PokemonSpecies extends NamedResource {
    order: Order;
    gender_rate: number;
    capture_rate: number;
    base_happiness: number;
    is_baby: boolean;
    is_legendary: boolean;
    is_mythical: boolean;
    hatch_counter: boolean;
    has_gender_differences: boolean;
    forms_switchable: boolean;
    evolves_from_species: NamedAPIResource<PokemonSpecies>;
    evolution_chain: APIResource<EvolutionChain>;
    generation: NamedAPIResource<Generation>;
    names: Name[];
    flavor_text_entries: FlavorText[];
    form_descriptions: Description[];
    varieties: PokemonSpeciesVariety[];
    //#region unspecified
    growth_rate: Unspecified;
    pokedex_numbers: Unspecified;
    egg_groups: Unspecified;
    color: Unspecified;
    shape: Unspecified;
    habitat: Unspecified;
    pal_park_encounters: Unspecified;
    genera: Unspecified;
    //#endregion
}

export interface EvolutionChain extends Resource {
    chain: ChainLink;
    //#region unspecified
    baby_trigger_item: Unspecified;
    //#endregion
}

export interface ChainLink {
    is_baby: boolean;
    species: NamedAPIResource<PokemonSpecies>;
    evolves_to: ChainLink[]
    //#region unspecified
    evolution_details: Unspecified;
    //#endregion
}

export interface PokemonSpeciesVariety {
    is_default: boolean;
    pokemon: NamedAPIResource<Pokemon>;
}

export interface Pokemon extends NamedResource {
    base_experience: number;
    height: number;
    is_default: boolean;
    order: Order;
    weight: number;
    abilities: PokemonAbility[];
    forms: NamedAPIResource<PokemonForm>[];
    moves: PokemonMove[];
    species: NamedAPIResource<PokemonSpecies>;
    stats: PokemonStat[];
    types: PokemonType[];
    //#region unspecified
    game_indices: Unspecified;
    held_items: Unspecified;
    location_area_encounters: Unspecified;
    sprites: Unspecified;
    //#endregion
}

export interface PokemonAbility {
    is_hidden: boolean;
    slot: number;
    ability: NamedAPIResource<Ability>;
}

export interface PokemonMove {
    move: NamedAPIResource<Move>;
    version_group_details: PokemonMoveVersion[];
}

export interface PokemonMoveVersion {
    version_group: NamedAPIResource<VersionGroup>;
    level_learned_at: number;
    //#region unspecified
    move_learn_method: Unspecified;
    //#endregion
}

export interface PokemonStat {
    stat: NamedAPIResource<Stat>;
    effort: number;
    base_stat: number;
}

export interface PokemonType {
    slot: number;
    type: NamedAPIResource<Type>;
}

export interface PokemonForm extends NamedResource {
    order: Order;
    form_order: Order;
    is_default: boolean;
    is_battle_only: boolean;
    is_mega: boolean;
    form_name: string;
    pokemon: NamedAPIResource<Pokemon>;
    version_group: NamedAPIResource<VersionGroup>;
    names: Name[];
    form_names: Name[];
    //#region unspecified
    sprites: Unspecified;
    //#endregion
}

//#endregion

//#region Stat

export interface Stat extends NamedResource {
    is_battle_only: boolean;
    names: Name[];
    //#region unspecified
    game_index: Unspecified;
    affecting_moves: Unspecified;
    affecting_natures: Unspecified;
    characteristics: Unspecified;
    move_damage_class: Unspecified;
    //#endregion
}

//#endregion

//#region Nature

export interface Nature extends NamedResource {
    decreased_stat: NamedAPIResource<Stat>;
    increased_stat: NamedAPIResource<Stat>;
    names: Name[];
    //#region unspecified
    hates_flavor: Unspecified;
    likes_flavor: Unspecified;
    pokeathlon_stat_changes: Unspecified;
    move_battle_style_preferences: Unspecified;
    //#endregion
}

//#endregion