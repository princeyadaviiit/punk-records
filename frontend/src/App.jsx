import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import CheckpointTraffic from './routes/CheckpointTraffic'
import CheckpointLegal from './routes/CheckpointLegal'
import Vault from './routes/Vault'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <Navbar />
        <main className="dossier-sheet">
          {/* Punch-hole margin evoking a physical ring-binder ledger */}
          <div className="punch-hole-margin" aria-hidden="true">
            <div className="punch-hole" />
            <div className="punch-hole" />
            <div className="punch-hole" />
          </div>

          {/* Dossier Document Content */}
          <div className="dossier-content">
            <Routes>
              <Route path="/" element={<Navigate to="/checkpoint/traffic" replace />} />
              <Route path="/checkpoint/traffic" element={<CheckpointTraffic />} />
              <Route path="/checkpoint/legal" element={<CheckpointLegal />} />
              <Route path="/vault" element={<Vault />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  )
}
