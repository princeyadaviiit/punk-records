/**
 * CitizenSelect — dropdown selector replacing live OCR scan for the MVP demo.
 *
 * Disclosure: explicitly labeled as "demo mode — replaces DL scan"
 * per design.md §2 and rules.md #6.
 */
export default function CitizenSelect({ citizens, value, onChange, loading }) {
  return (
    <div className="citizen-select">
      <label htmlFor="citizen-selector">Select citizen (demo)</label>
      <select
        id="citizen-selector"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={loading}
      >
        <option value="">— Choose a citizen —</option>
        {citizens.map(c => (
          <option key={c.id} value={c.id}>
            {c.name} · DOB {c.dob}
          </option>
        ))}
      </select>
      <p className="ocr-disclaimer">
        📷 Demo mode — citizen select replaces DL document scan (OCR disabled for demo stability; see <code>ocr/ocr_stub.py</code>)
      </p>
    </div>
  )
}
