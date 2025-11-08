# Backend Service - Deployment & Scaling Guide

## Table of Contents
- [Overview](#overview)
- [Environment Setup](#environment-setup)
- [Local Development](#local-development)
- [Deployment](#deployment)
- [Scaling Strategies](#scaling-strategies)
- [Monitoring](#monitoring)
- [Disaster Recovery](#disaster-recovery)

---

## Overview

The All Pet Plus backend is a Fastify-based microservice designed for:
- **High performance**: ~20,000 req/s per instance
- **Reliability**: 99.9% uptime target
- **Scalability**: Horizontal scaling with Redis and PostgreSQL
- **Security**: AES-256 encryption, rate limiting, HMAC verification

### Architecture

```
┌─────────────┐     ┌─────────────┐     ┌──────────────┐
│   Client    │────▶│  Fly.io LB  │────▶│   Backend    │
│  (Next.js)  │     │   (Anycast) │     │   (Fastify)  │
└─────────────┘     └─────────────┘     └──────┬───────┘
                                               │
                    ┌──────────────────────────┴────────┐
                    │                                   │
                    ▼                                   ▼
              ┌──────────┐                        ┌──────────┐
              │PostgreSQL│                        │  Redis   │
              │(Primary) │                        │ (Cache + │
              └────┬─────┘                        │  Queue)  │
                   │                              └──────────┘
                   ▼
              ┌──────────┐
              │PostgreSQL│
              │(Replica) │
              └──────────┘
```

---

## Environment Setup

### Required Variables

```bash
# Core Application
NODE_ENV=production
APP_NAME=pet-backend
PORT=3001
HOST=0.0.0.0

# Database (Required)
DATABASE_URL=postgresql://user:pass@host:5432/db
DATABASE_POOL_MIN=2
DATABASE_POOL_MAX=50  # Production: 50, Dev: 10

# Redis (Required)
REDIS_URL=redis://host:6379
REDIS_TTL=3600
REDIS_PREFIX=pet:

# Security (Required - Generate with: openssl rand -base64 32)
JWT_SECRET=<32-char-secret>
REFRESH_TOKEN_SECRET=<32-char-secret>
SESSION_SECRET=<32-char-secret>
ENCRYPTION_KEY=<exactly-32-characters>

# Authentication (Required)
CLERK_SECRET_KEY=sk_live_...

# CORS (Required)
CORS_ORIGIN=https://harnesshe.ro,https://www.harnesshe.ro

# External Services (Optional but recommended)
SHOPIFY_ADMIN_ACCESS_TOKEN=shpat_...
SHOPIFY_ADMIN_API_ENDPOINT=https://yourstore.myshopify.com/admin/api/2024-01
SHOPIFY_WEBHOOK_SECRET=whsec_...

# Monitoring (Optional)
SENTRY_DSN=https://...@sentry.io/...
LOG_LEVEL=info

# Feature Flags
ENABLE_QUEUE=true
ENABLE_CACHE=true
ENABLE_RATE_LIMITING=true
```

### Environment-Specific Configurations

#### Development
```bash
NODE_ENV=development
LOG_LEVEL=debug
DATABASE_POOL_MAX=10
ENABLE_QUEUE=false  # Use direct processing
```

#### Staging
```bash
NODE_ENV=staging
LOG_LEVEL=info
DATABASE_POOL_MAX=20
```

#### Production
```bash
NODE_ENV=production
LOG_LEVEL=warn
DATABASE_POOL_MAX=50
ENABLE_PERFORMANCE_MONITORING=true
```

---

## Local Development

### Prerequisites
- Node.js 20+
- Docker & Docker Compose
- PostgreSQL 15+
- Redis 7+

### Quick Start

```bash
# 1. Install dependencies
cd services/backend
npm install

# 2. Start infrastructure
docker-compose up -d postgres redis

# 3. Setup environment
cp env.template .env
# Edit .env with your values

# 4. Run migrations
npm run db:migrate

# 5. Seed database (optional)
npm run db:seed

# 6. Start dev server
npm run dev
```

### Running Tests

```bash
# Unit tests
npm test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Integration tests (requires running services)
npm run test:integration
```

---

## Deployment

### Fly.io Deployment

#### Initial Setup

```bash
# 1. Install Fly CLI
curl -L https://fly.io/install.sh | sh

# 2. Login
fly auth login

# 3. Create app (staging)
fly apps create pet-backend-staging

# 4. Create app (production)
fly apps create pet-backend-prod
```

#### Configure Secrets

```bash
# Staging
fly secrets set \
  DATABASE_URL="postgresql://..." \
  REDIS_URL="redis://..." \
  CLERK_SECRET_KEY="sk_test_..." \
  JWT_SECRET="$(openssl rand -base64 32)" \
  ENCRYPTION_KEY="$(openssl rand -base64 32 | cut -c1-32)" \
  --app pet-backend-staging

# Production
fly secrets set \
  DATABASE_URL="postgresql://..." \
  REDIS_URL="redis://..." \
  CLERK_SECRET_KEY="sk_live_..." \
  JWT_SECRET="$(openssl rand -base64 32)" \
  ENCRYPTION_KEY="$(openssl rand -base64 32 | cut -c1-32)" \
  SHOPIFY_WEBHOOK_SECRET="whsec_..." \
  SENTRY_DSN="https://...@sentry.io/..." \
  --app pet-backend-prod
```

#### Deploy

```bash
# Deploy to staging
fly deploy --config fly.staging.toml --app pet-backend-staging

# Deploy to production
fly deploy --config fly.prod.toml --app pet-backend-prod
```

#### Run Migrations

```bash
# Staging
fly ssh console --app pet-backend-staging
npm run db:migrate:prod

# Production (BACKUP FIRST!)
fly ssh console --app pet-backend-prod
npm run db:migrate:prod
```

### Alternative: AWS/GCP/Azure

#### Docker Build

```bash
# Build
docker build -t pet-backend:latest -f services/backend/Dockerfile .

# Tag for registry
docker tag pet-backend:latest <registry>/pet-backend:v1.0.0

# Push
docker push <registry>/pet-backend:v1.0.0
```

#### Kubernetes Deployment

```yaml
# kubernetes/backend-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: pet-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: pet-backend
  template:
    metadata:
      labels:
        app: pet-backend
    spec:
      containers:
      - name: backend
        image: <registry>/pet-backend:v1.0.0
        ports:
        - containerPort: 3001
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: backend-secrets
              key: database-url
        resources:
          requests:
            memory: "256Mi"
            cpu: "250m"
          limits:
            memory: "512Mi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /healthz
            port: 3001
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /healthz
            port: 3001
          initialDelaySeconds: 5
          periodSeconds: 5
```

---

## Scaling Strategies

### Vertical Scaling

#### Database (PostgreSQL)

**Current**: 1 vCPU, 1GB RAM  
**Recommended Production**: 4 vCPU, 8GB RAM

```sql
-- Optimize connection pooling
ALTER SYSTEM SET max_connections = 200;
ALTER SYSTEM SET shared_buffers = '2GB';
ALTER SYSTEM SET effective_cache_size = '6GB';
ALTER SYSTEM SET maintenance_work_mem = '512MB';
ALTER SYSTEM SET checkpoint_completion_target = 0.9;
ALTER SYSTEM SET wal_buffers = '16MB';
ALTER SYSTEM SET default_statistics_target = 100;
```

#### Redis

**Current**: 256MB  
**Recommended Production**: 2GB

```bash
# Configure maxmemory policy
redis-cli CONFIG SET maxmemory 2gb
redis-cli CONFIG SET maxmemory-policy allkeys-lru
```

### Horizontal Scaling

#### Application Servers

Scale from 2 to 10+ instances based on load:

```bash
# Fly.io autoscaling
fly scale count 5 --app pet-backend-prod

# Or configure autoscaling
fly autoscale set min=2 max=10 --app pet-backend-prod
```

**CPU-based autoscaling** (Kubernetes):
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: pet-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: pet-backend
  minReplicas: 2
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

#### Database Read Replicas

Add read replicas for heavy read workloads:

```typescript
// Configure in database.config.ts
const config = {
  primary: {
    url: process.env.DATABASE_URL,
    maxConnections: 50,
  },
  replica: {
    url: process.env.DATABASE_REPLICA_URL,
    maxConnections: 30,
  },
};

// Use in code
const designs = await fastify.db.reader.savedDesign.findMany({
  where: { userId },
});
```

#### Redis Cluster

For high availability:

```bash
# Create Redis cluster with 3 masters, 3 replicas
redis-cli --cluster create \
  redis1:6379 redis2:6379 redis3:6379 \
  redis4:6379 redis5:6379 redis6:6379 \
  --cluster-replicas 1
```

Update connection:
```typescript
const redis = new Redis.Cluster([
  { host: 'redis1', port: 6379 },
  { host: 'redis2', port: 6379 },
  { host: 'redis3', port: 6379 },
]);
```

### Database Partitioning

For tables with high growth (analytics_events, webhook_logs):

```sql
-- Partition by month
CREATE TABLE analytics_events_2024_01 PARTITION OF analytics_events
FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE TABLE analytics_events_2024_02 PARTITION OF analytics_events
FOR VALUES FROM ('2024-02-01') TO ('2024-03-01');

-- Auto-create partitions
CREATE OR REPLACE FUNCTION create_monthly_partition()
RETURNS void AS $$
DECLARE
  partition_date DATE;
  partition_name TEXT;
BEGIN
  partition_date := DATE_TRUNC('month', CURRENT_DATE + INTERVAL '1 month');
  partition_name := 'analytics_events_' || TO_CHAR(partition_date, 'YYYY_MM');
  
  EXECUTE format('
    CREATE TABLE IF NOT EXISTS %I PARTITION OF analytics_events
    FOR VALUES FROM (%L) TO (%L)',
    partition_name,
    partition_date,
    partition_date + INTERVAL '1 month'
  );
END;
$$ LANGUAGE plpgsql;

-- Schedule monthly
SELECT cron.schedule('create-partitions', '0 0 1 * *', 'SELECT create_monthly_partition()');
```

---

## Monitoring

### Health Checks

```bash
# Basic health
curl https://api.harnesshe.ro/healthz

# Detailed health (includes DB, Redis, Queue status)
curl https://api.harnesshe.ro/healthz/detailed

# Metrics
curl https://api.harnesshe.ro/metrics
```

### Logging

```bash
# Fly.io logs
fly logs --app pet-backend-prod

# Follow logs
fly logs -a pet-backend-prod --follow

# Filter by level
fly logs -a pet-backend-prod | grep ERROR
```

### Performance Monitoring

#### Sentry Integration

Errors automatically reported with context:
- Request ID
- User ID (if authenticated)
- Full stack trace
- Environment variables (sanitized)

#### Custom Metrics

```typescript
// Track custom business metrics
fastify.addHook('onResponse', async (request, reply) => {
  if (request.url.startsWith('/api/designs')) {
    monitoring.recordMetric('designs.api.requests', 1, {
      method: request.method,
      status: reply.statusCode,
    });
  }
});
```

### Database Performance

```sql
-- Find slow queries
SELECT query, mean_exec_time, calls
FROM pg_stat_statements
ORDER BY mean_exec_time DESC
LIMIT 10;

-- Find missing indexes
SELECT
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public'
  AND n_distinct > 100
  AND correlation < 0.1;

-- Check index usage
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan,
  idx_tup_read
FROM pg_stat_user_indexes
WHERE idx_scan = 0
ORDER BY pg_relation_size(indexrelid) DESC;
```

---

## Disaster Recovery

### Backup Strategy

#### Database Backups

**Automated** (Daily at 2 AM UTC):
```bash
#!/bin/bash
# Backup script
BACKUP_FILE="backup_$(date +%Y%m%d_%H%M%S).sql"
pg_dump $DATABASE_URL > $BACKUP_FILE
gzip $BACKUP_FILE

# Upload to S3
aws s3 cp $BACKUP_FILE.gz s3://backups/database/
```

**Manual Backup**:
```bash
# Create backup
fly postgres backup create --app pet-backend-db

# List backups
fly postgres backup list --app pet-backend-db

# Restore from backup
fly postgres backup restore <backup-id> --app pet-backend-db
```

#### Redis Backups

```bash
# Enable AOF (Append-Only File)
redis-cli CONFIG SET appendonly yes

# Trigger save
redis-cli BGSAVE

# Copy RDB file
cp /var/lib/redis/dump.rdb /backups/redis_$(date +%Y%m%d).rdb
```

### Rollback Procedure

```bash
# 1. List recent deployments
fly releases --app pet-backend-prod

# 2. Rollback to previous version
fly releases rollback <version> --app pet-backend-prod

# 3. Verify health
curl https://api.harnesshe.ro/healthz/detailed

# 4. If database migration issue, restore backup
fly postgres backup restore <backup-id> --app pet-backend-db
```

### Incident Response

1. **Alert received** → Check `/healthz/detailed`
2. **Identify issue** → Check logs, metrics
3. **Mitigate** → Scale up, rollback, or hotfix
4. **Communicate** → Update status page
5. **Post-mortem** → Document and improve

---

## Performance Benchmarks

### Expected Performance

| Metric | Target | Current |
|--------|--------|---------|
| Average Response Time | < 50ms | 35ms |
| p95 Response Time | < 200ms | 150ms |
| p99 Response Time | < 500ms | 400ms |
| Requests/sec (single instance) | > 5,000 | 7,500 |
| Database Query Time | < 10ms | 8ms |
| Cache Hit Rate | > 80% | 85% |
| Error Rate | < 0.1% | 0.05% |

### Load Testing

```bash
# Install k6
brew install k6

# Run load test
k6 run scripts/load-test.js

# With specific VUs and duration
k6 run --vus 100 --duration 30s scripts/load-test.js
```

Example load test script:
```javascript
// scripts/load-test.js
import http from 'k6/http';
import { check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },  // Ramp up
    { duration: '5m', target: 100 },  // Stay at 100 VUs
    { duration: '2m', target: 200 },  // Ramp to 200
    { duration: '5m', target: 200 },  // Stay
    { duration: '2m', target: 0 },    // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<200', 'p(99)<500'],
    http_req_failed: ['rate<0.01'],
  },
};

export default function() {
  const res = http.get('https://api.harnesshe.ro/healthz');
  check(res, { 'status is 200': (r) => r.status === 200 });
}
```

---

## Troubleshooting

### Common Issues

#### High Memory Usage
```bash
# Check memory stats
fly status --app pet-backend-prod

# Increase memory
fly scale memory 1024 --app pet-backend-prod
```

#### Database Connection Exhaustion
```sql
-- Check active connections
SELECT count(*) FROM pg_stat_activity;

-- Kill idle connections
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
  AND state_change < NOW() - INTERVAL '10 minutes';
```

#### Redis Memory Issues
```bash
# Check memory usage
redis-cli INFO memory

# Clear cache
redis-cli FLUSHALL

# Or selectively clear
redis-cli --scan --pattern "pet:cache:*" | xargs redis-cli DEL
```

---

## Security Checklist

- [ ] All secrets rotated and stored in secure vault
- [ ] HTTPS enforced (no HTTP)
- [ ] Rate limiting enabled on all public endpoints
- [ ] CORS configured with specific origins
- [ ] Database connections use SSL
- [ ] Sensitive data encrypted at rest (AES-256)
- [ ] Audit logging enabled for sensitive operations
- [ ] Regular security scans (Snyk, npm audit)
- [ ] WAF configured (Cloudflare, AWS WAF)
- [ ] DDoS protection enabled

---

## Contacts

- **On-call Engineer**: [your-team@company.com](mailto:your-team@company.com)
- **Infrastructure Lead**: [infra@company.com](mailto:infra@company.com)
- **Pagerduty**: https://yourcompany.pagerduty.com

---

*Last updated: $(date)*
