# SMACOM Deployment Audit - Issues Summary Table

## Quick Reference

### Issues by Severity

| # | Issue | Severity | File(s) | Line(s) | Impact | Status |
|---|-------|----------|---------|---------|--------|--------|
| 1 | Build artifacts tracked in git (17 files) | 🔴 CRITICAL | `.git` (ls-files) | - | Repo bloat, deployment inefficiency | **Must fix** |
| 2 | Conflicting project structure | 🔴 CRITICAL | `backend/`, `frontend/`, `green-cycle-hub/`, `api/` | - | Confusion, maintenance burden | **Must fix** |
| 3 | IoT module disabled but imported | 🔴 CRITICAL | `app/api/processor.py` | 4-6 | Import failures | **Must fix** |
| 4 | Hardcoded JWT secret "changeme" | 🔴 CRITICAL | `config.py` | 9 | Security vulnerability | **Must fix** |
| 5 | Incomplete frontend path resolution | 🔴 CRITICAL | `api/index.py`, `main.py` | 57-69, 72-94 | 503 errors on deployment | **Must fix** |
| 6 | Dev API port mismatch | 🟠 HIGH | `src/lib/api.ts` | 6 | Development API calls fail | Fix for dev |
| 7 | Missing root package.json | 🟠 HIGH | Root level | - | Non-idiomatic setup | Improve |
| 8 | Build command uses Unix `ls` | 🟠 HIGH | `vercel.json` | 4 | Windows dev testing fails | Improve |
| 9 | Empty root .gitignore | 🟠 HIGH | `.gitignore` | 1 | Missing entries for dist, node_modules | Fix |
| 10 | .vercelignore excludes dist/ | 🟠 HIGH | `.vercelignore` | 26 | Frontend not deployed | Fix |
| 11 | Duplicate dist folders | 🟡 MEDIUM | `dist/`, `frontend-dist/`, `backend/frontend-dist/` | - | Maintenance confusion | Clean up |
| 12 | VITE_API_URL not set explicitly | 🟡 MEDIUM | Frontend env config | - | Implicit configuration (works but fragile) | Document |
| 13 | Duplicate entry points | 🟡 MEDIUM | `api/index.py`, `main.py` | - | Easy to forget updating both | Document |
| 14 | Multiple deployment docs | 🟣 LOW | 5 different `.md` files | - | User confusion | Consolidate |
| 15 | TypeScript strict mode disabled | 🟣 LOW | `tsconfig.json` | - | Type errors allowed | Enable later |
| 16 | Tests reference IoT | 🟣 LOW | `tests/` folder | Multiple | Tests broken | Mock/fix |

---

## Issues by File Location

### 🔴 CRITICAL

#### `green-cycle-hub/backend/app/core/config.py`
- **Line 9:** `jwt_secret: str = "changeme"`
- **Issue:** Security vulnerability - exposed in source
- **Fix:** Remove default, require environment variable

#### `green-cycle-hub/backend/app/api/processor.py`
- **Line 4:** `from app.models.iot import IoTReading, ProcessingUnitCreate`
- **Line 6:** `from app.core.realtime import broadcast_iot_reading`
- **Issue:** IoT disabled but still imported
- **Fix:** Conditional import based on settings.mqtt_enabled

#### `api/index.py`
- **Lines 57-69:** Frontend path resolution with multiple fallbacks
- **Issue:** Unreliable path logic, may fail on Vercel
- **Fix:** Simplify to single expected path

#### `green-cycle-hub/backend/main.py`
- **Lines 72-94:** Same path resolution issue as api/index.py
- **Issue:** Duplicate logic, both should be kept in sync
- **Fix:** Factor into shared utility

#### Git Repository
- **17 files:** Build artifacts in dist/ and frontend-dist/
- **Issue:** Should never be committed
- **Fix:** Add to .gitignore and remove from git

#### Project Structure
- **4 overlapping locations:** backend/, frontend/, green-cycle-hub/, api/
- **Issue:** Unclear which is source of truth
- **Fix:** Verify if backend/ and frontend/ are legacy, remove if unused

---

### 🟠 HIGH

#### `vercel.json`
- **Line 4:** `"buildCommand": "... && ls -la dist/ || ..."`
- **Issue:** Unix command, fails on Windows
- **Fix:** Use cross-platform command or remove

#### `.gitignore` (Root Level)
- **Line 1 only:** `green-cycle-hub/backend/firebase-credentials.json`
- **Issue:** Missing standard entries (dist/, node_modules/, etc.)
- **Fix:** Add comprehensive .gitignore entries

#### `.vercelignore`
- **Line 26:** `dist/`
- **Issue:** dist/ is needed for frontend serving
- **Fix:** Remove from exclusions

#### `green-cycle-hub/src/lib/api.ts`
- **Line 6:** `'http://localhost:8080/api/v1'`
- **Issue:** Backend runs on 8000, not 8080
- **Fix:** Change to 8000 for local development

---

### 🟡 MEDIUM

#### Build Artifacts (Git tracked)
- **Locations:**
  - `green-cycle-hub/dist/assets/index-DOCqC_ER.js`
  - `green-cycle-hub/dist/index.html`
  - `green-cycle-hub/frontend-dist/assets/...` (5 files)
  - `green-cycle-hub/backend/frontend-dist/...` (5 files)
- **Issue:** Old builds, multiple copies, all should be .gitignored
- **Fix:** Remove and keep only one dist location

#### Environment Configuration
- **Missing:** VITE_API_URL not explicitly set in Vercel
- **Status:** Works because fallback is correct, but should be explicit
- **Fix:** Add to .env.production or Vercel dashboard

#### Documentation
- **Multiple files:** VERCEL_*.md files (5 different guides)
- **Issue:** Unclear which to follow
- **Fix:** Consolidate into single guide

#### TypeScript Configuration
- **Files:** `tsconfig.json`
- **Lines:** Multiple `false` values for strict checking
- **Issue:** Allows type errors
- **Status:** Development choice, OK for now
- **Fix:** Enable when codebase stabilizes

---

### 🟣 LOW

#### Test Files
- **Files:** `tests/test_smacom.py`, `tests/test_integration.py`, `tests/conftest.py`
- **Issue:** Import disabled IoT models
- **Status:** Tests aren't run in production, non-blocking
- **Fix:** Mock IoT models in tests

---

## Tracked Build Artifacts (Must Remove)

```
green-cycle-hub/backend/frontend-dist/assets/index-BEuR8ETE.js
green-cycle-hub/backend/frontend-dist/assets/index-_t2tiWP4.css
green-cycle-hub/backend/frontend-dist/index.html
green-cycle-hub/backend/frontend-dist/placeholder.svg
green-cycle-hub/backend/frontend-dist/robots.txt

green-cycle-hub/dist/assets/index-DOCqC_ER.js
green-cycle-hub/dist/assets/index-fUQMP_AF.css
green-cycle-hub/dist/index.html
green-cycle-hub/dist/logo.jpg
green-cycle-hub/dist/robots.txt

green-cycle-hub/frontend-dist/assets/index-BEuR8ETE.js
green-cycle-hub/frontend-dist/assets/index-_t2tiWP4.css
green-cycle-hub/frontend-dist/favicon.ico
green-cycle-hub/frontend-dist/index.html
green-cycle-hub/frontend-dist/logo.jpg
green-cycle-hub/frontend-dist/placeholder.svg
green-cycle-hub/frontend-dist/robots.txt
```

**Total:** 17 files across 3 directories

---

## Environment Variables Status

### Must Set in Vercel Dashboard
- [ ] `JWT_SECRET` ← **CURRENTLY UNSAFE DEFAULT**
- [ ] `SUPABASE_URL`
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SENDGRID_API_KEY`
- [ ] `MPESA_CONSUMER_KEY`
- [ ] `MPESA_CONSUMER_SECRET`
- [ ] `MPESA_SHORTCODE`
- [ ] `MPESA_PASSKEY`
- [ ] `MPESA_CALLBACK_URL`
- [ ] `FLUTTERWAVE_SECRET_KEY`
- [ ] `FLUTTERWAVE_WEBHOOK_HASH`

### Optional
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `FIREBASE_CREDENTIALS_JSON`

### Auto-set by Vercel (in vercel.json)
- ✅ `PYTHONUNBUFFERED=1`
- ✅ `PYTHONPATH=/var/task`

---

## Recommended Fix Order

### Phase 1: Critical (Do immediately)
1. Remove 17 build artifact files from git
2. Update root .gitignore
3. Change JWT secret default
4. Fix IoT imports

### Phase 2: High (Before production)
5. Fix frontend path resolution
6. Update .vercelignore
7. Fix dev API port

### Phase 3: Medium (Before code freeze)
8. Consolidate project structure
9. Simplify deployment docs
10. Document entry points

### Phase 4: Low (Polish)
11. Enable TypeScript strict mode
12. Mock IoT in tests

---

## Configuration Health Check

| Configuration | Status | Notes |
|---|---|---|
| Backend (Python) | ✅ Good | All deps in requirements.txt |
| Frontend (Node) | ⚠️ Fair | Works but some issues |
| Database | ✅ Good | Supabase config in place |
| Build Process | ⚠️ Fair | Works but platform-specific commands |
| Deployment | 🔴 Risky | Security issue with JWT, path issues |
| Git Repository | 🔴 Risky | Build artifacts committed |
| Documentation | ⚠️ Fair | Multiple conflicting guides |

---

## Deployment Readiness: ⚠️ 60% READY

**Can deploy:** Yes, technically it works  
**Should deploy:** Not recommended without fixes  
**Estimated fix time:** 1-2 hours  
**Risk level:** Medium (security issue, possible 503 errors)
