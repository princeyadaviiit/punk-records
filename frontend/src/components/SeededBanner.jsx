/**
 * SeededBanner — visible, mandatory disclosure for seeded/preview Satellites.
 *
 * Per design.md §3: this should be impossible to miss even on a quick glance.
 * Per rules.md #6: every fake/stub must be disclosed in-app, never hidden.
 * Language from rules.md: "seeded preview — live cross-Satellite sync is the next milestone."
 */
export default function SeededBanner() {
  return (
    <div className="seeded-banner" role="status" aria-live="polite">
      <span className="seeded-banner__icon">🔬</span>
      <span>
        <strong>Seeded preview</strong> — live cross-Satellite sync is the next milestone.
        This view demonstrates the same access pattern on a different Satellite;
        challan / summons data is from seed data, not a live government registry.
      </span>
    </div>
  )
}
