# Deployment Guide

## Overview

All Pet Plus uses a hybrid deployment strategy:
- **Frontend**: Vercel (Next.js App Router with Edge + Node runtimes)
- **Backend**: Fly.io or containerized service (Fastify)
- **Database**: Managed PostgreSQL (Neon, Supabase, or AWS RDS)
- **Cache**: Managed Redis (Upstash or Redis Cloud)

---

## Prerequisites

1. **Vercel Account**
   - Sign up at https://vercel.com
   - Link GitHub repository
   - Configure environment variables

2. **Fly.io Account** (for backend)
   - Install flyctl: `curl -L https://fly.io/install.sh | sh`
   - Login: `flyctl auth login`
   - Create app: `flyctl apps create all-pet-plus-api`

3. **Database Setup**
   - Provision PostgreSQL instance
   - Run migrations: `npm run db:migrate:prod`
   - Seed initial data: `npm run db:seed`

4. **Redis Setup**
   - Provision Redis instance
   - Note connection URL for environment variables

---

## Environment Variables

### Frontend (Vercel)
```bash
NEXT_PUBLIC_APP_URL=https://harnesshero.com
NEXT_PUBLIC_API_URL=https://api.harnesshero.com
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT=https://store.myshopify.com/api/graphql
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=...
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=...
NEXT_PUBLIC_SENTRY_DSN=...
```

### Backend (Fly.io)
```bash
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
CLERK_SECRET_KEY=sk_live_...
SHOPIFY_WEBHOOK_SECRET=...
SHOPIFY_ADMIN_TOKEN=...
CORS_ORIGIN=https://harnesshero.com
SENTRY_DSN=...
```

---

## Deployment Steps

### Initial Setup

1. **Configure Vercel Project**
```bash
cd apps/web
vercel link
vercel env add NEXT_PUBLIC_APP_URL production
# Add all environment variables...
```

2. **Configure Fly.io App**
```bash
cd services/backend
flyctl launch --no-deploy
flyctl secrets set DATABASE_URL=postgresql://...
flyctl secrets set REDIS_URL=redis://...
# Set all secrets...
```

3. **Set up GitHub Secrets**
```bash
# Required secrets for CI/CD:
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
FLY_API_TOKEN
LHCI_GITHUB_APP_TOKEN
```

---

### Continuous Deployment

**Automatic Deployments:**
- Push to `develop` → Deploy to staging
- Push to `main` → Deploy to production (after tests pass)

**Manual Deployment:**
```bash
# Frontend
cd apps/web
vercel --prod

# Backend
cd services/backend
flyctl deploy --remote-only
```

---

## Database Migrations

### Development
```bash
cd services/backend
npm run db:migrate
```

### Production
```bash
# Run migrations before deployment
cd services/backend
DATABASE_URL=postgresql://prod-url npm run db:migrate:prod
```

### Rollback
```bash
# Revert last migration
cd services/backend
npx prisma migrate resolve --rolled-back <migration-name>
```

---

## Monitoring & Alerts

### Vercel Analytics
- Enabled by default for Core Web Vitals
- View at: https://vercel.com/dashboard/analytics

### Backend Monitoring
- Health checks: `https://api.harnesshero.com/healthz/detailed`
- Metrics: `https://api.harnesshero.com/metrics`

### Error Tracking (Sentry)
```bash
# Frontend errors tracked automatically
# Backend errors logged via Fastify + Sentry integration
```

---

## Performance Optimization

### CDN Configuration
- Vercel Edge Network (automatic)
- Cloudinary for image transformations
- Static assets cached at edge

### Database Connection Pooling
- Max connections: 50 (production), 10 (staging)
- Idle timeout: 30 seconds
- Connection timeout: 5 seconds

### Redis Configuration
- Max retries: 3
- Retry strategy: exponential backoff
- Connection pooling enabled

---

## Security Checklist

- [ ] All environment variables set
- [ ] Shopify webhook secret configured
- [ ] CORS origins restricted to production domains
- [ ] Rate limiting enabled
- [ ] HTTPS enforced
- [ ] Security headers configured (via Helmet)
- [ ] Database connection encrypted
- [ ] Secrets rotated regularly
- [ ] Audit logging enabled

---

## Troubleshooting

### Frontend Build Failures
```bash
# Clear cache and rebuild
rm -rf apps/web/.next
cd apps/web && npm run build
```

### Backend Connection Issues
```bash
# Test database connection
cd services/backend
npx prisma db push --skip-generate

# Test Redis connection
redis-cli -u $REDIS_URL ping
```

### Webhook Not Receiving
1. Check HMAC signature verification
2. Verify webhook URL in Shopify settings
3. Check Fly.io logs: `flyctl logs`
4. Review webhook logs table in database

---

## Rollback Procedure

### Frontend (Vercel)
```bash
# List deployments
vercel ls

# Rollback to previous deployment
vercel rollback <deployment-url>
```

### Backend (Fly.io)
```bash
# List releases
flyctl releases

# Rollback to previous release
flyctl releases rollback <version>
```

---

## Scaling Considerations

### Horizontal Scaling
- **Frontend**: Automatic via Vercel
- **Backend**: `flyctl scale count 2`
- **Database**: Upgrade to larger instance or read replicas
- **Redis**: Cluster mode for high traffic

### Vertical Scaling
```bash
# Backend resources
flyctl scale vm shared-cpu-2x --memory 512

# Database
# Upgrade via provider dashboard
```
