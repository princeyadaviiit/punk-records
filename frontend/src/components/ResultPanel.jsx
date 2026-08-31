import CleanState from './CleanState'
import FlaggedState from './FlaggedState'

/**
 * ResultPanel — dispatches to CleanState or FlaggedState based on the
 * typed API response.
 */
export default function ResultPanel({ data, loading, error }) {
  if (loading) {
    return (
      <div className="dossier-state-msg" role="status">
        Retrieving record and executing verification pipeline…
      </div>
    )
  }

  if (error) {
    return (
      <div className="dossier-error-msg" role="alert">
        Statutory query error: {error}
      </div>
    )
  }

  if (!data) return null

  if (!data.vehicle_match || data.dl_status === 'flagged' || data.dl_status === 'expired') {
    return <FlaggedState data={data} />
  }

  return <CleanState data={data} />
}
