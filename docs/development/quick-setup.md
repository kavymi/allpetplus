# Quick Setup Guide

**Purpose:** Get AllPetPlus running in under 5 minutes  
**Status:** Active  
**Last Updated:** 2025-11-07

## Prerequisites

- Node.js 24.x installed
- npm 10.x installed
- PostgreSQL running on port 5432
- Redis running on port 6379

## Setup Steps

### 1. Install Dependencies

```bash
cd /Users/kavyrattana/Coding/allpetplus
npm install
```

### 2. Create Environment Files

**Backend (.env):**
```bash
cd services/backend
cp env.template .env
```

Edit `services/backend/.env` and ensure:
```env
PORT=4000
DATABASE_URL=postgresql://postgres:password@localhost:5432/harness_hero
REDIS_URL=redis://localhost:6379
CLERK_SECRET_KEY=your-clerk-secret-key
```

**Builder Service (.env):**
```bash
cd services/builder-service
cp env.template .env
```

Edit `services/builder-service/.env` and ensure:
```env
PORT=4001
DATABASE_URL=postgresql://postgres:password@localhost:5432/harness_hero
REDIS_URL=redis://localhost:6379
CLERK_SECRET_KEY=your-clerk-secret-key
```

**Web App (.env.local):**
```bash
cd apps/web
cp env.template .env.local
```

Edit `apps/web/.env.local` and configure.

### 3. Generate Prisma Clients

```bash
cd /Users/kavyrattana/Coding/allpetplus
npm run db:generate
```

### 4. Start All Services

```bash
npm run dev
```

This will:
1. Generate Prisma clients for all services
2. Kill any processes on dev ports
3. Start all 5 services in parallel:
   - `web` on port 3000
   - `pet-licensing` on port 3001
   - `backend` on port 4000
   - `builder-service` on port 4001
   - `test` on port 4002

## Verify Services Are Running

Open new terminal tabs:

```bash
# Check web
curl -I http://localhost:3000

# Check pet licensing
curl -I http://localhost:3001

# Check backend
curl http://localhost:4000/health

# Check builder service
curl http://localhost:4001/healthz
```

## Port Configuration

| Service | Port | URL |
|---------|------|-----|
| apps/web | 3000 | http://localhost:3000 |
| apps/pet-licensing | 3001 | http://localhost:3001 |
| services/backend | 4000 | http://localhost:4000 |
| services/builder-service | 4001 | http://localhost:4001 |
| services/test | 4002 | http://localhost:4002 |

## Troubleshooting

### Port Already in Use

```bash
npm run ports:kill
```

### Prisma Client Not Generated

```bash
npm run db:generate
```

### Service Won't Start

Check the .env file has correct PORT value:
- Backend: `PORT=4000`
- Builder: `PORT=4001`

### Database Connection Failed

1. Ensure PostgreSQL is running: `psql -U postgres`
2. Check DATABASE_URL in .env files
3. Create database if needed: `createdb harness_hero`

## Individual Service Commands

Start services individually for debugging:

```bash
npm run dev:web          # Web app only
npm run dev:backend      # Backend only
npm run dev:builder      # Builder service only
npm run dev:licensing    # Pet licensing only
```

## Stop All Services

Press `Ctrl+C` in the terminal running `npm run dev`

## Next Steps

- See [Port Configuration](/docs/development/port-configuration.md)
- See [Testing Dev Commands](/docs/development/testing-dev-commands.md)
- See [Environment Setup](/docs/guides/environment-setup.md)




