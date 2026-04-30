import type {
  ComputeRouteRequest,
  ComputeRouteResponse,
  GenerateInstructionsRequest,
  GenerateInstructionsResponse,
} from "./dto";
import { makeMockInstructions } from "../mock/mockInstructions";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString() || "http://localhost:8080";

/**
 * Step 1: routing (geometry + route id)
 */
export async function computeRoute(
  req: ComputeRouteRequest,
): Promise<ComputeRouteResponse> {
  // MOCK for now: return a stable id + empty geometry.
  // Later replace with fetch(`${API_BASE_URL}/api/route/compute`, ...)
  void req;

  return {
    routeId: "mock-route-1",
    geometry: { type: "LineString", coordinates: [] },
    maneuvers: [],
  };
}

/**
 * Step 2: instruction generation (tulips, distances, etc.)
 */
export async function generateInstructions(
  req: GenerateInstructionsRequest,
): Promise<GenerateInstructionsResponse> {
  // MOCK for now: return the same mock instructions you already see.
  // Later replace with fetch(`${API_BASE_URL}/api/instructions/generate`, ...)
  void req;

  return { instructions: makeMockInstructions() };
}