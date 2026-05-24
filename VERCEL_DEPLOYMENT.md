# Vercel Deployment Guide

This guide explains how to deploy your SMACOM project to Vercel.

## Important Architecture Note

Vercel is optimized for **static frontend deployments** and **Node.js backends**. Your FastAPI backend has specific requirements:

- **Long-running connections** (MQTT broker)
- **Background tasks** (APScheduler)
- **Real-time features**

### Recommended Deployment Architecture

```
┌─────────────────────────────────────┐
│   Frontend (React + TypeScript)      │
│   Deployed on: VERCEL                │
└──────────────────┬──────────────────┘
                   │
                   ▼
       ┌─────────────────────┐
       │   FastAPI Backend    │
       │   Deployed on:       │
       │   Railway/Render/    │
       │   Fly.io (via API)   │
       └─────────────────────┘
```

---

## Part 1: Frontend Deployment (Vercel)

### Step 1: Prepare the Frontend

Your frontend is already configured. Verify `green-cycle-hub/`:
- ✅ `package.json` - Dependencies declared
- ✅ `vite.config.ts` - Build configuration
- ✅ `.env` and `.env.example` - Environment variables

### Step 2: Update Environment Variables

Create `.env.production` in `green-cycle-hub/`:

```env
VITE_API_URL=https://your-backend-api-url.com
VITE_API_TIMEOUT=30000
```

Update `green-cycle-hub/.env.example`:

```env
VITE_API_URL=http://localhost:8000
VITE_API_TIMEOUT=30000
```

### Step 3: Update vercel.json

The current `vercel.json` at the root only handles the frontend. It's correctly configured for Vercel deployment.

**Current Configuration (ROOT/vercel.json):**
```json
{
  "version": 2,
  "builds": [
    {
      "src": "green-cycle-hub/package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

✅ This is good as-is for frontend-only deployment on Vercel.

### Step 4: Deploy Frontend to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from root directory:**
   ```bash
   cd c:\Users\HP\Desktop\smacom
   vercel --prod
   ```

   **Configuration prompt:**
   - **Project name:** `smacom`
   - **Root directory:** `green-cycle-hub`
   - **Build command:** `npm run build`
   - **Output directory:** `dist`
   - **Install command:** `npm install --legacy-peer-deps` (or `bun install` if using Bun)

4. **Set Environment Variables in Vercel Dashboard:**
   - Go to Project → Settings → Environment Variables
   - Add `VITE_API_URL` pointing to your backend API
   - Redeploy to apply changes

### Step 5: Configure CORS in Backend

Update your backend's CORS configuration to accept requests from your Vercel frontend:

**File:** `green-cycle-hub/backend/app/core/config.py`

Add your Vercel frontend URL:
```python
ALLOWED_ORIGINS = [
    "https://your-project.vercel.app",
    "https://www.your-domain.com",  # If using custom domain
    "http://localhost:3000",  # Development
    "http://localhost:5173",  # Vite dev
]
```

---

## Part 2: Backend Deployment (NOT on Vercel)

**⚠️ IMPORTANT:** Your FastAPI backend is **not suitable for Vercel's serverless environment** due to:
- WebSocket/MQTT requirements
- Long-running background tasks (APScheduler)
- 10-second timeout limit on Vercel Functions

### Recommended Backend Hosting Options

#### Option 1: Keep on Railway ✅ RECOMMENDED
- Already configured
- Supports Docker containers
- No timeout issues
- Supports MQTT/WebSockets

**No changes needed for backend on Railway.**

#### Option 2: Deploy to Render.com
1. Push code to GitHub
2. Create new Web Service on Render
3. Connect GitHub repository
4. Set Start Command: `uvicorn main:app --host 0.0.0.0 --port ${PORT}`
5. Add environment variables

#### Option 3: Deploy to Fly.io
1. Install `flyctl`
2. Run `flyctl launch` in backend directory
3. Configure `fly.toml`
4. Deploy with `flyctl deploy`

#### Option 4: AWS Elastic Beanstalk
1. Configure `.ebextensions`
2. Use Elastic Beanstalk CLI
3. Deploy with `eb deploy`

---

## Part 3: Communication Between Frontend & Backend

Once deployed:

1. **Frontend** is running on: `https://your-project.vercel.app`
2. **Backend** is running on: `https://your-backend-domain.com` (Railway/Render/Fly.io)

### Update API Configuration in Frontend

**File:** `green-cycle-hub/src/lib/api.ts`

Ensure it uses the environment variable:
```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000')
});
```

---

## Step-by-Step Deployment Checklist

### ✅ Frontend (Vercel)
- [ ] Verify `green-cycle-hub/package.json` exists
- [ ] Verify `green-cycle-hub/vite.config.ts` exists
- [ ] Create `green-cycle-hub/.env.production`
- [ ] Update `vercel.json` (or keep as-is if working)
- [ ] Commit and push to GitHub
- [ ] Deploy via Vercel CLI or GitHub integration
- [ ] Set `VITE_API_URL` in Vercel dashboard
- [ ] Test frontend deployment

### ✅ Backend (Railway/Render/Fly.io)
- [ ] Ensure backend API is deployed and running
- [ ] Update `ALLOWED_ORIGINS` to include Vercel URL
- [ ] Set environment variables in backend hosting platform
- [ ] Test backend API is accessible from frontend

### ✅ Integration
- [ ] Test API calls from frontend to backend
- [ ] Check browser console for CORS errors
- [ ] Test authentication flow
- [ ] Test MQTT connections (if applicable)
- [ ] Monitor error logs

---

## Environment Variables Reference

### Frontend (Vercel Environment Variables)
```
VITE_API_URL=https://api.yourdomain.com
VITE_API_TIMEOUT=30000
```

### Backend (Railway/Render/Fly.io Environment Variables)
```
ENVIRONMENT=production
SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
SUPABASE_ANON_KEY=...
JWT_SECRET=...
MQTT_BROKER_URL=...
MQTT_PORT=...
ALLOWED_ORIGINS=https://your-project.vercel.app,https://yourdomain.com
# ... other API keys and secrets
```

---

## Troubleshooting

### CORS Errors
- Update `ALLOWED_ORIGINS` in backend config
- Ensure backend URL is correct
- Verify backend is running

### API Not Found
- Check `VITE_API_URL` in frontend
- Verify backend deployment is active
- Check backend logs for errors

### Build Fails on Vercel
- Check `vercel.json` build settings
- Verify Node version compatibility
- Check build output in Vercel dashboard

### Frontend Can't Reach Backend
- Ensure both are deployed and running
- Check firewall/CORS settings
- Verify environment variables are set correctly

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [FastAPI Deployment](https://fastapi.tiangolo.com/deployment/)
- [Railway Docs](https://docs.railway.app)
- [Render Docs](https://render.com/docs)
- [Fly.io Docs](https://fly.io/docs)

