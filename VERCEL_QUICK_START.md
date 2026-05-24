# SMACOM - Vercel Full-Stack Deployment - Quick Start

## 🎯 What Changed

Your project is now configured for **Vercel-only hosting** (full-stack):
- ✅ Frontend (React) + Backend (FastAPI) both on Vercel
- ✅ Same domain: `https://your-project.vercel.app`
- ✅ All services in one place
- ⏸️ IoT/MQTT features temporarily disabled

## 📁 Key Files Updated

```
✅ vercel.json              - Full-stack configuration
✅ api/index.py            - Backend serverless entry point
✅ requirements.txt        - Removed MQTT dependencies
✅ main.py                 - IoT disabled
✅ app/core/config.py      - MQTT settings removed
✅ .vercelignore           - Build optimization
✅ .env.example            - Updated
✅ .env.production         - Production template
```

## 🚀 Deploy in 3 Steps

### Step 1: Install & Login
```bash
npm install -g vercel
vercel login
```

### Step 2: Deploy
```bash
cd c:\Users\HP\Desktop\smacom
vercel --prod
```

### Step 3: Set Environment Variables
1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Select your project → Settings → Environment Variables
3. Add all your secrets (JWT_SECRET, SUPABASE keys, etc.)
4. Click "Redeploy" button

**That's it!** Your app is live at `https://your-project.vercel.app`

## 📋 Environment Variables to Set (Critical)

These MUST be set in Vercel dashboard:

```env
JWT_SECRET=strong-random-string
SUPABASE_URL=your-supabase-url
SUPABASE_SERVICE_ROLE_KEY=your-key
SUPABASE_ANON_KEY=your-key
MPESA_CONSUMER_KEY=your-key
MPESA_CONSUMER_SECRET=your-secret
MPESA_SHORTCODE=your-code
MPESA_PASSKEY=your-pass
FLUTTERWAVE_PUBLIC_KEY=your-key
FLUTTERWAVE_SECRET_KEY=your-key
SENDGRID_API_KEY=your-key
SENDGRID_FROM_EMAIL=noreply@smacom.co.ke
GOOGLE_CLIENT_ID=your-id
GOOGLE_CLIENT_SECRET=your-secret
```

## ✅ Verify Deployment Works

1. **Open your site:**
   - `https://your-project.vercel.app` (should load frontend)
   - `https://your-project.vercel.app/health` (should return `{"status": "healthy"}`)

2. **Test in browser:**
   - Open DevTools → Console
   - Should see no CORS errors
   - API calls should work

3. **Check logs:**
   - Vercel Dashboard → Deployments
   - Click latest deployment → Logs
   - Look for any errors

## 🔄 Update Cycle (Future Pushes)

1. Make code changes
2. Commit: `git add . && git commit -m "Update description"`
3. Push: `git push origin main`
4. Vercel auto-deploys (if using GitHub integration)

OR manually: `vercel --prod`

## ⚠️ Important Notes

### IoT/MQTT Features
- Currently **DISABLED**
- Will be re-enabled on Railway when you have budget
- See VERCEL_FULLSTACK_GUIDE.md for migration plan

### Environment Variables
- Never commit `.env` or `.env.production` files
- Always set in Vercel dashboard, not locally
- Use `.env.example` as template

### Database
- Supabase handles all data persistence
- Vercel serverless functions are stateless
- No need for additional database configuration

### Performance
- First request may be slow (cold start)
- Upgrade to Vercel Pro for faster cold starts
- Subsequent requests are fast

## 📖 Full Documentation

See **VERCEL_FULLSTACK_GUIDE.md** for:
- Detailed deployment steps
- Troubleshooting guide
- Environment variable reference
- How to migrate IoT to Railway later
- Architecture explanation
- Local development setup

## 🆘 Need Help?

### Common Issues

**"Build failed"**
- Check Vercel build logs
- Ensure Node packages install: `npm install --legacy-peer-deps`

**"API endpoints not working"**
- Verify `/api/index.py` exists in root
- Check environment variables are set
- Restart deployment after setting vars

**"CORS errors in console"**
- Backend allows all origins (`["*"]`)
- Check API URL matches your domain
- Verify backend is responding

**"Frontend loads but API doesn't"**
- Run: `curl https://your-project.vercel.app/health`
- Should return JSON response
- If error, check Vercel backend logs

### For Detailed Help
See **VERCEL_FULLSTACK_GUIDE.md** → "Troubleshooting" section

## 📞 Deployment Checklist

- [ ] GitHub repo pushed with all changes
- [ ] `.env` files in `.gitignore`
- [ ] Vercel CLI installed
- [ ] Vercel CLI logged in
- [ ] Ran `vercel --prod`
- [ ] Noted your Vercel URL
- [ ] Set environment variables in Vercel dashboard
- [ ] Clicked "Redeploy" in Vercel
- [ ] Tested frontend loads
- [ ] Tested `/health` endpoint returns JSON
- [ ] Tested API calls from frontend
- [ ] Checked browser console for errors
- [ ] Checked Vercel deployment logs

## 🎉 You're Ready!

Your SMACOM app is now ready for Vercel deployment!

**Frontend + Backend:** `https://your-project.vercel.app`

---

### Next Steps
1. Follow the 3-step deployment above
2. Set environment variables
3. Test your application
4. Monitor Vercel dashboard for issues
5. When ready for IoT: See VERCEL_FULLSTACK_GUIDE.md for Railway migration

**Good luck!** 🚀
