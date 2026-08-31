/**
 * CleanState — renders when dl_status is 'valid' and vehicle_match is true.
 * Visual treatment: rubber ink stamp in --stamp-green on ruled paper.
 */
export default function CleanState({ data }) {
  return (
    <div className="stamp-container" role="region" aria-label="Verification outcome: Verified Clear">
      {/* Rubber Stamp Mark */}
      <div className="rubber-stamp rubber-stamp--clean">
        <div className="rubber-stamp__title">VERIFIED · CLEAR</div>
        <div className="rubber-stamp__sub">RECORD MATCH CONFIRMED</div>
      </div>

      {/* Ledger details on ruled paper */}
      <table className="ledger-table">
        <tbody>
          <tr>
            <th>Subject Name</th>
            <td>{data.citizen_name}</td>
          </tr>
          <tr>
            <th>Subject Identifier</th>
            <td className="mono-field">{data.citizen_id}</td>
          </tr>
          <tr>
            <th>Driving Licence Status</th>
            <td>{data.dl_status.toUpperCase()}</td>
          </tr>
          <tr>
            <th>Vehicle Registration Match</th>
            <td>CONFIRMED</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}
