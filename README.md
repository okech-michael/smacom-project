# SMACOM - Waste-to-Wealth System

A comprehensive waste management and sustainable agriculture platform connecting waste producers, bio-processors, and farmers.

## 🚀 Quick Deploy to Vercel (Recommended)

**New:** Full-stack deployment now available on Vercel! Frontend + Backend on one platform.

```bash
npm install -g vercel
vercel login
vercel --prod
# Then set environment variables in Vercel Dashboard
```

👉 **[Read START_HERE.md for complete setup guide](START_HERE.md)**

---

## Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Backend**: FastAPI (Python)
- **Deployment**: Vercel (full-stack) or Railway (traditional)
- **Database**: Supabase (PostgreSQL)
- **Payments**: M-Pesa, Flutterwave
- **Notifications**: Firebase Cloud Messaging, SendGrid
- **IoT**: MQTT (currently disabled on Vercel, will be moved to Railway)

## Project Structure

```
.
├── api/                     # Backend serverless (Vercel)
│   └── index.py            # FastAPI entry point for Vercel
│
├── green-cycle-hub/         # Frontend (React + Vite)
│   ├── src/
│   ├── package.json
│   ├── vite.config.ts
│   ├── backend/            # Backend for local development
│   │   ├── main.py
│   │   ├── requirements.txt
│   │   └── app/
│   └── .env.example
│
├── vercel.json              # Vercel full-stack configuration
├── .env.production          # Production env template
├── .vercelignore            # Vercel build optimization
│
├── START_HERE.md            # 👈 Read this first!
├── VERCEL_QUICK_START.md    # 3-step deployment guide
├── DEPLOYMENT_CHECKLIST.md  # Detailed verification steps
└── VERCEL_FULLSTACK_GUIDE.md # Complete deployment guide
```

## Quick Start - Deployment

### Production Deployment (Vercel)

**Recommended for production use.** Full-stack on Vercel with auto-scaling.

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Login to Vercel
vercel login

# 3. Deploy from root directory
vercel --prod

# 4. Set environment variables in Vercel Dashboard
# (See START_HERE.md for which variables)

# 5. Done! Your app is live
```

**For complete instructions**, see [START_HERE.md](START_HERE.md)

### Local Development

For local development with Docker or running services independently:

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# Required: SUPABASE_*, JWT_SECRET
```

**Frontend only:**
```bash
cd green-cycle-hub
npm install --legacy-peer-deps
npm run dev
# Opens at http://localhost:5173
```

**Backend only:**
```bash
cd green-cycle-hub/backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python main.py
# API at http://localhost:8000
```

Access:
- **Frontend**: http://localhost (Nginx)
- **Backend API**: http://localhost/api/v1
- **MQTT**: localhost:1883

### 2. Local Frontend Development (without Docker)

```bash
cd green-cycle-hub

# Install dependencies
npm install --legacy-peer-deps

# Start dev server
npm run dev
# Opens at http://localhost:5173
```

### 3. Local Backend Development (without Docker)

```bash
cd green-cycle-hub/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows

# Install dependencies
pip install -r requirements.txt

# Run development server
python main.py
# API at http://localhost:8000
```

---

## 📋 Deployment Options

### Option 1: Vercel (Recommended) ✅
- **Full-stack:** Frontend + Backend on same platform
- **Scaling:** Auto-scale with traffic
- **Cost:** Free tier + $20/month for production
- **Setup time:** ~30 minutes
- **Limitation:** IoT/MQTT disabled (can be moved to Railway)

**[Follow START_HERE.md](START_HERE.md) for Vercel deployment**

### Option 2: Railway (Legacy)
- **Traditional:** Monolithic deployment
- **Services:** Frontend, Backend, MQTT, Database
- **Cost:** ~$10-20/month
- **Setup time:** ~1-2 hours
- **Files:** See RAILWAY_DEPLOYMENT.md

### Option 3: Docker Compose (Local)
- **Development:** Run entire stack locally
- **Services:** All included (frontend, backend, MQTT)
- **Cost:** Free (hardware only)

```bash
docker-compose up --build
```

---

## ✨ Features

### ✅ Fully Working
- React frontend with responsive UI
- FastAPI backend with 11 API modules
- User authentication (JWT + Google OAuth)
- Supabase database integration
- Payment processing (M-Pesa, Flutterwave)
- Email notifications (SendGrid)
- Admin panel and dashboards
- Marketplace functionality
- Learning center & courses
- Reports & analytics
- Waste management module
- Processor & farmer modules
- Notifications system

### ⏸️ Currently Disabled (Temporary)
- IoT sensors & real-time data
- MQTT messaging (will move to Railway when budget allows)
- Scheduled background tasks

---

## 📚 Documentation

- **[START_HERE.md](START_HERE.md)** - Begin here! 5-minute overview
- **[VERCEL_QUICK_START.md](VERCEL_QUICK_START.md)** - 3-step deployment
- **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Detailed verification
- **[VERCEL_FULLSTACK_GUIDE.md](VERCEL_FULLSTACK_GUIDE.md)** - Complete guide (30+ pages)
- **[VERCEL_CONFIG_SUMMARY.md](VERCEL_CONFIG_SUMMARY.md)** - Configuration overview
- **[RAILWAY_DEPLOYMENT.md](RAILWAY_DEPLOYMENT.md)** - Legacy Railway setup

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
# Essential
ENVIRONMENT=development          # or 'production'
SUPABASE_URL=<your_url>
SUPABASE_SERVICE_ROLE_KEY=<key>
SUPABASE_ANON_KEY=<key>
JWT_SECRET=<secure_random_string>

# Optional - Payment Services
MPESA_CONSUMER_KEY=
MPESA_CONSUMER_SECRET=
FLUTTERWAVE_SECRET_KEY=

# Optional - Notifications
SENDGRID_API_KEY=
FIREBASE_CREDENTIALS_JSON=

# Optional - IoT
MQTT_BROKER_HOST=mqtt
MQTT_BROKER_PORT=1883
```

## Deployment - Railway

This project is fully configured for Railway deployment with both frontend and backend in one project.

### One-Click Deployment

1. Go to [railway.app](https://railway.app)
2. Create new project → Deploy from GitHub repo
3. Select `smacom` repository
4. Add environment variables from `.env.example`
5. Deploy!

**For detailed instructions**, see [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

### Production Access

Once deployed on Railway:
- Your app runs at `https://smacom-xxxxx.up.railway.app`
- Frontend served by Nginx on port 80
- Backend APIs at `/api/v1/*`
- MQTT broker running internally

## API Documentation

Once the backend is running, visit:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### Key Endpoints

```
POST   /api/v1/auth/signup           - User registration
POST   /api/v1/auth/login            - User login
GET    /api/v1/users/me              - Current user
GET    /api/v1/health                - Health check

POST   /api/v1/waste/report          - Report waste
GET    /api/v1/marketplace/products  - Browse marketplace
POST   /api/v1/payments/mpesa        - M-Pesa payment
GET    /api/v1/iot/sensors           - IoT sensor data
```

See backend `/docs` endpoint for full API specification.

## Features

### User Management
- Multi-role authentication (waste producer, processor, farmer, admin)
- User profiles and organization management

### Waste Management  
- Waste collection and scheduling
- Waste-to-wealth conversion tracking

### IoT Integration
- Real-time sensor monitoring via MQTT
- Environmental data collection

### Learning Platform
- Educational courses on waste management
- Certificates upon completion

### Marketplace
- Buy/sell waste products and materials
- Commission tracking

### Payments
- M-Pesa integration
- Flutterwave (multiple currencies)
- Payment history and reconciliation

### Notifications
- Firebase Cloud Messaging
- Email notifications via SendGrid
- Real-time alerts

## Development

### Running Tests

```bash
# Frontend tests
cd green-cycle-hub
npm run test
npm run test:watch

# Backend tests
cd green-cycle-hub/backend
pytest
```

### Code Style

- **Frontend**: ESLint configured in `eslint.config.js`
- **Backend**: PEP 8 compliant Python code

### Building

```bash
# Frontend production build
cd green-cycle-hub
npm run build      # Output: dist/

# Backend doesn't need building (Python)
```

## Troubleshooting

### Docker Issues
```bash
# Clean up containers
docker-compose down -v

# Rebuild
docker-compose up --build

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

### MQTT Connection Failed
- Ensure `mqtt` service is running: `docker-compose ps`
- Check `MQTT_BROKER_HOST=mqtt` in environment

### Backend API Not Responding
- Check backend is healthy: `curl http://localhost:8000/health`
- View logs: `docker-compose logs backend`
- Verify Supabase credentials in `.env`

### Frontend Can't Reach Backend
- In Docker: backend should be at `http://backend:8000`
- Locally: backend should be at `http://localhost:8000`
- Check nginx proxy config: `green-cycle-hub/nginx.conf`

## Contributing

1. Create a feature branch
2. Make your changes
3. Test locally with Docker Compose
4. Push to GitHub
5. Create a Pull Request

## License

[Your License Here]

## Support

For deployment help, see [RAILWAY_DEPLOYMENT.md](./RAILWAY_DEPLOYMENT.md)

For issues, open a GitHub issue with:
- Steps to reproduce
- Expected vs actual behavior
- Environment info (Docker/local, OS, etc.)

4. Open the frontend at `http://localhost:4173`.

## Production Notes

- The backend container exposes port `8000` and runs Uvicorn.
- The frontend container serves the built app over Nginx.
- `green-cycle-hub/nginx.conf` proxies `/api/` requests to the backend service.
- For production deployments, set `ALLOWED_ORIGINS` explicitly in your backend environment.

## Manual Build Commands

### Backend

```powershell
cd smacom-backend
python -m pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Frontend

```powershell
cd green-cycle-hub
npm ci
npm run build
```

## Notes

- Ensure `smacom-backend/.env` is present before starting the backend.
- If you deploy frontend and backend separately, point the frontend API requests to your backend URL and update `ALLOWED_ORIGINS` accordingly.
