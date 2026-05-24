# ✅ SMACOM Vercel Deployment Checklist

## Pre-Deployment

- [ ] All code committed and pushed to GitHub
- [ ] `.env` files added to `.gitignore`
- [ ] Latest changes pulled locally
- [ ] Node.js installed (`node --version`)
- [ ] npm installed (`npm --version`)
- [ ] GitHub account linked to Vercel
- [ ] Have all secret keys ready (JWT, Supabase, etc.)

---

## Step 1: Install & Login to Vercel

- [ ] Open terminal/PowerShell
- [ ] Run: `npm install -g vercel`
- [ ] Wait for installation to complete
- [ ] Run: `vercel login`
- [ ] Follow browser login process
- [ ] Confirm logged in

---

## Step 2: Deploy Project

- [ ] Navigate to project root: `cd c:\Users\HP\Desktop\smacom`
- [ ] Run: `vercel --prod`
- [ ] When prompted for project name, enter: `smacom`
- [ ] When prompted for scope, use default
- [ ] When prompted for settings, confirm (accept defaults)
- [ ] Wait for build to complete (5-10 minutes)
- [ ] Note down the Vercel URL provided

**Your Vercel URL:** `https://__________________________.vercel.app`

---

## Step 3: Verify Build Success

- [ ] Check Vercel dashboard shows "Deployment Successful"
- [ ] Click on deployment to see logs
- [ ] Look for any errors in build logs
- [ ] If errors, check frontend build locally: `cd green-cycle-hub && npm run build`

---

## Step 4: Set Environment Variables

1. **Go to Vercel Dashboard**
   - [ ] Open https://vercel.com/dashboard
   - [ ] Click on your project `smacom`
   - [ ] Click "Settings" button

2. **Add Environment Variables**
   - [ ] Click "Environment Variables" in sidebar
   - [ ] Click "Add"

3. **Add Each Variable**

   **Authentication (Required):**
   - [ ] `JWT_SECRET` = `[strong-random-string]`
   - [ ] `GOOGLE_CLIENT_ID` = `[your-google-id]`
   - [ ] `GOOGLE_CLIENT_SECRET` = `[your-google-secret]`

   **Database (Required):**
   - [ ] `SUPABASE_URL` = `[your-supabase-url]`
   - [ ] `SUPABASE_SERVICE_ROLE_KEY` = `[your-service-key]`
   - [ ] `SUPABASE_ANON_KEY` = `[your-anon-key]`

   **Payment - M-Pesa:**
   - [ ] `MPESA_CONSUMER_KEY` = `[your-key]`
   - [ ] `MPESA_CONSUMER_SECRET` = `[your-secret]`
   - [ ] `MPESA_SHORTCODE` = `[your-code]`
   - [ ] `MPESA_PASSKEY` = `[your-pass]`
   - [ ] `MPESA_CALLBACK_URL` = `https://[your-url].vercel.app/api/v1/payments/mpesa/callback`

   **Payment - Flutterwave:**
   - [ ] `FLUTTERWAVE_PUBLIC_KEY` = `[your-key]`
   - [ ] `FLUTTERWAVE_SECRET_KEY` = `[your-secret]`
   - [ ] `FLUTTERWAVE_WEBHOOK_HASH` = `[your-hash]`

   **Email:**
   - [ ] `SENDGRID_API_KEY` = `[your-api-key]`
   - [ ] `SENDGRID_FROM_EMAIL` = `noreply@smacom.co.ke`

   **Environment:**
   - [ ] `ENVIRONMENT` = `production`
   - [ ] `FRONTEND_URL` = `https://[your-url].vercel.app`

---

## Step 5: Redeploy with Variables

- [ ] Return to Deployments page
- [ ] Click "Redeploy" button on latest deployment
- [ ] Or go to Settings → Git and push a new commit
- [ ] Wait for redeployment to complete

---

## Step 6: Test Frontend

- [ ] Open your Vercel URL in browser: `https://[your-url].vercel.app`
- [ ] Verify page loads (should see home page)
- [ ] Check page styling looks correct
- [ ] Open browser DevTools (F12) → Console
- [ ] Should see NO errors

---

## Step 7: Test Backend

- [ ] Open new browser tab
- [ ] Navigate to: `https://[your-url].vercel.app/health`
- [ ] Should see JSON: `{"status": "healthy", "environment": "production"}`
- [ ] If error, check Vercel deployment logs

---

## Step 8: Test API Integration

- [ ] Go back to main site
- [ ] Try to login (click Login button)
- [ ] Watch Network tab (DevTools → Network)
- [ ] Login request should go to `/api/v1/auth/login`
- [ ] Response should contain auth token

**If Network shows errors:**
- [ ] Check `/api/index.py` exists in root
- [ ] Verify all env vars are set
- [ ] Check backend logs in Vercel

---

## Step 9: Full Application Testing

### Homepage
- [ ] [ ] Loads without errors
- [ ] [ ] All images display
- [ ] [ ] Navigation works
- [ ] [ ] Responsive on mobile (check with F12)

### Authentication
- [ ] [ ] Can register new account
- [ ] [ ] Can login with email/password
- [ ] [ ] Can login with Google
- [ ] [ ] Can logout
- [ ] [ ] JWT token persists in localStorage

### Dashboard/Features
- [ ] [ ] Dashboard loads
- [ ] [ ] Can view marketplace items
- [ ] [ ] Can view user profile
- [ ] [ ] Can update settings
- [ ] [ ] All API calls succeed (check Network tab)

### API Endpoints (if developer)
- [ ] [ ] `/api/v1/auth/*` works
- [ ] [ ] `/api/v1/users/*` works
- [ ] [ ] `/api/v1/waste/*` works
- [ ] [ ] `/api/v1/marketplace/*` works
- [ ] [ ] Database queries return data

---

## Step 10: Monitor for Issues

### Vercel Dashboard
- [ ] [ ] Check Deployments page regularly
- [ ] [ ] Review build logs for warnings
- [ ] [ ] Monitor error rate (should be low)
- [ ] [ ] Check function duration (should be <1s for most)

### Browser Console
- [ ] [ ] No red error messages
- [ ] [ ] No CORS warnings
- [ ] [ ] No 404 errors for API calls

### Testing Real Features
- [ ] [ ] Try marketplace purchase (test mode)
- [ ] [ ] Try data export/reports
- [ ] [ ] Try sending notifications
- [ ] [ ] Check Supabase for data persistence

---

## Troubleshooting Steps

### If Frontend Doesn't Load
1. [ ] Check Vercel dashboard for build errors
2. [ ] Verify build completed successfully
3. [ ] Clear browser cache (Ctrl+Shift+Delete)
4. [ ] Try incognito mode
5. [ ] Check `/health` endpoint works

### If API Returns 404
1. [ ] Verify `/api/index.py` exists in root
2. [ ] Check all env vars are set
3. [ ] Click "Redeploy" in Vercel
4. [ ] Check Vercel function logs

### If Getting CORS Errors
1. [ ] Frontend API URL should be: `https://your-url.vercel.app`
2. [ ] Backend CORS is set to `["*"]` (allowing all origins)
3. [ ] Check console for actual error message
4. [ ] Network tab shows response details

### If Database Queries Fail
1. [ ] Verify `SUPABASE_URL` is correct
2. [ ] Verify `SUPABASE_SERVICE_ROLE_KEY` is correct
3. [ ] Check Supabase dashboard for data
4. [ ] Test query in Supabase SQL editor

### If Payments Don't Work
1. [ ] Verify keys are correct (test vs production)
2. [ ] Use test mode for initial testing
3. [ ] Check payment provider dashboard
4. [ ] Check error logs in Vercel

---

## Success Criteria

- [ ] Frontend loads without errors
- [ ] `/health` endpoint returns JSON
- [ ] Can login/register
- [ ] API calls succeed
- [ ] No CORS errors
- [ ] Database saves data
- [ ] No red errors in DevTools

---

## After Successful Deployment

1. **Share Your URL:**
   - [ ] Send to team: `https://your-url.vercel.app`
   - [ ] Get feedback from users
   - [ ] Test all features

2. **Set Up Custom Domain (Optional):**
   - [ ] Go to Vercel → Settings → Domains
   - [ ] Add your custom domain
   - [ ] Point DNS records to Vercel
   - [ ] Wait for SSL certificate

3. **Monitor Regularly:**
   - [ ] Check Vercel dashboard weekly
   - [ ] Monitor error rates
   - [ ] Check Supabase storage usage
   - [ ] Review function performance

4. **Plan Next Phase:**
   - [ ] When ready, move IoT to Railway
   - [ ] Add more features
   - [ ] Scale as needed

---

## Emergency Contacts

- **Vercel Support:** https://vercel.com/support
- **Supabase Docs:** https://supabase.com/docs
- **FastAPI Docs:** https://fastapi.tiangolo.com

---

## Quick Reference

| What | Where |
|------|-------|
| Your App | `https://[your-url].vercel.app` |
| Vercel Dashboard | `https://vercel.com/dashboard` |
| Deployments | Dashboard → Deployments |
| Environment Vars | Dashboard → Settings → Env Vars |
| Logs | Deployments → [Latest] → Logs |
| Domain Settings | Settings → Domains |

---

## Notes

**Space for notes:**
```
Project URL: _________________________________
Deployment Date: _________________________________
Key Issues: _________________________________
Customizations Made: _________________________________
```

---

## Important Reminders

⚠️ **DO NOT:**
- [ ] Commit `.env` files
- [ ] Share API keys publicly
- [ ] Use test keys in production
- [ ] Skip setting environment variables
- [ ] Use weak JWT_SECRET

✅ **DO:**
- [ ] Keep backups of env vars
- [ ] Monitor error rates
- [ ] Test thoroughly before launch
- [ ] Update docs with changes
- [ ] Keep Vercel and dependencies updated

---

**Status:** Ready to deploy ✅

**Estimated time:** 30-45 minutes total

**Questions?** See VERCEL_FULLSTACK_GUIDE.md
