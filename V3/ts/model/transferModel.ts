export type FormId = number;
export type VarietyId = number;
export type SpeciesId = number;

export type MoveId = number;

export type AbilityId = number;

export type VersionGroupId = number;
export type GenerationId = number;

export type TypeId = number;

export enum AbilityStatus {
    Standard = 0,
    Hidden = 1,
    Signature = 2,
}

export interface VarietyAbility {
    i: AbilityId;
    s: AbilityStatus;
    g?: GenerationId[];
}

export interface VarietyVersionGroup {
    i: VersionGroupId;
    f: FormId[];
    m: MoveId[];
}

export interface SpeciesVariety {
    i: VarietyId;
    vg: VarietyVersionGroup[];
    a: VarietyAbility[];
}

export interface GenerationSpecies {
    i: SpeciesId;
    v: SpeciesVariety[];
    dv: VarietyId;
}

export interface Generation {
    i: GenerationId;
    s: GenerationSpecies[];
}

export interface Type {
    i: TypeId;
    m: MoveId[];
}

export interface Data {
    g: Generation[];
    t: Type[];
}