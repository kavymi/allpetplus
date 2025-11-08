# Database Setup Guide

This guide provides instructions for setting up and managing the database infrastructure for All Pet Plus.

## Quick Start

1. **Copy environment variables**:
   ```bash
   cp env.template .env
   # Edit .env with your values
   ```

2. **Start database services**:
   ```bash
   make db-up
   ```

3. **Run migrations**:
   ```bash
   cd services/backend
   npm install
   npm run db:generate
   npm run db:migrate
   ```

4. **Verify setup**:
   ```bash
   make db-test
   ```

## Architecture Overview

- **PostgreSQL 15**: Primary database with read replicas
- **PgBouncer**: Connection pooling
- **Redis**: Caching and queue backend
- **Docker Compose**: Local development environment

## Common Commands

### Database Operations

```bash
# Start services
make db-up

# Stop services
make db-down

# Reset database
make db-reset

# Run migrations
make db-migrate

# Seed test data
make db-seed

# Create backup
make db-backup

# View slow queries
make db-slow-queries

# Check connections
make db-connections
```

### Prisma Commands

```bash
# Generate Prisma client
npm run db:generate

# Create migration
npx prisma migrate dev --name your_migration_name

# Deploy migrations (production)
npm run db:migrate:prod

# Open Prisma Studio
npm run db:studio
```

## Connection URLs

### Development

- **PostgreSQL (via PgBouncer)**: `postgresql://postgres:development_password@localhost:6432/harness_hero`
- **PostgreSQL (Direct)**: `postgresql://postgres:development_password@localhost:5432/harness_hero`
- **Redis**: `redis://:development_password@localhost:6379`

### Admin UIs

- **pgAdmin**: http://localhost:5050
  - Email: `admin@harnesshero.local`
  - Password: `admin`
- **Redis Commander**: http://localhost:8081
  - Username: `admin`
  - Password: `admin`
- **Prisma Studio**: Run `npm run db:studio` in backend directory

## Performance Optimization

### Query Optimization

1. **Use indexes effectively**:
   ```sql
   -- Check index usage
   SELECT * FROM pg_stat_user_indexes WHERE idx_scan = 0;
   ```

2. **Monitor slow queries**:
   ```bash
   make db-slow-queries
   ```

3. **Analyze query plans**:
   ```sql
   EXPLAIN (ANALYZE, BUFFERS) YOUR_QUERY_HERE;
   ```

### Connection Pooling

PgBouncer is configured with:
- Pool mode: `transaction`
- Default pool size: 25
- Max client connections: 100

### Caching Strategy

Redis is used for:
- Session data (TTL: 1 hour)
- Product cache (TTL: 5 minutes)
- Builder configs (TTL: 24 hours)

## Security Best Practices

1. **Never commit `.env` files**
2. **Use strong passwords in production**
3. **Enable SSL/TLS for all connections**
4. **Implement Row-Level Security (RLS)**
5. **Encrypt sensitive fields at application level**
6. **Regular security audits**

## Monitoring

### Health Checks

```bash
# Check all services
make db-test

# View connections
make db-connections

# Table sizes
make db-table-sizes
```

### Key Metrics

Monitor these metrics in production:
- Query execution time (p95 < 100ms)
- Connection pool utilization (< 80%)
- Cache hit ratio (> 90%)
- Replication lag (< 10s)

## Troubleshooting

### Common Issues

1. **Connection refused**:
   - Ensure Docker is running
   - Check if ports are available
   - Verify environment variables

2. **Migration failures**:
   - Check database connectivity
   - Ensure migrations are run in order
   - Verify schema permissions

3. **Slow queries**:
   - Add missing indexes
   - Optimize query structure
   - Consider denormalization

### Logs

```bash
# View all logs
make dev-logs

# PostgreSQL logs
docker-compose logs postgres-primary

# Redis logs
docker-compose logs redis
```

## Production Deployment

### Prerequisites

1. Managed PostgreSQL (AWS RDS, Google Cloud SQL, etc.)
2. Redis cluster (AWS ElastiCache, Redis Cloud, etc.)
3. SSL certificates
4. Monitoring setup (Datadog, New Relic, etc.)

### Environment Variables

Required production variables:
- `DATABASE_URL`: Primary database connection
- `DATABASE_REPLICA_URL`: Read replica connection
- `REDIS_URL`: Redis connection
- `ENCRYPTION_KEY`: 32-character encryption key
- `CLERK_SECRET_KEY`: Clerk authentication key
- `SHOPIFY_*`: Shopify API credentials

### Migration Strategy

1. Test migrations in staging
2. Create database backup
3. Run migrations during low-traffic period
4. Monitor for errors
5. Have rollback plan ready

## Maintenance

### Regular Tasks

- **Daily**: Monitor slow queries, check error logs
- **Weekly**: Review index usage, analyze table growth
- **Monthly**: Update statistics, vacuum analyze
- **Quarterly**: Security audit, performance review

### Backup Strategy

- Continuous WAL archiving
- Daily snapshots with 30-day retention
- Test restore procedures monthly
- Cross-region replication for DR
