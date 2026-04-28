import MapView from "../components/MapView";

export default function RouteBuilderPage() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, position: 'relative' }}>
        <MapView />

        <div style={{ height: '100%', background: '#ddd' }}>
          Map goes here
        </div>
      </div>

      <aside style={{ width: 520, borderLeft: '1px solid #ccc', overflow: 'auto' }}>
        Instructions panel goes here
      </aside>
    </div>
  )
}