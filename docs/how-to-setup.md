# How To Setup All Pet Plus - Complete Guide

**Last Updated:** October 18, 2025  
**Estimated Time:** 30-45 minutes

---

## Prerequisites

Before you begin, ensure you have:

- ✅ **Node.js v24** - Download from [nodejs.org](https://nodejs.org)
- ✅ **npm 10.7.0+** - Comes with Node.js
- ✅ **Docker Desktop** - For PostgreSQL and Redis ([docker.com](https://www.docker.com/products/docker-desktop))
- ✅ **Git** - For cloning the repository
- ✅ **Code Editor** - VS Code recommended

---

## Step 1: Clone & Install (5 min)

```bash
# Clone the repository
git clone <repository-url>
cd pet

# Install all dependencies
npm install

# This installs packages for:
# - Root workspace
# - apps/web (Next.js frontend)
# - services/backend (Fastify backend)
# - libs/* (Shared libraries)
```

---

## Step 2: Start Database Services (3 min)

```bash
# Start PostgreSQL, Redis, and Adminer (database GUI)
docker compose -f docker-compose.dev.yml up -d

# Verify they're running
docker compose -f docker-compose.dev.yml ps

# Expected output:
# ✅ pet-postgres-1  running  0.0.0.0:5432->5432/tcp
# ✅ pet-redis-1     running  0.0.0.0:6379->6379/tcp
# ✅ pet-adminer-1   running  0.0.0.0:8081->8080/tcp
```

**Service URLs:**
- PostgreSQL: `localhost:5432`
- Redis: `localhost:6379`
- Adminer GUI: http://localhost:8081

---

## Step 3: Configure Environment Variables (10-15 min)

### Frontend Configuration

```bash
# Copy template
cp apps/web/env.template apps/web/.env.local

# Edit the file
nano apps/web/.env.local  # or use your preferred editor
```

**Required Variables:**

```bash
# Application URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001

# Clerk Authentication (GET THESE FROM CLERK)
# https://dashboard.clerk.com/ → Create app → API Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx

# Shopify (OPTIONAL for development)
# https://admin.shopify.com/ → Apps → Develop apps
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT=https://your-store.myshopify.com/api/2024-01/graphql.json
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=xxxxx

# Cloudinary (OPTIONAL)
# https://cloudinary.com/console
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Backend Configuration

```bash
# Copy template
cp services/backend/env.template services/backend/.env

# Edit the file
nano services/backend/.env
```

**Required Variables:**

```bash
# Environment
NODE_ENV=development

# Database (matches Docker Compose)
DATABASE_URL=postgresql://postgres:password@localhost:5432/pet_db

# Redis (matches Docker Compose)
REDIS_URL=redis://localhost:6379

# Security Secrets (GENERATE THESE)
# Generate with: openssl rand -base64 32
JWT_SECRET=<generate-32-char-secret>
REFRESH_TOKEN_SECRET=<generate-32-char-secret>
SESSION_SECRET=<generate-32-char-secret>

# CRITICAL: Must be EXACTLY 32 characters!
ENCRYPTION_KEY=dev-encryption-key-32-chars!!

# Clerk (same as frontend)
CLERK_SECRET_KEY=sk_test_xxxxx

# CORS (allow frontend)
CORS_ORIGIN=http://localhost:3000

# Shopify (OPTIONAL)
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxx
SHOPIFY_WEBHOOK_SECRET=whsec_xxxxx
```

### Generate Secrets

```bash
# Generate secure random secrets
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For REFRESH_TOKEN_SECRET
openssl rand -base64 32  # For SESSION_SECRET

# For ENCRYPTION_KEY (must be EXACTLY 32 characters)
# Use this for development:
ENCRYPTION_KEY=dev-encryption-key-32-chars!!

# For production, generate:
openssl rand -base64 24 | cut -c1-32
```

---

## Step 4: Setup Database (5 min)

```bash
# Navigate to backend
cd services/backend

# Generate Prisma Client
npm run db:generate

# Run database migrations
npm run db:migrate

# (Optional) Seed with sample data
npm run db:seed

# Return to root
cd ../..
```

**Verify database setup:**

Visit Adminer at http://localhost:8081
- System: `PostgreSQL`
- Server: `db`
- Username: `postgres`
- Password: `password`
- Database: `pet_db`

You should see tables like `user_profiles`, `saved_designs`, `order_meta`, etc.

---

## Step 5: Start Development Servers (2 min)

```bash
# From project root, start both services
npm run dev
```

**This starts:**
- 🎨 **Frontend** at http://localhost:3000
- ⚙️ **Backend API** at http://localhost:3001

**NX Terminal UI:**
- Use `←` / `→` arrows to switch between service logs
- Press `/` to search logs
- Press `Ctrl+C` to stop all services

---

## Step 6: Verify Everything Works (5 min)

### Frontend Check

Open http://localhost:3000 in your browser

**You should see:**
- ✅ Landing page loads
- ✅ No console errors
- ✅ "Build Your Harness" button visible

### Backend Health Check

Open http://localhost:3001/healthz

**You should see:**
```json
{
  "status": "ok",
  "uptime": 123.45,
  "timestamp": 1234567890,
  "services": {
    "postgres": true,
    "redis": true
  }
}
```

### Database Check

```bash
# Open Prisma Studio
cd services/backend
npm run db:studio
```

Visit http://localhost:5555 - you should see your database schema

---

## Common Setup Issues & Solutions

### Issue: ENCRYPTION_KEY Error

**Error:** `ENCRYPTION_KEY must be exactly 32 characters`

**Solution:**
```bash
# Edit services/backend/.env
# Change to EXACTLY 32 characters:
ENCRYPTION_KEY=dev-encryption-key-32-chars!!
```

### Issue: Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution:**
```bash
# Kill process using the port
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:3001 | xargs kill -9  # Backend

# Then restart
npm run dev
```

### Issue: Database Connection Failed

**Error:** `Can't reach database server`

**Solution:**
```bash
# Check Docker is running
docker ps

# Restart database services
docker compose -f docker-compose.dev.yml restart

# Check logs
docker compose -f docker-compose.dev.yml logs db
```

### Issue: Module Not Found

**Error:** `Cannot find module '@pet/api'`

**Solution:**
```bash
# Clear caches and rebuild
npm run clean
npm install
npx nx reset

# Restart TypeScript server in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## Next Steps: Start Developing

### 1. Understand the Architecture

Read these in order:
1. [Architecture Overview](./architecture/architecture.md) - System design
2. [Component Architecture](./architecture/component-architecture.md) - React patterns
3. [Code Patterns](./development/code-patterns.md) - Coding standards

### 2. Learn the Development Workflow

- [Development Guide](./development/DEVELOPMENT_GUIDE.md) - Daily workflows
- [Testing Guide](./development/testing-guide.md) - How to test
- [tRPC Usage](./guides/trpc-usage-examples.md) - API patterns

### 3. Explore the Codebase

```bash
# View NX dependency graph
npm run graph

# Run tests to see everything works
npm test

# Try building
npm run build
```

---

## Essential Environment Variables Reference

### 🔐 Authentication (Clerk)

Get your keys from https://dashboard.clerk.com/

```bash
# Frontend (apps/web/.env.local)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx

# Backend (services/backend/.env)
CLERK_SECRET_KEY=sk_test_xxxxx
```

**Setup Steps:**
1. Create account at https://dashboard.clerk.com/
2. Create new application
3. Go to "API Keys" section
4. Copy both keys

### 🛍️ Shopify (Optional for Development)

Get from https://admin.shopify.com/ → Apps → Develop apps

```bash
# Frontend
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT=https://store.myshopify.com/api/2024-01/graphql.json
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=xxxxx

# Backend
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxx
SHOPIFY_WEBHOOK_SECRET=whsec_xxxxx
```

**Setup Steps:**
1. Log into Shopify Admin
2. Settings → Apps and sales channels → Develop apps
3. Create app or use existing
4. Configure Storefront API scopes
5. Get access token from API credentials tab

### 🖼️ Cloudinary (Optional)

Get from https://cloudinary.com/console

```bash
# Frontend
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### 🗄️ Database & Cache (Local Development)

```bash
# Backend - These match docker-compose.dev.yml
DATABASE_URL=postgresql://postgres:password@localhost:5432/pet_db
REDIS_URL=redis://localhost:6379
```

### 🔒 Security Secrets

```bash
# Generate these with: openssl rand -base64 32
JWT_SECRET=<generated-secret>
REFRESH_TOKEN_SECRET=<generated-secret>
SESSION_SECRET=<generated-secret>

# Must be EXACTLY 32 characters
ENCRYPTION_KEY=dev-encryption-key-32-chars!!
```

---

## Quick Command Reference

### Development

```bash
npm run dev              # Start both frontend + backend
npm run dev:web          # Frontend only
npm run dev:backend      # Backend only
```

### Database

```bash
cd services/backend

npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Add sample data
npm run db:reset         # Reset database (CAUTION!)
```

### Testing

```bash
npm test                 # All tests
npm run test:watch       # Watch mode
npx nx test web          # Frontend tests only
npx nx test backend      # Backend tests only
```

### Building

```bash
npm run build            # Build all projects
npx nx build web         # Build frontend only
npx nx build backend     # Build backend only
```

### Quality Checks

```bash
npm run lint             # Lint all code
npm run typecheck        # Type check
npm run clean            # Clear NX cache
```

---

## Service URLs - Quick Access

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:3000 | Main application |
| **Backend API** | http://localhost:3001 | REST/tRPC API |
| **Health Check** | http://localhost:3001/healthz | API status |
| **Detailed Health** | http://localhost:3001/healthz/detailed | Full diagnostics |
| **Adminer** | http://localhost:8081 | Database GUI |
| **Prisma Studio** | http://localhost:5555 | Database ORM GUI |

---

## Recommended Development Setup

### VS Code Extensions

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Prisma** - Database schema support
- **Tailwind CSS IntelliSense** - CSS utilities autocomplete

### Terminal Setup

**Option 1: VS Code Split Terminal**
```
┌─────────────────┬─────────────────┐
│   Backend       │    Frontend     │
│   Port 3001     │    Port 3000    │
│   Fastify logs  │   Next.js logs  │
└─────────────────┴─────────────────┘
```

**Option 2: Single NX Terminal**
```bash
npm run dev
# Use ← → to switch between services
```

---

## Troubleshooting Guide

### Can't connect to database

```bash
# Check Docker is running
docker ps

# Check database container
docker compose -f docker-compose.dev.yml ps

# View database logs
docker compose -f docker-compose.dev.yml logs db

# Restart database
docker compose -f docker-compose.dev.yml restart db
```

### Port conflicts

```bash
# Check what's using a port
lsof -i :3000
lsof -i :3001
lsof -i :5432

# Kill process
kill -9 <PID>
```

### Prisma client errors

```bash
cd services/backend

# Regenerate client
npm run db:generate

# Check migration status
npx prisma migrate status

# Reset and reapply
npx prisma migrate reset
```

### Module not found errors

```bash
# Clear all caches
npm run clean
npx nx reset

# Reinstall
rm -rf node_modules package-lock.json
npm install

# Restart TypeScript in VS Code
# Cmd+Shift+P → "TypeScript: Restart TS Server"
```

---

## Environment Variables - Complete Reference

### Frontend (apps/web/.env.local)

#### Core Settings
```bash
NEXT_PUBLIC_APP_NAME=All Pet Plus
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
```

#### Authentication (Required)
```bash
# Clerk: https://dashboard.clerk.com/
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
CLERK_SECRET_KEY=sk_test_xxxxx
```

#### E-Commerce (Optional - Can develop without Shopify)
```bash
# Shopify: https://admin.shopify.com/ → Apps → Develop apps
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT=https://your-store.myshopify.com/api/2024-01/graphql.json
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=xxxxx
```

#### Media (Optional)
```bash
# Cloudinary: https://cloudinary.com/console
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

#### Analytics (Optional)
```bash
# Google Analytics: https://analytics.google.com/
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Umami: https://umami.is/
NEXT_PUBLIC_UMAMI_SITE_ID=xxxxx
```

#### Feature Flags (Optional)
```bash
NEXT_PUBLIC_ENABLE_EXPERIMENTS=true
NEXT_PUBLIC_ENABLE_ML_RECOMMENDATIONS=true
NEXT_PUBLIC_ENABLE_COMPARISON=true
NEXT_PUBLIC_ENABLE_SOCIAL_SHARING=true
NEXT_PUBLIC_ENABLE_ONBOARDING=true
```

### Backend (services/backend/.env)

#### Application Settings
```bash
NODE_ENV=development
PORT=3001
HOST=0.0.0.0
LOG_LEVEL=info
```

#### Database (Local Development)
```bash
# Matches docker-compose.dev.yml
DATABASE_URL=postgresql://postgres:password@localhost:5432/pet_db
DB_POOL_MIN=2
DB_POOL_MAX=10
```

#### Cache (Local Development)
```bash
# Matches docker-compose.dev.yml
REDIS_URL=redis://localhost:6379
REDIS_TTL=3600
REDIS_KEY_PREFIX=hh:
```

#### Security (CRITICAL - Generate These)
```bash
# Generate with: openssl rand -base64 32
JWT_SECRET=<generate-this>
REFRESH_TOKEN_SECRET=<generate-this>
SESSION_SECRET=<generate-this>

# MUST be EXACTLY 32 characters
ENCRYPTION_KEY=dev-encryption-key-32-chars!!
```

#### Authentication
```bash
# Clerk (same as frontend)
CLERK_SECRET_KEY=sk_test_xxxxx
```

#### CORS
```bash
# Allow frontend to make requests
CORS_ORIGIN=http://localhost:3000
```

#### Rate Limiting
```bash
RATE_LIMIT_MAX=100
RATE_LIMIT_WINDOW_MS=60000
```

#### Shopify (Optional)
```bash
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_xxxxx
SHOPIFY_WEBHOOK_SECRET=whsec_xxxxx
```

#### Monitoring (Optional)
```bash
# Sentry: https://sentry.io/
SENTRY_DSN=https://xxxxx@sentry.io/xxxxx
```

---

## Quick Reference - Daily Development

### Start Working

```bash
# 1. Ensure Docker is running
docker ps

# 2. Start databases (if not running)
docker compose -f docker-compose.dev.yml up -d

# 3. Start development servers
npm run dev

# 4. Open browser
# Frontend: http://localhost:3000
# Backend: http://localhost:3001/healthz
```

### Stop Working

```bash
# Stop development servers
Ctrl+C (in terminal running npm run dev)

# Stop databases (optional - can leave running)
docker compose -f docker-compose.dev.yml down
```

### Make Database Changes

```bash
cd services/backend

# 1. Edit prisma/schema.prisma
# 2. Create migration
npx prisma migrate dev --name your_change_name

# 3. Prisma client auto-generates
# 4. Return to root
cd ../..
```

### Run Tests

```bash
# All tests
npm test

# Frontend only
npx nx test web

# Backend only
npx nx test backend

# E2E tests (Playwright)
cd apps/web
npm run test:e2e:ui  # Interactive mode
```

---

## Getting API Keys - Step by Step

### Clerk (Required for Auth)

1. Go to https://dashboard.clerk.com/
2. Sign up or sign in
3. Click "Create application"
4. Choose application type: "Next.js"
5. Name it (e.g., "All Pet Plus Dev")
6. Go to "API Keys" in sidebar
7. Copy:
   - **Publishable key** → `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - **Secret key** → `CLERK_SECRET_KEY`

### Shopify (Optional - Can Skip Initially)

1. Go to https://partners.shopify.com/
2. Create Partner account (free)
3. Create development store
4. In your store: Settings → Apps → Develop apps
5. Create custom app
6. Configure Storefront API scopes:
   - `unauthenticated_read_product_listings`
   - `unauthenticated_read_collection_listings`
   - `unauthenticated_write_checkouts`
7. Install app and copy:
   - **Storefront Access Token** → `NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN`
   - **Store domain** → Use in `NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT`

### Cloudinary (Optional)

1. Go to https://cloudinary.com/console
2. Sign up for free account
3. From dashboard, copy:
   - **Cloud name** (top left) → `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

---

## What Can I Skip?

### ✅ Required for Development
- Node.js & npm
- Docker (for database)
- Environment files
- Clerk authentication

### ⚠️ Optional (Can Add Later)
- Shopify (mock data available)
- Cloudinary (fallback images work)
- Analytics (Google Analytics, Umami)
- Monitoring (Sentry)

### Minimum Setup to Start Coding

**Just need:**
1. Database running (Docker)
2. Clerk keys
3. Environment files configured
4. `npm run dev`

Everything else can be added as needed!

---

## Development Workflow Tips

### Running Individual Services

```bash
# Frontend only (faster startup)
npm run dev:web

# Backend only
npm run dev:backend

# Both (recommended)
npm run dev
```

### Database GUI Options

**Option 1: Adminer (Included)**
- URL: http://localhost:8081
- Simple web interface
- No installation needed

**Option 2: Prisma Studio**
```bash
cd services/backend
npm run db:studio
# Opens http://localhost:5555
```

**Option 3: pgAdmin or TablePlus**
- Connect to: `localhost:5432`
- Database: `pet_db`
- User: `postgres`
- Password: `password`

### Hot Reload

Both services auto-reload:
- **Frontend**: Instant refresh (Next.js Fast Refresh)
- **Backend**: Auto-restart (tsx watch)

Just save your files and changes appear!

---

## Useful Commands

### NX Workspace

```bash
# View project graph
npm run graph

# Run affected tests only
npx nx affected --target=test

# Build affected projects
npx nx affected --target=build

# Lint affected projects
npx nx affected --target=lint
```

### Docker Compose

```bash
# Start all services
docker compose -f docker-compose.dev.yml up -d

# View running containers
docker compose -f docker-compose.dev.yml ps

# View logs
docker compose -f docker-compose.dev.yml logs -f

# Stop all services
docker compose -f docker-compose.dev.yml down

# Stop and remove volumes (fresh start)
docker compose -f docker-compose.dev.yml down -v
```

---

## Summary

You should now have:

✅ Project cloned and dependencies installed  
✅ Docker services running (PostgreSQL, Redis)  
✅ Environment variables configured  
✅ Database migrated with schema  
✅ Development servers running  
✅ Frontend accessible at localhost:3000  
✅ Backend API responding at localhost:3001  

**Time to start building!** 🚀

---

## Getting Help

**Documentation:**
- Full docs index: [docs/README.md](./README.md)
- Troubleshooting: [docs/troubleshooting-faq.md](./troubleshooting-faq.md)
- Environment setup: [docs/guides/environment-setup.md](./guides/environment-setup.md)

**Common Issues:**
- Check [troubleshooting-faq.md](./troubleshooting-faq.md) first
- Search existing GitHub issues
- Ask in team chat

**Still stuck?**
- Review error messages carefully
- Check environment variables are set correctly
- Verify Docker services are running
- Clear caches with `npm run clean`

---

**Ready to code!** Proceed to [Code Patterns](./development/code-patterns.md) to learn our coding standards.

