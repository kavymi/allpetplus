# Database Migration Setup Complete

## Summary

Successfully set up and migrated the PostgreSQL database for All Pet Plus.

## What Was Done

### 1. Fixed PostgreSQL Port Conflict
- **Problem**: Local PostgreSQL@14 was running on port 5432, conflicting with Docker PostgreSQL
- **Solution**: Stopped local PostgreSQL service with `brew services stop postgresql@14`
- **Result**: Docker PostgreSQL now accessible on `127.0.0.1:5432`

### 2. Database Configuration
- **Service**: PostgreSQL 16 Alpine (Docker)
- **Connection**: `postgresql://postgres:password@127.0.0.1:5432/pet_db`
- **Extensions Installed**:
  - `uuid-ossp` - UUID generation
  - `pgcrypto` - Cryptographic functions
  - `pg_stat_statements` - Performance monitoring
  - `pg_trgm` - Full-text search
  - `btree_gist` - Row-level security helpers

### 3. Prisma Schema Updates
- Removed `multiSchema` preview feature (was causing permission issues)
- Removed `postgresqlExtensions` from datasource (extensions created manually)
- Simplified schema to use standard PostgreSQL features

### 4. Database Tables Created
Successfully created all required tables:
- `analytics_events` - User behavior tracking
- `audit_logs` - Security and compliance auditing
- `builder_presets` - Saved builder configurations
- `cache_invalidations` - Cache management
- `experiment_assignments` - A/B testing
- `order_meta` - Order metadata and tracking
- `saved_designs` - User's custom harness designs
- `user_profiles` - User profile information
- `webhook_logs` - Webhook event tracking

### 5. Environment Configuration
- Created `/services/backend/.env` from template
- Updated `DATABASE_URL` to point to Docker PostgreSQL
- Added placeholder `CLERK_SECRET_KEY` for development

## Files Modified

1. **`/services/backend/.env`**
   - Created from `env.template`
   - Updated `DATABASE_URL=postgresql://postgres:password@127.0.0.1:5432/pet_db`
   - Added development `CLERK_SECRET_KEY`

2. **`/services/backend/prisma/schema.prisma`**
   - Removed `multiSchema` and `postgresqlExtensions` preview features
   - Removed `extensions` from datasource (created manually in DB)

## Current State

### ✅ Working
- PostgreSQL database running in Docker
- All tables created and schema synced
- Prisma Client generated
- Database accessible from host machine

### ⚠️ Needs Attention

#### 1. Clerk Authentication
The backend `.env` has a placeholder Clerk key:
```bash
CLERK_SECRET_KEY=sk_test_development_placeholder_change_me_in_production
```

**To fix:**
1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Select your project (or create one)
3. Go to **API Keys**
4. Copy the **Secret Key**
5. Update both:
   - `/services/backend/.env` - Set `CLERK_SECRET_KEY`
   - `/apps/web/.env.local` - Set `CLERK_SECRET_KEY` and `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`

#### 2. Local PostgreSQL Service
Your local PostgreSQL@14 is now stopped. If you need it for other projects:
```bash
# Start local PostgreSQL
brew services start postgresql@14

# Note: You'll need to stop it again to use Docker PostgreSQL for this project
brew services stop postgresql@14
```

## Running Services

### Start Database
```bash
cd /Users/kavyrattana/Coding/pet
docker compose up db redis -d
```

### Check Database Status
```bash
# Check tables
PGPASSWORD=password psql -h 127.0.0.1 -U postgres -d pet_db -c "\dt"

# Check extensions
PGPASSWORD=password psql -h 127.0.0.1 -U postgres -d pet_db -c "\dx"

# Connect to database
PGPASSWORD=password psql -h 127.0.0.1 -U postgres -d pet_db
```

### Apply Future Migrations
```bash
cd services/backend

# Create migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# Sync schema without migration (development)
npx prisma db push

# Generate Prisma Client
npx prisma generate
```

## Troubleshooting

### Port 5432 Conflict
If you get connection errors:
```bash
# Check what's using port 5432
lsof -i:5432

# Stop local PostgreSQL
brew services stop postgresql@14
brew services stop postgresql@15
brew services stop postgresql@16

# Restart Docker PostgreSQL
docker compose restart db
```

### Permission Errors
If Prisma reports permission errors:
```bash
# Grant permissions
docker compose exec db psql -U postgres -d pet_db -c "
  GRANT ALL PRIVILEGES ON SCHEMA public TO postgres;
  GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres;
  GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres;
"
```

### Reset Database
To start fresh:
```bash
# Stop containers
docker compose down

# Remove volumes
docker volume rm pet_postgres_data

# Start and migrate
docker compose up db redis -d
sleep 3
cd services/backend
npx prisma db push
```

## Next Steps

1. **Set up Clerk Authentication** (see above)
2. **Start the backend server**:
   ```bash
   npx nx serve backend
   ```
3. **Test API endpoints** at `http://localhost:3001`
4. **Test tRPC integration** from the web app

## Related Documentation

- [Environment Setup Guide](/docs/guides/environment-setup.md)
- [Database Setup Guide](/docs/guides/database-setup.md)
- [tRPC Usage Examples](/docs/guides/trpc-usage-examples.md)
- [React 19 Compatibility](/docs/troubleshooting/react-19-compatibility.md)



