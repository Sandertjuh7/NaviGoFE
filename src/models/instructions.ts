export type ManeuverType =
  | "START"
  | "CONTINUE"
  | "TURN_LEFT"
  | "TURN_RIGHT"
  | "BEAR_LEFT"
  | "BEAR_RIGHT"
  | "UTURN"
  | "ROUNDABOUT"
  | "DESTINATION";

export type LatLon = { lat: number; lon: number };

export type DiagramArm = {
  id: string;
  bearingDeg: number; // world space
  name?: string;
  highwayType?: string;
  isIncoming?: boolean;
  isRouteOutgoing?: boolean;
  isExcludedByFilter?: boolean;
};

export type DiagramOverrides = {
  rotationOverrideDeg?: number;
  hideArmIds?: string[];
  forceIncomingArmId?: string;
  forceOutgoingArmId?: string;
  distanceDisplayOverride?: string;

  // Evil-mode display overrides (per instruction)
  hideRoadNames?: boolean;
  hideDistance?: boolean;
};

export type Diagram = {
  incomingBearingDeg: number;
  outgoingBearingDeg: number;
  arms: DiagramArm[];
  roundabout?: {
    exitNumber: number;
    exitCountVisible: number;
    direction?: "CW" | "CCW";
  };
  renderOverrides?: DiagramOverrides;
};

export type Instruction = {
  id: string;
  index: number;
  location: LatLon;
  osmNodeId?: string;

  distanceFromPrev: number; // meters
  distanceFromStart: number; // meters
  distanceRemaining: number; // meters

  maneuverType: ManeuverType;
  roadFrom?: string;
  roadTo?: string;

  diagram: Diagram;
  notes?: string;
  warnings?: string[];
};