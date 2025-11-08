# Builder Service Migration Guide

**Status:** ✅ Code Migration Complete  
**Date:** October 23, 2025  
**Migration Type:** Backend Monolith → Microservice

---

## Overview

The builder functionality (design CRUD operations) has been extracted from the backend monolith into a standalone microservice at `services/builder-service/`.

## What Was Migrated

### Code Migration Complete ✅

1. **Business Logic**
   - Source: `services/backend/src/modules/builder/service.ts`
   - Destination: `services/builder-service/src/services/builder.service.ts`
   - Status: ✅ Copied with full functionality

2. **API Routes**
   - Source: `services/backend/src/routes/designs.ts`
   - Destination: `services/builder-service/src/routes/designs.ts`
   - Status: ✅ All endpoints migrated

3. **Plugins & Infrastructure**
   - Database plugin: ✅ Created
   - Auth plugin (Clerk): ✅ Created
   - Health checks: ✅ Implemented
   - Rate limiting: ✅ Configured

4. **Configuration**
   - Docker: ✅ Ready
   - Fly.io deployment: ✅ Ready
   - Environment variables: ✅ Documented
   - TypeScript config: ✅ Set up

### Backward Compatibility ✅

The original routes in the backend are kept with deprecation warnings for gradual migration.

---

## Migration Phases

### Phase 1: Code Migration ✅ COMPLETE

- [x] Copy BuilderService to builder-service
- [x] Create database and auth plugins
- [x] Migrate all design routes
- [x] Update main.ts with all plugins
- [x] Mark backend routes as deprecated
- [x] Create Prisma schema
- [x] Update package.json dependencies

### Phase 2: Testing & Integration ⏳ NEXT

- [ ] Test builder-service locally
- [ ] Update tRPC router to point to builder-service
- [ ] Integration tests
- [ ] Load testing

### Phase 3: Deployment 📋 PLANNED

- [ ] Deploy to staging
- [ ] Smoke tests
- [ ] Deploy to production
- [ ] Monitor traffic
- [ ] Remove deprecated backend routes

---

## Local Development Setup

### 1. Install Dependencies

```bash
cd services/builder-service
npm install
```

### 2. Setup Environment

```bash
cp env.template .env
```

Edit `.env` and add:
- `DATABASE_URL` - Use same as backend
- `CLERK_SECRET_KEY` - Get from Clerk dashboard
- `CORS_ORIGIN` - Set to `http://localhost:3000`

### 3. Generate Prisma Client

```bash
npm run db:generate
```

### 4. Start Service

```bash
npm run dev
```

Service runs on `http://localhost:4002`

### 5. Test Endpoints

```bash
# Health check
curl http://localhost:4002/healthz

# Readiness check
curl http://localhost:4002/ready

# Get designs (requires auth)
curl http://localhost:4002/api/designs \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```

---

## API Endpoints

All endpoints migrated from backend:

### Authenticated Endpoints

```
POST   /api/designs           Create design
GET    /api/designs           List designs (paginated)
GET    /api/designs/:id       Get single design
PATCH  /api/designs/:id       Update design
DELETE /api/designs/:id       Delete design (soft delete)
```

### Public Endpoints

```
GET    /api/designs/shared/:token    Get shared design
```

### Health & Monitoring

```
GET    /healthz    Health check
GET    /ready      Readiness check
GET    /           Service info
```

---

## Production Deployment

### Prerequisites

1. **Environment Variables Set**
   ```bash
   fly secrets set \
     DATABASE_URL="postgresql://..." \
     CLERK_SECRET_KEY="sk_..." \
     CORS_ORIGIN="https://yourdomain.com" \
     --app harness-builder-prod
   ```

2. **Fly.io App Created**
   ```bash
   fly apps create harness-builder-prod
   ```

### Deploy Command

```bash
cd services/builder-service
fly deploy --config fly.toml
```

### Verify Deployment

```bash
# Check health
curl https://harness-builder-prod.fly.dev/healthz

# Check logs
fly logs -a harness-builder-prod
```

---

## Traffic Routing Strategy

### Option 1: Gradual Migration (Recommended)

1. Deploy builder-service to production
2. Update tRPC router to route 10% traffic to new service
3. Monitor for 24 hours
4. Increase to 50% traffic
5. Monitor for 24 hours
6. Route 100% traffic
7. Remove deprecated backend routes

### Option 2: Feature Flag

Use feature flags to control routing:

```typescript
// libs/api/src/routers/designs.ts
const useBuilderService = process.env.USE_BUILDER_SERVICE === 'true';
const serviceUrl = useBuilderService 
  ? process.env.BUILDER_SERVICE_URL 
  : process.env.BACKEND_URL;
```

---

## Monitoring & Observability

### Key Metrics to Track

1. **Request Rate**
   - Target: < 1000 req/min (stay in monolith)
   - If > 1000 req/min: Scale builder-service

2. **Response Time**
   - Target: p95 < 200ms
   - Alert if p95 > 500ms

3. **Error Rate**
   - Target: < 0.1%
   - Alert if > 1%

4. **Database Connections**
   - Monitor connection pool usage
   - Scale if approaching limits

### Health Checks

```bash
# Detailed health (includes DB status)
curl https://harness-builder-prod.fly.dev/healthz

# Expected response:
{
  "status": "healthy",
  "service": "builder-service",
  "uptime": 12345,
  "timestamp": "2025-10-23T..."
}
```

---

## Rollback Plan

If issues arise after deployment:

### Quick Rollback

```bash
# Stop routing to builder-service
fly scale count 0 -a harness-builder-prod

# Traffic falls back to backend monolith
```

### Full Rollback

```bash
# Revert tRPC router changes
git revert <commit-hash>

# Redeploy backend
cd services/backend
fly deploy --config fly.prod.toml
```

---

## Post-Migration Cleanup

After successful migration (30+ days stable):

1. **Remove Deprecated Code**
   ```bash
   # Remove from backend
   rm services/backend/src/routes/designs.ts
   rm -rf services/backend/src/modules/builder/
   ```

2. **Update Documentation**
   - Mark migration as complete
   - Update architecture diagrams
   - Update API documentation

3. **Archive Migration Docs**
   - Move this file to `/docs/archive/`

---

## Troubleshooting

### Issue: "Database connection failed"

**Solution:**
```bash
# Verify DATABASE_URL is set
fly secrets list -a harness-builder-prod

# Test connection manually
fly ssh console -a harness-builder-prod
# Then: psql $DATABASE_URL
```

### Issue: "Authentication failed"

**Solution:**
```bash
# Verify CLERK_SECRET_KEY is set
fly secrets list -a harness-builder-prod

# Ensure it matches production key from Clerk dashboard
```

### Issue: "CORS errors"

**Solution:**
```bash
# Update CORS_ORIGIN
fly secrets set CORS_ORIGIN="https://yourdomain.com" \
  --app harness-builder-prod
```

---

## Architecture Diagram

```
Before Migration:
Frontend → tRPC → Backend Monolith → Database
                     ↓
                  (all routes)

After Migration:
Frontend → tRPC → Builder Service → Database (shared)
              ↓
            Backend Monolith → Database
              ↓
          (other routes)
```

---

## Related Documentation

- [Hybrid Architecture Implementation](/docs/architecture/hybrid-architecture-implementation.md)
- [Microservices Architecture](/docs/architecture/microservices-architecture.md)
- [Creating New Microservice](/docs/guides/CREATE_NEW_MICROSERVICE.md)
- [Backend Deployment](/docs/ops/backend-deployment.md)

---

## Migration Checklist

### Pre-Deployment
- [x] Code migrated to builder-service
- [x] Plugins created (DB, Auth)
- [x] Routes migrated
- [x] Docker configuration ready
- [x] Fly.io configuration ready
- [ ] Local testing complete
- [ ] Environment variables documented

### Deployment
- [ ] Staging deployment
- [ ] Staging tests pass
- [ ] Production deployment
- [ ] Health checks green
- [ ] Traffic routing configured

### Post-Deployment
- [ ] Monitor for 24 hours
- [ ] No increase in errors
- [ ] Response times acceptable
- [ ] Remove deprecated code (after 30 days)
- [ ] Update documentation

---

**Questions or Issues?**  
Contact: @backend-team or create an issue in the repository

