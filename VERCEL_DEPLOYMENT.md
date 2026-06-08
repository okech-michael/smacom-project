# Vercel Deployment Guide

This document provides instructions for deploying the SMACOM application to Vercel.

## Project Structure

This is a full-stack monorepo with:
- **Frontend**: React/Vite application (root `/src`)
- **Backend**: Node.js/Express API (`/backend`)
- **Database**: Prisma ORM with SQLite

## Pre-Deployment Checklist

### 1. Database Setup

⚠️ **Important**: SQLite is not recommended for production on Vercel. For a production environment, you should:

- Use **PostgreSQL** (via Neon, Vercel Postgres, AWS RDS, or similar)
- Use **MongoDB** (via Atlas or similar)
- Use **MySQL** (via PlanetScale or similar)

**Steps to migrate from SQLite to PostgreSQL:**

1. Create a PostgreSQL database (e.g., using Vercel Postgres or Neon)
2. Update `backend/.env` with the PostgreSQL connection string:
   ```
   DATABASE_URL=postgresql://user:password@host:port/dbname
   ```
3. Update `backend/prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
4. Generate and apply migrations:
   ```bash
   cd backend
   npx prisma migrate deploy
   cd ..
   ```

### 2. Environment Variables

Configure the following environment variables in your Vercel project settings:

**Frontend Variables:**
- `VITE_API_URL`: Your production API URL (e.g., `https://your-domain.com/api`)
- `VITE_APP_ID`: Application identifier (default: `smacom`)

**Backend Variables:**
- `DATABASE_URL`: Your production database connection string
- `JWT_SECRET`: A strong, unique secret key (generate using `openssl rand -base64 32`)
- `CLIENT_URL`: Your frontend domain (for CORS)
- `AWS_ACCESS_KEY_ID`: AWS credentials (if using S3)
- `AWS_SECRET_ACCESS_KEY`: AWS credentials (if using S3)
- `AWS_REGION`: AWS region for S3
- `AWS_BUCKET`: S3 bucket name
- `SENDGRID_API_KEY`: SendGrid API key (for email)
- `SENDGRID_FROM_EMAIL`: Sender email address
- `OPENAI_API_KEY`: OpenAI API key (if used)
- `NODE_ENV`: Set to `production`

### 3. File Structure Setup

The following files have been configured for Vercel:
- `vercel.json` - Deployment configuration
- `.vercelignore` - Files to exclude from deployment
- `vite.config.js` - Frontend build configuration
- `.env.example` - Environment variable templates

## Deployment Steps

### Step 1: Push to GitHub

```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### Step 2: Connect to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Select the project root directory

### Step 3: Configure Environment Variables

In Vercel project settings:
1. Go to Settings → Environment Variables
2. Add all variables from the `.env.example` files
3. Ensure variables are set for Production environment

### Step 4: Configure Build Settings

Vercel should auto-detect the configuration from `vercel.json`. Verify:
- **Build Command**: `npm run build` (should be auto-detected)
- **Output Directory**: `dist` (should be auto-detected)

### Step 5: Deploy

Click "Deploy" to start the deployment process.

## Post-Deployment

### 1. Update Frontend API URL

After deployment, update the frontend environment variable:
- `VITE_API_URL`: Should point to your Vercel domain API endpoints

### 2. Test Health Check

```bash
curl https://your-domain.vercel.app/api/health
```

### 3. Monitor Deployment

- Check Function Logs in Vercel Dashboard
- Monitor usage and performance metrics
- Set up error notifications

## Troubleshooting

### Common Issues

**Issue**: "Cannot find module" errors
- Solution: Ensure `npm ci` is run in backend before deployment

**Issue**: Database connection failures
- Solution: Verify `DATABASE_URL` is correctly set in environment variables

**Issue**: CORS errors on API calls
- Solution: Verify `CLIENT_URL` matches your frontend domain in backend environment variables

**Issue**: Frontend routes returning 404
- Solution: The `vercel.json` SPA routing should handle this. Check your configuration.

**Issue**: File uploads not persisting
- Solution: File uploads to local filesystem won't persist between function invocations. Use AWS S3 or Cloudinary instead.

## Advanced Configuration

### Custom Domain

1. In Vercel Dashboard → Domains
2. Add your custom domain
3. Update DNS records as instructed by Vercel

### Database Backups

If using Vercel Postgres:
- Automated backups are included
- Access via Vercel Dashboard

### Performance Optimization

1. Enable caching headers
2. Consider upgrading to Pro for faster function execution
3. Use CDN caching for static assets

## Migration to Production Database

### From SQLite to PostgreSQL with Vercel Postgres

1. Create Vercel Postgres database
2. Copy the connection string
3. Update `DATABASE_URL` environment variable
4. Run migrations:
   ```bash
   cd backend
   npx prisma db push
   cd ..
   ```

## Support

For additional help:
- [Vercel Documentation](https://vercel.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Vite Documentation](https://vite.dev/)
