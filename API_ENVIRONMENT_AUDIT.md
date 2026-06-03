# 🔍 SMACOM API Environment Configuration Audit

## ⚠️ CRITICAL FINDINGS

### ❌ **APIs NOT CONFIGURED ON VERCEL** (BLOCKING)

#### Authentication
- ❌ **JWT_SECRET** - NOT SET
- ❌ **GOOGLE_CLIENT_ID** - NOT SET  
- ❌ **GOOGLE_CLIENT_SECRET** - NOT SET

#### Database
- ❌ **SUPABASE_URL** - NOT SET
- ❌ **SUPABASE_SERVICE_ROLE_KEY** - NOT SET
- ❌ **SUPABASE_ANON_KEY** - NOT SET

**Impact**: User authentication, signup, and login will NOT work

---

## 🟡 ADDITIONAL APIs (Optional but Recommended)

### Email Service
- ❌ **SENDGRID_API_KEY** - NOT SET
- ❌ **SENDGRID_FROM_EMAIL** - NOT SET
**Impact**: Email notifications won't work

### Payment Services - M-Pesa
- ❌ **MPESA_CONSUMER_KEY** - NOT SET
- ❌ **MPESA_CONSUMER_SECRET** - NOT SET
- ❌ **MPESA_SHORTCODE** - NOT SET
- ❌ **MPESA_PASSKEY** - NOT SET
- ❌ **MPESA_CALLBACK_URL** - NOT SET
**Impact**: M-Pesa payments won't work

### Payment Services - Flutterwave
- ❌ **FLUTTERWAVE_SECRET_KEY** - NOT SET
- ❌ **FLUTTERWAVE_WEBHOOK_HASH** - NOT SET
**Impact**: Flutterwave payments won't work

### Firebase (Optional)
- ❌ **FIREBASE_CREDENTIALS_JSON** - NOT SET
**Impact**: Firebase features (if used) won't work

### IoT/MQTT
- ⚠️ **MQTT_* VARIABLES** - DISABLED (by design - pending Railway migration)
**Impact**: IoT features temporarily disabled on Vercel

---

## 📋 WHAT NEEDS TO BE DONE

### IMMEDIATE ACTION REQUIRED (For authentication to work)

1. **Go to Vercel Dashboard**
   - Project: smacom-project
   - Settings → Environment Variables

2. **Add these REQUIRED variables:**

```
JWT_SECRET = [Generate: openssl rand -base64 32]
SUPABASE_URL = https://[your-project].supabase.co
SUPABASE_ANON_KEY = [from Supabase project settings]
SUPABASE_SERVICE_ROLE_KEY = [from Supabase project settings - KEEP SECRET]
GOOGLE_CLIENT_ID = [from Google Cloud Console]
GOOGLE_CLIENT_SECRET = [from Google Cloud Console]
FRONTEND_URL = https://www.smacom.co.ke
ENVIRONMENT = production
```

3. **Add OPTIONAL variables** (for payments/email):

```
SENDGRID_API_KEY = [from SendGrid dashboard]
SENDGRID_FROM_EMAIL = noreply@smacom.co.ke
MPESA_CONSUMER_KEY = [from Safaricom developer portal]
MPESA_CONSUMER_SECRET = [from Safaricom]
MPESA_SHORTCODE = [Your M-Pesa shortcode]
MPESA_PASSKEY = [Your M-Pesa passkey]
FLUTTERWAVE_SECRET_KEY = [from Flutterwave dashboard]
FLUTTERWAVE_WEBHOOK_HASH = [from Flutterwave webhooks]
```

4. **Redeploy on Vercel**
   - Go to Deployments tab
   - Click ⋯ on latest deployment
   - Select "Redeploy"

---

## 🔧 How to Get Each API Credential

### Supabase (Database)
1. Go to supabase.com → Your Project
2. Settings → API
3. Copy:
   - Project URL → SUPABASE_URL
   - anon public key → SUPABASE_ANON_KEY
   - service_role secret key → SUPABASE_SERVICE_ROLE_KEY

### Google OAuth
1. Go to console.cloud.google.com
2. Create OAuth 2.0 Credentials (Web application)
3. Authorized redirect URIs: `https://www.smacom.co.ke`
4. Copy Client ID → GOOGLE_CLIENT_ID
5. Copy Client Secret → GOOGLE_CLIENT_SECRET

### SendGrid (Email)
1. Go to sendgrid.com → Settings → API Keys
2. Create new API key
3. Copy → SENDGRID_API_KEY

### M-Pesa (Payments)
1. Go to Safaricom developer portal
2. Get:
   - Consumer Key
   - Consumer Secret
   - Shortcode
   - Passkey (2024)

### Flutterwave (Payments)
1. Go to Flutterwave dashboard
2. Settings → API Keys
3. Copy Secret Key
4. Webhooks → Get webhook hash

---

## 📊 Current Vercel Status

### Frontend
✅ Built and deployed
✅ CSS/JS loading correctly

### Backend API
❌ **CANNOT AUTHENTICATE** - Missing required env vars
❌ **Health check will fail** - Missing Supabase config

### Database
❌ **NOT CONNECTED** - Supabase credentials missing

### Authentication
❌ **BROKEN** - JWT_SECRET not set
❌ **Google OAuth disabled** - Credentials missing

### Payments
❌ **DISABLED** - No payment credentials

### Email
❌ **DISABLED** - SendGrid not configured

---

## ✅ What's Working

- ✅ Frontend builds and deploys
- ✅ Frontend assets (CSS, JS, images) serving
- ✅ API routes registered
- ✅ Backend starts (but can't connect to external services)

---

## ❌ What's NOT Working

- ❌ User signup
- ❌ User login
- ❌ Google OAuth
- ❌ Email notifications
- ❌ Payments (M-Pesa, Flutterwave)
- ❌ Any database queries

---

## 🚀 NEXT STEPS

1. ✅ Authentication fixes deployed (Login, Register, OAuth) - DONE
2. ⏳ Set environment variables on Vercel - **YOU MUST DO THIS**
3. ⏳ Redeploy project
4. ⏳ Test all auth flows
5. ⏳ (Optional) Configure payment services
6. ⏳ (Optional) Configure email service

---

## 📞 Troubleshooting

### "Failed to fetch" errors on login/signup?
→ Check if Supabase credentials are set correctly

### Blank screen on Google OAuth?
→ Check if GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are set

### Email not sending?
→ Check if SENDGRID_API_KEY is set

### Payment errors?
→ Check if M-Pesa/Flutterwave credentials are set

