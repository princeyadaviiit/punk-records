import { useState, useEffect } from 'react'
import CitizenSelect from '../components/CitizenSelect'
import ResultPanel from '../components/ResultPanel'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function CheckpointTraffic() {
  const [citizens, setCitizens] = useState([])
  const [citizenId, setCitizenId] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [citizensLoading, setCitizensLoading] = useState(true)

  // Load citizen list on mount
  useEffect(() => {
    fetch(`${API}/api/citizens`)
      .then(r => r.json())
      .then(data => { setCitizens(data); setCitizensLoading(false) })
      .catch(() => { setCitizensLoading(false) })
  }, [])

  // Fetch traffic check when citizen selection changes
  useEffect(() => {
    if (!citizenId) { setResult(null); setError(null); return }

    setLoading(true)
    setError(null)
    setResult(null)

    fetch(`${API}/api/checkpoint/traffic/${citizenId}`)
      .then(r => {
        if (!r.ok) return r.json().then(e => Promise.reject(e.detail || 'Request failed'))
        return r.json()
      })
      .then(data => { setResult(data); setLoading(false) })
      .catch(err => { setError(String(err)); setLoading(false) })
  }, [citizenId])

  return (
    <div className="page-content">
      {/* Satellite header communicates scope as a feature, not a limitation */}
      <div className="satellite-header">
        <h1 className="satellite-header__title">
          🚦 Traffic Satellite — Checkpoint View
        </h1>
        <span className="satellite-header__scope">
          Scope: DL validity · Vehicle registration match · Nothing else
        </span>
      </div>

      <CitizenSelect
        citizens={citizens}
        value={citizenId}
        onChange={setCitizenId}
        loading={citizensLoading}
      />

      <ResultPanel data={result} loading={loading} error={error} />

      {/* Scope disclosure — always visible per rules.md #6 */}
      <div className="scope-disclosure">
        <div className="scope-disclosure__title">Access scope — Traffic Satellite</div>
        This view is structurally limited to DL status and vehicle registration name match.
        The API response type (<code>TrafficCheckResponse</code>) is incapable of containing
        KYC, challan, Aadhaar, or other Satellite fields — verifiable by inspecting
        the <a href={`${API}/docs#/Traffic%20Satellite`} target="_blank" rel="noreferrer"
        style={{ color: 'var(--accent-400)' }}>OpenAPI schema</a>.
        · Officer role assumed active (no auth theater for MVP).
      </div>
    </div>
  )
}
