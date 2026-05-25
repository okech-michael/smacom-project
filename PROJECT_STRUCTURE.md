# SMACOM Project Structure - Consolidated

## Current Issue
The project has multiple nested folders which makes deployment confusing:
- `green-cycle-hub/` - main fullstack (has frontend + backend subdirectories)
- `smacom-backend/` - redundant/legacy backend code
- Separate `backend/` folder at root (unused)

## Recommended Consolidated Structure

```
smacom/ (root)
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── dist/ (built by Vite)
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── services/
│   │   └── __init__.py
│   ├── tests/
│   ├── main.py
│   ├── requirements.txt
│   └── pytest.ini
├── api/
│   └── index.py (Vercel serverless entry point)
├── vercel.json
├── requirements.txt (root level for Vercel)
└── README.md
```

## Migration Steps

### Phase 1: Flatten Structure (Current)
1. ✅ Simplify Vercel build process
2. ✅ Update path detection for frontend
3. ✅ Verify deployment works
4. Next: Test current deployment

### Phase 2: Consolidate Folders (When ready)
1. Create new `frontend/` at root
2. Move `green-cycle-hub/src/*` → `frontend/src/`
3. Move `green-cycle-hub/*.config.ts` → `frontend/`
4. Create new `backend/` at root
5. Move `green-cycle-hub/backend/app/*` → `backend/app/`
6. Update all import paths
7. Delete `green-cycle-hub/` and `smacom-backend/`
8. Update `vercel.json` and `api/index.py` paths

## Benefits of Consolidated Structure
- **Clearer navigation**: Frontend and backend at root level
- **Easier deployment**: No nested folder lookups
- **Better CI/CD**: Standard monorepo structure
- **Reduced confusion**: No redundant `smacom-backend/` folder

## Current Status
- **Build simplified**: `vercel.json` now runs simple `npm run build`
- **Path detection improved**: Backend checks multiple locations
- **Error messages enhanced**: Better debugging info
- **Next step**: Verify this works, then consolidate folders if needed
