import type { Instruction } from "../models/instructions";

export function makeMockInstructions(): Instruction[] {
  return [
    {
      id: "i-1",
      index: 1,
      location: { lat: 51.686, lon: 5.317 },
      distanceFromPrev: 0,
      distanceFromStart: 0,
      distanceRemaining: 5200,
      maneuverType: "START",
      roadTo: "Hoogweg",
      diagram: {
        incomingBearingDeg: 180,
        outgoingBearingDeg: 0,
          renderOverrides: { hideDistance: true, hideRoadNames: true },

        arms: [
          { id: "a1", bearingDeg: 180, isIncoming: true, name: "Start" },
          { id: "a2", bearingDeg: 0, isRouteOutgoing: true, name: "Hoogweg" },
          { id: "a3", bearingDeg: 90, name: "Side road" },
        ],
      },
    },
    {
      id: "i-2",
      index: 2,
      location: { lat: 51.688, lon: 5.33 },
      distanceFromPrev: 340,
      distanceFromStart: 340,
      distanceRemaining: 4860,
      maneuverType: "TURN_RIGHT",
      roadFrom: "Hoogweg",
      roadTo: "Lipsstraat",
      diagram: {
        incomingBearingDeg: 0,
        outgoingBearingDeg: 90,
        arms: [
          { id: "b1", bearingDeg: 180, name: "Hoogweg" },
          { id: "b2", bearingDeg: 0, isIncoming: true, name: "Hoogweg" },
          { id: "b3", bearingDeg: 90, isRouteOutgoing: true, name: "Lipsstraat" },
          { id: "b4", bearingDeg: 270, name: "Farm road" },
        ],
      },
    },
    {
      id: "rb-1",
      index: 3,
      location: { lat: 51.686, lon: 5.317 },
      distanceFromPrev: 120,
      distanceFromStart: 460,
      distanceRemaining: 3200,
      maneuverType: "ROUNDABOUT",
      roadFrom: "N-road",
      roadTo: "Exit road",
      diagram: {
        incomingBearingDeg: 0,   // will be rotated so incoming is bottom anyway
        outgoingBearingDeg: 90,
        arms: [
          { id: "in", bearingDeg: 180, isIncoming: true },
          { id: "ex1", bearingDeg: 270 },
          { id: "ex2", bearingDeg: 0 },
          { id: "ex3", bearingDeg: 90, isRouteOutgoing: true },
          { id: "ex4", bearingDeg: 135 },
        ],
        roundabout: {
          exitNumber: 3,
          exitCountVisible: 4,
          direction: "CCW",
        },
      },
    }
  ];
}