# Builder Service

**Status:** ✅ Migrated and Ready for Deployment  
**Port:** 4002  
**Purpose:** Handles design CRUD operations independently from the main backend

---

## Status

This service has been **fully migrated** from the backend monolith and is ready for deployment. It follows the [hybrid architecture pattern](../../docs/architecture/hybrid-architecture-implementation.md).

### Current State:
- ✅ Full service structure (Fastify, Prisma, health checks)
- ✅ Docker configuration ready
- ✅ Fly.io deployment config ready
- ✅ Routes migrated from backend
- ✅ Authentication (Clerk) integrated
- ✅ Database access configured
- ⏳ Needs tRPC integration for production use

### Ready to Deploy When:
- Builder traffic exceeds 1000 req/min
- Builder needs independent scaling
- Builder team needs separate deployment pipeline

---

## Quick Start (Local Development)

```bash
# Install dependencies
npm install

# Setup environment
cp env.template .env
# Edit .env with your DATABASE_URL and REDIS_URL

# Start service
npm run dev

# Service runs on http://localhost:4002
```

---

## Health Checks

```bash
# Health check
curl http://localhost:4002/healthz

# Readiness check
curl http://localhost:4002/ready
```

---

## Extraction Process

When ready to extract builder functionality from the monolith:

### 1. Migrate Business Logic
```bash
# Copy from services/backend/src/modules/builder/
cp -r ../backend/src/modules/builder/service.ts src/services/
```

### 2. Add Routes
```typescript
// src/routes/designs.ts
import { BuilderService } from '../services/service';

export async function designRoutes(fastify: FastifyInstance) {
  const builderService = new BuilderService(fastify.db);

  fastify.get('/api/designs', async (request, reply) => {
    // Implementation from backend module
  });
}
```

### 3. Update tRPC
```typescript
// libs/api/src/routers/designs.ts
// Route to builder-service instead of backend
const BUILDER_SERVICE_URL = process.env.BUILDER_SERVICE_URL || 'http://localhost:4002';
```

### 4. Deploy
```bash
# Deploy to Fly.io
fly deploy --config fly.toml
```

---

## Architecture

```
Frontend → tRPC → Builder Service (Port 4002)
                    ├── Fastify HTTP Server
                    ├── Prisma (shared DB)
                    ├── Redis (shared cache)
                    └── Uses @pet/domain (shared types)
```

---

## Environment Variables

See `env.template` for required configuration:

- `PORT` - Service port (default: 4002)
- `DATABASE_URL` - PostgreSQL connection
- `REDIS_URL` - Redis connection
- `CORS_ORIGIN` - Allowed origins
- `LOG_LEVEL` - Logging level

---

## Development Commands

```bash
npm run dev          # Start in development mode
npm run build        # Build for production
npm run start        # Start production build
npm run lint         # Run linting
npm run typecheck    # TypeScript checking
```

---

## Docker

```bash
# Build image
docker build -t builder-service .

# Run container
docker run -p 4002:4002 --env-file .env builder-service
```

---

## Documentation

- [Hybrid Architecture Implementation](../../docs/architecture/hybrid-architecture-implementation.md)
- [Microservices Architecture](../../docs/architecture/microservices-architecture.md)
- [Creating New Microservice Guide](../../docs/guides/CREATE_NEW_MICROSERVICE.md)

---

## Related

- **Backend Module:** `services/backend/src/modules/builder/`
- **Domain Logic:** `libs/domain/src/lib/builder/`
- **tRPC Router:** `libs/api/src/routers/designs.ts`

