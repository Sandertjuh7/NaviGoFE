import type { Instruction, LatLon } from "../models/instructions";

/**
 * Global filtering preset.
 * CLEAN_RALLY: hide noisy road classes by default.
 * EVERYTHING_DRIVABLE: show more arms (service, tracks, etc.).
 */
export type FilterPreset = "CLEAN_RALLY" | "EVERYTHING_DRIVABLE";

/**
 * Filtering & generation settings passed to instruction generation.
 * Keep this FE-owned and stable so the BE can evolve behind it.
 */
export type GenerateSettings = {
  filterPreset: FilterPreset;
  includeService: boolean;
  includeTracks: boolean;
  includePrivate: boolean;
};

export type RoutePoints = {
  start: LatLon;
  mids: LatLon[];
  end: LatLon;
};

export type ComputeRouteRequest = {
  points: RoutePoints;

  /**
   * Reserved for later (OSRM profiles, bicycle, etc.)
   */
  profile?: "car";
};

export type RouteGeometry = {
  type: "LineString";
  coordinates: [number, number][]; // [lon, lat]
};

/**
 * Optional: raw maneuver hints from the routing engine.
 * Not required for v1 UI, but useful for BE pipeline.
 */
export type ManeuverHint = {
  index: number;
  location: LatLon;
  type?: string; // reserved for later
  bearingBeforeDeg?: number;
  bearingAfterDeg?: number;
};

export type ComputeRouteResponse = {
  /**
   * Stable identifier to regenerate instructions without recomputing the route.
   */
  routeId: string;

  /**
   * Route geometry from routing layer (polyline / LineString).
   */
  geometry: RouteGeometry;

  /**
   * Optional: routing engine maneuver hints (v1 can keep empty).
   */
  maneuvers?: ManeuverHint[];
};

export type GenerateInstructionsRequest = {
  routeId: string;

  /**
   * Generation/filter settings.
   * Use Partial so you can send only what you care about.
   * BE should merge with defaults.
   */
  settings?: Partial<GenerateSettings>;
};

export type GenerateInstructionsResponse = {
  instructions: Instruction[];
};