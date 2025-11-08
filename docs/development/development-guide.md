# Development Guide

**For initial setup, see:** [How To Setup Guide](../how-to-setup.md)

---

## Daily Development Workflow

### Running Services

#### Option 1: NX Terminal (Recommended)

```bash
npm run dev
```

**Features:**
- View both frontend and backend logs
- Use `←` / `→` to navigate between services
- Press `/` to search logs
- `Ctrl+C` to stop all

#### Option 2: Split Terminal in VS Code

```
┌─────────────────┬─────────────────┐
│   Backend       │    Frontend     │
│   Port 3001     │    Port 3000    │
└─────────────────┴─────────────────┘
```

1. Open VS Code integrated terminal
2. Click split terminal button (`Cmd+\`)
3. Left: `npm run dev:backend`
4. Right: `npm run dev:web`

**Pros:** Clean separation, independent scrolling  
**Cons:** Two commands to start

#### Option 3: Separate Tabs

```bash
# Terminal 1
npm run dev:backend

# Terminal 2
npm run dev:web
```

#### Option 4: tmux (Advanced)

```bash
# Install tmux
brew install tmux

# Run dev script
./scripts/dev-tmux.sh

# Controls:
# Ctrl+B then arrows - Switch panes
# Ctrl+B then d - Detach
# tmux attach -t all-pet-plus-dev - Reattach
```

### Hot Reload

Both services auto-reload on changes:
- **Frontend**: Next.js Fast Refresh (instant)
- **Backend**: tsx watch (restarts server automatically)

## Individual Service Commands

### Run Services Separately

```bash
# Frontend only
npm run dev:web

# Backend only
npm run dev:backend
```

### Build Commands

```bash
# Build everything
npm run build

# Build specific service
npx nx build web
npx nx build backend
```

### Testing

```bash
# Run all tests
npm run test

# Test specific service
npx nx test web
npx nx test backend

# Watch mode
npm run test:watch
```

### Linting & Type Checking

```bash
# Lint all code
npm run lint

# Type check all code
npm run typecheck

# Format code
npm run format
```

## Database Management

### Common Commands

```bash
cd services/backend

# Generate Prisma client (after schema changes)
npm run db:generate

# Create and run migrations
npm run db:migrate

# Open Prisma Studio (DB GUI)
npm run db:studio

# Reset database (WARNING: Deletes all data!)
npm run db:reset

# Seed database with test data
npm run db:seed
```

### Using Adminer

Access Adminer at `http://localhost:8081`:
- **System**: PostgreSQL
- **Server**: db (or localhost from host machine)
- **Username**: postgres
- **Password**: password
- **Database**: pet_db

## Troubleshooting

### Port Already in Use

```bash
# Find process using a port
lsof -ti:3000  # Frontend
lsof -ti:3001  # Backend

# Kill process
kill -9 <PID>
```

### Database Connection Issues

```bash
# Check if databases are running
docker compose -f docker-compose.dev.yml ps

# Restart databases
docker compose -f docker-compose.dev.yml restart

# View logs
docker compose -f docker-compose.dev.yml logs -f
```

### Clear NX Cache

```bash
# Reset NX cache if builds are acting weird
npm run clean
```

### Prisma Issues

```bash
cd services/backend

# Regenerate Prisma client
npm run db:generate

# Check migration status
npx prisma migrate status
```

## Project Structure

```
pet/
├── apps/
│   └── web/                # Next.js frontend (port 3000)
├── services/
│   └── backend/            # Fastify backend (port 3001)
├── libs/
│   ├── shared/            # Shared TypeScript utilities
│   ├── ui/                # Shared UI components
│   └── utils/             # Shared helper functions
├── docs/                   # Documentation
└── docker-compose.dev.yml  # Development databases
```

## Environment Variables

### Required for Development

#### Frontend (`apps/web/.env.local`)
```bash
NEXT_PUBLIC_APP_NAME=All Pet Plus
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT=
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
```

#### Backend (`services/backend/.env`)
```bash
NODE_ENV=development
DATABASE_URL=postgresql://postgres:password@localhost:5432/pet_db
REDIS_URL=redis://localhost:6379
JWT_SECRET=your-jwt-secret-key-here
REFRESH_TOKEN_SECRET=your-refresh-token-secret
SESSION_SECRET=your-session-secret
ENCRYPTION_KEY=your-32-character-encryption-key!!
CLERK_SECRET_KEY=
CORS_ORIGIN=http://localhost:3000
```

## Useful Links

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Backend Health**: http://localhost:3001/healthz
- **Adminer (DB GUI)**: http://localhost:8081
- **NX Graph**: Run `npm run graph` to visualize project dependencies

## Build Process

### Quick Build Verification

**Build all libraries:**
```bash
npx nx run-many --target=build --projects=domain,shared,messaging
# ✅ Should complete in ~5 seconds
```

**Build web app:**
```bash
cd apps/web && NODE_ENV=production npx next build
# ✅ Should complete in ~12-15 seconds
# ✅ Generates 23/24 static pages
```

### Build Workflow for Feature Development

**Before starting feature:**
```bash
# Verify codebase builds
npx nx build domain shared messaging
```

**During development:**
```bash
# Type check your changes (fast)
npx nx typecheck web

# Lint your code
npx nx lint web
```

**Before committing:**
```bash
# 1. Build libraries
npx nx build domain shared messaging

# 2. Build web app
NODE_ENV=production npx nx build web

# 3. Run linting
npx nx lint web

# 4. Verify no errors or new warnings
```

### Build Commands Reference

**Individual projects:**
```bash
# Libraries
npx nx build domain
npx nx build shared  
npx nx build messaging

# Web app (via NX)
npx nx build web

# Web app (directly - faster for iteration)
cd apps/web && npx next build
```

**Type checking:**
```bash
# Web app
npx nx typecheck web

# Libraries
npx tsc -p libs/domain/tsconfig.lib.json --noEmit
npx tsc -p libs/shared/tsconfig.lib.json --noEmit
```

**Linting:**
```bash
npx nx lint web
npx nx lint domain
npx nx lint shared
```

### Build Status (Current)

| Project | Status | Build Time | Notes |
|---------|--------|------------|-------|
| `libs/domain` | ✅ Building | ~2s | 100% clean |
| `libs/shared` | ✅ Building | ~1s | 100% clean |
| `libs/messaging` | ✅ Building | ~1s | 100% clean |
| `apps/web` | ✅ Building | ~12s | Production ready |
| `apps/pet-licensing` | 🟡 Partial | N/A | Known Next.js workspace issue |
| `services/backend` | ⚠️ Errors | N/A | Pre-existing TypeScript errors |

### Troubleshooting Build Issues

**Module not found errors:**
- Ensure you've built dependencies: `npx nx build domain shared`
- Check import paths use correct aliases: `@pet/*` or `@/`
- Clear NX cache: `npx nx reset`

**TypeScript errors:**
- Run type check: `npx nx typecheck web`
- Ensure all imports are from built libraries
- Check tsconfig.json has correct paths

**Build takes too long:**
- Use NX caching: `npx nx build web` (subsequent builds are cached)
- Build only what changed: `npx nx affected --target=build`

**See:** `/docs/archive/2025-10/build-workflow-fixes-complete.md` for detailed build fix history

---

## Next Steps

1. Review the [Architecture Documentation](./docs/architecture.md)
2. Check the [API Reference](./docs/api-reference.md)
3. Read [Code Patterns](./docs/code-patterns.md)
4. See [Testing Guide](./docs/testing-guide.md)

## Getting Help

- Check [Troubleshooting FAQ](./docs/troubleshooting-faq.md)
- Review [Environment Variables Guide](./docs/environment-variables.md)
- See [Database Setup Guide](./docs/database-setup.md)

