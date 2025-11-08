# 2. Hybrid Microservices Approach

**Date:** 2025-09-20  
**Status:** Accepted  
**Deciders:** Architecture Team, Development Team

---

## Context

We needed to decide on our backend architecture for All Pet Plus. The application has multiple distinct domains (builder, pet profiles, orders, user management) that could benefit from separation, but we're a small team and don't want the complexity of full microservices from day one.

### Requirements

- Support multiple business domains
- Allow independent scaling when needed
- Maintain development velocity
- Keep infrastructure costs reasonable
- Enable future extraction of services

### Options Considered

1. **Monolithic application** - Everything in one codebase
2. **Full microservices** - Separate service for each domain
3. **Modular monolith** - Organized modules, single deployment
4. **Hybrid approach** - Modular monolith with extractable services

---

## Decision

We will use a **hybrid microservices approach**:

1. **Start with modular monolith** (`services/backend`)
   - Organize code by domain modules
   - Clear boundaries between domains
   - Single process, single deployment
   - Shared database initially

2. **Extract services when needed**
   - High-traffic modules → microservices
   - Different scaling requirements → microservices  
   - Keep low-traffic modules in monolith

3. **Shared libraries** for common code
   - `libs/domain/` - Business logic
   - `libs/api/` - tRPC routers
   - `libs/messaging/` - Event bus

**Architecture:**
```
services/
├── backend/                    # Modular monolith (port 4000)
│   └── src/modules/
│       ├── builder/           # Can be extracted
│       ├── pet/               # Stay in monolith
│       ├── order/             # Can be extracted
│       ├── user/              # Stay in monolith
│       └── webhook/           # Can be extracted
│
└── builder-service/           # Extractable template (port 4002)
    └── src/main.ts            # When traffic justifies
```

---

## Consequences

### Positive

- ✅ **Low initial complexity** - Start simple with monolith
- ✅ **Clear boundaries** - Modules = future services
- ✅ **Easy refactoring** - All code in one repo
- ✅ **Shared transactions** - Database operations easier
- ✅ **Lower costs** - Fewer servers to run
- ✅ **Fast development** - No inter-service communication overhead
- ✅ **Type safety** - tRPC works great in monolith
- ✅ **Future-ready** - Can extract when needed

### Negative

- ⚠️ **Discipline required** - Must maintain module boundaries
- ⚠️ **Single deployment** - Can't deploy modules independently (yet)
- ⚠️ **Shared resources** - One module can affect others
- ⚠️ **Eventual extraction** - Migration work when scaling

### Neutral

- Can still use microservices patterns (events, boundaries)
- Testing is simpler (integration tests in one codebase)
- Monitoring is simpler (one service to monitor initially)

---

## Implementation Plan

### Phase 1: Modular Monolith (Current)
```
✅ Organize backend by domain modules
✅ Define clear module interfaces
✅ Use tRPC for frontend communication
✅ Keep all modules in services/backend
```

### Phase 2: Preparation for Extraction
```
✅ Create builder-service template
✅ Document extraction process
⏳ Add inter-service communication (event bus)
⏳ Monitor module traffic and resource usage
```

### Phase 3: Extract When Needed
```
When builder module reaches >1000 req/min:
  1. Copy builder-service template
  2. Move builder routes to new service
  3. Update tRPC router to call new service
  4. Deploy both services
  5. Gradually shift traffic
  6. Remove builder module from monolith

Same process for other high-traffic modules
```

---

## Metrics for Extraction

**Extract a module to microservice when:**

| Metric | Threshold | Example Module |
|--------|-----------|----------------|
| **Traffic** | >1000 req/min | builder |
| **CPU Usage** | >70% dedicated | 3D preview rendering |
| **Response Time** | P95 > 500ms | Complex queries |
| **Team Size** | Separate team | New feature teams |
| **Deployment** | Need independent releases | External API |

---

## Alternatives Considered

### Alternative 1: Full Monolith

**Pros:**
- Simplest to start
- Fast development
- Easy deployment

**Cons:**
- Hard to scale specific features
- No clear boundaries
- Difficult to extract later

**Why not chosen:** Harder to scale and evolve

---

### Alternative 2: Microservices from Day One

**Pros:**
- Independent scaling
- Clear boundaries
- Team autonomy

**Cons:**
- High initial complexity
- Distributed transactions
- More infrastructure cost
- Slower development (inter-service calls)

**Why not chosen:** Too complex for current team size (3 developers)

---

### Alternative 3: Serverless Functions

**Pros:**
- Auto-scaling
- Pay per use
- No server management

**Cons:**
- Cold starts
- Vendor lock-in
- Harder debugging
- Cost unpredictable

**Why not chosen:** Need more control and predictable costs

---

## Related Decisions

- [ADR-001: Use tRPC for API](./001-use-trpc-for-api.md) - Complements this well
- [ADR-003: Iframe vs Module Federation](./003-iframe-vs-module-federation.md)
- Future: Database separation strategy
- Future: Event bus implementation

---

## Success Criteria

**This decision succeeds if:**

1. ✅ Development velocity remains high
2. ✅ Can extract services in <1 week
3. ✅ Infrastructure costs stay under budget
4. ✅ Code organization is clear
5. ⏳ Successfully extract first service when needed

**Review:** After extracting first microservice

---

## References

- [Modular Monolith Pattern](https://www.kamilgrzybek.com/blog/posts/modular-monolith-primer)
- [Martin Fowler - Monolith First](https://martinfowler.com/bliki/MonolithFirst.html)
- Team Discussion: September 15-20, 2025
- POC Results: Modular organization in services/backend

---

**Last Updated:** 2025-09-20  
**Next Review:** After first service extraction

