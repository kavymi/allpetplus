# Environment Setup Guide

**Complete guide for setting up environment variables across all apps and services**

---

## 📁 Environment File Structure

```
/
├── env.template                      # Root workspace (optional, for NX Cloud)
├── apps/
│   ├── web/
│   │   ├── env.template             # Frontend template
│   │   └── .env.local               # Frontend config (gitignored)
│   └── pet-licensing/
│       ├── env.template             # Licensing frontend template
│       └── .env.local               # Licensing config (gitignored)
├── services/
│   ├── backend/
│   │   ├── env.template             # Backend template
│   │   └── .env                     # Backend config (gitignored)
│   └── builder-service/
│       ├── env.template             # Builder service template
│       └── .env                     # Builder config (gitignored)
```

---

## 🚀 Quick Setup

### 1. Copy Template Files

```bash
# Frontend
cp apps/web/env.template apps/web/.env.local

# Backend
cp services/backend/env.template services/backend/.env

# Micro-frontends (as you add them)
cp apps/pet-licensing/env.template apps/pet-licensing/.env.local

# Microservices (when extracted)
cp services/builder-service/env.template services/builder-service/.env
```

### 2. Fill Required Values

**Minimum to run:**
```bash
# apps/web/.env.local
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=[from Clerk]
CLERK_SECRET_KEY=[from Clerk]
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT=[from Shopify]
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=[from Shopify]

# services/backend/.env
DATABASE_URL=postgresql://postgres:password@localhost:5432/harness_hero
REDIS_URL=redis://localhost:6379
CLERK_SECRET_KEY=[from Clerk]
```

---

## 📋 Environment Variables by Service

### Frontend (apps/web/)

#### Required:
- `NEXT_PUBLIC_APP_URL` - App URL (http://localhost:3000)
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT` - Shopify GraphQL endpoint
- `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN` - Shopify storefront token

#### Optional:
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` - Image CDN
- `NEXT_PUBLIC_GA_MEASUREMENT_ID` - Google Analytics
- `NEXT_PUBLIC_SENTRY_DSN` - Error tracking
- Feature flags (dark mode, confetti, etc.)

### Backend (services/backend/)

#### Required:
- `DATABASE_URL` - PostgreSQL connection string
- `REDIS_URL` - Redis connection string
- `CLERK_SECRET_KEY` - Clerk authentication
- `JWT_SECRET` - JWT signing key
- `SESSION_SECRET` - Session encryption
- `ENCRYPTION_KEY` - Data encryption (32 chars)

#### Optional:
- `SHOPIFY_ADMIN_ACCESS_TOKEN` - Shopify Admin API
- `SHOPIFY_WEBHOOK_SECRET` - Webhook verification
- `SENTRY_DSN` - Error tracking
- Service URLs (when running microservices)

### Micro-Frontends (apps/pet-licensing/, etc.)

#### Required:
- `NEXT_PUBLIC_APP_URL` - This app's URL
- `NEXT_PUBLIC_DASHBOARD_URL` - Main dashboard URL
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Shared Clerk key
- `CLERK_SECRET_KEY` - Shared Clerk secret

#### Optional:
- `NEXT_PUBLIC_API_URL` - If app has dedicated backend
- Feature-specific flags

### Microservices (services/builder-service/, etc.)

#### Required:
- `PORT` - Service port (4002, 4003, etc.)
- `DATABASE_URL` - Database connection
- `REDIS_URL` - Redis connection

#### Optional:
- Service URLs for inter-service communication
- Service-specific configuration

---

## 🔑 Getting API Keys

### Clerk (Authentication)
1. Sign up at https://clerk.com
2. Create application
3. Go to **API Keys**
4. Copy:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_`)
   - `CLERK_SECRET_KEY` (starts with `sk_`)
5. Use **same keys** for all apps (shared auth)

### Shopify (E-commerce)
1. Go to https://admin.shopify.com/
2. **Settings** → **Apps and sales channels** → **Develop apps**
3. Create private app
4. Configure **Storefront API** scopes
5. Install app
6. Copy:
   - Store domain (e.g., `your-store.myshopify.com`)
   - Storefront Access Token

### Cloudinary (Images - Optional)
1. Sign up at https://cloudinary.com
2. Go to **Dashboard**
3. Copy **Cloud Name**

### Google Analytics (Optional)
1. Go to https://analytics.google.com
2. **Admin** → **Data Streams** → **Web**
3. Copy **Measurement ID** (starts with `G-`)

---

## 🎯 Environment Organization

### Development (.env.local):
```bash
NODE_ENV=development
NEXT_PUBLIC_DEBUG_ANALYTICS=true
LOG_LEVEL=debug
```

### Staging (.env.staging):
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://staging.harnesshero.com
LOG_LEVEL=info
```

### Production (.env.production):
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://harnesshero.com
NEXT_PUBLIC_DEBUG_ANALYTICS=false
LOG_LEVEL=warn
```

---

## 🔒 Security Best Practices

### DO ✅
- Use `.env.local` for local development (gitignored)
- Use `NEXT_PUBLIC_` prefix ONLY for client-safe variables
- Generate strong secrets: `openssl rand -base64 32`
- Use different keys for dev/staging/production
- Store production secrets in deployment platform (Vercel, Fly.io)

### DON'T ❌
- Commit `.env` or `.env.local` files
- Use `NEXT_PUBLIC_` for secrets or API keys
- Share credentials in code or chat
- Use same secrets across environments
- Hardcode sensitive values

---

## 🐳 Docker Environment

When using `docker-compose.microservices.yml`, environment variables are set in the compose file:

```yaml
services:
  backend:
    environment:
      DATABASE_URL: postgresql://harness:dev_password@postgres:5432/harness_hero
      REDIS_URL: redis://redis:6379
```

For production Docker deployments, use `.env` files or secrets management.

---

## ✅ Validation

### Check Required Variables:
```bash
# Frontend
cd apps/web && npm run dev
# Will warn if required vars missing

# Backend
cd services/backend && npm run dev
# Will fail if required vars missing
```

### Test Connections:
```bash
# Database
psql $DATABASE_URL -c "SELECT 1"

# Redis
redis-cli -u $REDIS_URL ping
```

---

## 📚 Related Documentation

- **API Keys Guide:** `/docs/guides/api-keys.md`
- **Database Setup:** `/docs/guides/database-setup.md`
- **Deployment:** `/docs/ops/deploy.md`

---

**For detailed service-specific variables, see each service's `env.template` file.**