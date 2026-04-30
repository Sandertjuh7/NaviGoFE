export type FilterPreset = "CLEAN_RALLY" | "EVERYTHING_DRIVABLE";

export type GenerateSettings = {
  filterPreset: FilterPreset;
  includeService: boolean;
  includeTracks: boolean;
  includePrivate: boolean;
};