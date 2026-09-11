## Session 4: Scan Simulation + Satellite UI Rebuild

**Goal:** Rebuild Traffic and Banking checkpoint views in dark terminal aesthetic with scan simulation.

### Tasks

#### 1. Component Development
- [x] Create ScanButton.jsx with animation
- [x] Create SatelliteCard.jsx for section cards
- [x] Create LockedCard.jsx for scope-limited fields
- [x] Create StatusBadge.jsx (reusable VERIFIED/MATCHED/FLAGGED)
- [x] Create RoleBanner.jsx for officer role display
- [x] Update SeededBanner.jsx for flexible usage

#### 2. Checkpoint Traffic Rebuild
- [x] Replace old dossier-style UI with dark terminal
- [x] Add scan simulation interaction
- [x] Implement satellite cards (Driver Verification, Vehicle Match)
- [x] Add locked card showing inaccessible data
- [x] Connect to backend checkpoint endpoint
- [x] Add "Zero Overreach" footer
- [x] Display verification flags/mismatches

#### 3. Checkpoint Banking Rebuild
- [x] Build in dark terminal style (matching Traffic)
- [x] Add scan simulation
- [x] Implement KYC cards (Identity Link, Address Proof)
- [x] Add locked card for Traffic/Legal data
- [x] Include seeded banner disclosure
- [x] Add "Zero Overreach" footer

#### 4. CSS Styling
- [x] Add dark terminal component styles (~300 lines)
- [x] Scan button with animation (pulse + scanSweep)
- [x] Satellite card styles (grid, headers, fields)
- [x] Status badge variants (verified/matched/flagged)
- [x] Locked card with blur effect
- [x] Role banner styling
- [x] Zero Overreach footer

#### 5. Testing & Verification
- [x] Test production build (406ms, no errors)
- [x] Verify scan animation works
- [x] Check dark theme renders correctly
- [x] Verify checkpoint endpoints called correctly

**STATUS: ✅ COMPLETED**

### What Was Built

**Scan Simulation:**
- ScanButton component with camera frame icon
- 1.2-second scanning animation (pulse + line sweep)
- Disclosure label: "Scan (simulated) — replaces live document capture"
- Consistent with OCR-stub disclosure pattern
- Resolves to precomputed scoped data from backend

**Dark Terminal Aesthetic:**
- Navy/charcoal backgrounds matching reference screenshots
- Blue role banner showing officer identity
- Section cards with green VERIFIED badges
- Locked/blurred card showing scope limits
- "Zero Overreach: Only scoped data is decrypted" footer
- Monospace typography for technical data

**Traffic Checkpoint:**
- Scan → random citizen from seeded pool
- Driver Verification card (license number, validity, status)
- Vehicle Match card (registration, owner link)
- Locked card: "Financial & Legal Data" (PAN, Aadhaar, court records)
- Mismatch docket expands if verification flags present
- Connected to GET /api/checkpoint/traffic/{citizen_id}

**Banking Checkpoint:**
- Scan → random citizen from seeded pool (simulated KYC)
- Identity Link card (Aadhaar, PAN)
- Address Proof card (verified via utility bill)
- Locked card: "Traffic & Legal Records"
- Seeded banner disclosure (matches existing pattern)
- Zero Overreach footer

**Component Architecture:**
```
ScanButton → triggers scan animation
  ↓
SatelliteCard → displays scoped data sections
StatusBadge → VERIFIED/MATCHED/FLAGGED state
LockedCard → shows inaccessible scope-locked data
RoleBanner → officer role identification
```

### Files Created (6 new components)
- `frontend/src/components/ScanButton.jsx`
- `frontend/src/components/SatelliteCard.jsx`
- `frontend/src/components/LockedCard.jsx`
- `frontend/src/components/StatusBadge.jsx`
- `frontend/src/components/RoleBanner.jsx`
- `frontend/src/routes/CheckpointBanking.jsx` (new file, replaced old)

### Files Modified
- `frontend/src/routes/CheckpointTraffic.jsx` (complete rebuild)
- `frontend/src/components/SeededBanner.jsx` (made flexible with props)
- `frontend/src/index.css` (~300 lines of checkpoint/terminal styles)

### Design Decisions

1. **Scan Interaction:**
   - Picks random citizen from seeded pool (4 citizens for Traffic, 2 for Banking)
   - Simulates real scanning workflow without image capture complexity
   - Animation duration: 1.2s (feels realistic without being tedious)

2. **Component Reusability:**
   - SatelliteCard works for any section (Driver, Vehicle, KYC, etc.)
   - StatusBadge has variants (verified/matched/flagged/clean/warning)
   - LockedCard configurable with title + hint text

3. **Dark Terminal Colors:**
   - Uses [data-theme="dark"] tokens from Session 2
   - Blue role banner (#1E40AF) stands out from navy background
   - Green badges (#10B981) for verified states
   - Amber badges (#F59E0B) for flagged states

4. **Locked Card Visual:**
   - Dashed border indicates "not accessible"
   - Blurred placeholder lines behind lock icon
   - Clear messaging: "This Satellite cannot decrypt X, Y, Z"
   - Demonstrates structural access control at UI level

5. **API Integration:**
   - Traffic uses real backend endpoint (GET /api/checkpoint/traffic/{id})
   - Banking uses mock data (simulated for MVP per TRD.md)
   - Both will send JWT tokens in Authorization header (Session 6)

6. **"Zero Overreach" Footer:**
   - Lock icon + clear message about scoped decryption
   - Matches reference screenshot footer line
   - Reinforces the core architectural claim

### Reference Screenshot Alignment

✓ **Dark Terminal Background** - Navy/charcoal matching reference
✓ **Role Banner** - Blue banner with "Role: Traffic Officer"
✓ **Section Cards** - Driver Verification, Vehicle Match cards
✓ **Green VERIFIED Badges** - Emerald badges on cards
✓ **Locked Card** - Visibly locked third card with blur
✓ **Footer Line** - "Zero Overreach" message at bottom

### Technical Notes

**Scan Animation:**
- CSS keyframes: `pulse` (opacity) + `scanSweep` (translateY)
- SVG scan line animates vertically through frame
- Respects `prefers-reduced-motion: reduce`

**Random Citizen Selection:**
```javascript
const randomCitizen = SEEDED_CITIZENS[Math.floor(Math.random() * SEEDED_CITIZENS.length)]
```
- Deterministic citizen pool (same 4 citizens as backend seed)
- Each scan picks randomly for variety
- In production, would be replaced by real document scan → OCR → lookup

**Component Props Pattern:**
```javascript
<SatelliteCard
  title="Driver Verification"
  icon="🪪"
  status="verified"
  statusLabel="VERIFIED"
  fields={[...]}
/>
```
- Declarative, easy to add new sections
- Icon prop for visual identification
- Fields array for key-value pairs

### Outstanding Items

- Protected routes (auth guards) - Session 6
- Token in Authorization headers - Session 6
- Live Banking endpoint (currently mock) - Phase B per rules.md
- Actual OCR integration - Phase B per rules.md

### Next Session Preview

**Session 5: Vault Rebuild**
- Rebuild Vault in light card grid style (matching reference)
- DocumentCard component with status badges
- Surface cross-verification flags for mismatch citizen
- Add disabled BridgeAssistant module
- Strictly read-only (no upload/sync affordances)
- Connect to GET /api/vault/{citizen_id} endpoint
- Use light theme as default for Vault

---
