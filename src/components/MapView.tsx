import { useMemo } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMapEvents } from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { EditMode, LatLon } from "../pages/RouteBuilderPage";

type PointsState = {
  start: LatLon | null;
  mids: LatLon[];
  end: LatLon | null;
};

function ClickHandler({ onMapClick }: { onMapClick: (p: LatLon) => void }) {
  useMapEvents({
    click(e) {
      onMapClick({ lat: e.latlng.lat, lon: e.latlng.lng });
    },
  });
  return null;
}

export default function MapView({
  mode,
  points,
  onMapClick,
}: {
  mode: EditMode;
  points: PointsState;
  onMapClick: (p: LatLon) => void;
}) {
  // Build a temporary polyline (just connects points) so you see something happening
  const line: LatLngExpression[] = useMemo(() => {
    const out: LatLngExpression[] = [];
    if (points.start) out.push([points.start.lat, points.start.lon]);
    for (const m of points.mids) out.push([m.lat, m.lon]);
    if (points.end) out.push([points.end.lat, points.end.lon]);
    return out;
  }, [points]);

  return (
    <MapContainer
      center={[51.686, 5.317]}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution="&copy; OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* mode is not used yet inside MapView, but you might show it later (cursor/behavior) */}
      <ClickHandler onMapClick={onMapClick} />

      {points.start && <Marker position={[points.start.lat, points.start.lon]} />}
      {points.mids.map((m, idx) => (
        <Marker key={`${m.lat}-${m.lon}-${idx}`} position={[m.lat, m.lon]} />
      ))}
      {points.end && <Marker position={[points.end.lat, points.end.lon]} />}

      {line.length >= 2 && <Polyline positions={line} />}
    </MapContainer>
  );
}