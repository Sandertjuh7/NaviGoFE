import { Link, Route, Routes } from 'react-router-dom'
import RouteBuilderPage from './pages/RouteBuilderPage'
import InstructionsPage from './pages/InstructionsPage'
import ExportPage from './pages/ExportPage'

export default function App() {
  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <Link to="/">Route Builder</Link>
        <Link to="/instructions">Instructions</Link>
        <Link to="/export">Export</Link>
      </header>

      <Routes>
        <Route path="/" element={<RouteBuilderPage />} />
        <Route path="/instructions" element={<InstructionsPage />} />
        <Route path="/export" element={<ExportPage />} />
      </Routes>
    </div>
  )
}