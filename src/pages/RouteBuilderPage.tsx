import { useMemo, useState } from "react";
import MapView from "../components/MapView";
import InstructionsPanel from "../components/InstructionsPanel";
import { makeMockInstructions } from "../mock/mockInstructions";
import { computeRoute, generateInstructions } from "../api/client";
import type { GenerateSettings } from "../api/dto";

export type EditMode = "pan" | "setStart" | "addMid" | "setEnd";

export type LatLon = { lat: number; lon: number };

type PointsState = {
  start: LatLon | null;
  mids: LatLon[];
  end: LatLon | null;
};

export default function RouteBuilderPage() {
  const [routeId, setRouteId] = useState<string | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<{
    type: "LineString";
    coordinates: [number, number][];
  } | null>(null);

  const [mode, setMode] = useState<EditMode>("pan");

  const [start, setStart] = useState<LatLon | null>(null);
  const [mids, setMids] = useState<LatLon[]>([]);
  const [end, setEnd] = useState<LatLon | null>(null);

  const [instructions, setInstructions] = useState(() => makeMockInstructions());

  // Global generation settings (future-proofing for BE)
  const [genSettings, setGenSettings] = useState<GenerateSettings>({
    filterPreset: "CLEAN_RALLY",
    includeService: false,
    includeTracks: false,
    includePrivate: false,
  });

  const points: PointsState = useMemo(
    () => ({ start, mids, end }),
    [start, mids, end],
  );

  function clearAll() {
    setStart(null);
    setMids([]);
    setEnd(null);
    setMode("pan");
    setInstructions([]);
    setRouteId(null);
    setRouteGeometry(null);
  }

  function handleMapClick(p: LatLon) {
    if (mode === "setStart") {
      setStart(p);
      setMode("pan");
      return;
    }
    if (mode === "addMid") {
      setMids((prev) => [...prev, p]);
      return;
    }
    if (mode === "setEnd") {
      setEnd(p);
      setMode("pan");
      return;
    }
  }

  async function computeRouteClick() {
    if (!start || !end) return;

    try {
      // Step 1: route
      const routeRes = await computeRoute({
        points: { start, mids, end },
        profile: "car",
      });

      setRouteId(routeRes.routeId);
      setRouteGeometry(routeRes.geometry);

      // Step 2: instructions
      const instrRes = await generateInstructions({
        routeId: routeRes.routeId,
        settings: genSettings,
      });

      setInstructions(instrRes.instructions);
    } catch (e) {
      console.error(e);
      alert(String(e));
    }
  }

  async function regenerateInstructionsClick() {
    if (!routeId) return;

    try {
      const instrRes = await generateInstructions({
        routeId,
        settings: genSettings,
      });

      setInstructions(instrRes.instructions);
    } catch (e) {
      console.error(e);
      alert(String(e));
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* LEFT: map + toolbar overlay */}
      <div style={{ flex: 1, position: "relative" }}>
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 1000,
            display: "flex",
            gap: 8,
            padding: 8,
            background: "rgba(255,255,255,0.92)",
            border: "1px solid #ddd",
            borderRadius: 6,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          <button onClick={() => setMode("setStart")}>Set Start</button>
          <button onClick={() => setMode("addMid")}>Add Midpoint</button>
          <button onClick={() => setMode("setEnd")}>Set End</button>
          <button onClick={() => setMode("pan")}>Pan</button>

          <button
            onClick={computeRouteClick}
            disabled={!start || !end}
            title={!start || !end ? "Set start and end first" : "Compute route"}
          >
            Compute route
          </button>

          <button
            onClick={regenerateInstructionsClick}
            disabled={!routeId}
            title={!routeId ? "Compute a route first" : "Regenerate instructions"}
          >
            Regenerate instructions
          </button>

          <button onClick={clearAll}>Clear</button>

          {/* Settings (future-proof, used by generateInstructions) */}
          <div
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              marginLeft: 8,
              paddingLeft: 8,
              borderLeft: "1px solid #ddd",
            }}
          >
            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
              Preset:
              <select
                value={genSettings.filterPreset}
                onChange={(e) =>
                  setGenSettings((s) => ({
                    ...s,
                    filterPreset: e.target.value as GenerateSettings["filterPreset"],
                  }))
                }
              >
                <option value="CLEAN_RALLY">Clean rally</option>
                <option value="EVERYTHING_DRIVABLE">Everything drivable</option>
              </select>
            </label>

            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={genSettings.includeService}
                onChange={(e) =>
                  setGenSettings((s) => ({ ...s, includeService: e.target.checked }))
                }
              />
              service
            </label>

            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={genSettings.includeTracks}
                onChange={(e) =>
                  setGenSettings((s) => ({ ...s, includeTracks: e.target.checked }))
                }
              />
              tracks
            </label>

            <label style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <input
                type="checkbox"
                checked={genSettings.includePrivate}
                onChange={(e) =>
                  setGenSettings((s) => ({ ...s, includePrivate: e.target.checked }))
                }
              />
              private
            </label>
          </div>
        </div>

        <MapView
          mode={mode}
          points={points}
          onMapClick={handleMapClick}
          routeGeometry={routeGeometry}
        />
      </div>

      {/* RIGHT: instructions */}
      <aside
        style={{
          width: 520,
          borderLeft: "1px solid #ccc",
          overflow: "auto",
          background: "#f2f2f2",
        }}
      >
        <InstructionsPanel
          instructions={instructions}
          onChangeInstructions={setInstructions}
        />

        {/* Optional debug section */}
        <div style={{ padding: 12, fontSize: 12, color: "#444" }}>
          <div>
            <strong>Mode:</strong> {mode}
          </div>
          <div>
            <strong>RouteId:</strong> {routeId ?? "-"}
          </div>
          <div>
            <strong>Start:</strong>{" "}
            {start ? `${start.lat.toFixed(5)}, ${start.lon.toFixed(5)}` : "-"}
          </div>
          <div>
            <strong>Mids:</strong> {mids.length}
          </div>
          <div>
            <strong>End:</strong>{" "}
            {end ? `${end.lat.toFixed(5)}, ${end.lon.toFixed(5)}` : "-"}
          </div>
          <div>
            <strong>Geometry:</strong>{" "}
            {routeGeometry ? `${routeGeometry.coordinates.length} pts` : "-"}
          </div>
          <div>
            <strong>Preset:</strong> {genSettings.filterPreset}
          </div>
          <div>
            <strong>Toggles:</strong>{" "}
            {[
              genSettings.includeService ? "service" : null,
              genSettings.includeTracks ? "tracks" : null,
              genSettings.includePrivate ? "private" : null,
            ]
              .filter(Boolean)
              .join(", ") || "-"}
          </div>
        </div>
      </aside>
    </div>
  );
}