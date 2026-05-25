# 🚀 SMACOM - Vercel Deployment Instructions

## ✅ Issue Fixed

The error `Environment Variable "JWT_SECRET" references Secret "JWT_SECRET", which does not exist` has been resolved by removing the hardcoded secret references from `vercel.json`.

## 🔧 What Changed

- Removed `env` section from `vercel.json` that was trying to reference non-existent secrets
- Environment variables must now be set manually in the Vercel Dashboard
- This is the **recommended approach** for production deployments

## 📋 Next Steps - Deploy on Vercel

### Step 1: Connect Repository to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click **"Add New"** → **"Project"**
3. Select **"Import Git Repository"**
4. Search for `okech-michael/smacom-project` and click **Import**
5. Framework: Select **"Other"** (for full-stack)
6. Click **"Deploy"** (first deploy will build successfully without secrets)

### Step 2: Set Environment Variables in Vercel Dashboard

After the initial deployment, go to **Settings** → **Environment Variables** and add:

#### Required (Critical - Must Set)

```
JWT_SECRET = [Generate a strong random string - use: openssl rand -base64 32]
SUPABASE_URL = [Your Supabase project URL]
SUPABASE_SERVICE_ROLE_KEY = [Your Supabase service role key]
SUPABASE_ANON_KEY = [Your Supabase anon key]
```

#### Payment Services

```
MPESA_CONSUMER_KEY = [Your M-Pesa Consumer Key]
MPESA_CONSUMER_SECRET = [Your M-Pesa Consumer Secret]
MPESA_SHORTCODE = [Your M-Pesa Shortcode]
MPESA_PASSKEY = [Your M-Pesa Passkey]
FLUTTERWAVE_SECRET_KEY = [Your Flutterwave Secret Key]
FLUTTERWAVE_WEBHOOK_HASH = [Your Webhook Hash]
```

#### Email Service

```
SENDGRID_API_KEY = [Your SendGrid API Key]
SENDGRID_FROM_EMAIL = noreply@smacom.co.ke
```

#### Authentication (Optional but Recommended)

```
GOOGLE_CLIENT_ID = [Your Google OAuth Client ID]
GOOGLE_CLIENT_SECRET = [Your Google OAuth Client Secret]
```

#### Application Settings

```
ENVIRONMENT = production
FRONTEND_URL = https://[your-vercel-app].vercel.app
```

### Step 3: Generate JWT_SECRET

Run this command in PowerShell or terminal to generate a secure JWT_SECRET:

**Windows PowerShell:**
```powershell
[Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(32))
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

### Step 4: Redeploy on Vercel

1. After adding all environment variables, go to **Deployments** tab
2. Click the three dots on your latest deployment
3. Select **"Redeploy"**
4. Wait for deployment to complete

### Step 5: Test Your Deployment

1. Visit `https://[your-project].vercel.app`
2. Check backend health: `https://[your-project].vercel.app/api/v1/health`
3. View API docs: `https://[your-project].vercel.app/docs`

## 🐛 Troubleshooting

### Still Seeing JWT_SECRET Error?

**Solution:** 
- Make sure you clicked **"Redeploy"** after adding environment variables
- Check that `JWT_SECRET` is set to a non-empty value
- Wait 2-3 minutes for Vercel to propagate the changes

### Build Failing?

**Check:**
1. All environment variables are set
2. No `.env` file is committed (should be in `.gitignore`)
3. Vercel logs for specific error messages

### Frontend Not Loading?

1. Update `VITE_API_URL` in Vercel environment variables to point to your Vercel app
2. Set it to: `https://[your-project].vercel.app`
3. Redeploy

## 📚 Key Resources

- [Vercel Environment Variables Docs](https://vercel.com/docs/projects/environment-variables)
- [SMACOM Backend API Docs](https://[your-project].vercel.app/docs)
- [Supabase Project Dashboard](https://app.supabase.com)

## ✨ Local Development

To test locally before deploying:

```bash
# Install dependencies
cd green-cycle-hub
npm install --legacy-peer-deps

# Create .env file (copy from .env.example)
cp .env.example .env

# Run frontend
npm run dev

# In another terminal, run backend
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
```

## 🎉 Success!

Once deployed and tested, your SMACOM application is live on Vercel! 

The application includes:
- ✅ React Frontend (Vite)
- ✅ FastAPI Backend
- ✅ Supabase Database
- ✅ Payment Integration (M-Pesa, Flutterwave)
- ✅ Email Notifications (SendGrid)

---

**Questions?** Check the other deployment guides:
- `VERCEL_FULLSTACK_GUIDE.md` - Comprehensive guide
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
- `VERCEL_QUICK_START.md` - Quick reference
