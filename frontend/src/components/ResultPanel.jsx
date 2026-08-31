import CleanState from './CleanState'
import FlaggedState from './FlaggedState'

/**
 * ResultPanel — dispatches to CleanState or FlaggedState based on the
 * API response. Never passes the full response object through to a
 * generic renderer — always a typed component per result type.
 */
export default function ResultPanel({ data, loading, error }) {
  if (loading) {
    return (
      <div className="state-loading">
        <div className="spinner" />
        Verifying…
      </div>
    )
  }

  if (error) {
    return (
      <div className="state-error" role="alert">
        ⚠ {error}
      </div>
    )
  }

  if (!data) return null

  // Route to the appropriate card based on the traffic check result
  if (!data.vehicle_match || data.dl_status === 'flagged' || data.dl_status === 'expired') {
    return <FlaggedState data={data} />
  }

  return <CleanState data={data} />
}
