# SMACOM - Waste to Wealth

This repository contains a full-stack SMACom project with:

- `src/` — React frontend built with Vite
- `backend/` — Express + Prisma backend API
- Vercel deployment support via `vercel.json`

## Local Development

### 1. Install dependencies

From the root:

```bash
npm install
```

Then install backend dependencies:

```bash
cd backend
npm install
cd ..
```

### 2. Configure environment variables

Create a root frontend `.env` file from `.env.example`:

```bash
copy .env.example .env
```

Create the backend `.env` file from `backend/.env.example`:

```bash
cd backend
copy .env.example .env
```

Then update `backend/.env` with your local PostgreSQL, JWT, and storage keys.

### 3. Start the backend server

From `backend/`:

```bash
npm run dev
```

This starts the backend on port `4000`.

If you want to confirm the backend endpoints and upload flow locally, run the smoke test from `backend/`:

```bash
npm run smoke-test
```

### 4. Start the frontend app

From the project root:

```bash
npm run dev
```

The Vite dev server proxies `/api` to `http://localhost:4000`.

## Vercel Deployment

This repo is configured for Vercel with `vercel.json`.

### Production settings

- Frontend static site is built from the root with `npm run build`
- Backend is served as a Vercel serverless function from `backend/api/index.js`
- API requests from the frontend are routed to `/api`

### Required Vercel environment variables

Set these in your Vercel project:

- `DATABASE_URL`
- `JWT_SECRET`
- `JWT_EXPIRES_IN=7d`
- `AWS_BUCKET`
- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `CLOUDINARY_URL` (optional if using Cloudinary)
- `OPENAI_API_KEY`
- `SENDGRID_API_KEY`
- `EMAIL_FROM`
- `CLIENT_URL=https://<your-vercel-domain>`

### Frontend Vite environment

In Vercel, set:

- `VITE_API_URL=/api`
- `VITE_APP_BASE_URL=/api`
- `VITE_APP_ID=smacom`
- `VITE_FUNCTIONS_VERSION=1`

## Available scripts

Root frontend:

- `npm run dev` — start Vite dev server
- `npm run build` — build production frontend
- `npm run preview` — preview production build
- `npm run lint` — lint codebase
- `npm run lint:fix` — fix lint issues

Backend:

- `npm run dev` — start backend Express server with nodemon
- `npm run smoke-test` — run local backend smoke tests
- `npm start` — run backend server once

## Notes

- The backend API is exposed under `/api` for both local and production environments.
- The frontend uses Axios and automatically passes stored JWT tokens.
- The project is ready for Vercel deployment with `vercel.json`.
