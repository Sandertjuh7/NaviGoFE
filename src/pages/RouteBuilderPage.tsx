import { useMemo, useState } from "react";
import MapView from "../components/MapView";

export type EditMode = "pan" | "setStart" | "addMid" | "setEnd";

export type LatLon = { lat: number; lon: number };

export default function RouteBuilderPage() {
  const [mode, setMode] = useState<EditMode>("pan");

  const [start, setStart] = useState<LatLon | null>(null);
  const [mids, setMids] = useState<LatLon[]>([]);
  const [end, setEnd] = useState<LatLon | null>(null);

  const points = useMemo(() => ({ start, mids, end }), [start, mids, end]);

  function clearAll() {
    setStart(null);
    setMids([]);
    setEnd(null);
    setMode("pan");
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
    // pan = do nothing special
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ flex: 1, position: "relative" }}>
        {/* Toolbar overlay */}
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
          }}
        >
          <button onClick={() => setMode("setStart")}>Set Start</button>
          <button onClick={() => setMode("addMid")}>Add Midpoint</button>
          <button onClick={() => setMode("setEnd")}>Set End</button>
          <button onClick={() => setMode("pan")}>Pan</button>
          <button onClick={clearAll}>Clear</button>
        </div>

        <MapView mode={mode} points={points} onMapClick={handleMapClick} />
      </div>

      <aside
        style={{
          width: 520,
          borderLeft: "1px solid #ccc",
          overflow: "auto",
          padding: 12,
        }}
      >
        <h2 style={{ marginTop: 0 }}>Route Instructions</h2>
        <div style={{ fontSize: 14, lineHeight: 1.4 }}>
          <div>
            <strong>Mode:</strong> {mode}
          </div>
          <div>
            <strong>Start:</strong> {start ? `${start.lat.toFixed(5)}, ${start.lon.toFixed(5)}` : "-"}
          </div>
          <div>
            <strong>Mids:</strong> {mids.length}
          </div>
          <div>
            <strong>End:</strong> {end ? `${end.lat.toFixed(5)}, ${end.lon.toFixed(5)}` : "-"}
          </div>
        </div>
      </aside>
    </div>
  );
}