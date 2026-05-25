# SMACOM Project Deployment Audit Report
**Generated:** May 25, 2026  
**Status:** ⚠️ **CRITICAL ISSUES FOUND** - Multiple blocking issues preventing reliable deployment

---

## Executive Summary
The SMACOM project has significant deployment configuration issues that will cause failures on Vercel. Key problems include:
- Build artifacts tracked in git (17 files)
- Conflicting project structure (multiple backend/frontend folders)
- Incomplete environment configuration
- IoT module disabled but still imported in multiple places
- Security risk with hardcoded JWT secret default

**Estimated Time to Fix:** 1-2 hours with proper cleanup

---

## CRITICAL ISSUES (Must Fix)

### 1. **Build Artifacts Tracked in Git** ⛔ CRITICAL
- **Severity:** CRITICAL
- **Files:** 17 files in dist/ and frontend-dist/ folders
- **Location:** 
  - `green-cycle-hub/dist/` (5 files)
  - `green-cycle-hub/frontend-dist/` (7 files)
  - `green-cycle-hub/backend/frontend-dist/` (5 files)
- **Issue:** Build output should NEVER be committed. This causes:
  - Repository bloat
  - Merge conflicts
  - Stale assets served to users
  - Vercel deployment inefficiency
- **Git tracked files:**
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
- **Root Cause:** Root level `.gitignore` only has 1 entry (firebase-credentials.json)
- **Fix:**
  ```bash
  # Update root .gitignore - ADD:
  dist/
  node_modules/
  .venv/
  __pycache__/
  *.pyc
  .DS_Store
  .env.local
  ```
  Then remove from git:
  ```bash
  git rm -r --cached green-cycle-hub/dist/
  git rm -r --cached green-cycle-hub/frontend-dist/
  git rm -r --cached green-cycle-hub/backend/frontend-dist/
  git commit -m "Remove build artifacts from git tracking"
  ```

---

### 2. **Conflicting Project Structure** ⛔ CRITICAL
- **Severity:** CRITICAL
- **Issue:** Multiple overlapping backend/frontend structures cause confusion:
  - `/backend/` - Empty folder at root
  - `/frontend/` - Contains public/src folders
  - `/green-cycle-hub/` - Main project with its own backend/
  - `/api/` - Vercel entry point
- **Problem:** 
  - `/backend/` is empty and unused
  - `/frontend/` might be legacy
  - Vercel expects `/api/index.py` but backend code is in `/green-cycle-hub/backend/`
  - This duplicated structure increases maintenance burden and deployment risk
- **Recommendation:** 
  1. Verify if `/backend/` and `/frontend/` are legacy
  2. Remove if not used: `git rm -r backend/ frontend/` (if legacy)
  3. Or consolidate everything into `green-cycle-hub/` as the source of truth

---

### 3. **IoT Module Disabled But Still Imported** ⛔ CRITICAL
- **Severity:** CRITICAL (Import Failure Risk)
- **Disabled in:**
  - `api/index.py` line 28 (commented out)
  - `green-cycle-hub/backend/main.py` line 20 (commented out)
- **But Still Imported in:**
  - `green-cycle-hub/backend/app/api/processor.py` line 4:
    ```python
    from app.models.iot import IoTReading, ProcessingUnitCreate
    ```
  - `green-cycle-hub/backend/app/core/realtime.py` - uses `broadcast_iot_reading`
  - Test files (`test_smacom.py`, `test_integration.py`) - 9+ imports of IoT models
- **Issue:** When processor.py tries to import IoTReading, it will succeed, but if IoT routes aren't included, runtime calls will fail
- **Fix:**
  Option 1: Conditionally import in processor.py:
  ```python
  # app/api/processor.py
  from app.models.iot import IoTReading, ProcessingUnitCreate
  # Only use if IoT is enabled
  if settings.mqtt_enabled:
      from app.core.realtime import broadcast_iot_reading
  ```
  Option 2: Move IoT-specific code to separate module and mock for non-IoT builds

---

### 4. **Hardcoded JWT Secret Default - Security Risk** ⛔ CRITICAL  
- **Severity:** CRITICAL (Security)
- **Location:** `green-cycle-hub/backend/app/core/config.py` line 9
  ```python
  jwt_secret: str = "changeme"
  ```
- **Issue:** 
  - Default secret is exposed in source code
  - Anyone with access to repo can forge tokens in production
  - This will be a security vulnerability if deployed with default value
- **Fix:**
  ```python
  # config.py
  jwt_secret: str = ""  # No default - MUST be set in environment
  
  # Then in vercel.json and deployment docs:
  # MANDATORY: Set JWT_SECRET in Vercel environment variables
  ```
- **Deployment Impact:** Vercel deployment WILL FAIL without JWT_SECRET set

---

## HIGH-SEVERITY ISSUES

### 5. **Incomplete Frontend Path Resolution** 🔴 HIGH
- **Severity:** HIGH (Runtime Failure Risk)
- **Location:** `api/index.py` lines 57-69 and `green-cycle-hub/backend/main.py` lines 72-94
- **Issue:** Multiple potential frontend paths with no clear precedence:
  ```python
  frontend_paths = [
      Path(__file__).parent.parent / "green-cycle-hub" / "dist",  # Vercel build location
      Path(__file__).parent.parent / "frontend" / "dist",  # Fallback if restructured
      Path(__file__).parent.parent / "dist",  # Root level fallback
  ]
  ```
- **Problem:**
  - On Vercel: `api/index.py` runs from `/var/task/api/` so paths resolve incorrectly
  - First path becomes `/var/task/green-cycle-hub/dist` (doesn't exist)
  - But vercel.json buildCommand puts frontend at `/var/task/green-cycle-hub/dist` ✓
  - Path resolution is unreliable
- **Test on Vercel:** Frontend likely fails with 503 on first deploy
- **Fix:** Simplify to single expected path:
  ```python
  # On Vercel, frontend ALWAYS builds to green-cycle-hub/dist
  frontend_dist = Path(__file__).parent.parent / "green-cycle-hub" / "dist"
  if not frontend_dist.exists():
      print(f"ERROR: Frontend dist not found at {frontend_dist}")
      print(f"Current file: {__file__}")
      print(f"Vercel build must create: green-cycle-hub/dist/")
  ```

---

### 6. **Development API Port Mismatch** 🔴 HIGH
- **Severity:** HIGH (Development broken, not production)
- **Location:** `green-cycle-hub/src/lib/api.ts` line 6
  ```typescript
  : 'http://localhost:8080/api/v1'  // Direct to backend in development
  ```
- **Issue:** 
  - Backend runs on port 8000 by default (Procfile, config.py)
  - Frontend expects backend on port 8080
  - Development API calls fail with connection refused
- **Fix:** Change to:
  ```typescript
  : 'http://localhost:8000/api/v1'  // Direct to backend in development
  ```

---

### 7. **Missing Root package.json** 🔴 HIGH
- **Severity:** HIGH (Deployment Failure)
- **Issue:** No `package.json` at root level
  - Vercel may expect one for installation order
  - Current setup has `green-cycle-hub/package.json` only
- **vercel.json line 3:** 
  ```json
  "installCommand": "pip install -r requirements.txt && cd green-cycle-hub && npm install --legacy-peer-deps"
  ```
  This works but is not idiomatic
- **Better Approach:** Create root `package.json` as proxy:
  ```json
  {
    "name": "smacom",
    "private": true,
    "scripts": {
      "install:frontend": "cd green-cycle-hub && npm install --legacy-peer-deps"
    }
  }
  ```

---

### 8. **vercel.json Build Command Platform Incompatibility** 🔴 HIGH
- **Severity:** HIGH (Dev environment, not production)
- **Location:** `vercel.json` line 4
  ```json
  "buildCommand": "cd green-cycle-hub && npm run build && echo '=== Build Complete ===' && ls -la dist/ || echo 'ERROR: dist folder not created!'"
  ```
- **Issue:** 
  - Uses `ls` command (Unix only)
  - Fails on Windows development machines during testing
  - Causes confusion when developers test locally
- **Fix:** Use cross-platform command:
  ```json
  "buildCommand": "cd green-cycle-hub && npm run build && npm run build:verify"
  ```
  Then add to package.json:
  ```json
  "build:verify": "node -e \"if(!require('fs').existsSync('dist')) throw 'dist folder not created!'\""
  ```

---

## MEDIUM-SEVERITY ISSUES

### 9. **Duplicate Dist Folders** 🟡 MEDIUM
- **Severity:** MEDIUM (Confusion, Cleanup)
- **Issue:** Three dist locations:
  - `green-cycle-hub/dist/` (Vite build output)
  - `green-cycle-hub/frontend-dist/` (Old build?)
  - `green-cycle-hub/backend/frontend-dist/` (Local development copy?)
- **Files:** All have similar content but different builds
- **Problem:** Unclear which one is used, maintenance burden
- **Recommendation:** 
  - Keep only `green-cycle-hub/dist/` (Vite standard output)
  - Remove `frontend-dist/` as these are build artifacts
  - Verify they're in `.gitignore`

---

### 10. **Missing VITE_API_URL in Vercel Environment** 🟡 MEDIUM
- **Severity:** MEDIUM (Runtime Configuration Issue)
- **Location:** Frontend API configuration not explicitly set on Vercel
- **File:** `green-cycle-hub/src/lib/api.ts` lines 2-6
  ```typescript
  export const API_BASE_URL = import.meta.env.VITE_API_URL || (
    typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
      ? '/api/v1'  // Use nginx proxy in production
      : 'http://localhost:8000/api/v1'  // Direct to backend in development
  );
  ```
- **Issue:**
  - On Vercel, `VITE_API_URL` is not set in environment variables
  - Falls back to '/api/v1' which is correct (same-domain routing)
  - But this is implicit and fragile - should be explicit
- **Current Status:** Actually works because fallback is correct
- **Recommendation:** Add to `.env.production`:
  ```
  VITE_API_URL=https://your-project.vercel.app
  ```

---

### 11. **Empty .gitignore at Root** 🟡 MEDIUM
- **Severity:** MEDIUM (Repository hygiene)
- **File:** `.gitignore` only has 1 line
  ```
  green-cycle-hub/backend/firebase-credentials.json
  ```
- **Missing Entries:**
  ```
  # Build outputs
  dist/
  build/
  .next/
  
  # Node/Python
  node_modules/
  __pycache__/
  *.pyc
  *.pyo
  .venv/
  venv/
  env/
  
  # Environment
  .env.local
  .env.*.local
  
  # IDE
  .vscode/
  .idea/
  *.swp
  *.swo
  
  # OS
  .DS_Store
  Thumbs.db
  
  # Logs
  *.log
  logs/
  ```

---

### 12. **.vercelignore Excludes dist/ (Needed for Production)** 🟡 MEDIUM
- **Severity:** MEDIUM (Deployment issue)
- **Location:** `.vercelignore` line 26
  ```
  dist/
  build/
  .next/
  ```
- **Issue:** `dist/` is NEEDED for deployment (contains built frontend)
- **Fix:** Remove `dist/` from `.vercelignore`:
  ```
  # Only exclude files NOT needed for deployment:
  build/
  .next/
  
  # Keep dist/ since Vercel build creates it
  ```

---

### 13. **Duplicate Entry Points Not Clearly Documented** 🟡 MEDIUM
- **Severity:** MEDIUM (Maintenance Confusion)
- **Files:**
  1. `api/index.py` - 150 lines
  2. `green-cycle-hub/backend/main.py` - 140 lines
- **Issue:** Nearly identical but both exist
  - Which one does Vercel use? (Answer: `api/index.py` per vercel.json)
  - Why maintain two?
  - Easy to forget updating both
- **Status:** `main.py` is for local development, `api/index.py` for Vercel
- **Recommendation:** Add clear comments at top of both files explaining their role:
  ```python
  """
  LOCAL DEVELOPMENT ENTRY POINT
  Run: uvicorn main:app --reload
  Use this when testing locally
  """
  ```
  and in api/index.py:
  ```python
  """
  VERCEL PRODUCTION ENTRY POINT
  Vercel calls this as serverless function
  Do NOT use for local development
  """
  ```

---

## LOW-SEVERITY ISSUES

### 14. **Conflicting Deployment Documentation** 🟣 LOW
- **Severity:** LOW (Confusing but not blocking)
- **Multiple deployment guides exist:**
  - `VERCEL_DEPLOYMENT.md`
  - `VERCEL_DEPLOY_INSTRUCTIONS.md`
  - `VERCEL_FULLSTACK_GUIDE.md`
  - `VERCEL_QUICK_START.md`
  - `VERCEL_CONFIG_SUMMARY.md`
- **Issue:** Users don't know which to follow
- **Recommendation:** Consolidate into single `DEPLOYMENT.md` with:
  - Prerequisites
  - Step-by-step Vercel deployment
  - Troubleshooting
  - Delete other docs

---

### 15. **TSConfig Warnings** 🟣 LOW
- **Severity:** LOW (Non-blocking)
- **Locations:**
  - `green-cycle-hub/tsconfig.json`:
    ```json
    "noImplicitAny": false,
    "noUnusedParameters": false,
    "noUnusedLocals": false,
    "strictNullChecks": false
    ```
  - These disable strict type checking
- **Issue:** Not blocking but allows type errors
- **Status:** This is development choice, OK for startup
- **Recommendation:** Enable once codebase is stable:
  ```json
  "strict": true,
  "noImplicitAny": true,
  "strictNullChecks": true
  ```

---

### 16. **Tests Reference Disabled IoT Module** 🟣 LOW
- **Severity:** LOW (Tests broken, but not affecting production)
- **Files with IoT imports:**
  - `green-cycle-hub/backend/tests/test_smacom.py` - 9 imports
  - `green-cycle-hub/backend/tests/test_integration.py` - 5 imports
  - `green-cycle-hub/backend/tests/conftest.py` - 1 import
- **Issue:** Tests will fail if run, but tests aren't part of production build
- **Impact:** `pytest` command won't work without proper IoT mocking
- **Fix:** Mock IoT imports in conftest:
  ```python
  # tests/conftest.py
  import sys
  from unittest.mock import MagicMock
  
  sys.modules['app.models.iot'] = MagicMock()
  ```

---

## CONFIGURATION MATRIX

| Aspect | Development | Vercel Production | Issue |
|--------|-------------|-------------------|-------|
| Backend Entry Point | `green-cycle-hub/backend/main.py` | `api/index.py` | Different files, manual sync needed |
| Frontend Build | `npm run build` in green-cycle-hub | Same command | ✓ Consistent |
| Frontend Output | `dist/` | `dist/` | ✓ Consistent |
| API Port | 8000 | 443 (HTTPS) | Hardcoded 8080 in frontend, mismatch in dev |
| API URL | `http://localhost:8000/api/v1` | `/api/v1` (relative) | ✓ Works but implicit |
| Database | Supabase (via env vars) | Supabase (via env vars) | ✓ Consistent |
| JWT Secret | "changeme" (INSECURE) | Must set in Vercel | ⚠️ Risky default |

---

## DEPENDENCY ANALYSIS

### Python Dependencies (requirements.txt) - Status: ✓ GOOD
- FastAPI, Uvicorn, Pydantic - all present
- Supabase client - present
- Payment libraries (mpesa, flutterwave) - present
- Email (SendGrid) - present
- JWT/Security libraries - present
- **Missing (Optional):** 
  - MQTT libraries would be needed if `mqtt_enabled = true` (currently disabled)

### Frontend Dependencies (package.json) - Status: ⚠️ NEEDS REVIEW
- React, React Router, React Query - ✓
- Tailwind, Shadcn/UI components - ✓
- Framer Motion - ✓
- **Issue:** No explicit `@vitejs/plugin-react-swc` pinning, using caret (^)
- **Recommendation:** Pin versions for production stability

---

## ENVIRONMENT VARIABLE CHECKLIST

**Required for Deployment (MUST SET IN VERCEL):**
- [ ] `JWT_SECRET` - Currently dangerous "changeme" default
- [ ] `SUPABASE_URL` 
- [ ] `SUPABASE_SERVICE_ROLE_KEY`
- [ ] `SUPABASE_ANON_KEY`
- [ ] `SENDGRID_API_KEY`
- [ ] `MPESA_CONSUMER_KEY`
- [ ] `MPESA_CONSUMER_SECRET`
- [ ] `MPESA_SHORTCODE`
- [ ] `MPESA_PASSKEY`
- [ ] `FLUTTERWAVE_SECRET_KEY`

**Optional (for features):**
- [ ] `GOOGLE_CLIENT_ID`
- [ ] `GOOGLE_CLIENT_SECRET`
- [ ] `FIREBASE_CREDENTIALS_JSON`

**Auto-Set by Vercel (in vercel.json):**
- [ ] `PYTHONUNBUFFERED=1`
- [ ] `PYTHONPATH=/var/task`

---

## BUILD FLOW VERIFICATION

### Current Flow:
```
Vercel Push
  ↓
Vercel installCommand:
  ├─ pip install -r requirements.txt (Python backend deps)
  └─ cd green-cycle-hub && npm install --legacy-peer-deps (Frontend deps)
  ↓
Vercel buildCommand:
  ├─ cd green-cycle-hub && npm run build (creates dist/)
  ├─ echo '=== Build Complete ===' (logging)
  └─ ls -la dist/ (FAILS ON WINDOWS, but OK on Vercel Linux)
  ↓
Vercel Deployment:
  ├─ Python lambda: api/index.py (serves backend + static frontend)
  └─ Routes all /* to /api/index.py
```

### Verified Working: ✓
- Frontend builds to `dist/`
- Backend finds `green-cycle-hub/dist/` for static serving
- Single Lambda handles both API and frontend

### Potential Issues:
- Windows developers can't locally test the exact build command (uses `ls`)
- Path resolution in api/index.py has multiple fallbacks

---

## PRIORITY FIX ORDER

1. **IMMEDIATE (Before next deployment):**
   - Remove dist files from git tracking (Issue #1)
   - Update root .gitignore (Issue #11)
   - Fix JWT secret default (Issue #4)

2. **HIGH (Before production):**
   - Resolve frontend path logic (Issue #5)
   - Fix dev API port (Issue #6)
   - Document entry points clearly (Issue #13)

3. **MEDIUM (Before code freeze):**
   - Remove or consolidate duplicate project structure (Issue #2)
   - Fix IoT imports (Issue #3)
   - Remove .vercelignore dist exclusion (Issue #12)

4. **LOW (Nice to have):**
   - Consolidate deployment docs (Issue #14)
   - Enable TypeScript strict mode (Issue #15)
   - Mock IoT in tests (Issue #16)

---

## DEPLOYMENT READINESS CHECKLIST

- [x] Backend code exists and configured
- [x] Frontend code exists and configured  
- [x] Vercel.json configured
- [x] API entry point exists (api/index.py)
- [ ] **Build artifacts removed from git** ← CRITICAL
- [ ] **Root .gitignore completed** ← CRITICAL
- [ ] **JWT_SECRET set in Vercel** ← CRITICAL
- [ ] Environment variables documented
- [ ] No hardcoded secrets in code
- [ ] Frontend/backend path resolution verified
- [ ] Tested locally (dev port mismatch will show)
- [ ] Database (Supabase) configured
- [ ] Payment providers configured

---

## CONCLUSION

**Overall Status:** ⚠️ **Can Deploy But Risky**

The project CAN be deployed to Vercel but has critical issues that need immediate attention:
1. Build artifacts in git (cleanup needed)
2. Insecure JWT default (security risk)
3. Incomplete path resolution (might fail at startup)

Estimated time to production-ready: **1-2 hours** for cleanup and testing.

**Recommendation:** Fix Critical issues #1, #4, and #5 before next deployment.
