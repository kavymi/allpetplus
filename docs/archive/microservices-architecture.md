# Microservices Architecture - All Pet Plus

**Date:** October 8, 2025  
**Status:** Design Complete, Ready for Implementation  
**Approach:** Domain-Driven Design with NX Monorepo

---

## Executive Summary

Transform All Pet Plus from a monolithic backend into a scalable microservices architecture while maintaining monorepo benefits. Split by **business domains** for clear boundaries and independent scaling.

### Key Benefits:
- ✅ **Independent deployment** - Deploy services separately
- ✅ **Scalability** - Scale high-traffic services independently
- ✅ **Team ownership** - Clear service boundaries
- ✅ **Technology flexibility** - Different stacks per service if needed
- ✅ **Fault isolation** - One service failure doesn't crash everything
- ✅ **Monorepo benefits** - Shared code, coordinated releases, single repo

---

## Domain Analysis

### Identified Business Domains

Based on Prisma schema and component structure:

| Domain | Current Models | Complexity | Traffic | Priority |
|--------|---------------|------------|---------|----------|
| **User** | UserProfile | Low | Medium | P1 |
| **Builder** | SavedDesign, BuilderPreset | High | High | P1 |
| **Order** | OrderMeta | Medium | High | P1 |
| **Webhook** | WebhookLog | Medium | Spiky | P2 |
| **Analytics** | AnalyticsEvent, ExperimentAssignment | Low | Very High | P2 |
| **Audit** | AuditLog, CacheInvalidation | Low | Medium | P3 |

---

## Proposed Microservices Architecture

### Backend Services Structure

```
services/
├── user-service/               # 🆕 User authentication & profiles
│   ├── src/
│   │   ├── main.ts
│   │   ├── routes/
│   │   │   ├── auth.ts
│   │   │   ├── profiles.ts
│   │   │   └── preferences.ts
│   │   └── workers/
│   │       └── user-sync.ts
│   └── prisma/
│       └── schema.prisma      # User domain only
│
├── builder-service/            # 🆕 Design management
│   ├── src/
│   │   ├── main.ts
│   │   ├── routes/
│   │   │   ├── designs.ts     # Move from backend
│   │   │   ├── presets.ts
│   │   │   └── sharing.ts
│   │   └── workers/
│   │       ├── preview-render.ts
│   │       └── design-optimize.ts
│   └── prisma/
│       └── schema.prisma      # Builder domain only
│
├── order-service/              # 🆕 Order tracking
│   ├── src/
│   │   ├── main.ts
│   │   ├── routes/
│   │   │   ├── orders.ts      # Move from backend
│   │   │   ├── tracking.ts
│   │   │   └── status.ts
│   │   └── workers/
│   │       ├── order-fulfillment.ts
│   │       └── notification.ts
│   └── prisma/
│       └── schema.prisma      # Order domain only
│
├── webhook-service/            # 🆕 Webhook processing
│   ├── src/
│   │   ├── main.ts
│   │   ├── routes/
│   │   │   ├── shopify.ts
│   │   │   ├── stripe.ts
│   │   │   └── internal.ts
│   │   └── workers/
│   │       ├── webhook-processor.ts
│   │       └── webhook-replay.ts
│   └── prisma/
│       └── schema.prisma      # Webhook domain only
│
├── analytics-service/          # 🆕 Analytics & experiments
│   ├── src/
│   │   ├── main.ts
│   │   ├── routes/
│   │   │   ├── events.ts
│   │   │   ├── experiments.ts
│   │   │   └── reports.ts
│   │   └── workers/
│   │       ├── event-aggregation.ts
│   │       └── export-data.ts
│   └── prisma/
│       └── schema.prisma      # Analytics domain only
│
└── api-gateway/                # 🆕 Central entry point (optional)
    ├── src/
    │   ├── main.ts
    │   ├── routes/
    │   │   └── proxy.ts       # Route to services
    │   └── middleware/
    │       ├── auth.ts
    │       ├── rate-limit.ts
    │       └── logging.ts
    └── config/
        └── service-registry.ts
```

### Frontend Apps Structure

```
apps/
├── web/                        # ✅ Existing - Customer storefront
│   └── src/
│       ├── app/
│       │   ├── (builder)/     # Builder flow
│       │   ├── (catalog)/     # Product catalog
│       │   ├── (checkout)/    # Cart & checkout
│       │   └── (tracking)/    # Order tracking
│       └── components/
│
├── admin/                      # 🆕 Admin dashboard
│   └── src/
│       ├── app/
│       │   ├── (orders)/      # Order management
│       │   ├── (products)/    # Product management
│       │   ├── (analytics)/   # Analytics dashboard
│       │   └── (settings)/    # Admin settings
│       └── components/
│
└── mobile/                     # 🆕 Future - React Native
    └── src/
        ├── screens/
        ├── components/
        └── navigation/
```

### Shared Libraries

```
libs/
├── api/                        # ✅ Existing - tRPC routers
│   └── src/
│       └── routers/
│           ├── user.ts         # 🆕 User operations
│           ├── builder.ts      # 🆕 Renamed from designs
│           ├── order.ts        # 🆕 Order operations
│           ├── analytics.ts    # 🆕 Analytics operations
│           └── webhooks.ts     # 🆕 Webhook operations
│
├── domain/                     # 🆕 Business logic & types
│   └── src/lib/
│       ├── user/
│       │   ├── types.ts
│       │   ├── validation.ts
│       │   └── utils.ts
│       ├── builder/
│       │   ├── types.ts
│       │   ├── validation.ts
│       │   ├── pricing.ts
│       │   └── config.ts
│       ├── order/
│       │   ├── types.ts
│       │   ├── validation.ts
│       │   └── status-machine.ts
│       └── commerce/
│           ├── types.ts
│           ├── pricing.ts
│           └── shopify.ts
│
├── shared/                     # ✅ Existing - Common utilities
│   └── src/lib/
│       ├── utils/
│       ├── constants/
│       └── types/
│
├── messaging/                  # 🆕 Inter-service communication
│   └── src/
│       ├── events/
│       │   ├── user-events.ts
│       │   ├── order-events.ts
│       │   └── builder-events.ts
│       ├── pubsub.ts
│       └── event-bus.ts
│
└── database/                   # 🆕 Shared database utilities
    └── src/
        ├── migrations/
        ├── seeds/
        └── utils/
            ├── connection-pool.ts
            └── transaction-manager.ts
```

---

## Service Communication Patterns

### 1. **tRPC for Client ↔ Services**
```typescript
// Frontend calls services via tRPC
const { data } = trpc.builder.designs.list.useQuery();

// tRPC router aggregates from multiple services
export const appRouter = router({
  user: userServiceRouter,      // → user-service
  builder: builderServiceRouter, // → builder-service
  order: orderServiceRouter,     // → order-service
  analytics: analyticsServiceRouter, // → analytics-service
});
```

### 2. **Service-to-Service Communication**

#### Option A: Direct HTTP (Simple)
```typescript
// builder-service calls user-service
const userResponse = await fetch('http://user-service:4001/api/users/profile', {
  headers: { 'x-internal-key': process.env.INTERNAL_API_KEY }
});
```

#### Option B: Message Queue (Recommended)
```typescript
// builder-service publishes event
await eventBus.publish('design.created', {
  userId: 'user_123',
  designId: 'design_456',
});

// analytics-service subscribes
eventBus.subscribe('design.created', async (event) => {
  await recordAnalyticsEvent(event);
});
```

#### Option C: tRPC Server-to-Server (Type-Safe)
```typescript
// Each service exports its tRPC router
// Other services can import and call directly
import { userServiceCaller } from '@pet/user-service/trpc';

const user = await userServiceCaller.getProfile({ id: userId });
```

### 3. **Event-Driven Architecture**

```
┌──────────────┐         ┌──────────────┐
│    Builder   │─Event─►│  Redis/NATS  │
│   Service    │         │  Event Bus   │
└──────────────┘         └──────┬───────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
                    ▼           ▼           ▼
            ┌──────────┐ ┌──────────┐ ┌──────────┐
            │Analytics │ │  Email   │ │  Audit   │
            │ Service  │ │ Service  │ │ Service  │
            └──────────┘ └──────────┘ └──────────┘
```

---

## Database Strategy

### Option 1: Database Per Service (Recommended)
```
user-service → users_db
builder-service → builder_db
order-service → orders_db
analytics-service → analytics_db
```

**Pros:**
- ✅ True service independence
- ✅ Optimized schemas per domain
- ✅ Independent scaling
- ✅ Technology flexibility

**Cons:**
- ⚠️ No foreign keys across services
- ⚠️ Distributed transactions needed
- ⚠️ More complex queries

### Option 2: Shared Database with Schema Separation
```
shared_postgres
├── user_schema
├── builder_schema
├── order_schema
└── analytics_schema
```

**Pros:**
- ✅ Easier to start
- ✅ Can use foreign keys
- ✅ Simple transactions

**Cons:**
- ⚠️ Services coupled at DB level
- ⚠️ Harder to scale independently
- ⚠️ Schema migrations affect all

**Recommendation:** Start with Option 2, migrate to Option 1 when needed

---

## Service Deployment Matrix

### Development
```
Local Docker Compose:
- user-service:4001
- builder-service:4002
- order-service:4003
- webhook-service:4004
- analytics-service:4005
- web:3000
- admin:3001
```

### Staging/Production
```
Cloud Platform (Fly.io / AWS ECS / Kubernetes):
- user-service (1-2 instances)
- builder-service (2-4 instances, high traffic)
- order-service (1-2 instances)
- webhook-service (1-2 instances, auto-scale on spikes)
- analytics-service (1-2 instances)

Frontend (Vercel):
- web (edge + serverless)
- admin (serverless)
```

---

## Implementation Roadmap

### Phase 1: Foundation (Week 1-2)

#### Step 1: Create Domain Library
```bash
nx g @nx/js:lib domain --directory=libs/domain
```

**Contents:**
- Extract types from current schema
- Create Zod validation schemas
- Business logic utilities
- Domain events

#### Step 2: Create Messaging Library
```bash
nx g @nx/js:lib messaging --directory=libs/messaging
```

**Contents:**
- Event bus abstraction
- Event types
- PubSub implementation (Redis/NATS)

#### Step 3: Split Current Backend
```bash
# Keep existing backend, create new services alongside
nx g @nx/node:app user-service --directory=services/user-service
nx g @nx/node:app builder-service --directory=services/builder-service
nx g @nx/node:app order-service --directory=services/order-service
```

### Phase 2: Migration (Week 3-4)

#### Step 4: Migrate Routes to Services
```
backend/src/routes/designs.ts → builder-service/src/routes/designs.ts
backend/src/routes/orders.ts → order-service/src/routes/orders.ts
```

#### Step 5: Update tRPC Routers
```typescript
// libs/api/src/routers/builder.ts (calls builder-service)
export const builderRouter = router({
  designs: {
    list: protectedProcedure
      .input(...)
      .query(async ({ ctx, input }) => {
        // Calls builder-service internally
        return await builderServiceClient.getDesigns(ctx.userId, input);
      }),
  },
});
```

#### Step 6: Setup Inter-Service Communication
- Redis event bus for async events
- Direct HTTP for synchronous calls
- Shared database initially

### Phase 3: Optimization (Week 5-6)

#### Step 7: Add API Gateway (Optional)
- Central authentication
- Rate limiting
- Request routing
- Load balancing

#### Step 8: Database Separation
- Split schemas into separate databases
- Implement data replication where needed
- Handle distributed transactions

#### Step 9: Independent Deployment
- Docker containers per service
- Kubernetes/Fly.io deployment
- Service mesh (optional)
- Health checks and monitoring

---

## Detailed Service Design

### 1. User Service

**Port:** 4001  
**Purpose:** Authentication, user profiles, preferences

**API:**
```typescript
// tRPC router
userRouter = router({
  profile: {
    get: protectedProcedure.query(),
    update: protectedProcedure.mutation(),
  },
  preferences: {
    get: protectedProcedure.query(),
    update: protectedProcedure.mutation(),
  },
});
```

**Database:**
- UserProfile
- UserPreferences (new table)
- UserSessions (new table)

**Events Published:**
- `user.created`
- `user.updated`
- `user.deleted`

### 2. Builder Service

**Port:** 4002  
**Purpose:** Design CRUD, presets, sharing

**API:**
```typescript
builderRouter = router({
  designs: {
    list: protectedProcedure.query(),
    byId: protectedProcedure.query(),
    create: protectedProcedure.mutation(),
    update: protectedProcedure.mutation(),
    delete: protectedProcedure.mutation(),
    share: protectedProcedure.mutation(),
  },
  presets: {
    list: publicProcedure.query(),
    byCategory: publicProcedure.query(),
  },
});
```

**Database:**
- SavedDesign
- BuilderPreset
- DesignShare (new table)

**Events Published:**
- `design.created`
- `design.updated`
- `design.deleted`
- `design.shared`

**Events Subscribed:**
- `order.created` (update design status)

### 3. Order Service

**Port:** 4003  
**Purpose:** Order tracking, status updates

**API:**
```typescript
orderRouter = router({
  lookup: publicProcedure.input(...).query(),
  status: publicProcedure.input(...).query(),
  reorder: protectedProcedure.mutation(),
});
```

**Database:**
- OrderMeta
- OrderTimeline (new table)
- ShipmentTracking (new table)

**Events Published:**
- `order.created`
- `order.status_changed`
- `order.shipped`
- `order.delivered`

**Events Subscribed:**
- `webhook.order_created` (from webhook-service)
- `webhook.order_updated`

### 4. Webhook Service

**Port:** 4004  
**Purpose:** External webhook processing

**API:**
```typescript
// Public endpoints for external services
POST /webhooks/shopify/orders
POST /webhooks/shopify/products
POST /webhooks/stripe/payment
```

**Database:**
- WebhookLog
- WebhookRetry (new table)

**Events Published:**
- `webhook.order_created`
- `webhook.order_updated`
- `webhook.product_updated`

**Workers:**
- Webhook replay
- Failed webhook retry
- Idempotency checking

### 5. Analytics Service

**Port:** 4005  
**Purpose:** Event tracking, A/B testing, reporting

**API:**
```typescript
analyticsRouter = router({
  events: {
    track: publicProcedure.mutation(),
    query: protectedProcedure.query(),
  },
  experiments: {
    assign: publicProcedure.mutation(),
    getVariant: publicProcedure.query(),
  },
  reports: {
    builderFunnel: protectedProcedure.query(),
    conversionRate: protectedProcedure.query(),
  },
});
```

**Database:**
- AnalyticsEvent
- ExperimentAssignment
- AggregatedMetrics (new table)

**Events Subscribed:**
- All events (for analytics)

**Workers:**
- Event aggregation
- Report generation
- Data export

---

## Service Communication Architecture

### Synchronous (Request-Response)

```
Frontend (Next.js)
    ↓ tRPC over HTTP
tRPC API Gateway (libs/api)
    ↓ Route to service
Individual Services
    ↓ Prisma
Database(s)
```

### Asynchronous (Event-Driven)

```
Service A
    ↓ Publish event
Redis/NATS Event Bus
    ↓ Fan-out
Service B, C, D (subscribers)
    ↓ Process independently
Update their databases
```

---

## Shared Code Strategy

### What Lives Where:

#### libs/domain/ (Shared Business Logic)
```typescript
// All services import from here
import { BuilderConfig, validateDesign } from '@pet/domain/builder';
import { OrderStatus, calculateShipping } from '@pet/domain/order';
import { UserRole, hasPermission } from '@pet/domain/user';
```

#### libs/api/ (tRPC Aggregation Layer)
```typescript
// Frontend only knows about this
import { trpc } from '@pet/api';

// Internally, routes to correct service
export const appRouter = router({
  user: createServiceRouter('user-service'),
  builder: createServiceRouter('builder-service'),
  order: createServiceRouter('order-service'),
  analytics: createServiceRouter('analytics-service'),
});
```

#### libs/messaging/ (Event System)
```typescript
// All services use this for events
import { eventBus } from '@pet/messaging';

await eventBus.publish('design.created', payload);
```

---

## Deployment Strategy

### Local Development
```yaml
# docker-compose.microservices.yml
services:
  postgres:
    image: postgres:15
    ports: ["5432:5432"]
  
  redis:
    image: redis:7
    ports: ["6379:6379"]
  
  user-service:
    build: ./services/user-service
    ports: ["4001:4001"]
    depends_on: [postgres, redis]
  
  builder-service:
    build: ./services/builder-service
    ports: ["4002:4002"]
    depends_on: [postgres, redis]
  
  order-service:
    build: ./services/order-service
    ports: ["4003:4003"]
    depends_on: [postgres, redis]
  
  webhook-service:
    build: ./services/webhook-service
    ports: ["4004:4004"]
    depends_on: [postgres, redis]
  
  analytics-service:
    build: ./services/analytics-service
    ports: ["4005:4005"]
    depends_on: [postgres, redis]
```

### Production (Kubernetes/Fly.io)
```yaml
# Each service gets:
- Auto-scaling (2-10 instances)
- Health checks
- Rolling deployments
- Service mesh (optional)
- Distributed tracing
```

---

## Migration Strategy

### Phase 1: Foundation (Week 1-2) ✨ START HERE

1. **Create Domain Library**
   ```bash
   nx g @nx/js:lib domain --directory=libs/domain
   ```

2. **Extract Business Logic**
   - Move types to `libs/domain/`
   - Create validation schemas
   - Extract business rules

3. **Create Messaging Library**
   ```bash
   nx g @nx/js:lib messaging --directory=libs/messaging
   ```

4. **Setup Event Bus**
   - Redis PubSub or NATS
   - Event type definitions
   - Publish/subscribe utilities

### Phase 2: Create Services (Week 3-4)

5. **Generate Service Projects**
   ```bash
   nx g @nx/node:app builder-service --directory=services
   nx g @nx/node:app order-service --directory=services
   nx g @nx/node:app user-service --directory=services
   ```

6. **Copy & Adapt Code**
   - Copy routes from `backend/`
   - Update imports to use `@pet/domain`
   - Add event publishing

7. **Update tRPC Routers**
   - Point to new services
   - Maintain same API contract

### Phase 3: Run Parallel (Week 5)

8. **Run Both Architectures**
   - Keep old `backend` running
   - Deploy new services alongside
   - Route subset of traffic to new services

9. **Validate**
   - Test all endpoints
   - Monitor performance
   - Compare metrics

### Phase 4: Full Migration (Week 6)

10. **Switch Traffic**
    - Gradually increase to 100%
    - Monitor for issues
    - Quick rollback if needed

11. **Deprecate Old Backend**
    - Archive old `services/backend`
    - Remove after 1 month safety period

---

## Service Sizing Guidelines

### Resource Allocation

| Service | CPU | Memory | Instances | Scaling |
|---------|-----|--------|-----------|---------|
| **user-service** | 0.5 vCPU | 512MB | 1-2 | Low traffic |
| **builder-service** | 1 vCPU | 1GB | 2-4 | High traffic, CPU intensive |
| **order-service** | 0.5 vCPU | 512MB | 1-2 | Medium traffic |
| **webhook-service** | 0.5 vCPU | 512MB | 1-4 | Spiky, auto-scale |
| **analytics-service** | 1 vCPU | 2GB | 1-2 | Memory intensive |

### Database Sizing

| Database | Size | Connections | Backups |
|----------|------|-------------|---------|
| **users_db** | 10GB | 10 | Daily |
| **builder_db** | 50GB | 20 | Hourly |
| **orders_db** | 100GB | 15 | Hourly |
| **analytics_db** | 500GB | 25 | Daily |

---

## Monitoring & Observability

### Per-Service Monitoring
```typescript
// Each service exports metrics
GET /healthz     # Health check
GET /metrics     # Prometheus metrics
GET /ready       # Readiness probe
```

### Distributed Tracing
```typescript
// OpenTelemetry integration
import { trace } from '@opentelemetry/api';

const span = trace.getTracer('builder-service').startSpan('create-design');
// ... operation
span.end();
```

### Centralized Logging
```
All services → Fluentd → Elasticsearch → Kibana
```

---

## Frontend Modularity (Micro-Frontends)

### Approach: Module Federation

```
apps/
├── web/                    # Main shell app
│   └── Loads remote modules dynamically
│
├── builder-module/         # 🆕 Builder micro-frontend
│   └── Independently deployable builder UI
│
├── catalog-module/         # 🆕 Catalog micro-frontend
│   └── Product listing and PDP
│
└── admin-module/           # 🆕 Admin micro-frontend
    └── Admin dashboard
```

### Module Federation Config

```javascript
// apps/web/next.config.js
module.exports = {
  experimental: {
    moduleFederation: {
      builder: 'builder@http://builder-cdn.com/remoteEntry.js',
      catalog: 'catalog@http://catalog-cdn.com/remoteEntry.js',
    },
  },
};
```

**Benefits:**
- Independent deployment
- Lazy loading
- Version isolation
- Team autonomy

---

## Cost-Benefit Analysis

### Monolith vs Microservices

| Factor | Monolith | Microservices | Winner |
|--------|----------|---------------|--------|
| **Deployment** | Simple | Complex | Monolith (initially) |
| **Scalability** | Limited | Excellent | Microservices |
| **Development Speed** | Fast (initially) | Faster (long-term) | Depends on scale |
| **Debugging** | Easy | Harder | Monolith |
| **Resource Usage** | Efficient | More overhead | Monolith (small scale) |
| **Team Autonomy** | Limited | High | Microservices |
| **Technology Flexibility** | None | High | Microservices |
| **Type Safety** | Easy | Needs planning | Monolith + tRPC |

### When to Use Microservices

✅ **Good reasons:**
- Team has >5 developers
- Different domains need different scaling
- Want independent deployment cycles
- Clear domain boundaries exist

⚠️ **Bad reasons:**
- "It's trendy"
- Team is <3 developers
- No clear domain boundaries
- Premature optimization

### Recommendation for All Pet Plus

**Start with:** **"Modular Monolith"** → Migrate to microservices incrementally

```
Current: Monolithic backend
    ↓
Step 1: Modular monolith (separate modules, shared process)
    ↓
Step 2: Separate processes (still shared DB)
    ↓
Step 3: Separate databases (true microservices)
```

---

## Alternative: Modular Monolith (Recommended Starting Point)

### Structure:
```
services/
└── backend/                # Keep as one process initially
    └── src/
        ├── modules/        # 🆕 Organize by domain
        │   ├── user/
        │   │   ├── routes.ts
        │   │   ├── service.ts
        │   │   └── repository.ts
        │   ├── builder/
        │   │   ├── routes.ts
        │   │   ├── service.ts
        │   │   └── repository.ts
        │   ├── order/
        │   └── analytics/
        └── shared/
            ├── database.ts
            └── events.ts
```

**Benefits:**
- ✅ Clear boundaries (same as microservices)
- ✅ Easier to debug
- ✅ Lower infrastructure cost
- ✅ Can split into microservices later
- ✅ Shared types easier

**Migration path:**
1. Start with modular monolith
2. Measure which modules need independent scaling
3. Extract hot modules to services
4. Keep cold modules in monolith

---

## Recommendation

### For All Pet Plus Today:

**✅ Implement:** **Hybrid Approach**

```
Frontend:
- apps/web (existing) - monolith is fine
- apps/admin (future) - separate app
- Shared components via libs/

Backend:
- Start: Modular monolith with domain modules
- Phase 2: Extract builder-service (high traffic)
- Phase 3: Extract webhook-service (spiky load)
- Phase 4: Extract analytics-service (different scaling needs)
- Keep: user-service, order-service in monolith until needed
```

**Why:**
1. **Lower risk** - Incremental migration
2. **Lower cost** - Fewer services = less infrastructure
3. **Easier debugging** - Simpler initially
4. **Future-ready** - Can extract when needed
5. **Type safety** - Easier with tRPC in monolith

---

## Next Steps

1. **Review this architecture** with team
2. **Decide approach:**
   - Option A: Modular monolith (recommended)
   - Option B: Full microservices (if team >10 people)
   - Option C: Hybrid (start modular, extract as needed)

3. **Start Phase 1:**
   - Create `libs/domain` library
   - Extract types and validation
   - Organize current backend by modules

4. **Monitor and decide:**
   - Which modules need independent scaling?
   - Extract those first

**Would you like me to:**
1. Implement modular monolith approach? (Recommended)
2. Implement full microservices? (More complex)
3. Create hybrid architecture? (Best of both)

Let me know which direction and I'll start implementation!

---

**Related Docs:**
- Current architecture: `/docs/architecture/architecture.md`
- Database design: `services/backend/prisma/schema.prisma`
- tRPC setup: `/docs/guides/trpc-implementation-complete.md`
