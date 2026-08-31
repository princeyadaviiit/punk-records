/**
 * CivicLiteracyBridge — Static Legal Aid & Rights Docket (Pillar 3 Preview).
 *
 * Grounded in "The Government File" design language.
 * Displays curated, cited statutory provisions under the Motor Vehicles Act, 1988
 * and Central Motor Vehicles Rules, 1989 to demonstrate how information asymmetry
 * is structurally dismantled for citizens at enforcement checkpoints.
 */
export default function CivicLiteracyBridge() {
  return (
    <div>
      {/* Gazette-style departmental header */}
      <div className="dossier-heading">
        <div className="dossier-heading__topline">
          <span className="dossier-heading__dept">
            Legal Aid & Civic Literacy Division
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--ink-muted)' }}>
            DOCKET PR-CLB-4
          </span>
        </div>
        <h1 className="dossier-heading__title">
          Civic Literacy Bridge — Statutory Rights Record
        </h1>
        <p className="dossier-heading__scope">
          Statutory provisions governing citizen rights, digital document validity, and enforcement procedure at checkpoints.
        </p>
      </div>

      {/* Mandatory Roadmap Preview Banner */}
      <div className="seeded-banner-bar" style={{ borderLeftColor: 'var(--tape-red)' }}>
        <div className="seeded-banner-bar__title">
          Pillar 3 Preview: Civic Literacy Integration
        </div>
        <div className="seeded-banner-bar__text">
          Static statutory preview (MVP Phase A). Full context-aware legal assistance triggered directly from verification flags is the Phase B milestone. Below are the governing statutory rules protecting citizens against arbitrary enforcement.
        </div>
      </div>

      {/* Statutory Provisions Docket */}
      <div className="bridge-section">
        {/* Provision 1: DigiLocker & Digital Documents */}
        <div className="bridge-provision-card">
          <div className="bridge-provision-card__section-tag">
            Statutory Provision · Rule 139, CMVR (1989)
          </div>
          <h2 className="bridge-provision-card__title">
            Electronic Production of Driving Licences & Registration Certificates
          </h2>
          <p className="bridge-provision-card__text">
            Documents presented in digital format through the DigiLocker or mParivahan government platforms are legally recognized at par with physical originals. Enforcement officers cannot demand physical certificates or issue challans solely for presenting valid digital credentials.
          </p>
          <div className="bridge-provision-card__citation">
            Ministry of Road Transport and Highways (MoRTH) Notification No. RT-11036/64/2017-MVL; Section 4, Information Technology Act, 2000.
          </div>
        </div>

        {/* Provision 2: Licence Impounding & Seizure Limitations */}
        <div className="bridge-provision-card">
          <div className="bridge-provision-card__section-tag">
            Statutory Procedure · Section 206(4), Motor Vehicles Act
          </div>
          <h2 className="bridge-provision-card__title">
            Mandatory Seizure Receipt & Disqualification Boundaries
          </h2>
          <p className="bridge-provision-card__text">
            An officer may seize a physical driving licence only for specified offences (e.g. driving under influence, dangerous driving, or jumping red signals). When a document is seized, the officer is mandated by law to provide an immediate temporary acknowledgment receipt. An officer cannot arbitrarily retain documents without issuing a formal receipt.
          </p>
          <div className="bridge-provision-card__citation">
            Section 206(4) as amended by Motor Vehicles (Amendment) Act, 2019; Standard Operating Procedure for Electronic Enforcement.
          </div>
        </div>

        {/* Provision 3: 15-Day Production Grace Window */}
        <div className="bridge-provision-card">
          <div className="bridge-provision-card__section-tag">
            Statutory Grace · Rule 139 Proviso, CMVR
          </div>
          <h2 className="bridge-provision-card__title">
            15-Day Production Grace Period for Uncarried Documents
          </h2>
          <p className="bridge-provision-card__text">
            If a citizen does not have their insurance or pollution certificate (PUC) immediately accessible at the time of a road check, they are entitled to produce the certificates before the designated authority or police station within 15 days, in lieu of an immediate fine.
          </p>
          <div className="bridge-provision-card__citation">
            Proviso to Rule 139, Central Motor Vehicles Rules, 1989; MoRTH advisory on on-the-spot document verification.
          </div>
        </div>
      </div>

      {/* Statutory Footer */}
      <div className="statutory-footer">
        <div className="statutory-footer__title">Dismantling Information Asymmetry (Pillar 3)</div>
        Punk Records is designed to reduce the informational asymmetry that enables informal payments during checkpoint stops. By coupling purpose-scoped Satellite views (Pillar 1) with citizen transparency (Pillar 2) and cited statutory literacy (Pillar 3), the product enforces clear institutional boundaries on both sides of the interaction.
      </div>
    </div>
  )
}
