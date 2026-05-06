# SMACOM Deployment Guide

This repository contains two applications:

- `green-cycle-hub/` — React + Vite frontend
- `smacom-backend/` — FastAPI backend

## Prepared Hosting Setup

### Backend

The backend now includes:

- `smacom-backend/Dockerfile` — production-ready FastAPI container
- `smacom-backend/.dockerignore`
- `smacom-backend/.env.example` — template for required environment variables
- `smacom-backend/app/core/config.py` — added `allowed_origins` and `debug` settings for proper runtime configuration

### Frontend

The frontend now includes:

- `green-cycle-hub/Dockerfile` — builds the Vite app and serves it with Nginx
- `green-cycle-hub/.dockerignore`
- `green-cycle-hub/nginx.conf` — SPA-friendly Nginx config with `/api/` proxy support

### Combined Local Deployment

A root-level `docker-compose.yml` has been added to launch both services together:

- frontend on `http://localhost:4173`
- backend on `http://localhost:8000`

## Getting Started Locally

1. Copy the backend environment template:

```powershell
cd smacom-backend
copy .env.example .env
```

2. Populate `.env` with your Supabase, payment, and notification settings.

3. From the repository root, start both services:

```powershell
docker compose up --build
```

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
