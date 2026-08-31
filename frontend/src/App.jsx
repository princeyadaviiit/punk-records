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
        <Routes>
          <Route path="/" element={<Navigate to="/checkpoint/traffic" replace />} />
          <Route path="/checkpoint/traffic" element={<CheckpointTraffic />} />
          <Route path="/checkpoint/legal" element={<CheckpointLegal />} />
          <Route path="/vault" element={<Vault />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
