# DEPLOYMENT AUDIT - RECOMMENDED FIXES

## Quick-Fix Commands

### 1. Remove Build Artifacts from Git (CRITICAL)

```bash
cd c:\Users\HP\Desktop\smacom

# Remove from git tracking (don't delete files yet)
git rm -r --cached green-cycle-hub/dist/
git rm -r --cached green-cycle-hub/frontend-dist/
git rm -r --cached green-cycle-hub/backend/frontend-dist/

# Commit the removal
git commit -m "Remove build artifacts from git tracking

- Removed dist/ folders (17 build output files)
- These are generated at build time, not source code
- Will be regenerated on Vercel deployment"
```

### 2. Fix Root .gitignore (CRITICAL)

Replace entire `.gitignore` with:

```bash
# Build outputs
dist/
build/
.next/
*.tsbuildinfo

# Node modules
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*

# Python
__pycache__/
*.py[cod]
*$py.class
*.so
.Python
*.egg-info/
dist-python/
build-python/
.eggs/
.venv/
venv/
ENV/
env/

# Environment variables
.env
.env.local
.env.*.local

# IDE
.vscode/
.idea/
*.swp
*.swo
*~
*.iml
.project
.pydevproject

# OS
.DS_Store
Thumbs.db

# Logs
*.log
logs/

# Testing
.pytest_cache/
.coverage
htmlcov/
.tox/
.nyc_output/

# Specific to this project
green-cycle-hub/backend/firebase-credentials.json

# Lock files (keep these)
# package-lock.json - tracked
# bun.lockb - tracked
# yarn.lock - tracked
```

Then commit:
```bash
git add .gitignore
git commit -m "Expand root .gitignore with standard entries

- Added dist/, node_modules/
- Added Python cache and virtual env folders
- Added IDE and OS-specific files
- Ensures build artifacts never committed again"
```

### 3. Fix JWT Secret (CRITICAL)

Edit `green-cycle-hub/backend/app/core/config.py`:

**Before:**
```python
class Settings(BaseSettings):
    # Authentication
    google_client_id: str = ""
    google_client_secret: str = ""
    jwt_secret: str = "changeme"  # ← DANGEROUS DEFAULT
```

**After:**
```python
class Settings(BaseSettings):
    # Authentication
    google_client_id: str = ""
    google_client_secret: str = ""
    jwt_secret: str = ""  # MUST be set in environment
```

Add validation:
```python
    def __init__(self, **data):
        super().__init__(**data)
        if not self.jwt_secret or self.jwt_secret == "changeme":
            raise ValueError(
                "FATAL: jwt_secret is not set or is using insecure default. "
                "Set JWT_SECRET environment variable before running."
            )
```

### 4. Fix Frontend Path Resolution (CRITICAL)

Edit `api/index.py` (lines 57-69):

**Before:**
```python
frontend_paths = [
    Path(__file__).parent.parent / "green-cycle-hub" / "dist",
    Path(__file__).parent.parent / "frontend" / "dist",
    Path(__file__).parent.parent / "dist",
]

frontend_dist = None
for path in frontend_paths:
    if path.exists():
        frontend_dist = path
        break
```

**After:**
```python
# On Vercel: api/index.py runs from /var/task/api/
# vercel.json buildCommand creates green-cycle-hub/dist/
# Path must be relative to /var/task/
frontend_dist = Path(__file__).parent.parent / "green-cycle-hub" / "dist"

if not frontend_dist.exists():
    print(f"ERROR: Frontend dist not found at {frontend_dist}")
    print(f"Expected: {frontend_dist}")
    print(f"Current working dir: {Path.cwd()}")
    print(f"This file: {__file__}")
    
    # Try to list what's actually there
    parent = Path(__file__).parent.parent
    if parent.exists():
        print(f"\nContents of {parent}:")
        for item in parent.iterdir():
            print(f"  {'[DIR]' if item.is_dir() else '[FILE]'} {item.name}")
```

### 5. Fix Development API Port (HIGH)

Edit `green-cycle-hub/src/lib/api.ts`:

**Before:**
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? '/api/v1'
    : 'http://localhost:8080/api/v1'  // ← WRONG PORT
);
```

**After:**
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || (
  typeof window !== 'undefined' && window.location.hostname !== 'localhost' 
    ? '/api/v1'
    : 'http://localhost:8000/api/v1'  // ✓ CORRECT PORT
);
```

### 6. Fix .vercelignore (HIGH)

Edit `.vercelignore`:

**Before:**
```
...
dist/
build/
.next/
...
```

**After:**
```
# Exclude files not needed for deployment

# Docker
docker-compose.yml
Dockerfile
nginx.conf

# Railway config
railway.json
RAILWAY_DEPLOYMENT.md

# Deployment docs (markdown only, not needed at runtime)
# But keep everything else!

# Development only
.git/
.gitignore
.vscode/
.idea/
*.log

# Environment examples (not actual env files)
.env.example
.env.production.example

# Tests
tests/
pytest.ini

# Python cache
__pycache__/
*.pyc
.pytest_cache/

# Notes
*.md  # Remove markdown guides from deployment
```

Wait, that will remove the markdown. Better approach:

```
# Vercel ignore file

# Docker & local dev
docker-compose.yml
Dockerfile
nginx.conf
railway.json
RAILWAY_DEPLOYMENT.md

# Version control
.git/
.gitignore

# IDE
.vscode/
.idea/

# Python
__pycache__/
*.pyc
.pytest_cache/
.pytest_cache

# Tests
tests/

# Dev docs
DEPLOYMENT_*.md
VERCEL_*.md
*_SUMMARY.md
START_HERE.md

# Logs & temps
*.log
*.tmp

# Keep everything else including dist/
```

Actually, simplest fix:

**Remove this line:**
```
dist/
```

### 7. Fix IoT Imports (CRITICAL)

Edit `green-cycle-hub/backend/app/api/processor.py`:

**Before:**
```python
from fastapi import APIRouter, Depends, Query
from app.db.supabase_client import get_supabase
from app.core.dependencies import get_current_user, require_role
from app.models.iot import IoTReading, ProcessingUnitCreate  # ← DISABLED
from app.services.alert_engine import evaluate_reading
from app.core.realtime import broadcast_iot_reading  # ← DISABLED
```

**After (Option 1 - Conditional Import):**
```python
from fastapi import APIRouter, Depends, Query
from app.db.supabase_client import get_supabase
from app.core.dependencies import get_current_user, require_role
from app.core.config import settings

# Only import IoT if enabled
if settings.mqtt_enabled:
    from app.models.iot import IoTReading, ProcessingUnitCreate
    from app.core.realtime import broadcast_iot_reading
    from app.services.alert_engine import evaluate_reading
else:
    # Provide mock objects for other endpoints
    IoTReading = None
    ProcessingUnitCreate = None
    broadcast_iot_reading = None
    evaluate_reading = None
```

**After (Option 2 - Try/Except):**
```python
from fastapi import APIRouter, Depends, Query
from app.db.supabase_client import get_supabase
from app.core.dependencies import get_current_user, require_role

try:
    from app.models.iot import IoTReading, ProcessingUnitCreate
    from app.services.alert_engine import evaluate_reading
    from app.core.realtime import broadcast_iot_reading
    IOT_AVAILABLE = True
except ImportError:
    IOT_AVAILABLE = False
    print("WARNING: IoT models not available")
```

Then in endpoints:
```python
@router.post("/readings")
async def submit_reading(
    reading: IoTReading,
    supabase=Depends(get_supabase),
):
    if not IOT_AVAILABLE:
        return {"error": "IoT features not enabled"}
    # ... rest of function
```

### 8. Update vercel.json Build Command (HIGH)

**Before:**
```json
"buildCommand": "cd green-cycle-hub && npm run build && echo '=== Build Complete ===' && ls -la dist/ || echo 'ERROR: dist folder not created!'"
```

**After (Cross-platform):**
```json
"buildCommand": "cd green-cycle-hub && npm run build && node -e \"if(!require('fs').existsSync('dist')) throw 'ERROR: dist folder not created!'; console.log('✓ Build Complete - dist folder created')\""
```

Or better, add to green-cycle-hub/package.json:
```json
{
  "scripts": {
    "build": "vite build",
    "build:verify": "node -e \"if(!require('fs').existsSync('dist')) throw new Error('dist folder not created!'); console.log('✓ Build verified')\""
  }
}
```

Then in vercel.json:
```json
"buildCommand": "cd green-cycle-hub && npm run build && npm run build:verify"
```

---

## Configuration File Updates

### `.env.production` (Create if missing)

```bash
# Frontend configuration
VITE_API_URL=https://your-project.vercel.app

# Backend environment
ENVIRONMENT=production
DEBUG=false
FRONTEND_URL=https://your-project.vercel.app

# Security (SET IN VERCEL DASHBOARD, NOT HERE)
# JWT_SECRET=<set in Vercel dashboard>
# SUPABASE_URL=<set in Vercel dashboard>
# etc.
```

### `green-cycle-hub/.env.production` (Update)

```bash
# Frontend API URL for production
VITE_API_URL=https://your-project.vercel.app
```

---

## Documentation Consolidation

Create single file: `DEPLOYMENT_GUIDE.md`

Delete these duplicate guides:
- VERCEL_DEPLOYMENT.md
- VERCEL_DEPLOY_INSTRUCTIONS.md
- VERCEL_FULLSTACK_GUIDE.md
- VERCEL_QUICK_START.md
- VERCEL_CONFIG_SUMMARY.md

---

## Testing After Fixes

### 1. Verify Build Artifacts Removed
```bash
git ls-files | grep -E "dist/|frontend-dist/" | wc -l
# Should return: 0
```

### 2. Verify .gitignore Works
```bash
cd green-cycle-hub
npm run build
git status | grep dist
# Should return: nothing (dist/ ignored)
```

### 3. Test Development Setup
```bash
# Terminal 1: Start backend
cd green-cycle-hub/backend
uvicorn main:app --reload --port 8000

# Terminal 2: Start frontend
cd green-cycle-hub
npm run dev  # should be on 5173

# Browser: http://localhost:5173
# Verify API calls work (should call localhost:8000)
```

### 4. Verify JWT Config
```bash
cd green-cycle-hub/backend
python -c "from app.core.config import get_settings; print(get_settings())"
# Should fail with error about JWT_SECRET if not set
```

### 5. Build and Test Path Resolution
```bash
cd green-cycle-hub
npm run build
ls dist/  # Should exist and have index.html
```

---

## Priority Fixes Checklist

### 🔴 CRITICAL (Do before next push)
- [ ] Remove build artifacts from git
- [ ] Update .gitignore
- [ ] Fix JWT secret default
- [ ] Fix IoT imports
- [ ] Fix frontend path resolution

### 🟠 HIGH (Do before production)
- [ ] Fix dev API port
- [ ] Update .vercelignore
- [ ] Fix build command
- [ ] Add JWT_SECRET to Vercel dashboard

### 🟡 MEDIUM (Do soon)
- [ ] Consolidate project structure  
- [ ] Fix .env.production
- [ ] Document entry points
- [ ] Consolidate deployment docs

### 🟣 LOW (Do when ready)
- [ ] Enable TypeScript strict mode
- [ ] Mock IoT in tests
- [ ] Clean up code comments
- [ ] Add deployment health checks

---

## Verification Checklist for Deployment

Before pushing to Vercel:

- [ ] `git status` shows no build artifacts
- [ ] `.gitignore` includes dist/, node_modules/
- [ ] `JWT_SECRET` is NOT "changeme" in config.py
- [ ] IoT imports are conditional or removed
- [ ] Frontend path resolution simplified
- [ ] API port is 8000 (not 8080) in api.ts
- [ ] `.vercelignore` does NOT exclude dist/
- [ ] Build command works on Windows (no `ls` command)
- [ ] `JWT_SECRET` set in Vercel Dashboard
- [ ] All required env vars set in Vercel Dashboard
- [ ] Local test: `npm run build` creates dist/
- [ ] Local test: Frontend API calls work

---

## Deployment Smoke Tests

After deploying to Vercel:

```bash
# 1. API is responding
curl https://your-project.vercel.app/health

# 2. Frontend loads
curl https://your-project.vercel.app | grep "index.html" | head -1

# 3. API routes work
curl https://your-project.vercel.app/api/v1/auth/me -H "Authorization: Bearer test"
# Should fail with 401, not 404 or 500

# 4. Check for 503 errors
curl -v https://your-project.vercel.app 2>&1 | grep "503"
# Should NOT find 503
```

---

## Estimated Time to Complete

| Fix | Time |
|-----|------|
| Remove artifacts from git | 5 min |
| Update .gitignore | 5 min |
| Fix JWT secret | 10 min |
| Fix IoT imports | 15 min |
| Fix path resolution | 15 min |
| Fix other configs | 20 min |
| **Testing & verification** | 30 min |
| **TOTAL** | **1.5 hours** |

---

## Support

If deployment still fails after these fixes:

1. Check Vercel logs: https://vercel.com/dashboard
2. Look for "frontend dist not found" → Fix path resolution
3. Look for "JWT_SECRET" error → Set in Vercel environment
4. Look for "module not found" → Check IoT imports
5. Look for "build failed" → Check vercel.json buildCommand
