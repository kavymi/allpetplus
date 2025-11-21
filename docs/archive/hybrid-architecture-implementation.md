# Hybrid Microservices Architecture - Implementation Guide

**Date:** October 8, 2025  
**Approach:** Modular Monolith → Extract Services as Needed  
**Status:** In Progress

---

## ✅ Phase 1: Foundation - COMPLETE

### What's Ready:
- ✅ Domain library created (`libs/domain/`)
- ✅ Builder domain with types, validation, pricing
- ✅ User and Order domain types
- ✅ Backend module structure started
- ✅ Builder service class created

### Current Structure:
```
libs/domain/               # ✅ Shared business logic
services/backend/
├── src/
│   ├── modules/          # ✅ NEW: Domain modules
│   │   └── builder/      # ✅ First module
│   └── routes/           # ⚠️ OLD: To be migrated
└── prisma/

services/builder-service/  # 🆕 Prepared for extraction
```

---

## 🚀 Phase 2: Modular Backend (Current)

### Step 1: Update Main Backend to Use Modules

**File:** `services/backend/src/main.ts`

```typescript
import { builderRoutes } from './modules/builder';
// Import other modules as you create them

const buildServer = async () => {
  const server = fastify({ ... });
  
  // Register plugins
  await server.register(dbPlugin);
  await server.register(authPlugin);
  
  // Register module routes
  await server.register(builderRoutes);  // ✅ Module-based
  // await server.register(orderRoutes);
  // await server.register(userRoutes);
  
  return server;
};
```

### Step 2: Migrate Remaining Routes

```bash
# Create order module
services/backend/src/modules/order/
├── service.ts           # Business logic
├── routes.ts            # HTTP endpoints
└── index.ts

# Create user module  
services/backend/src/modules/user/
├── service.ts
├── routes.ts
└── index.ts

# Create webhook module
services/backend/src/modules/webhook/
├── service.ts
├── routes.ts
└── index.ts
```

### Step 3: Add Event System

**Create:** `libs/messaging/` for inter-module communication

```bash
nx g @nx/js:lib messaging --directory=libs/messaging
```

**Purpose:** Allow modules to publish/subscribe to events

```typescript
// libs/messaging/src/lib/event-bus.ts
import { Redis } from 'ioredis';

export class EventBus {
  constructor(private redis: Redis) {}
  
  async publish(event: string, data: any) {
    await this.redis.publish(event, JSON.stringify(data));
  }
  
  async subscribe(event: string, handler: (data: any) => Promise<void>) {
    const subscriber = this.redis.duplicate();
    await subscriber.subscribe(event);
    
    subscriber.on('message', async (channel, message) => {
      if (channel === event) {
        await handler(JSON.parse(message));
      }
    });
  }
}
```

**Usage:**
```typescript
// Builder module publishes
await eventBus.publish('design.created', {
  designId: design.id,
  userId: user.id,
});

// Analytics module subscribes
eventBus.subscribe('design.created', async (event) => {
  await recordAnalyticsEvent(event);
});
```

---

## 🎯 Phase 3: Extract Builder Service (High Traffic)

### When to Extract:
- Builder module is stable
- Clear API boundaries
- Need independent scaling
- Team wants autonomy

### Step 1: Create Standalone Service

```bash
# Use the prepared builder-service directory
cd services/builder-service

# Copy module code
cp -r ../backend/src/modules/builder/* src/

# Add main.ts
```

**File:** `services/builder-service/src/main.ts`

```typescript
import Fastify from 'fastify';
import { builderRoutes } from './routes';
import { dbPlugin } from './plugins/db';

const buildServer = async () => {
  const server = Fastify({
    logger: { level: 'info' }
  });

  // Plugins
  await server.register(dbPlugin);
  
  // Routes
  await server.register(builderRoutes);
  
  return server;
};

const start = async () => {
  const server = await buildServer();
  await server.listen({ port: 4002, host: '0.0.0.0' });
};

start();
```

### Step 2: Update tRPC to Route to Service

**File:** `libs/api/src/routers/designs.ts`

```typescript
import { router, protectedProcedure } from '../trpc';
import { createDesignSchema } from '@pet/domain/builder';

// Service URL from environment
const BUILDER_SERVICE_URL = process.env.BUILDER_SERVICE_URL || 'http://localhost:4002';

export const designsRouter = router({
  create: protectedProcedure
    .input(createDesignSchema)
    .mutation(async ({ input, ctx }) => {
      // Option A: Call builder-service via HTTP
      const response = await fetch(`${BUILDER_SERVICE_URL}/api/designs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': ctx.userId,
        },
        body: JSON.stringify(input),
      });
      
      return response.json();
      
      // Option B: Keep in monolith initially
      // const service = new BuilderService(ctx.db);
      // return service.createDesign(ctx.userId, ctx.userEmail, input);
    }),
});
```

### Step 3: Docker Compose for Multi-Service Development

**File:** `docker-compose.microservices.yml`

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: harness
      POSTGRES_PASSWORD: dev_password
      POSTGRES_DB: harness_hero
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  # Modular Backend (keeps webhook, order, user modules)
  backend:
    build: ./services/backend
    ports:
      - "4000:4000"
    environment:
      DATABASE_URL: postgresql://harness:dev_password@postgres:5432/harness_hero
      REDIS_URL: redis://redis:6379
      PORT: 4000
      BUILDER_SERVICE_URL: http://builder-service:4002
    depends_on:
      - postgres
      - redis
    volumes:
      - ./services/backend:/app
      - /app/node_modules

  # Builder Service (extracted for independent scaling)
  builder-service:
    build: ./services/builder-service
    ports:
      - "4002:4002"
    environment:
      DATABASE_URL: postgresql://harness:dev_password@postgres:5432/harness_hero
      REDIS_URL: redis://redis:6379
      PORT: 4002
    depends_on:
      - postgres
      - redis
    deploy:
      replicas: 2  # Can scale independently!
    volumes:
      - ./services/builder-service:/app
      - /app/node_modules

  # Frontend
  web:
    build: ./apps/web
    ports:
      - "3000:3000"
    environment:
      NEXT_PUBLIC_API_URL: http://backend:4000
      NEXT_PUBLIC_APP_URL: http://localhost:3000
    depends_on:
      - backend
      - builder-service
    volumes:
      - ./apps/web:/app
      - /app/node_modules
      - /app/.next

volumes:
  postgres_data:
  redis_data:
```

---

## 🎯 Development Workflow

### Run Everything Locally:
```bash
# Option 1: All in Docker
docker-compose -f docker-compose.microservices.yml up

# Option 2: Mixed (some Docker, some local)
docker-compose up postgres redis  # Just infrastructure
npm run dev                       # Local dev servers
```

### Run Specific Services:
```bash
# Just builder service
nx serve builder-service

# Just backend
nx serve backend

# All services in parallel
nx run-many --target=serve --projects=backend,builder-service --parallel=2
```

---

## 📊 Service Communication Matrix

### Current (Modular Monolith):
```
Frontend → tRPC → Backend (single process)
                    ├── Builder Module
                    ├── Order Module
                    ├── User Module
                    └── Webhook Module
```

### After Extraction (Hybrid):
```
Frontend → tRPC → API Gateway (tRPC)
                    ├── Builder Service (Port 4002) ← Extracted!
                    ├── Backend Monolith (Port 4000)
                    │   ├── Order Module
                    │   ├── User Module
                    │   └── Webhook Module
                    └── Shared: @pet/domain
```

### Future (Full Microservices):
```
Frontend → tRPC → API Gateway
                    ├── Builder Service (4002)
                    ├── Order Service (4003)
                    ├── User Service (4001)
                    ├── Webhook Service (4004)
                    └── Analytics Service (4005)
```

---

## 🔧 Implementation Checklist

### Modular Backend (Week 1)
- [x] Create `src/modules/` structure
- [x] Implement Builder module (service + routes)
- [ ] Migrate orders routes to Order module
- [ ] Migrate user/auth to User module
- [ ] Create webhook module
- [ ] Update main.ts to register modules
- [ ] Test all endpoints work

### Extract Builder Service (Week 2)
- [ ] Create `services/builder-service/` project
- [ ] Copy builder module code
- [ ] Add Dockerfile
- [ ] Add health checks
- [ ] Update tRPC to route to service
- [ ] Test with docker-compose
- [ ] Deploy to staging

### Add Communication Layer (Week 3)
- [ ] Create `libs/messaging/` library
- [ ] Implement Redis event bus
- [ ] Add event publishers to modules
- [ ] Add event subscribers
- [ ] Test event flow

### Production Ready (Week 4)
- [ ] Add monitoring (Prometheus metrics)
- [ ] Add distributed tracing
- [ ] Setup CI/CD per service
- [ ] Create Kubernetes manifests
- [ ] Load testing
- [ ] Documentation complete

---

## 💡 Migration Decision Points

### When to Extract a Module:

**Extract if:**
- ✅ Module has >1000 requests/minute
- ✅ Needs different scaling (CPU vs Memory)
- ✅ Team wants independent deployment
- ✅ Technology change needed (e.g., Go for performance)

**Keep in Monolith if:**
- ❌ Low traffic (<100 requests/minute)
- ❌ Tightly coupled with other modules
- ❌ Small codebase (<500 lines)
- ❌ Shared database transactions needed

### Recommended Extraction Order:

1. **Builder Service** (First) - High traffic, CPU intensive
2. **Webhook Service** (Second) - Spiky load, needs auto-scaling
3. **Analytics Service** (Third) - Different database needs
4. **Order/User** (Last) - Can stay in monolith longer

---

## 🐳 Docker Configuration

### Builder Service Dockerfile

**File:** `services/builder-service/Dockerfile`

```dockerfile
FROM node:20-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
COPY services/builder-service/package*.json ./services/builder-service/
RUN npm ci --workspace=services/builder-service

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx nx build builder-service --configuration=production

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV production

COPY --from=builder /app/dist/services/builder-service ./
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 4002
CMD ["node", "main.js"]
```

---

## 📈 Scaling Strategy

### Horizontal Scaling (Kubernetes/Fly.io):
```yaml
# builder-service can scale to 10 instances
builder-service:
  replicas: 2
  autoscaling:
    min: 2
    max: 10
    cpu: 70%
    memory: 80%

# Backend monolith scales conservatively
backend:
  replicas: 1
  autoscaling:
    min: 1
    max: 3
```

---

## 🎯 Success Criteria

### Module Organization:
- [x] Clear domain boundaries
- [x] Shared business logic in `@pet/domain`
- [ ] Service classes for each module
- [ ] Routes use services (not direct DB)

### Builder Service Extraction:
- [ ] Independent deployment
- [ ] Own Docker container
- [ ] Scales separately
- [ ] Communicates via tRPC

### Type Safety:
- [x] 100% across services
- [x] Shared types via `@pet/domain`
- [x] Zod validation everywhere
- [x] tRPC end-to-end

---

## 📚 Related Documentation

- **Microservices Plan:** `/docs/architecture/microservices-architecture.md`
- **Domain Library:** `libs/domain/src/lib/`
- **tRPC Setup:** `/docs/guides/trpc-implementation-complete.md`
- **Current Status:** `/MICROSERVICES_IMPLEMENTATION_STATUS.md`

---

**Next:** Complete backend module migration, then extract builder-service!
