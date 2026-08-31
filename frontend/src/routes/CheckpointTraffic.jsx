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

  useEffect(() => {
    fetch(`${API}/api/citizens`)
      .then(r => r.json())
      .then(data => { setCitizens(data); setCitizensLoading(false) })
      .catch(() => { setCitizensLoading(false) })
  }, [])

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
    <div>
      {/* Gazette-style departmental header */}
      <div className="dossier-heading">
        <div className="dossier-heading__topline">
          <span className="dossier-heading__dept">
            Transport Department — Field Checkpoint Enforcement
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
            FORM PR-TR-1
          </span>
        </div>
        <h1 className="dossier-heading__title">
          Traffic Satellite Verification Record
        </h1>
        <p className="dossier-heading__scope">
          Statutory Access Scope: Driving licence validity and vehicle registration match only.
        </p>
      </div>

      <CitizenSelect
        citizens={citizens}
        value={citizenId}
        onChange={setCitizenId}
        loading={citizensLoading}
      />

      <ResultPanel data={result} loading={loading} error={error} />

      {/* Statutory Footer */}
      <div className="statutory-footer">
        <div className="statutory-footer__title">Access Scope & Privacy Boundary</div>
        This checkpoint surface is structurally limited to driving licence status and registered vehicle matching. The underlying API response model (<code>TrafficCheckResponse</code>) is structurally incapable of returning tax, Aadhaar, legal, or court records — verifiable via the{' '}
        <a href={`${API}/docs#/Traffic%20Satellite`} target="_blank" rel="noreferrer">
          OpenAPI Specification
        </a>. Officer credentials assumed active for field inspection.
      </div>
    </div>
  )
}
