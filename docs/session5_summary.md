
## Session 5: Vault Rebuild (Light Card Grid)

**Goal:** Rebuild Citizen Vault in light card grid aesthetic, matching reference screenshots.

### Tasks

#### 1. Component Development
- [x] Create DocumentCard.jsx with status dots
- [x] Create BridgeAssistant.jsx (disabled, "Coming Soon")
- [x] Reuse StatusBadge.jsx from Session 4
- [x] Integrate with AuthContext for user authentication

#### 2. Vault UI Rebuild
- [x] Replace old dossier-style UI with light card grid
- [x] Add vault header with title and subtitle
- [x] Add user profile circle with initial
- [x] Build document grid layout (responsive cards)
- [x] Display verification flags section (for citizens with mismatches)
- [x] Add Bridge Assistant module (disabled preview)
- [x] Add "One Graph, Two Directions" footer disclosure

#### 3. Document Card Design
- [x] Icon + status dot indicator system
- [x] Document icon mapping (🪪 Aadhaar, 🚗 DL, 🚙 RC, 💳 PAN, etc.)
- [x] Status configuration (valid→verified, expired→warning, flagged→flagged)
- [x] Department/issuing authority display
- [x] Hover effects with subtle shadow lift

#### 4. API Integration
- [x] Connect to GET /api/vault/{citizen_id}
- [x] Auto-load vault data on user authentication
- [x] Handle loading, error, and empty states
- [x] Display verification flags from cross_verification_results

#### 5. CSS Styling
- [x] Light theme tokens (warm neutrals, soft accents)
- [x] Vault container layout (centered, max-width constrained)
- [x] Document card grid (responsive, 3-column desktop → 1-column mobile)
- [x] Profile circle with gradient background
- [x] Verification flag cards (amber accent, explanation text)
- [x] Bridge Assistant disabled input styling
- [x] Footer badge with icon

#### 6. Authentication Guards
- [x] Require user login to access Vault
- [x] Show "Authentication Required" empty state for logged-out users
- [x] Use AuthContext.user for citizen identification
- [x] Display personalized data (name, DOB, documents)

**STATUS: ✅ COMPLETED**

### What Was Built

**Light Card Grid Design:**
- Warm neutral color palette (soft beige/cream backgrounds)
- Rounded cards with subtle shadows
- 3-column responsive grid (collapses to 1-column on mobile)
- Clean, modern aesthetic contrasting with dark terminal checkpoint views
- Smooth hover effects with shadow lift

**User Profile:**
- Circular avatar with first initial
- Gradient background (blue-to-purple)
- Name and date of birth display
- Centered layout above document grid

**Document Cards:**
- Icon + label + department/issuing authority
- Status dot indicator (green/amber/red) in top-right corner
- Small StatusBadge (Verified/Expired/Flagged)
- Hover effect: translateY(-2px) + shadow increase
- Semantic color coding matching checkpoint views

**Verification Flags Section:**
- Only appears for citizens with cross-verification mismatches
- Amber "⚠️ VERIFICATION NOTES" heading
- Flag cards showing match_field (e.g., "NAME Discrepancy")
- Explanation text from backend verification pipeline
- Transparency hint: "Officers see the same information in their checkpoint view"

**Bridge Assistant Module:**
- Disabled input with placeholder: "Ask: 'What do I need to show at a checkpoint?'"
- "Coming Soon" badge in header
- Hint text explaining future functionality
- Matches reference screenshot prompt-style design
- Clear disclosure that feature is not live in MVP

**One Graph, Two Directions Footer:**
- 🔄 icon + "One Graph, Two Directions" badge
- Explanation of Pillar 2: citizens see same verification graph as officers
- Transparency messaging about flag visibility
- Reinforces core architectural claim

**Authentication Flow:**
- Vault requires user to be logged in as citizen
- Empty state for logged-out users (🔒 icon + message)
- Auto-loads vault data when user authenticates
- Uses citizen_id from JWT token to fetch documents
- Loading spinner during API call
- Error state with retry guidance

### Files Created (2 new components)
- `frontend/src/components/DocumentCard.jsx`
- `frontend/src/components/BridgeAssistant.jsx`

### Files Modified
- `frontend/src/routes/Vault.jsx` (complete rebuild)
- `frontend/src/index.css` (~350 lines of Vault/document card styles)

### Design Decisions

1. **Light vs Dark Theme:**
   - Vault uses light theme as default (citizen-facing, less intimidating)
   - Checkpoints use dark terminal theme (officer-facing, technical)
   - ThemeToggle still allows manual override
   - Clear UX distinction between enforcement and citizen contexts

2. **Status Dot System:**
   - Small colored dot in top-right corner of document icon
   - Green = valid/verified, Amber = flagged, Red = expired
   - Complements StatusBadge text label
   - Quick visual scanning of document health

3. **Document Icon Mapping:**
   - Aadhaar 🪪, DL 🚗, RC 🚙, PAN 💳
   - Challan 📋, Summons ⚖️, KYC 🏦
   - Fallback 📄 for unknown types
   - Consistent with checkpoint satellite icons

4. **Verification Flags Transparency:**
   - Flags appear in Vault if present in backend cross_verification_results
   - Same data officers see at checkpoints
   - Demonstrates "One Graph, Two Directions" Pillar 2
   - Critical for trust: citizens discover discrepancies before enforcement does

5. **Bridge Assistant Disclosure:**
   - Clearly marked "Coming Soon" (no live LLM in MVP)
   - Input disabled with aria-label for accessibility
   - Placeholder shows example query for future functionality
   - Matches OCR-stub and seeded-data disclosure pattern

6. **Read-Only Constraint:**
   - No upload buttons or sync affordances (per rules.md MVP scope)
   - No reorder/delete/edit document actions
   - Strictly a read-only registry viewer
   - Upload/sync/re-verification are Phase B features

7. **Responsive Grid:**
   - Desktop: 3 columns (minmax(280px, 1fr))
   - Tablet: 2 columns (auto-collapses)
   - Mobile: 1 column stacked
   - Cards maintain aspect ratio and readability at all breakpoints

8. **Empty/Error States:**
   - Authentication Required: 🔒 icon + login prompt
   - Loading: ⏳ spinner + "Loading your Vault..."
   - Error: ⚠️ icon + error message display
   - Graceful degradation for API failures

### Reference Screenshot Alignment

✓ **Light Card Grid** - Warm neutral backgrounds, rounded cards
✓ **User Profile Circle** - Gradient circle with initial at top
✓ **Document Cards** - Icon + label + status in grid layout
✓ **Status Indicators** - Colored dots + badges for document health
✓ **Verification Flags** - Amber warning cards for mismatches
✓ **Bridge Assistant** - Disabled input with "Coming Soon" badge
✓ **Footer Disclosure** - "One Graph, Two Directions" message

### Technical Notes

**API Integration:**
```javascript
fetch(`${API_BASE_URL}/api/vault/${user.user_id}`)
  .then(r => r.json())
  .then(data => setVaultData(data))
```
- Uses citizen_id from AuthContext.user.user_id
- Auto-loads on component mount when authenticated
- No manual "Load" button needed (seamless UX)

**Document Card Props Pattern:**
```javascript
<DocumentCard 
  document={{
    doc_type: 'AADHAAR',
    display_label: 'Aadhaar Card',
    department: 'UIDAI',
    status: 'valid' // → 'verified' badge
  }}
/>
```
- Declarative, easy to extend with new document types
- Status mapping centralized in DocumentCard component
- Icon/label fallbacks for unknown types

**Verification Flags Display:**
```javascript
{vaultData.verification_flags.map((flag, idx) => (
  <div className="verification-flag-card">
    <h4>{flag.match_field.toUpperCase()} Discrepancy</h4>
    <p>{flag.explanation}</p>
  </div>
))}
```
- Only renders section if flags array has items
- Uses same backend verification_flags format as checkpoint views
- Demonstrates data parity between citizen and officer views

**CSS Grid Responsiveness:**
```css
.document-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}
```
- Auto-responsive without media queries
- Cards flow naturally to available space
- Maintains 280px minimum card width

### Outstanding Items

- Protected routes (auth guards on officer checkpoints) - Session 6
- JWT token in Authorization headers for API calls - Session 6
- Responsive polish (test all breakpoints) - Session 6
- End-to-end testing of full auth → checkpoint → vault flow - Session 6
- Live Banking checkpoint backend endpoint - Phase B per rules.md
- Bridge Assistant LLM integration - Phase B per rules.md
- Document upload/sync/re-verification - Phase B per rules.md

### Next Session Preview

**Session 6: Final Polish + E2E Testing**
- Add protected route guards (redirect to RolePicker if not authenticated)
- Add Authorization: Bearer {token} headers to checkpoint API calls
- Test complete auth flow: login → checkpoint scan → vault view
- Responsive testing at mobile/tablet/desktop breakpoints
- Verify Ramesh Kumar mismatch appears correctly in both checkpoint and vault
- Test theme toggle works across all views
- Verify seeded banners and stub disclosures visible
- Build production bundle and measure bundle size
- Final visual QA against reference screenshots

---
