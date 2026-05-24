# SMACOM Vercel Migration - Summary

## Overview

Your project has been prepared for migration from Railway to Vercel. This document provides a high-level summary of the migration strategy and key considerations.

---

## Architecture Decision

### Current (Railway)
```
Railway hosts everything:
├── Frontend (React + Nginx)
├── Backend (FastAPI + Uvicorn)
└── MQTT Broker (Eclipse Mosquitto)
```

### New (Vercel + Backend Service)
```
Vercel (Frontend only):
├── React + TypeScript + Vite
└── Static builds deployed globally

Backend Service (Railway/Render/Fly.io):
├── FastAPI + Uvicorn
├── MQTT connections
└── Background tasks (APScheduler)
```

---

## Why Split Frontend and Backend?

Vercel is **optimized for frontend deployment** with these benefits:
- ✅ Global CDN for fast delivery
- ✅ Automatic scaling
- ✅ Zero-config deployments
- ✅ Free tier available

However, Vercel has limitations for Python backends:
- ⚠️ 10-second timeout on serverless functions
- ⚠️ No persistent connections (MQTT, WebSockets)
- ⚠️ Limited Python runtime support
- ⚠️ Higher costs for long-running services

Your backend needs:
- ✅ Long-running connections (MQTT)
- ✅ Background tasks (APScheduler)
- ✅ Persistent state
- ✅ Real-time capabilities

**Therefore:** Keep backend on Railway (or equivalent service) and only migrate frontend to Vercel.

---

## Migration Path

### Step 1: Prepare Frontend (✅ DONE)
- [x] Created `.env.production` for frontend
- [x] Updated `.env.example` for Vercel URLs
- [x] Created `.vercelignore` to exclude unnecessary files
- [x] Verified `vite.config.ts` is correctly configured
- [x] Verified `package.json` build scripts

### Step 2: Prepare Backend (✅ DONE)
- [x] Updated backend `core/config.py` to support Vercel URLs
- [x] Created `.env.production` for backend with production settings
- [x] Configured `get_allowed_origins()` method for CORS

### Step 3: Deploy Frontend to Vercel (📋 TODO)
1. Use deployment script or Vercel CLI
2. Set environment variables in Vercel dashboard
3. Test frontend loads correctly

### Step 4: Configure Backend (📋 TODO)
1. Update `ALLOWED_ORIGINS` on Railway with Vercel URL
2. Set `VERCEL_FRONTEND_URLS` environment variable
3. Ensure backend is running and accessible

### Step 5: Integration Testing (📋 TODO)
1. Test API calls from frontend to backend
2. Verify CORS is working
3. Check authentication flow
4. Test real-time features

---

## Files Created/Modified

### New Files
```
✅ VERCEL_DEPLOYMENT.md          - Complete deployment guide
✅ VERCEL_QUICK_START.md         - Quick reference checklist
✅ .vercelignore                 - Vercel build exclusions
✅ deploy-to-vercel.bat          - Windows deployment script
✅ deploy-to-vercel.sh           - Linux/macOS deployment script
✅ green-cycle-hub/.env.production
✅ green-cycle-hub/backend/.env.production
```

### Modified Files
```
✅ green-cycle-hub/.env.example
✅ green-cycle-hub/backend/app/core/config.py
✅ vercel.json                   - (already properly configured)
```

---

## Key Configuration Points

### Frontend Environment Variables (Vercel)
```env
VITE_API_URL=https://your-backend-api-url.com
VITE_API_TIMEOUT=30000
```

### Backend Environment Variables (Railway)
```env
ENVIRONMENT=production
ALLOWED_ORIGINS=https://your-project.vercel.app,https://yourdomain.com
VERCEL_FRONTEND_URLS=https://your-project.vercel.app
FRONTEND_URL=https://your-project.vercel.app
```

### CORS Configuration
The backend's `get_allowed_origins()` now:
1. Combines `allowed_origins` (development URLs)
2. Adds `vercel_frontend_urls` (production URLs)
3. Includes `frontend_url` if specified
4. Falls back to `["*"]` if empty in production

---

## Deployment Options Considered

### ❌ Option 1: Full Vercel (Backend as Serverless Functions)
- **Reason:** Not suitable for your use case
- **Problem:** 10-second timeout, no MQTT support, no persistent connections
- **Cost:** Expensive for long-running services

### ✅ Option 2: Vercel Frontend + Railway Backend (CHOSEN)
- **Reason:** Optimal for your architecture
- **Benefit:** Leverages each platform's strengths
- **Cost:** Cost-effective
- **Status:** Already configured for this approach

### Option 3: Keep Everything on Railway
- **Reason:** Simplicity
- **Trade-off:** Lose Vercel's global CDN benefits
- **Cost:** May be higher

### Option 4: Vercel Frontend + Render/Fly.io Backend
- **Reason:** Alternative to Railway
- **Benefit:** Different cost/performance profile
- **Status:** Configuration would be similar

---

## Deployment Checklist

### Pre-Deployment
- [ ] Push all changes to GitHub
- [ ] Verify local build works: `cd green-cycle-hub && npm run build`
- [ ] Install Vercel CLI: `npm install -g vercel`
- [ ] Have Vercel account ready

### Frontend Deployment
- [ ] Run deployment script or manual `vercel --prod`
- [ ] Note the provided Vercel URL
- [ ] Set `VITE_API_URL` in Vercel dashboard
- [ ] Redeploy to apply environment variables
- [ ] Test frontend loads

### Backend Configuration
- [ ] Get Vercel frontend URL
- [ ] Log into Railway dashboard
- [ ] Update `ALLOWED_ORIGINS` environment variable
- [ ] Update `FRONTEND_URL` and `VERCEL_FRONTEND_URLS`
- [ ] Restart backend service

### Integration Testing
- [ ] Load frontend URL in browser
- [ ] Open DevTools → Network/Console
- [ ] Test API calls (login, fetch data)
- [ ] Verify no CORS errors
- [ ] Test authentication
- [ ] Test real-time features

---

## Important Considerations

### 1. Environment Variables
- **Frontend vars** go in Vercel dashboard
- **Backend vars** go in Railway dashboard
- Both need to be set for proper communication

### 2. CORS Headers
Backend must accept requests from Vercel URL. Configuration is:
```python
# Railway Backend
ALLOWED_ORIGINS=https://your-project.vercel.app
```

### 3. API Base URL
Frontend must know where backend is:
```env
# Vercel Frontend
VITE_API_URL=https://your-railway-backend.up.railway.app
```

### 4. Secrets Management
- ✅ Store sensitive data as environment variables
- ✅ Never commit `.env` files
- ✅ Use `.env.example` for templates
- ✅ Rotate keys regularly

### 5. Monitoring
- Watch Vercel logs for frontend issues
- Watch Railway logs for backend issues
- Monitor API response times
- Check error rates

---

## Next Steps

1. **Read:** [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for detailed instructions
2. **Review:** [VERCEL_QUICK_START.md](VERCEL_QUICK_START.md) for checklist
3. **Deploy:** Run `deploy-to-vercel.bat` (Windows) or `deploy-to-vercel.sh` (Mac/Linux)
4. **Configure:** Set environment variables in Vercel dashboard
5. **Update:** Update backend ALLOWED_ORIGINS on Railway
6. **Test:** Verify frontend ↔ backend communication works

---

## Support Resources

- [Vercel Docs](https://vercel.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Railway Documentation](https://docs.railway.app)
- [CORS Issues Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

---

## Questions?

Refer to the troubleshooting section in [VERCEL_DEPLOYMENT.md](VERCEL_DEPLOYMENT.md) for common issues and solutions.

---

**Status:** Ready for deployment ✅
