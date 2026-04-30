import { useMemo } from "react";
import {
  MapContainer,
  Marker,
  Polyline,
  TileLayer,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression } from "leaflet";
import type { EditMode, LatLon } from "../pages/RouteBuilderPage";

type PointsState = {
  start: LatLon | null;
  mids: LatLon[];
  end: LatLon | null;
};

type RouteGeometry = {
  type: "LineString";
  coordinates: [number, number][]; // [lon, lat]
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
  routeGeometry,
}: {
  mode: EditMode;
  points: PointsState;
  onMapClick: (p: LatLon) => void;
  routeGeometry?: RouteGeometry | null;
}) {
  // Temporary polyline (connects selected points)
  const draftLine: LatLngExpression[] = useMemo(() => {
    const out: LatLngExpression[] = [];
    if (points.start) out.push([points.start.lat, points.start.lon]);
    for (const m of points.mids) out.push([m.lat, m.lon]);
    if (points.end) out.push([points.end.lat, points.end.lon]);
    return out;
  }, [points]);

  // Real computed route polyline (from geometry)
  const routeLine: LatLngExpression[] = useMemo(() => {
    const coords = routeGeometry?.coordinates ?? [];
    // GeoJSON coordinates are [lon, lat] -> Leaflet expects [lat, lon]
    return coords.map(([lon, lat]) => [lat, lon] as LatLngExpression);
  }, [routeGeometry]);

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

      {/* mode not used yet inside MapView */}
      <ClickHandler onMapClick={onMapClick} />

      {points.start && <Marker position={[points.start.lat, points.start.lon]} />}
      {points.mids.map((m, idx) => (
        <Marker key={`${m.lat}-${m.lon}-${idx}`} position={[m.lat, m.lon]} />
      ))}
      {points.end && <Marker position={[points.end.lat, points.end.lon]} />}

      {/* Computed route line (preferred) */}
      {routeLine.length >= 2 && (
        <Polyline
          positions={routeLine}
          pathOptions={{ color: "#1d4ed8", weight: 5, opacity: 0.9 }}
        />
      )}

      {/* Draft line connecting points (fallback / helpful while editing) */}
      {draftLine.length >= 2 && (
        <Polyline
          positions={draftLine}
          pathOptions={{ color: "#111", weight: 2, opacity: 0.35, dashArray: "6 8" }}
        />
      )}
    </MapContainer>
  );
}