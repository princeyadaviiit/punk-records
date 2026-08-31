/**
 * SeededBanner — mandatory disclosure for seeded/preview Satellites.
 * Solid --carbon-slate bar with high-contrast type.
 */
export default function SeededBanner() {
  return (
    <div className="seeded-banner-bar" role="status" aria-live="polite">
      <div className="seeded-banner-bar__title">
        Administrative Notice: Seeded Preview
      </div>
      <div className="seeded-banner-bar__text">
        Seeded preview — live cross-Satellite sync is the next milestone. This view demonstrates the purpose-scoped access pattern on an enforcement Satellite; challan and court summons data are retrieved from demonstration seed records.
      </div>
    </div>
  )
}
