import { MapContainer, TileLayer } from 'react-leaflet'

export default function MapView() {
  return (
    <MapContainer
      center={[51.686, 5.317]} // pick a default
      zoom={13}
      style={{ height: '100%', width: '100%' }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
    </MapContainer>
  )
}