# Database Scaling Plan for All Pet Plus

## Executive Summary

This document outlines a comprehensive database scaling strategy for the All Pet Plus storefront, built on Shopify headless architecture with Clerk authentication. The plan addresses performance optimization, security hardening, high availability, and cost-effective scaling patterns suitable for an e-commerce platform with custom product builders.

## Current Architecture Context

- **Frontend**: Next.js 15 with App Router
- **Backend**: Fastify service (to be implemented)
- **Authentication**: Clerk (external managed service)
- **Commerce**: Shopify headless
- **Primary Database**: PostgreSQL with Prisma ORM
- **Cache Layer**: Redis
- **Queue System**: BullMQ (Redis-backed)

## Database Architecture

### 1. Multi-Tier Database Strategy

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Application   │────▶│  Connection     │────▶│   Primary DB    │
│   (Fastify)     │     │  Pooler         │     │  (PostgreSQL)   │
└─────────────────┘     │  (PgBouncer)    │     └────────┬────────┘
                        └─────────────────┘              │
                                                         │
┌─────────────────┐     ┌─────────────────┐     ┌───────▼─────────┐
│   Cache Layer   │     │   Read Replicas │◀────│   Replication   │
│   (Redis)       │     │  (PostgreSQL)   │     │   Stream        │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### 2. Database Partitioning Strategy

#### Vertical Partitioning (Immediate Implementation)
- **Core Tables**: High-frequency access patterns
  - `UserProfile`, `SavedDesign`, `BuilderPreset`
- **Analytics Tables**: Write-heavy, read-occasional
  - `WebhookLog`, `ExperimentAssignment`, `AnalyticsEvent`
- **Archive Tables**: Historical data
  - `OrderMetaArchive`, `DesignHistory`

#### Horizontal Partitioning (Future Growth)
- Partition `SavedDesign` by user_id range
- Partition `WebhookLog` by date (monthly partitions)
- Partition `OrderMeta` by created_at date

## Performance Optimization

### 1. Query Optimization

```sql
-- Example: Optimized index for frequent builder queries
CREATE INDEX idx_saved_design_user_created 
ON saved_design(user_id, created_at DESC) 
WHERE deleted_at IS NULL;

CREATE INDEX idx_order_meta_lookup 
ON order_meta(shopify_order_id, email);

-- Partial index for active designs
CREATE INDEX idx_active_designs 
ON saved_design(user_id) 
WHERE is_active = true AND deleted_at IS NULL;
```

### 2. Connection Pooling Configuration

```yaml
# PgBouncer configuration
[databases]
harness_hero = host=postgres-primary port=5432 dbname=harness_hero

[pgbouncer]
pool_mode = transaction
default_pool_size = 25
reserve_pool_size = 5
max_client_conn = 100
max_db_connections = 50
server_lifetime = 3600
server_idle_timeout = 600
```

### 3. Caching Strategy

#### Redis Cache Layers
1. **L1 - Session Cache** (TTL: 1 hour)
   - Clerk session data
   - User preferences
   - Feature flags

2. **L2 - Product Cache** (TTL: 5 minutes)
   - Shopify product data
   - Pricing rules
   - Inventory levels

3. **L3 - Builder Cache** (TTL: 24 hours)
   - Sprite layer manifests
   - Preset configurations
   - Render templates

```typescript
// Cache-aside pattern implementation
interface CacheStrategy {
  key: string;
  ttl: number;
  fallback: () => Promise<any>;
  tags?: string[];
}

class CacheManager {
  async get<T>(strategy: CacheStrategy): Promise<T> {
    const cached = await redis.get(strategy.key);
    if (cached) return JSON.parse(cached);
    
    const data = await strategy.fallback();
    await redis.setex(strategy.key, strategy.ttl, JSON.stringify(data));
    return data;
  }
}
```

### 4. Read Replica Configuration

```yaml
# Primary-Replica Setup
Primary Database:
  - All writes
  - Critical reads (user authentication, checkout)
  
Read Replicas (2-3 instances):
  - Product catalog queries
  - Analytics dashboards
  - Report generation
  - Non-critical user data reads
```

## Security Implementation

### 1. Database Access Control

```sql
-- Role-based access control
CREATE ROLE app_reader;
CREATE ROLE app_writer;
CREATE ROLE app_admin;

-- Granular permissions
GRANT SELECT ON ALL TABLES IN SCHEMA public TO app_reader;
GRANT SELECT, INSERT, UPDATE ON saved_design, user_profile TO app_writer;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO app_admin;

-- Row-level security for multi-tenancy
ALTER TABLE saved_design ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_design_policy ON saved_design
  FOR ALL 
  USING (user_id = current_setting('app.current_user_id')::uuid);
```

### 2. Encryption Strategy

```yaml
Data at Rest:
  - PostgreSQL: Transparent Data Encryption (TDE)
  - Backups: AES-256 encryption
  - File storage: Encrypted S3 buckets

Data in Transit:
  - SSL/TLS for all connections
  - Certificate pinning for critical services
  - VPC peering for AWS services

Sensitive Data:
  - PII fields: Application-level encryption
  - Payment tokens: Stored only in Shopify
  - User emails: Hashed for lookups
```

### 3. Audit Logging

```sql
-- Audit table structure
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  table_name VARCHAR(255) NOT NULL,
  operation VARCHAR(10) NOT NULL,
  user_id UUID,
  clerk_session_id VARCHAR(255),
  changed_data JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  ip_address INET
);

-- Trigger for automatic audit logging
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO audit_log (table_name, operation, user_id, changed_data)
  VALUES (TG_TABLE_NAME, TG_OP, current_setting('app.current_user_id')::uuid, 
          to_jsonb(NEW));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## Scaling Patterns

### 1. Database Sharding Strategy (Future)

```yaml
Sharding Key: user_id
Shard Distribution:
  - Shard 1: user_id % 4 = 0
  - Shard 2: user_id % 4 = 1
  - Shard 3: user_id % 4 = 2
  - Shard 4: user_id % 4 = 3

Cross-Shard Queries:
  - Vitess or Citus for distributed queries
  - Scatter-gather pattern for analytics
```

### 2. Event Sourcing for Order Data

```typescript
interface OrderEvent {
  id: string;
  orderId: string;
  eventType: 'created' | 'updated' | 'fulfilled' | 'returned';
  payload: any;
  timestamp: Date;
  userId: string;
}

// Write events to append-only log
// Materialize views for current state
```

### 3. CQRS Implementation

```yaml
Command Side (Write):
  - PostgreSQL primary
  - Optimized for writes
  - Normalized schema
  
Query Side (Read):
  - PostgreSQL replicas
  - Denormalized views
  - Elasticsearch for search
  - Redis for hot data
```

## Monitoring & Observability

### 1. Key Metrics to Track

```yaml
Database Performance:
  - Query execution time (p50, p95, p99)
  - Connection pool utilization
  - Replication lag
  - Cache hit ratio
  - Lock wait times
  - Transaction rollback rate

Resource Utilization:
  - CPU usage per database
  - Memory usage and cache efficiency
  - Disk I/O and storage growth
  - Network throughput

Business Metrics:
  - Active users per shard
  - Design saves per minute
  - Order creation rate
  - Webhook processing lag
```

### 2. Alerting Rules

```yaml
Critical Alerts:
  - Replication lag > 10 seconds
  - Connection pool exhaustion
  - Disk space < 10%
  - Failed backups
  
Warning Alerts:
  - Query time p95 > 1 second
  - Cache miss rate > 30%
  - Connection pool > 80% utilized
  - Unusual traffic patterns
```

## Disaster Recovery

### 1. Backup Strategy

```yaml
Continuous Backups:
  - WAL archiving to S3
  - Point-in-time recovery (PITR)
  - 5-minute recovery point objective (RPO)

Daily Snapshots:
  - Full database snapshots
  - 30-day retention
  - Cross-region replication

Testing:
  - Monthly restore drills
  - Automated backup verification
  - Documented recovery procedures
```

### 2. High Availability Setup

```yaml
Primary Region (us-east-1):
  - Multi-AZ PostgreSQL deployment
  - Automatic failover
  - PgBouncer on each app server

Standby Region (us-west-2):
  - Async streaming replica
  - Read-only operations
  - Can be promoted in disaster

Redis Cluster:
  - Redis Sentinel for HA
  - 3 nodes minimum
  - Automatic failover
```

## Cost Optimization

### 1. Resource Right-Sizing

```yaml
Development:
  - Single PostgreSQL instance (db.t3.medium)
  - Basic Redis (cache.t3.micro)
  - Shared PgBouncer

Staging:
  - PostgreSQL with read replica (db.t3.large)
  - Redis cluster (cache.m5.large)
  - Dedicated PgBouncer

Production:
  - PostgreSQL Multi-AZ (db.r6g.xlarge)
  - Redis cluster (cache.r6g.large)
  - PgBouncer pool per region
```

### 2. Data Lifecycle Management

```yaml
Hot Data (0-30 days):
  - Primary database
  - Full indexing
  - Real-time access

Warm Data (30-180 days):
  - Compressed tables
  - Reduced indexes
  - Async access okay

Cold Data (180+ days):
  - Archive to S3
  - Queryable via Athena
  - Compliance retention only
```

## Implementation Timeline

### Phase 1: Foundation (Weeks 1-2)
- Set up PostgreSQL with Prisma
- Configure PgBouncer
- Implement basic Redis caching
- Create initial indexes

### Phase 2: Security & Monitoring (Weeks 3-4)
- Implement RLS policies
- Set up audit logging
- Configure monitoring dashboards
- Implement backup strategy

### Phase 3: Performance Optimization (Weeks 5-6)
- Add read replicas
- Optimize query patterns
- Implement advanced caching
- Load testing and tuning

### Phase 4: Advanced Features (Weeks 7-8)
- Implement CQRS patterns
- Set up cross-region replication
- Advanced monitoring and alerting
- Disaster recovery testing

## Recommended Technology Stack

### Core Database Stack
- **PostgreSQL 15+**: Primary database with JSONB support
- **PgBouncer**: Connection pooling
- **Redis 7+**: Caching and queues
- **Prisma**: Type-safe ORM with migration support

### Monitoring Stack
- **Prometheus + Grafana**: Metrics and dashboards
- **pg_stat_statements**: Query performance analysis
- **Datadog/New Relic**: APM and infrastructure monitoring
- **Sentry**: Error tracking and performance monitoring

### Security Tools
- **Vault**: Secrets management
- **AWS KMS**: Encryption key management
- **PostgreSQL Audit Extension**: Compliance logging
- **OWASP Dependency Check**: Security scanning

## Conclusion

This scaling plan provides a robust foundation for the All Pet Plus platform, balancing performance, security, and cost-effectiveness. The phased approach allows for incremental implementation while maintaining system stability. Regular review and adjustment of these strategies based on actual usage patterns will ensure optimal performance as the platform grows.
