import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import RolePicker from './routes/RolePicker'
import LoginCitizen from './routes/LoginCitizen'
import LoginOfficer from './routes/LoginOfficer'
import Navbar from './components/Navbar'
import CheckpointTraffic from './routes/CheckpointTraffic'
import CheckpointBanking from './routes/CheckpointBanking'
import Vault from './routes/Vault'
import CivicLiteracyBridge from './components/CivicLiteracyBridge'
import './index.css'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing - Role Picker */}
            <Route path="/" element={<RolePicker />} />

            {/* Auth Routes */}
            <Route path="/login/citizen" element={<LoginCitizen />} />
            <Route path="/login/officer/:role" element={<LoginOfficer />} />

            {/* Main App Routes (will require auth in future) */}
            <Route path="/checkpoint/traffic" element={
              <AppShell>
                <CheckpointTraffic />
              </AppShell>
            } />
            <Route path="/checkpoint/banking" element={
              <AppShell>
                <CheckpointBanking />
              </AppShell>
            } />
            <Route path="/vault" element={
              <AppShell>
                <Vault />
              </AppShell>
            } />
            <Route path="/civic-literacy" element={
              <AppShell>
                <CivicLiteracyBridge />
              </AppShell>
            } />

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

// App Shell wrapper for authenticated routes
function AppShell({ children }) {
  return (
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
          {children}
        </div>
      </main>
    </div>
  )
}
