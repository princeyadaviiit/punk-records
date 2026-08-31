/**
 * CitizenSelect — form dropdown replacing camera OCR document scan.
 * Grounded in government docket forms.
 */
export default function CitizenSelect({ citizens, value, onChange, loading }) {
  return (
    <div className="citizen-select-box">
      <label htmlFor="citizen-selector" className="ledger-label">
        Citizen record selection (Demonstration Mode)
      </label>
      <select
        id="citizen-selector"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={loading}
      >
        <option value="">Select citizen record for verification</option>
        {citizens.map(c => (
          <option key={c.id} value={c.id}>
            {c.name} — DOB: {c.dob}
          </option>
        ))}
      </select>
      <p className="disclaimer-note">
        Record selection replaces optical character recognition document scanning (live OCR pipeline intentionally disabled for demo stability; see <code>ocr/ocr_stub.py</code>).
      </p>
    </div>
  )
}
