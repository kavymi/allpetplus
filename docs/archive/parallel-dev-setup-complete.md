# ✅ Parallel Development Setup Complete

## What Was Configured

### 1. **NX Parallel Execution**
- ✅ Updated `package.json` to run `web` and `backend` in parallel
- ✅ Added `dev` target to backend project configuration
- ✅ Configured `npm run dev` to start both services simultaneously

### 2. **Development Databases**
- ✅ Fixed `docker-compose.dev.yml` (removed obsolete version)
- ✅ Changed Adminer port from 8080 to 8081 (avoid conflicts)
- ✅ Started PostgreSQL, Redis, and Adminer successfully

### 3. **Environment Configuration**
- ✅ Updated backend env template with proper 32-character encryption key
- ✅ Environment files ready at:
  - `apps/web/.env.local`
  - `services/backend/.env`

### 4. **Documentation**
- ✅ Created comprehensive `DEVELOPMENT_GUIDE.md`
- ✅ Included NX terminal usage instructions
- ✅ Added troubleshooting tips

## How to Use

### Start Everything

```bash
# 1. Ensure databases are running
docker compose -f docker-compose.dev.yml ps

# 2. Fix the encryption key (ONE TIME SETUP)
# Edit services/backend/.env and change:
#   ENCRYPTION_KEY=your-32-character-encryption-key!!
# To exactly this (32 characters):
#   ENCRYPTION_KEY=dev-encryption-key-32-chars!!

# 3. Start both services
npm run dev
```

### NX Terminal Features

When you run `npm run dev`, you'll see:

```
 NX   Running target dev for 2 projects:

- web
- backend
```

**Interactive Features:**
- View logs for both services simultaneously
- Navigate between service outputs
- Search through logs
- Restart individual services
- Stop all with `Ctrl+C`

### Service URLs

After running `npm run dev`:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:3001
- **Backend Health**: http://localhost:3001/healthz
- **Database GUI (Adminer)**: http://localhost:8081

## Individual Service Commands

### Run Separately

```bash
# Frontend only
npm run dev:web

# Backend only
npm run dev:backend
```

### Check Services

```bash
# View NX dependency graph
npm run graph

# Check database status
docker compose -f docker-compose.dev.yml ps

# View database logs
docker compose -f docker-compose.dev.yml logs -f
```

## Project Configuration

### Package.json Scripts
```json
{
  "dev": "nx run-many --target=dev --projects=web,backend --parallel=2",
  "dev:web": "nx dev web",
  "dev:backend": "nx dev backend"
}
```

### Backend Project (services/backend/project.json)
```json
{
  "targets": {
    "dev": {
      "executor": "nx:run-commands",
      "options": {
        "command": "cd services/backend && npm run dev",
        "color": true
      }
    }
  }
}
```

### Frontend Project (apps/web/project.json)
```json
{
  "targets": {
    "dev": {
      "executor": "@nx/next:server",
      "options": {
        "dev": true,
        "turbo": true
      }
    }
  }
}
```

## Development Workflow

### Typical Development Session

```bash
# 1. Start databases (first time only)
docker compose -f docker-compose.dev.yml up -d

# 2. Start development servers
npm run dev

# 3. Make changes to code
# - Frontend auto-reloads on save
# - Backend auto-restarts with tsx watch

# 4. View logs in NX terminal
# - Use arrow keys to switch between services
# - Search logs with /
# - Press Ctrl+C to stop all services

# 5. Stop databases when done (optional)
docker compose -f docker-compose.dev.yml down
```

### Database Migrations

```bash
cd services/backend

# Create migration
npm run db:migrate

# View database
npm run db:studio

# Or use Adminer at http://localhost:8081
```

## Troubleshooting

### Issue: ENCRYPTION_KEY Error

**Error**: `ENCRYPTION_KEY must be exactly 32 characters`

**Fix**: Edit `services/backend/.env`:
```bash
# Must be EXACTLY 32 characters
ENCRYPTION_KEY=dev-encryption-key-32-chars!!
```

### Issue: Port Already in Use

**Frontend (3000):**
```bash
lsof -ti:3000 | xargs kill -9
```

**Backend (3001):**
```bash
lsof -ti:3001 | xargs kill -9
```

### Issue: Database Connection Failed

```bash
# Check if databases are running
docker compose -f docker-compose.dev.yml ps

# Restart databases
docker compose -f docker-compose.dev.yml restart

# View logs
docker compose -f docker-compose.dev.yml logs -f db
```

### Issue: NX Cache Issues

```bash
# Clear NX cache
npm run clean

# Restart dev servers
npm run dev
```

## Additional Resources

- **Full Guide**: See `DEVELOPMENT_GUIDE.md`
- **Architecture**: See `docs/architecture.md`
- **API Reference**: See `docs/api-reference.md`
- **Troubleshooting**: See `docs/troubleshooting-faq.md`

## Next Steps

1. ✅ **Fix encryption key** in `services/backend/.env`
2. ✅ **Run** `npm run dev`
3. ✅ **Open** http://localhost:3000 in your browser
4. ✅ **Start coding** - changes will auto-reload!

## Summary

You now have a fully configured parallel development environment where:
- ✅ Both frontend and backend run simultaneously
- ✅ NX terminal provides unified log viewing
- ✅ Auto-reload/restart on file changes
- ✅ Easy navigation between service logs
- ✅ Individual service control
- ✅ Database GUI for easy data inspection

Enjoy developing! 🚀

