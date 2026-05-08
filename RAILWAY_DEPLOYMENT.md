# Railway Deployment Guide

This project is set up for full-stack deployment on Railway with both frontend and backend running as Docker containers.

## What's Deployed

- **Frontend**: React + TypeScript application served via Nginx
- **Backend**: FastAPI Python application with all APIs
- **MQTT Broker**: Eclipse Mosquitto for IoT real-time communication
- **Database**: Connected via Supabase

## Deployment Steps

### 1. Push to GitHub

Make sure your repository is pushed to GitHub (both frontend and backend in the root directory).

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

### 2. Create Railway Project

1. Go to [railway.app](https://railway.app)
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `smacom` repository
5. Select the root directory (or let it auto-detect)

### 3. Configure Environment Variables

In the Railway dashboard:

1. Go to your project → Variables
2. Add all variables from `.env.example`:

**Critical Variables:**
```
ENVIRONMENT=production
SUPABASE_URL=<your_supabase_url>
SUPABASE_SERVICE_ROLE_KEY=<your_key>
SUPABASE_ANON_KEY=<your_key>
JWT_SECRET=<generate_a_secure_key>
MQTT_BROKER_HOST=mqtt
```

**Payment Services (if using):**
- `MPESA_CONSUMER_KEY`
- `MPESA_CONSUMER_SECRET`
- `MPESA_SHORTCODE`
- `MPESA_PASSKEY`
- `MPESA_CALLBACK_URL`
- `FLUTTERWAVE_SECRET_KEY`
- `FLUTTERWAVE_WEBHOOK_HASH`

**Email Service:**
- `SENDGRID_API_KEY`
- `SENDGRID_FROM_EMAIL`

**Firebase (optional):**
- `FIREBASE_CREDENTIALS_JSON`

### 4. Configure Railway Settings

In your project settings:

**Build Command:** (Usually auto-detected)
```
# Railway should auto-detect docker-compose.yml
```

**Start Command:** (Usually auto-detected)
```
# For docker-compose, Railway handles this
```

### 5. Deploy

1. Click "Deploy" on the Railway dashboard
2. Monitor the build logs for any errors
3. Once deployed, you'll get a public URL like: `https://smacom-xxxxx.up.railway.app`

## How It Works

### Architecture

```
┌─────────────────────────────────────┐
│     Browser / Client                 │
└──────────────────┬──────────────────┘
                   │
                   ▼
┌─────────────────────────────────────┐
│  Nginx (Port 80)                    │
│  - Serves React frontend (/)         │
│  - Proxies /api/* to backend:8000   │
└──────────────┬──────────────────────┘
               │
       ┌───────┴────────┐
       ▼                ▼
┌─────────────┐  ┌──────────────┐
│  Backend    │  │ MQTT Broker  │
│  FastAPI    │  │ (1883)       │
│  (8000)     │  │              │
└─────────────┘  └──────────────┘
       │
       ▼
┌─────────────────────────────────────┐
│     External Services               │
│ - Supabase (Database)               │
│ - Firebase (Notifications)          │
│ - Flutterwave / M-Pesa (Payments)  │
└─────────────────────────────────────┘
```

### Communication Flow

1. **Frontend** → Makes API calls to `/api/v1/*` (relative path)
2. **Nginx** → Proxies these requests to `http://backend:8000/api/v1/*`
3. **Backend** → Handles API requests, connects to external services
4. **MQTT** → IoT devices connect to the MQTT broker for real-time updates

## Troubleshooting

### 403 Forbidden Error

If you see a 403 Forbidden error:

1. **Check backend is running**: Visit `https://your-app.up.railway.app/api/v1/health` in your browser
2. **Check CORS**: Verify `ALLOWED_ORIGINS` environment variable is set
3. **Check logs**: View Railway deployment logs for errors

### Backend Not Responding

1. View logs in Railway dashboard
2. Check if all environment variables are set
3. Check Supabase credentials are correct
4. Verify MQTT_BROKER_HOST is set to `mqtt`

### MQTT Connection Issues

1. Ensure `MQTT_BROKER_HOST=mqtt` (use the service name)
2. Check credentials if using authentication
3. View MQTT logs in Railway dashboard

## Local Testing

To test locally before deploying:

```bash
# Build and run
docker-compose up --build

# Frontend: http://localhost
# Backend API: http://localhost/api/v1/*
# MQTT: localhost:1883

# Stop
docker-compose down
```

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `ENVIRONMENT` | Deployment environment | `production` or `development` |
| `DEBUG` | Enable debug mode | `false` |
| `SUPABASE_URL` | Database URL | `https://xxx.supabase.co` |
| `SUPABASE_SERVICE_ROLE_KEY` | Database admin key | Sensitive - don't share |
| `JWT_SECRET` | Token signing secret | Long random string |
| `MQTT_BROKER_HOST` | MQTT server address | `mqtt` (service name in Docker) |
| `ALLOWED_ORIGINS` | CORS allowed domains | `*` or specific domains |

## Performance Notes

- **First deploy**: May take 5-10 minutes for initial build
- **Cold starts**: Minimal since all services run continuously
- **MQTT**: Persistent connection for IoT real-time updates
- **Database**: All traffic goes through Supabase

## Monitoring

In Railway dashboard:

1. **Logs**: Real-time application logs
2. **Metrics**: CPU, memory, disk usage
3. **Deployments**: History of all deployments
4. **Environment**: Current environment variables (hidden for security)

## Next Steps

1. Set up custom domain (Railway → Settings → Domains)
2. Enable auto-deploys from GitHub (Railway → Settings → GitHub)
3. Set up monitoring alerts for errors
4. Configure backup strategy for MQTT data if needed

## Support

For Railway-specific help: [Railway Docs](https://docs.railway.app)
For your application issues: Check the backend logs in Railway dashboard
