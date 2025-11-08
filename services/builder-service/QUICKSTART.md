# Builder Service - Quick Start

Get the builder service running in 5 minutes.

## Prerequisites

- Node.js v20+
- PostgreSQL running (or use shared database)
- Redis running (optional, for future caching)
- Clerk account (for authentication)

---

## Quick Setup

### 1. Install Dependencies (1 min)

```bash
cd services/builder-service
npm install
```

### 2. Environment Setup (2 min)

```bash
# Copy template
cp env.template .env

# Edit .env and set:
# - DATABASE_URL (same as backend)
# - CLERK_SECRET_KEY (from dashboard.clerk.com)
# - CORS_ORIGIN=http://localhost:3000
```

### 3. Generate Prisma Client (1 min)

```bash
npm run db:generate
```

### 4. Start Service (1 min)

```bash
npm run dev
```

✅ Service running on `http://localhost:4002`

---

## Verify It Works

```bash
# Health check
curl http://localhost:4002/healthz

# Should return:
{
  "status": "healthy",
  "service": "builder-service",
  "uptime": 12.345,
  "timestamp": "2025-10-23T..."
}
```

---

## Test API Endpoints

### Get All Designs (requires auth)

```bash
curl http://localhost:4002/api/designs \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```

### Create Design (requires auth)

```bash
curl -X POST http://localhost:4002/api/designs \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "My Test Design",
    "configJson": {
      "size": "M",
      "colorway": "ocean-blue",
      "hardware": "silver"
    }
  }'
```

---

## Common Issues

### ❌ "Database connection failed"

**Fix:** Ensure PostgreSQL is running and DATABASE_URL is correct

```bash
# Test connection
psql $DATABASE_URL -c "SELECT 1"
```

### ❌ "Prisma client not generated"

**Fix:** Run Prisma generation

```bash
npm run db:generate
```

### ❌ "Authentication failed"

**Fix:** Ensure CLERK_SECRET_KEY is set correctly

```bash
# Verify in .env
cat .env | grep CLERK_SECRET_KEY

# Get key from: https://dashboard.clerk.com/ > API Keys
```

---

## Development Commands

```bash
npm run dev              # Start with hot reload
npm run build            # Build for production
npm run start            # Start production build
npm run db:generate      # Generate Prisma client
npm run db:migrate       # Run database migrations
```

---

## Next Steps

1. ✅ Service running locally
2. 📝 Read [Migration Guide](../../docs/guides/BUILDER_SERVICE_MIGRATION.md)
3. 🔄 Integrate with tRPC
4. 🚀 Deploy to staging
5. 📊 Monitor and optimize

---

## Need Help?

- **Full README:** [README.md](./README.md)
- **Migration Guide:** [docs/guides/BUILDER_SERVICE_MIGRATION.md](../../docs/guides/BUILDER_SERVICE_MIGRATION.md)
- **Architecture Docs:** [docs/architecture/](../../docs/architecture/)

