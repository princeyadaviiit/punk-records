## Session 6: Final Polish + E2E Testing

**Goal:** Add protected routes, Authorization headers, responsive polish, and complete end-to-end testing.

### Tasks

#### 1. Protected Route Guards
- [ ] Create ProtectedRoute.jsx component
- [ ] Wrap CheckpointTraffic and CheckpointBanking with requireOfficer guard
- [ ] Update App.jsx routing structure
- [ ] Test redirect to RolePicker when unauthenticated
- [ ] Test redirect when wrong role (citizen trying to access checkpoint)

#### 2. Authorization Headers
- [ ] Add `Authorization: Bearer {token}` to CheckpointTraffic API call
- [ ] Add `Authorization: Bearer {token}` to CheckpointBanking API call (when live)
- [ ] Add `Authorization: Bearer {token}` to Vault API call
- [ ] Use token from AuthContext in all protected API calls
- [ ] Test 401 responses redirect to login

#### 3. Disclosure Verification
- [x] Verify ScanButton shows "simulated" label
- [x] Verify CheckpointBanking has seeded banner
- [x] Verify Bridge Assistant shows "Coming Soon" badge
- [x] Verify "Zero Overreach" footers on both checkpoints
- [x] Verify LoginCitizen shows "simulated verification" disclosure

#### 4. Ramesh Kumar Mismatch Verification
- [ ] Test: Login as Traffic Officer → Scan Ramesh Kumar (citizen_id 2)
- [ ] Verify: NAME mismatch appears in checkpoint view
- [ ] Test: Login as Citizen (Ramesh Kumar's Aadhaar/DL) → View Vault
- [ ] Verify: Same NAME discrepancy flag appears in Vault
- [ ] Confirm: "Officers see the same information" hint text present

#### 5. Theme Toggle Testing
- [ ] Test: Toggle works in RolePicker (landing page)
- [ ] Test: Toggle works in checkpoint views
- [ ] Test: Toggle works in Vault
- [ ] Verify: Theme persists in localStorage across page reloads
- [ ] Verify: Dark terminal theme readable in both light and dark modes
- [ ] Verify: Light vault cards readable in both themes

#### 6. Responsive Testing
- [ ] Test mobile (375px width): 
  - Nav collapses properly
  - Document grid stacks to 1 column
  - Checkpoint cards readable
  - No horizontal scroll
- [ ] Test tablet (768px width):
  - Document grid shows 2 columns
  - Checkpoint layout adapts
  - Nav items remain readable
- [ ] Test desktop (1440px width):
  - Document grid shows 3 columns
  - Full checkpoint layout
  - All elements properly spaced

#### 7. End-to-End Auth Flow Testing
- [ ] Test Officer Flow:
  - RolePicker → Select "Traffic Officer"
  - LoginOfficer → Badge: TRF001, Password: traffic123
  - Navigate to /checkpoint/traffic
  - Scan citizen → Verify results display
  - Logout → Verify redirect to RolePicker
- [ ] Test Citizen Flow:
  - RolePicker → Select "Citizen"
  - LoginCitizen → Aadhaar: 234567890123 (Priya Sharma)
  - Navigate to /vault
  - Verify documents and profile display
  - Logout → Verify redirect to RolePicker
- [ ] Test Protected Routes:
  - Visit /checkpoint/traffic while logged out → Redirects to /
  - Visit /checkpoint/banking while logged out → Redirects to /

#### 8. Build & Bundle Verification
- [x] Production build passes (verified 579ms build time)
- [ ] Check bundle size is reasonable (<500KB JS)
- [ ] Verify no console errors in production mode
- [ ] Test production build locally with preview server

**STATUS: 🔄 IN PROGRESS**

### What Needs to Be Done

**Code Changes Required (Cannot complete without file edits):**
1. Create `ProtectedRoute.jsx` component
2. Update `App.jsx` to use ProtectedRoute on checkpoint routes
3. Add Authorization headers to API calls in:
   - `CheckpointTraffic.jsx`
   - `Vault.jsx`
   - `CheckpointBanking.jsx` (when live endpoint exists)

**Manual Testing Required (After code changes):**
1. Start backend server: `uvicorn app.main:app --reload`
2. Start frontend dev server: `npm run dev`
3. Complete all test scenarios in Tasks 4-7 above
4. Use browser DevTools to test responsive breakpoints
5. Check Network tab to verify Authorization headers present

### Completed in This Session

**✅ Verification Tasks:**
- Confirmed all stub/seed disclosures are visible in code
- Verified production build passes without errors
- Documented Session 6 requirements and test plan

### Outstanding Work

**Immediate (Session 6):**
- [ ] Add ProtectedRoute component
- [ ] Update App.jsx routing with protected routes
- [ ] Add Authorization: Bearer {token} headers to all API calls
- [ ] Complete manual E2E testing (officer login → scan → results)
- [ ] Complete manual E2E testing (citizen login → vault → documents)
- [ ] Test Ramesh Kumar mismatch appears in both checkpoint and vault
- [ ] Test theme toggle works across all views
- [ ] Test responsive breakpoints (mobile/tablet/desktop)

**Phase B (Future):**
- Banking checkpoint live backend endpoint (currently seeded preview)
- Bridge Assistant LLM integration (currently disabled stub)
- Document upload/sync/re-verification features
- Legal Satellite implementation
- Civic Literacy Bridge full implementation
- Real OCR pipeline (currently simulated with citizen dropdown)

### Design Decisions

1. **ProtectedRoute Component:**
   - Wraps route element to check authentication state
   - `requireOfficer` prop for checkpoint-only routes
   - `requireCitizen` prop for future citizen-only features
   - Shows loading state while AuthContext initializes from sessionStorage
   - Redirects to RolePicker (/) when auth check fails

2. **Authorization Header Pattern:**
   ```javascript
   const { token } = useAuth()
   fetch(url, {
     headers: {
       'Authorization': `Bearer ${token}`
     }
   })
   ```
   - Use token from AuthContext in all protected API calls
   - Backend validates JWT and extracts user_id/role claims
   - 401 responses should trigger logout and redirect

3. **Responsive Breakpoints:**
   - Already defined in CSS via `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))`
   - Document cards auto-collapse: 3 columns → 2 columns → 1 column
   - No additional media queries needed for grid (uses CSS Grid auto-fit)
   - May need media queries for nav/header elements

4. **Testing Priority:**
   - Ramesh Kumar mismatch is THE critical demo (precomputed, must work)
   - Officer login → scan → results is primary user flow
   - Theme toggle is secondary (nice-to-have, not blocking)
   - Responsive is tertiary (works via CSS Grid already)

### Files to Create (When File Edits Resume)

```
frontend/src/components/ProtectedRoute.jsx
```

### Files to Modify (When File Edits Resume)

```
frontend/src/App.jsx - Add ProtectedRoute wrappers
frontend/src/routes/CheckpointTraffic.jsx - Add Authorization header
frontend/src/routes/Vault.jsx - Add Authorization header
```

### Test Credentials Reference

**Officers:**
- Traffic: Badge TRF001, Password: traffic123
- Traffic: Badge TRF002, Password: traffic123
- Banking: Badge BNK001, Password: banking123
- Banking: Badge BNK002, Password: banking123

**Citizens (for Vault testing):**
- Ramesh Kumar: DL DL1234567890123 (has NAME mismatch flag)
- Priya Sharma: Aadhaar 234567890123 (clean verification)
- Amit Patel: Aadhaar 345678901234 (clean verification)
- Sunita Rao: Aadhaar 456789012345 (clean verification)

### Key Verification Points

1. **Structural Access Control:**
   - Traffic checkpoint CANNOT see PAN/Aadhaar fields
   - Banking checkpoint CANNOT see DL/RC fields
   - Locked cards visually demonstrate scope limits
   - OpenAPI schema at /docs shows structurally limited response models

2. **One Graph, Two Directions:**
   - Ramesh Kumar's NAME mismatch appears in Traffic checkpoint
   - Same mismatch appears in Ramesh Kumar's Vault
   - Same `cross_verification_results` table queried by both views
   - Citizen sees verification flags BEFORE enforcement encounters them

3. **Disclosure Transparency:**
   - Scan labeled as "simulated" (not real document capture)
   - Banking labeled as "seeded preview" (not live cross-Satellite sync)
   - Bridge Assistant labeled "Coming Soon" (not live LLM)
   - Citizen auth labeled "simulated verification" (no real OTP/2FA)

4. **Physical Metaphor Consistency:**
   - Checkpoint views: dark terminal, technical, enforcement context
   - Vault view: light cards, warm, citizen-facing accessibility
   - "Government file" physicality throughout (punch holes, file tabs, rubber stamps)
   - Zero gradients, flat colors, institutional typography

### Next Steps After Session 6

Once Session 6 testing is complete and all E2E flows verified:

1. **Create Pull Request or Merge to Main:**
   - Commit Session 6 changes (ProtectedRoute + Authorization headers)
   - Create comprehensive PR description summarizing Phase 2 redesign
   - Include screenshots of checkpoint and vault views
   - Link to session summaries in docs/

2. **Deploy to Staging/Production:**
   - Verify DATABASE_URL points to production Postgres
   - Ensure JWT_SECRET uses secure environment variable
   - Test on deployed environment (not just localhost)
   - Verify CORS settings allow frontend domain

3. **Prepare for Phase B:**
   - Review docs/phases.md and docs/rules.md for Phase B scope
   - Live Banking endpoint implementation
   - Bridge Assistant LLM integration
   - Document upload/sync features
   - Legal Satellite full implementation

---
