# SMACOM Vercel Deployment Guide (Full-Stack)

Complete guide for deploying SMACOM to Vercel as a full-stack application.

## ⚠️ Important: IoT/MQTT Features Disabled

**Temporary Status:** IoT and MQTT features are temporarily disabled on this Vercel deployment.
- ✅ All other features work normally
- ⏸️ IoT sensors/real-time data: DISABLED
- 📅 Will be re-enabled on Railway when budget allows

## 🏗️ Architecture

```
┌─────────────────────────────────────┐
│      VERCEL DEPLOYMENT              │
├─────────────────────────────────────┤
│                                     │
│  ┌──────────────────────────────┐   │
│  │  Frontend (React + Vite)     │   │
│  │  └─ Deployed at /            │   │
│  └──────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │  Backend (FastAPI)           │   │
│  │  └─ Deployed at /api/*       │   │
│  │  └─ Serverless Functions     │   │
│  └──────────────────────────────┘   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │  Database (Supabase)         │   │
│  └──────────────────────────────┘   │
│                                     │
└─────────────────────────────────────┘
```

## 📋 Project Structure

```
smacom/
├── vercel.json              ← Full-stack configuration
├── api/
│   └── index.py            ← Backend serverless entry point
├── green-cycle-hub/
│   ├── package.json        ← Frontend dependencies
│   ├── src/                ← React source
│   ├── vite.config.ts      ← Build configuration
│   ├── dist/               ← Built frontend (generated)
│   └── backend/
│       ├── main.py         ← Backend app (local development)
│       ├── requirements.txt ← Python dependencies
│       ├── app/            ← API modules
│       └── .env.production ← Production config template
├── .env.production         ← Production environment variables
└── .vercelignore           ← Build optimization
```

## 🚀 Deployment Steps

### Step 1: Prepare Your Repository

1. **Commit all changes:**
   ```bash
   git add .
   git commit -m "Prepare for Vercel full-stack deployment"
   git push origin main
   ```

2. **Ensure `.env` and `.env.production` are in `.gitignore`:**
   ```bash
   echo ".env" >> .gitignore
   echo ".env.production" >> .gitignore
   git add .gitignore
   git commit -m "Add env files to gitignore"
   git push
   ```

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd c:\Users\HP\Desktop\smacom
   vercel --prod
   ```

4. **Follow prompts:**
   - Project name: `smacom` (or your choice)
   - Root directory: `./` (use root - not green-cycle-hub)
   - Build command: Default (Vercel will auto-detect)
   - Output directory: Leave empty (auto-detected)

#### Option B: Using GitHub Integration (Recommended for CI/CD)

1. **Go to [vercel.com](https://vercel.com/dashboard)**
2. **Click "Add New" → "Project"**
3. **Import your GitHub repository**
4. **Configure:**
   - Root directory: `./` (keep as root)
   - Build command: Leave as default
   - Environment variables: Add from Step 3 below
5. **Click "Deploy"**

### Step 3: Configure Environment Variables

In Vercel Dashboard → Project → Settings → Environment Variables

Add these variables from your `.env`:

**Required (Change these!):**
- `JWT_SECRET` - Strong random string
- `SUPABASE_URL` - Your Supabase URL
- `SUPABASE_SERVICE_ROLE_KEY` - Your service role key
- `SUPABASE_ANON_KEY` - Your anon key

**Payment Services:**
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`
- `MPESA_CALLBACK_URL`

**Flutterwave (if using):**
- `FLUTTERWAVE_PUBLIC_KEY`
- `FLUTTERWAVE_SECRET_KEY`
- `FLUTTERWAVE_WEBHOOK_HASH`

**Email:**
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`

**Authentication:**
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`

**Application:**
- `ENVIRONMENT=production`
- `FRONTEND_URL=https://your-project.vercel.app`

### Step 4: Redeploy

After setting environment variables, redeploy:

1. Go to Vercel Dashboard
2. Select your project
3. Click "Redeploy"

## ✅ Post-Deployment Verification

### Test Frontend
- [ ] Website loads at `https://your-project.vercel.app`
- [ ] All pages render correctly
- [ ] CSS/styling loads properly
- [ ] Images display

### Test Backend
- [ ] `/health` endpoint returns `{"status": "healthy"}`
- [ ] API endpoints work (test with frontend)
- [ ] Authentication works (login/register)
- [ ] Database queries work

### Test Integration
- [ ] Frontend can reach backend API
- [ ] No CORS errors in browser console
- [ ] API responses are correct
- [ ] User data persists

### Check Logs
1. In Vercel Dashboard → Deployments
2. Click latest deployment
3. Check "Logs" for any errors

## 🔑 Environment Variables Reference

### Frontend Variables (Used in React)
These are available in React as `import.meta.env.VITE_*`

```env
VITE_API_URL=https://your-project.vercel.app
VITE_API_TIMEOUT=30000
```

### Backend Variables (Python)
These are read by FastAPI from environment

```env
ENVIRONMENT=production
JWT_SECRET=your-secret
SUPABASE_URL=your-url
SUPABASE_SERVICE_ROLE_KEY=your-key
SUPABASE_ANON_KEY=your-key
MPESA_CONSUMER_KEY=your-key
MPESA_CONSUMER_SECRET=your-secret
# ... other payment/email keys
```

## 🛠️ Development vs Production

### Local Development
```bash
cd green-cycle-hub
npm run dev          # Frontend dev server

# In another terminal
cd backend
python -m pip install -r requirements.txt
python main.py       # Backend dev server
```

Frontend: `http://localhost:5173`
Backend: `http://localhost:8000`

### Production (Vercel)
Frontend: `https://your-project.vercel.app`
Backend: `https://your-project.vercel.app/api/*`

## 📱 Frontend API Configuration

The frontend is configured to use environment variable `VITE_API_URL`.

**Development:** `http://localhost:8000`
**Production:** `https://your-project.vercel.app` (same domain)

File: `green-cycle-hub/src/lib/api.ts`

```typescript
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: `${API_URL}/api/v1`,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '30000')
});
```

## 🚨 Troubleshooting

### Build Fails
**Error:** `npm ERR! peer dep missing`
**Solution:** Add `--legacy-peer-deps` to build command
```json
{
  "buildCommand": "cd green-cycle-hub && npm install --legacy-peer-deps && npm run build"
}
```

### "Cannot GET /api/*"
**Error:** Backend routes not working
**Solution:** 
1. Check `/api/index.py` exists in root
2. Verify `vercel.json` routes section
3. Check environment variables are set

### CORS/API Errors
**Error:** "Access to XMLHttpRequest blocked by CORS"
**Solution:**
1. Backend CORS is set to `["*"]`
2. Ensure API URL in frontend is correct
3. Check Vercel logs for backend errors

### "No module named 'app'"
**Error:** Python import error in backend
**Solution:**
1. Verify `app/` directory structure
2. Ensure `__init__.py` files exist
3. Check `requirements.txt` has all dependencies

### Slow Initial Load
**Cause:** Cold start on serverless functions
**Solution:** This is normal. Use Vercel Pro for faster cold starts.

## 🔄 Future: Moving IoT to Railway

When you're ready to re-enable IoT features:

1. **Deploy backend to Railway:**
   ```bash
   # Create railway.toml in green-cycle-hub/backend
   # Configure for persistent services
   ```

2. **Update MQTT in config:**
   ```python
   mqtt_enabled = True
   mqtt_broker_host = "your-railway-mqtt-broker"
   ```

3. **Update frontend API:**
   ```env
   VITE_API_URL=https://your-railway-backend.up.railway.app
   ```

4. **Re-enable in main.py:**
   ```python
   app.include_router(iot.router, prefix="/api/v1/iot")
   ```

5. **Update requirements.txt:**
   ```
   paho-mqtt
   aiomqtt
   apscheduler
   ```

## 📚 Resources

- [Vercel Python Support](https://vercel.com/docs/functions/serverless-functions/python)
- [FastAPI on Vercel](https://fastapi.tiangolo.com/deployment/concepts/)
- [Vercel Environment Variables](https://vercel.com/docs/environment-variables)
- [Supabase Documentation](https://supabase.com/docs)

## 📞 Quick Checklist

- [ ] Repository pushed to GitHub
- [ ] `.env` and `.env.production` in `.gitignore`
- [ ] Vercel CLI installed (`npm install -g vercel`)
- [ ] Logged in to Vercel (`vercel login`)
- [ ] Deployed project (`vercel --prod`)
- [ ] Environment variables set in Vercel dashboard
- [ ] Project redeployed after env vars
- [ ] Frontend loads and works
- [ ] Backend API endpoints respond
- [ ] Frontend ↔ Backend communication works
- [ ] Database queries work
- [ ] Authentication flows work

## ✨ Success!

Your SMACOM application is now deployed on Vercel:
- **Frontend:** `https://your-project.vercel.app`
- **Backend API:** `https://your-project.vercel.app/api/v1/*`
- **Database:** Supabase (managed separately)

**Next Steps:**
1. Monitor deployments in Vercel dashboard
2. Check error logs regularly
3. Update environment variables as needed
4. When ready, move IoT to Railway following the guide above

---

**Note:** This is a temporary configuration. When budget allows, move the backend to Railway to enable persistent connections and real-time IoT features.
