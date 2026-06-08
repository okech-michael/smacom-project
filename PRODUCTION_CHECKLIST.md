# Production Deployment Checklist

Use this checklist to ensure your SMACOM application is ready for Vercel production deployment.

## Database Preparation

- [ ] Migrate from SQLite to PostgreSQL (or another managed database)
- [ ] Set `DATABASE_URL` to your production database connection string
- [ ] Test database connection locally
- [ ] Backup existing data (if migrating from development database)
- [ ] Run Prisma migrations: `npx prisma db push`

## Environment Variables

- [ ] Set `JWT_SECRET` to a strong, randomly generated secret
- [ ] Set `CLIENT_URL` to your production domain (`https://www.smacom.co.ke`)
- [ ] Set `VITE_API_URL` to `/api` for same-domain routing
- [ ] Set `NODE_ENV` to `production`
- [ ] Configure all external service keys:
  - [ ] AWS credentials (if using S3)
  - [ ] SendGrid API key (if using email)
  - [ ] OpenAI API key (if needed)
  - [ ] Cloudinary credentials (if using)

## Code Preparation

- [ ] Run tests: `npm test` or appropriate test command
- [ ] Verify no console.log statements remain in production code
- [ ] Update API endpoints in code to use environment variables
- [ ] Review and secure sensitive configuration
- [ ] Enable minification and tree-shaking in build
- [ ] Test production build locally: `npm run build`

## Security

- [ ] Generate new JWT secret for production
- [ ] Ensure database credentials are never committed to git
- [ ] Review CORS settings in `backend/src/app.js`
- [ ] Check authentication middleware is properly enforced
- [ ] Verify rate limiting is configured (if applicable)
- [ ] Remove debug endpoints from production

## File Storage

- [ ] If using file uploads, configure cloud storage (AWS S3 or Cloudinary)
- [ ] Update upload middleware to use cloud storage instead of filesystem
- [ ] Test file upload functionality with cloud storage

## Frontend Optimization

- [ ] Build optimization configured in `vite.config.js`
- [ ] Check bundle size: `npm run build`
- [ ] Verify no hardcoded localhost references
- [ ] Test with production environment variables
- [ ] Test API endpoints point to production

## Backend Optimization

- [ ] Verify database connection pooling is configured
- [ ] Check Prisma client is using singleton pattern (already done)
- [ ] Confirm error handling is production-appropriate
- [ ] Verify logging configuration for production

## Vercel Configuration

- [ ] `vercel.json` is properly configured
- [ ] `.vercelignore` excludes unnecessary files
- [ ] Build command in Vercel matches `vercel-build` in package.json
- [ ] Root directory is set correctly
- [ ] Node version is compatible (18.x recommended)

## Testing

- [ ] Test API health endpoint: `GET /api/health`
- [ ] Test authentication flow
- [ ] Test database operations
- [ ] Test file uploads (if applicable)
- [ ] Verify frontend routes work correctly
- [ ] Test error handling and error messages
- [ ] Verify CORS is working properly

## Monitoring & Logging

- [ ] Set up Vercel error notifications
- [ ] Configure function logs monitoring
- [ ] Plan log retention strategy
- [ ] Set up performance monitoring (if available)

## DNS & Domains

- [ ] Configure custom domain (if applicable)
- [ ] Update DNS records as per Vercel instructions
- [ ] Test domain resolution
- [ ] Verify SSL certificate is installed

## Post-Deployment

- [ ] Test all features in production
- [ ] Monitor error logs for 24 hours after deployment
- [ ] Check performance metrics
- [ ] Verify email notifications are sending (if applicable)
- [ ] Test with various browsers and devices
- [ ] Backup production database setup
- [ ] Document any custom configurations

## Performance Optimization

- [ ] Enable caching headers in Vercel
- [ ] Optimize images (use next-gen formats)
- [ ] Consider upgrading to Vercel Pro for better performance
- [ ] Monitor function execution time
- [ ] Check database query performance

## Troubleshooting Common Issues

If deployment fails:
1. Check build logs in Vercel dashboard
2. Verify all environment variables are set
3. Ensure database connection is working
4. Check file permissions and .vercelignore
5. Review function logs for runtime errors

## Emergency Contacts & Resources

- Vercel Support: https://vercel.com/support
- Prisma Docs: https://www.prisma.io/docs/
- Database Provider Support:
  - Vercel Postgres: https://vercel.com/docs/storage/postgres
  - Neon: https://neon.tech/docs
  - PlanetScale: https://planetscale.com/docs

---

**Last Updated**: 2026-06-08
**Project**: SMACOM (smacom-app)
