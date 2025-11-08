# Performance Benchmarks & Targets

**Last Updated:** October 23, 2025  
**Environment:** Production-like (4 vCPU, 8GB RAM)  
**Load Testing Tool:** k6, Lighthouse, Web Vitals

---

## Performance Targets

### Frontend (Web Vitals)

| Metric | Target | Good | Poor |
|--------|--------|------|------|
| **LCP** (Largest Contentful Paint) | <2.5s | <2.5s | >4.0s |
| **FID** (First Input Delay) | <100ms | <100ms | >300ms |
| **CLS** (Cumulative Layout Shift) | <0.1 | <0.1 | >0.25 |
| **FCP** (First Contentful Paint) | <1.8s | <1.8s | >3.0s |
| **TTFB** (Time to First Byte) | <600ms | <800ms | >1800ms |

**Target Score:** 90+ on Lighthouse Performance

---

### API Response Times

| Endpoint Type | P50 | P95 | P99 | Target |
|---------------|-----|-----|-----|--------|
| **Simple Queries** (list, byId) | <50ms | <100ms | <200ms | P95 <100ms |
| **Complex Queries** (joins, aggregations) | <100ms | <300ms | <500ms | P95 <300ms |
| **Mutations** (create, update) | <100ms | <200ms | <400ms | P95 <200ms |
| **Heavy Operations** (3D render, export) | <1s | <3s | <5s | P95 <3s |

---

### Throughput

| Service | RPS Target | Current | Headroom |
|---------|------------|---------|----------|
| **Web (SSR)** | 100 req/s | - | TBD |
| **API (tRPC)** | 500 req/s | - | TBD |
| **Backend** | 1000 req/s | - | TBD |

**RPS** = Requests Per Second

---

## Current Performance

### Frontend Metrics (apps/web)

**Measured:** October 23, 2025  
**Page:** Homepage  
**Tool:** Lighthouse CI

| Metric | Value | Score | Status |
|--------|-------|-------|--------|
| **Performance** | - | 📊 TBD | 🔍 Measure needed |
| **Accessibility** | - | 📊 TBD | 🔍 Measure needed |
| **Best Practices** | - | 📊 TBD | 🔍 Measure needed |
| **SEO** | - | 📊 TBD | 🔍 Measure needed |

**Web Vitals:**
- LCP: 📊 TBD
- FID: 📊 TBD
- CLS: 📊 TBD

**Bundle Size:**
- First Load JS: 📊 TBD
- Total Page Weight: 📊 TBD

---

### API Performance (services/backend)

**Measured:** October 23, 2025  
**Tool:** k6 load testing

**Designs API:**
| Endpoint | P50 | P95 | P99 | Status |
|----------|-----|-----|-----|--------|
| `GET /api/trpc/designs.list` | 📊 TBD | 📊 TBD | 📊 TBD | 🔍 Measure needed |
| `POST /api/trpc/designs.create` | 📊 TBD | 📊 TBD | 📊 TBD | 🔍 Measure needed |
| `PATCH /api/trpc/designs.update` | 📊 TBD | 📊 TBD | 📊 TBD | 🔍 Measure needed |

**Pets API:**
| Endpoint | P50 | P95 | P99 | Status |
|----------|-----|-----|-----|--------|
| `GET /api/trpc/pets.list` | 📊 TBD | 📊 TBD | 📊 TBD | 🔍 Measure needed |
| `POST /api/trpc/pets.create` | 📊 TBD | 📊 TBD | 📊 TBD | 🔍 Measure needed |

---

### Database Performance

**Measured:** October 23, 2025

| Query Type | P50 | P95 | Status |
|------------|-----|-----|--------|
| Simple SELECT | 📊 TBD | 📊 TBD | 🔍 Measure needed |
| JOINs (2-3 tables) | 📊 TBD | 📊 TBD | 🔍 Measure needed |
| Aggregations | 📊 TBD | 📊 TBD | 🔍 Measure needed |

**Connection Pool:**
- Pool size: 10 connections
- Utilization: 📊 TBD
- Wait time: 📊 TBD

---

## Load Testing

### Test Scenarios

#### Scenario 1: Normal Traffic

**Profile:** Average user behavior

```javascript
// k6 script: scripts/load-tests/normal-traffic.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 50 },   // Ramp up to 50 users
    { duration: '5m', target: 50 },   // Stay at 50 users
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% <500ms
    http_req_failed: ['rate<0.01'],   // <1% error rate
  },
};

export default function() {
  // List designs
  const listRes = http.get('http://localhost:4000/api/trpc/designs.list');
  check(listRes, {
    'list status 200': (r) => r.status === 200,
    'list < 200ms': (r) => r.timings.duration < 200,
  });
  
  sleep(1);
  
  // Get design by ID
  const byIdRes = http.get('http://localhost:4000/api/trpc/designs.byId?id=test_id');
  check(byIdRes, {
    'byId status 200': (r) => r.status === 200,
    'byId < 100ms': (r) => r.timings.duration < 100,
  });
  
  sleep(2);
}
```

**Run:**
```bash
k6 run scripts/load-tests/normal-traffic.js
```

---

#### Scenario 2: Peak Traffic

**Profile:** Black Friday, product launches

```javascript
export const options = {
  stages: [
    { duration: '5m', target: 200 },   // Ramp to 200 users
    { duration: '10m', target: 200 },  // Sustain
    { duration: '5m', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],  // 95% <1s (relaxed)
    http_req_failed: ['rate<0.05'],     // <5% error rate
  },
};
```

---

#### Scenario 3: Spike Test

**Profile:** Sudden traffic surge

```javascript
export const options = {
  stages: [
    { duration: '1m', target: 500 },   // Immediate spike!
    { duration: '3m', target: 500 },   // Hold
    { duration: '1m', target: 0 },     // Drop
  ],
};
```

---

### Test Results (To Be Updated)

| Scenario | Users | Duration | Success Rate | P95 Latency | Status |
|----------|-------|----------|--------------|-------------|--------|
| Normal | 50 | 9 min | 📊 TBD | 📊 TBD | 🔍 Not run |
| Peak | 200 | 20 min | 📊 TBD | 📊 TBD | 🔍 Not run |
| Spike | 500 | 5 min | 📊 TBD | 📊 TBD | 🔍 Not run |

---

## Database Optimization

### Indexing Strategy

**Current Indexes:**
```sql
-- From schema.prisma

-- SavedDesign
CREATE INDEX idx_saved_design_user_id ON saved_design(user_id);
CREATE INDEX idx_saved_design_status ON saved_design(status);
CREATE INDEX idx_saved_design_created_at ON saved_design(created_at DESC);

-- PetProfile
CREATE INDEX idx_pet_profile_user_id ON pet_profile(user_id);
CREATE INDEX idx_pet_profile_primary ON pet_profile(is_primary);

-- OrderMeta
CREATE INDEX idx_order_meta_user_id ON order_meta(user_id);
CREATE INDEX idx_order_meta_shopify_id ON order_meta(shopify_order_id);
```

**Query Performance:**
```bash
# Check slow queries
EXPLAIN ANALYZE SELECT * FROM saved_design WHERE user_id = 'xxx';

# Expected: Index Scan (not Seq Scan)
```

---

### Connection Pooling

**Current Configuration:**
```typescript
// Prisma connection pool
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Connection string includes pooling
// postgresql://user:pass@host/db?connection_limit=20&pool_timeout=30
```

**Recommended Settings:**
| Environment | Pool Size | Timeout |
|-------------|-----------|---------|
| **Development** | 5 | 10s |
| **Staging** | 10 | 20s |
| **Production** | 20-50 | 30s |

---

## Frontend Optimization

### Code Splitting

**Current Strategy:**
```typescript
// Lazy load heavy components
const HeavyComponent = dynamic(
  () => import('./heavy-component'),
  {
    loading: () => <LoadingState />,
    ssr: false, // Client-side only
  }
);

// Route-based code splitting (automatic with Next.js App Router)
```

**Bundle Analysis:**
```bash
npm run analyze

# Opens bundle analyzer
# Check for:
# - Large dependencies
# - Duplicate packages
# - Unused code
```

---

### Image Optimization

**Using next/image:**
```typescript
import Image from 'next/image';

<Image
  src="/harness.jpg"
  alt="Custom harness"
  width={800}
  height={600}
  quality={85}           // Default: 75
  loading="lazy"         // Lazy load
  placeholder="blur"     // Show placeholder
/>
```

**Cloudinary Integration:**
```typescript
// next.config.ts
images: {
  loader: 'cloudinary',
  path: 'https://res.cloudinary.com/harness-hero/image/upload/',
}
```

---

### Caching Strategy

**Static Assets:**
```typescript
// next.config.ts
headers: async () => [
  {
    source: '/_next/static/:path*',
    headers: [
      {
        key: 'Cache-Control',
        value: 'public, max-age=31536000, immutable',
      },
    ],
  },
],
```

**API Responses:**
```typescript
// Cache designs list for 60 seconds
const { data } = trpc.designs.list.useQuery(
  { limit: 20 },
  {
    staleTime: 60_000,    // 60 seconds
    cacheTime: 300_000,   // 5 minutes
  }
);
```

---

## Monitoring

### Web Vitals Tracking

**Implementation:** `apps/web/src/app/layout.tsx`

```typescript
import { sendToAnalytics } from '@/lib/analytics';

export function reportWebVitals(metric: NextWebVitalsMetric) {
  sendToAnalytics({
    name: metric.name,
    value: metric.value,
    id: metric.id,
    label: metric.label,
  });
}
```

---

### Performance Monitoring

**Tools to use:**
- **Vercel Analytics** - Real user monitoring
- **Sentry** - Error tracking + performance
- **DataDog** - Backend APM
- **Lighthouse CI** - Automated audits

**Setup:**
```bash
# Lighthouse CI
npm install -g @lhci/cli

# Run audit
lhci autorun
```

---

## Optimization Checklist

### Frontend
- [ ] Images optimized (next/image, Cloudinary)
- [ ] Code splitting implemented
- [ ] Lazy loading for heavy components
- [ ] CSS purged (Tailwind)
- [ ] Fonts optimized (font-display: swap)
- [ ] Service Worker (optional)
- [ ] Prefetching critical resources
- [ ] Bundle size <200KB (First Load JS)

### API
- [ ] Database queries optimized
- [ ] Indexes on all filtered columns
- [ ] Connection pooling configured
- [ ] Response caching where appropriate
- [ ] Pagination implemented
- [ ] Rate limiting enabled
- [ ] Compression enabled (gzip/brotli)
- [ ] CDN for static assets

### Database
- [ ] Indexes created
- [ ] Slow query log analyzed
- [ ] Vacuum and analyze run regularly
- [ ] Connection limits appropriate
- [ ] Read replicas for analytics (future)

---

## Performance Testing Guide

### 1. Frontend Performance Test

**Using Lighthouse:**
```bash
# Run Lighthouse
npm run lighthouse

# Or via CLI
lighthouse http://localhost:3000 --view
```

**Using Next.js analyze:**
```bash
npm run analyze

# Check:
# - Total bundle size
# - Largest packages
# - Duplicate dependencies
```

---

### 2. API Load Test

**Using k6:**
```bash
# Install k6
brew install k6

# Run load test
k6 run scripts/load-tests/api-load-test.js

# With reporting
k6 run --out json=results.json scripts/load-tests/api-load-test.js
```

**Sample k6 Script:**
```javascript
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  vus: 50,                    // 50 virtual users
  duration: '30s',            // Run for 30 seconds
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% < 500ms
  },
};

export default function() {
  const res = http.get('http://localhost:4000/api/trpc/designs.list');
  check(res, {
    'status is 200': (r) => r.status === 200,
    'response < 200ms': (r) => r.timings.duration < 200,
  });
}
```

---

### 3. Database Performance Test

**Using pgbench:**
```bash
# Initialize test database
pgbench -i -s 50 test_database

# Run test
pgbench -c 10 -j 2 -t 1000 test_database

# Results:
# - TPS (transactions per second)
# - Latency average
# - Latency stddev
```

---

## Optimization Techniques

### 1. React Component Optimization

```typescript
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive components
export const ExpensiveComponent = memo(({ data }: Props) => {
  // Memoize expensive calculations
  const sortedData = useMemo(
    () => data.sort((a, b) => a.name.localeCompare(b.name)),
    [data]
  );
  
  // Memoize callbacks
  const handleClick = useCallback(() => {
    // Handle click
  }, [/* dependencies */]);
  
  return <div>{/* render */}</div>;
});
```

---

### 2. Database Query Optimization

```typescript
// ❌ N+1 Query Problem
const designs = await prisma.savedDesign.findMany();
for (const design of designs) {
  design.user = await prisma.userProfile.findUnique({
    where: { id: design.userId },
  });
}

// ✅ Use include to fetch related data in one query
const designs = await prisma.savedDesign.findMany({
  include: {
    user: true,  // Joins in single query
  },
});
```

---

### 3. Caching Strategies

**Client-Side (React Query):**
```typescript
const { data } = trpc.designs.list.useQuery(
  { limit: 20 },
  {
    staleTime: 5 * 60 * 1000,    // 5 minutes
    cacheTime: 10 * 60 * 1000,   // 10 minutes
    refetchOnWindowFocus: false,  // Don't refetch on focus
  }
);
```

**Server-Side (Redis):**
```typescript
async function getCachedData(key: string) {
  // Check cache first
  const cached = await redis.get(key);
  if (cached) return JSON.parse(cached);
  
  // Fetch from database
  const data = await db.query();
  
  // Store in cache (5 minutes)
  await redis.setex(key, 300, JSON.stringify(data));
  
  return data;
}
```

---

## Performance Regression Testing

### Automated Tests

**Lighthouse CI Configuration:**
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3,
      startServerCommand: 'npm run start',
      url: ['http://localhost:3000', 'http://localhost:3000/builder'],
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
      },
    },
  },
};
```

**Run in CI:**
```bash
npm run build
lhci autorun
```

---

### Budget Monitoring

**Bundle Size Budget:**
```json
// package.json
{
  "bundlesize": [
    {
      "path": "./dist/**/*.js",
      "maxSize": "200 KB"
    }
  ]
}
```

---

## Historical Performance

### Baseline (October 2025)

**To be measured after production launch**

| Date | LCP | FID | CLS | API P95 | Notes |
|------|-----|-----|-----|---------|-------|
| 2025-10-23 | 📊 TBD | 📊 TBD | 📊 TBD | 📊 TBD | Initial measurement |

---

### Performance Improvements

| Date | Change | Impact | Metrics |
|------|--------|--------|---------|
| TBD | Example improvement | Description | Before/After |

---

## Running Performance Tests

### Quick Performance Check

```bash
# 1. Frontend performance
npm run build
npm run start
lighthouse http://localhost:3000

# 2. API load test
k6 run --vus 50 --duration 30s scripts/load-tests/api-test.js

# 3. Database performance
# In services/backend:
npm run db:analyze
```

---

### Full Performance Suite

```bash
# Run all performance tests
npm run perf:all

# Individual tests
npm run perf:frontend     # Lighthouse
npm run perf:api          # k6 load test
npm run perf:db           # Database benchmarks
```

---

## Troubleshooting Slow Performance

### Frontend Slow

**Check:**
1. Bundle size (`npm run analyze`)
2. Network waterfall (Chrome DevTools)
3. React DevTools Profiler
4. Lighthouse report

**Common Issues:**
- Large bundle size → Code split
- Slow API calls → Add caching
- Heavy renders → Memoize components
- Large images → Optimize/compress

---

### API Slow

**Check:**
1. Response time per endpoint
2. Database query time
3. External API calls
4. Connection pool utilization

**Common Issues:**
- Missing indexes → Add to Prisma schema
- N+1 queries → Use `include` or `select`
- No caching → Add Redis cache
- Too many connections → Increase pool size

---

### Database Slow

**Check:**
```sql
-- Slow query log
SELECT query, mean_exec_time
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Table sizes
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- Index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans
FROM pg_stat_user_indexes
ORDER BY idx_scan ASC;
```

---

## Performance Budget

### Frontend Budget

| Resource | Budget | Current | Status |
|----------|--------|---------|--------|
| **First Load JS** | <150 KB | 📊 TBD | 🔍 Measure |
| **Total JS** | <500 KB | 📊 TBD | 🔍 Measure |
| **CSS** | <50 KB | 📊 TBD | 🔍 Measure |
| **Images** | <1 MB | 📊 TBD | 🔍 Measure |
| **Total Page** | <2 MB | 📊 TBD | 🔍 Measure |

### API Budget

| Metric | Budget | Current | Status |
|--------|--------|---------|--------|
| **Simple Query** | <50ms | 📊 TBD | 🔍 Measure |
| **Complex Query** | <200ms | 📊 TBD | 🔍 Measure |
| **Mutation** | <100ms | 📊 TBD | 🔍 Measure |
| **Throughput** | >500 req/s | 📊 TBD | 🔍 Measure |

---

## Related Documentation

- [Performance Guide](/docs/development/performance-guide.md) - Optimization strategies
- [Testing Guide](/docs/development/testing-guide.md) - General testing
- [Deployment Guide](/docs/ops/deploy.md) - Production setup

---

## Next Steps

### Immediate
1. Run initial Lighthouse audit
2. Set up k6 load tests
3. Measure baseline metrics
4. Update this document with results

### Ongoing
- Weekly performance monitoring
- Monthly load testing
- Quarterly optimization reviews
- Performance regression tests in CI/CD

---

**Performance Testing Schedule:**
- **Daily:** Automated Lighthouse CI
- **Weekly:** Load testing
- **Monthly:** Full performance audit
- **Quarterly:** Optimization sprint

---

**Last Updated:** October 23, 2025  
**Next Review:** November 23, 2025  
**Status:** Framework Complete, Measurements Needed

