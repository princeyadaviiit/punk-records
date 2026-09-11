# Punk Records - Demo Guide

**Version:** Phase 2 MVP  
**Last Updated:** 2026-09-12

This guide explains how to login and navigate the Punk Records demo application.

---

## Quick Start

1. **Start the servers:**
   ```bash
   # Backend (from backend/ directory)
   uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
   
   # Frontend (from frontend/ directory)
   npm run dev
   ```

2. **Open the app:** http://localhost:5173/

3. **Pick your role:** Officer or Citizen

---

## Officer Login (Checkpoint Access)

### Traffic Officer

**Access:** Traffic Satellite checkpoint (DL + vehicle verification)

**Credentials:**
- **Badge ID:** `TRF001`
- **Password:** `traffic123`
- **Officer Name:** Rajesh Mehta
- **Department:** Transport Enforcement

**OR**

- **Badge ID:** `TRF002`
- **Password:** `traffic123`
- **Officer Name:** Anjali Singh
- **Department:** Transport Enforcement

**Steps:**
1. Click **"Traffic Officer"** card on Role Picker
2. Enter Badge ID and Password
3. Click **"Sign In"**
4. You'll be redirected to `/checkpoint/traffic`

**What You Can Do:**
- Click **"Scan"** button (simulated document scan)
- View Driver Verification (DL status, validity)
- View Vehicle Match (RC registration, owner name)
- See verification flags (mismatches between documents)
- **Cannot see:** PAN, Aadhaar, court records, financial data (scope-limited)

---

### Banking Officer

**Access:** Banking Satellite checkpoint (KYC verification)

**Credentials:**
- **Badge ID:** `BNK001`
- **Password:** `banking123`
- **Officer Name:** Suresh Kumar
- **Department:** Financial Services

**OR**

- **Badge ID:** `BNK002`
- **Password:** `banking123`
- **Officer Name:** Kavita Reddy
- **Department:** Financial Services

**Steps:**
1. Click **"Banking Officer"** card on Role Picker
2. Enter Badge ID and Password
3. Click **"Sign In"**
4. You'll be redirected to `/checkpoint/banking`

**What You Can Do:**
- Click **"Scan"** button (simulated KYC check)
- View Identity Link (Aadhaar, PAN verification)
- View Address Proof (utility bill verification)
- **Cannot see:** DL, RC, traffic challans, court summons (scope-limited)

**Note:** Banking checkpoint uses seeded preview data (disclosed with banner).

---

## Citizen Login (Vault Access)

### How to Login

Citizens login using **any valid document ID** from their records:
- **Aadhaar Number** (12 digits)
- **PAN Card** (10 characters)
- **Driving License** (DL + 13 digits)

**Steps:**
1. Click **"Citizen"** card on Role Picker
2. Select document type from dropdown
3. Enter document ID
4. Click **"Sign In"**
5. You'll be redirected to `/vault`

**MVP Disclosure:** This is a simulated identity verification (no real OTP/2FA in the demo).

---

### Demo Citizens & Credentials

#### 1. Ramesh Kumar ⚠️ **[HAS VERIFICATION MISMATCH]**

**The Critical Demo Case** - Demonstrates "One Graph, Two Directions"

**Login Credentials (any one):**
- **Aadhaar:** `123456789012`
- **PAN:** `ABCDE1234F`
- **Driving License:** `DL1234567890123`

**What You'll See:**
- 4 documents in Vault (Aadhaar, PAN, DL, RC)
- ⚠️ **VERIFICATION NOTES section** with NAME discrepancy
- Flag: DL name doesn't match RC owner name (85.7% similarity)
- Same flag that Traffic Officers see at checkpoints

**Why This Matters:** Demonstrates Pillar 2 - citizens see verification issues BEFORE enforcement encounters them.

---

#### 2. Priya Sharma ✅ **[CLEAN VERIFICATION]**

**Login Credentials (any one):**
- **Aadhaar:** `234567890123`
- **PAN:** `FGHIJ5678K`
- **Driving License:** `DL2345678901234`

**What You'll See:**
- 3 documents in Vault (Aadhaar, PAN, DL)
- All documents verified (green status)
- No verification flags
- Clean cross-verification audit

---

#### 3. Amit Patel ✅ **[CLEAN VERIFICATION]**

**Login Credentials (any one):**
- **Aadhaar:** `345678901234`
- **PAN:** `KLMNO9012P`

**What You'll See:**
- 2 documents in Vault (Aadhaar, PAN)
- All documents verified
- No verification flags

---

#### 4. Sunita Rao ✅ **[CLEAN VERIFICATION]**

**Login Credentials (any one):**
- **Aadhaar:** `456789012345`
- **PAN:** `QRSTU3456V`

**What You'll See:**
- 2 documents in Vault (Aadhaar, PAN)
- All documents verified
- No verification flags

---

## Key Demo Flows

### Flow 1: Officer Checkpoint Verification

**Goal:** See how officers verify citizens at checkpoints

1. **Login as Traffic Officer** (TRF001 / traffic123)
2. Click **"Scan"** button multiple times
3. Eventually you'll get **Ramesh Kumar**
4. **Observe:** NAME mismatch flag in verification results
5. **Note:** You can only see DL + vehicle data, nothing else

**Key Point:** Officers see ONLY their Satellite's scoped data.

---

### Flow 2: Citizen Transparency

**Goal:** See how citizens view their own verification status

1. **Login as Ramesh Kumar** (DL: `DL1234567890123`)
2. View your Vault
3. **Observe:** Same NAME discrepancy appears in "Verification Notes"
4. **Read:** "Officers see the same information in their checkpoint view"

**Key Point:** Citizens discover verification issues before enforcement does.

---

### Flow 3: "One Graph, Two Directions"

**Goal:** Demonstrate Pillar 2 - same data, two perspectives

1. **As Officer:** Login → Scan Ramesh Kumar → See mismatch
2. **As Citizen:** Login as Ramesh Kumar → See same mismatch in Vault
3. **Verify:** Both views query the same `cross_verification_results` table

**Key Point:** No information asymmetry. Citizens and officers see the same verification graph.

---

### Flow 4: Structural Access Control

**Goal:** Prove scope limits are enforced at schema level

1. **Login as Traffic Officer**
2. Scan any citizen
3. **Observe:** Locked card shows "Financial & Legal Data" you CANNOT see
4. **Verify:** Open DevTools → Network tab → Check API response
5. **Confirm:** Response model has NO PAN/Aadhaar fields (structurally impossible)

**Key Point:** Access control via Pydantic response models, not frontend filtering.

---

## What's Real vs What's Stubbed (MVP)

### ✅ Fully Functional
- Officer authentication (badge + password, JWT tokens)
- Citizen authentication (document ID lookup, JWT tokens)
- Traffic checkpoint with real backend endpoint
- Vault with real backend endpoint
- Cross-verification pipeline (checksum + fuzzy matching)
- Ramesh Kumar mismatch (precomputed, guaranteed to work)
- Theme toggle (light/dark mode)
- Responsive design (mobile/tablet/desktop)

### 🔶 Disclosed Stubs/Previews
- **Scan button:** Simulated (picks random citizen, not real document capture)
- **Banking checkpoint:** Seeded preview data (not live cross-Satellite sync)
- **Bridge Assistant:** "Coming Soon" stub (no live LLM)
- **Citizen auth:** Simulated verification (no real OTP/2FA)
- **OCR pipeline:** Intentionally disabled (citizen dropdown acts as stand-in)

### 📋 Phase B Features (Not Yet Built)
- Real document scanning with OCR
- Live Banking Satellite backend endpoint
- Bridge Assistant LLM integration
- Document upload/sync features
- Legal Satellite implementation
- Civic Literacy Bridge full implementation
- Re-verification trigger mechanisms

---

## Common Issues & Troubleshooting

### "Cannot access checkpoint" / Redirects to Role Picker
**Cause:** Not logged in as an officer  
**Fix:** Login with officer credentials (TRF001/BNK001)

### "No verification flags appear for Ramesh Kumar"
**Cause:** Database not seeded or mismatch data missing  
**Fix:** Restart backend server (seeding runs on startup)

### "Authorization header not sent" (DevTools shows no Bearer token)
**Cause:** Sessions 1-5 not yet committed, old code still active  
**Fix:** You need to commit the Phase 2 redesign first, then apply Session 6 changes

### "Theme toggle doesn't work"
**Cause:** Sessions 1-5 not yet committed  
**Fix:** Commit Phase 2 redesign (ThemeContext not in old code)

---

## API Endpoints Reference

### Public (No Auth Required)
- `GET /api/citizens` - List all seeded citizens

### Protected (Requires JWT Token)
- `POST /api/auth/citizen` - Citizen login
- `POST /api/auth/officer` - Officer login
- `GET /api/checkpoint/traffic/{citizen_id}` - Traffic verification
- `GET /api/vault/{citizen_id}` - Citizen vault view

### API Documentation
**Interactive Docs:** http://localhost:8000/docs  
**OpenAPI Schema:** http://localhost:8000/openapi.json

**Tip:** Use `/docs` to inspect response models and verify structural access control.

---

## Testing Checklist

### Authentication
- [ ] Officer login works (TRF001/BNK001)
- [ ] Citizen login works (Ramesh Kumar DL)
- [ ] Invalid credentials rejected
- [ ] JWT token stored in sessionStorage
- [ ] Logout clears session and redirects

### Protected Routes
- [ ] Cannot access `/checkpoint/traffic` when logged out
- [ ] Cannot access `/checkpoint/banking` when logged out
- [ ] Citizen cannot access checkpoint routes
- [ ] Officer CAN access checkpoint routes after login

### Checkpoint Verification
- [ ] Scan button works (picks random citizen)
- [ ] "Scan (simulated)" disclosure visible
- [ ] Ramesh Kumar mismatch appears correctly
- [ ] Locked card shows inaccessible data
- [ ] "Zero Overreach" footer present

### Vault Transparency
- [ ] Documents display correctly
- [ ] Profile circle shows citizen initial
- [ ] Ramesh Kumar's mismatch flag appears
- [ ] "One Graph, Two Directions" footer present
- [ ] Bridge Assistant shows "Coming Soon"

### Theme Toggle
- [ ] Toggle switches between light/dark
- [ ] Theme persists across page reloads
- [ ] Both themes readable on checkpoints
- [ ] Both themes readable in Vault

### Responsive Design
- [ ] Mobile (375px): Nav collapses, cards stack
- [ ] Tablet (768px): 2-column grid works
- [ ] Desktop (1440px): 3-column grid works
- [ ] No horizontal scroll at any width

---

## Development Tips

### Quick Login Shortcuts
Instead of clicking through the UI every time:

1. **Save credentials in browser** (DevTools → Application → Session Storage)
2. **Use API directly:**
   ```bash
   # Get a token via curl
   curl -X POST http://localhost:8000/api/auth/officer \
     -H "Content-Type: application/json" \
     -d '{"role":"traffic","badge_id":"TRF001","password":"traffic123"}'
   ```

### Inspect JWT Tokens
Tokens are stored in `sessionStorage` as `punk-records-token`. Decode at [jwt.io](https://jwt.io) to see claims.

### Database Reset
Restart the backend server - seeding runs on every startup and is idempotent.

---

## Support & Feedback

**Documentation:**
- `CLAUDE.md` - Architecture and constraints
- `docs/architecture.md` - Satellite pattern explanation
- `docs/rules.md` - MVP scope and non-negotiables
- `docs/phases.md` - Phase A/B roadmap

**Session Summaries:**
- `docs/session4_summary.md` - Checkpoint UI rebuild
- `docs/session5_summary.md` - Vault rebuild
- `docs/session6_summary.md` - Auth guards and testing

**Questions?** Check the backend test suite at `backend/tests/test_access_control.py` for proof that structural isolation works.

---

**Happy Testing! 🚀**
