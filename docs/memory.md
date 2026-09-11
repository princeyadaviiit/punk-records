# Punk Records Phase 2 Redesign — Progress Tracker

**Started:** 2026-09-12  
**Current Session:** Session 6 - Final Polish + E2E Testing

---

## Overall Progress

### ✅ Completed
- Initial planning and architecture review
- Reference screenshot analysis (dark terminal, light Vault styles)
- Confirmed non-negotiables and risk assessment
- **Session 1: Backend Foundations** ✅
- **Session 2: Theme System** ✅
- **Session 3: Role Picker + Auth Flows** ✅
- **Session 4: Scan Simulation + Satellite UI Rebuild** ✅
- **Session 5: Vault Rebuild (Light Card Grid)** ✅

### 🔄 In Progress
- None currently

### 📋 Upcoming
- Session 6: Final polish + end-to-end testing

---

## Session 1: Backend Foundations

**Goal:** Add auth infrastructure and officer accounts without breaking existing deployment.

### Tasks

#### 1. Officers Table
- [x] Add `officers` table to schema.sql (Postgres syntax)
- [x] Add SQLite schema in client.py (SQLite doesn't use schema.sql)
- [x] Fields: id, badge_id (unique), password_hash, role (traffic|banking), name, department

#### 2. Seed Officer Accounts
- [x] Extend seed_data.py with officer seed data
- [x] Add password hashing (bcrypt)
- [x] Seed 4 officers: 2 traffic (TRF001, TRF002), 2 banking (BNK001, BNK002)
- [x] Follow idempotent seeding pattern (INSERT OR IGNORE / ON CONFLICT)

#### 3. Auth Endpoints
- [x] Create backend/app/routes/auth.py
- [x] Implement POST /api/auth/citizen (id_type, id_value → session token)
- [x] Implement POST /api/auth/officer (role, badge_id, password → session token)
- [x] Add JWT token generation with PyJWT
- [x] Create backend/app/models/auth.py (LoginRequest, AuthResponse models)

#### 4. Citizen ID Lookup Helper
- [x] Add helper to look up citizen by Aadhaar/PAN/DL number
- [x] Query documents table fields JSONB for matching ID
- [x] Return citizen_id + name for auth flow

#### 5. Vault Route Verification
- [x] Confirm VaultViewResponse includes all necessary fields
- [x] Verify route returns document details correctly
- [x] Test that Aadhaar/PAN/DL numbers are accessible from fields JSONB

#### 6. Router Registration
- [x] Add auth router to main.py
- [x] Preserve existing router order (critical for deployment)
- [x] Verify startup sequence unchanged

**STATUS: ✅ COMPLETED**

### Test Results

All backend foundations verified via test_session1.py:
- ✓ Officers table: 4 rows (2 traffic, 2 banking)
- ✓ Password hashing with bcrypt works
- ✓ Document ID extraction from JSONB works (Aadhaar, DL, PAN)
- ✓ Citizen lookup by document ID works
- ✓ Existing tables intact (citizens, documents, cross_verification_results)
- ✓ Server starts successfully with new auth router
- ✓ Database seeding is idempotent and complete

---

## Design Decisions & Notes

### Authentication Strategy
- **Citizen auth:** Lookup by document ID (Aadhaar/PAN/DL) from documents.fields JSONB
- **Officer auth:** Badge/Employee ID + password against officers table
- **Token:** JWT with citizen_id/officer_id + role claim
- **Session duration:** TBD (likely 24h for demo purposes)
- **Disclosure:** Citizen auth labeled as "simulated identity verification" (no real OTP/2FA)

### Officers Table Schema
```sql
CREATE TABLE IF NOT EXISTS officers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    badge_id TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('traffic', 'banking')),
    name TEXT NOT NULL,
    department TEXT NOT NULL
);
```

### Seeded Officers (Plaintext Passwords for Reference)
- **Traffic:** Badge TRF001, password "traffic123", Officer Rajesh Mehta
- **Traffic:** Badge TRF002, password "traffic123", Officer Anjali Singh  
- **Banking:** Badge BNK001, password "banking123", Officer Suresh Kumar
- **Banking:** Badge BNK002, password "banking123", Officer Kavita Reddy

*Note: Passwords will be bcrypt-hashed in actual seed data*

---

## Non-Negotiables Compliance Checklist

- [x] Schema-level access control preserved (Pydantic response models unchanged)
- [x] One shared schema (officers table additive, no separate mock datasets)
- [x] No LLM in verification pipeline (auth is separate concern)
- [x] Precomputed mismatch unchanged (Ramesh Kumar flag untouched)
- [x] No deployment config changes (Procfile, render.yaml, start commands intact)
- [x] Router registration order preserved in main.py

---

## Session 1 Summary

**Completed:** 2026-09-12

### What Was Built

1. **Officers Table**
   - Added to schema.sql (Postgres) and client.py (SQLite)
   - Fields: id, badge_id (unique), password_hash, role, name, department
   - Indexes on badge_id and role for efficient lookups

2. **Officer Seed Data**
   - 4 officers seeded: TRF001, TRF002 (traffic), BNK001, BNK002 (banking)
   - Passwords bcrypt-hashed at module load time
   - Idempotent seeding via INSERT OR IGNORE / ON CONFLICT

3. **Authentication System**
   - `POST /api/auth/citizen` - login by document ID (Aadhaar/PAN/DL)
   - `POST /api/auth/officer` - login by badge_id + password
   - JWT tokens with user_id, role, name claims
   - 24-hour token expiration
   - Auth models in app/models/auth.py

4. **Citizen Document Lookup**
   - Helper function queries documents.fields JSONB
   - Extracts Aadhaar/PAN/DL numbers via json_extract
   - Returns citizen_id + name for token generation

### Files Modified
- `backend/app/db/schema.sql` - Added officers table (Postgres)
- `backend/app/db/client.py` - Added officers table (SQLite)
- `backend/app/seed/seed_data.py` - Added officer seed data + bcrypt hashing
- `backend/app/main.py` - Registered auth router
- `backend/requirements.txt` - Added bcrypt>=4.1.0, pyjwt>=2.8.0

### Files Created
- `backend/app/routes/auth.py` - Auth endpoints
- `backend/app/models/auth.py` - Auth request/response models
- `backend/test_session1.py` - Comprehensive test suite
- `backend/test_auth_http.py` - HTTP endpoint tests (optional)

### Key Decisions

1. **JWT Secret:** Hardcoded for MVP ("punk-records-mvp-secret-change-in-production")
   - Production should use environment variable
   - Disclosed in code comments

2. **Citizen Auth Disclosure:** Labeled as "simulated identity verification"
   - No real OTP/2FA in MVP
   - Consistent with OCR-stub disclosure pattern

3. **Password Storage:** bcrypt with salt, hashed at seed time
   - Plaintext passwords only in code comments for reference
   - Never stored in database

4. **SQLite Schema:** Maintained separate from schema.sql
   - schema.sql is Postgres-only (with DO blocks, ENUM types)
   - client.py contains SQLite-compatible schema

### Deployment Safety

✓ No changes to Procfile, render.yaml, or start commands
✓ Existing router order preserved (auth added first, foundational)
✓ Lifespan auto-seeding unchanged
✓ Backward compatible - existing endpoints unaffected
✓ Database migration is additive (new table only)

---

## Next Session Preview

**Session 2: Theme System**
- Create ThemeContext + ThemeProvider
- Add CSS tokens for dark terminal theme (navy/charcoal backgrounds, green VERIFIED accents)
- Add CSS tokens for light Vault theme (warm neutrals, softer accents)
- Build ThemeToggle component
- Verify toggle works app-wide via CSS variables
