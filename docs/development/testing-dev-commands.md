# Testing Development Commands

**Purpose:** Validation steps for the new nx run-many architecture  
**Status:** Test Procedures  
**Last Updated:** 2025-11-07

## Prerequisites

Before testing, ensure:

1. Dependencies are installed:
   ```bash
   npm install
   ```

2. Environment files are set up:
   ```bash
   cp env.template apps/web/.env.local
   cp env.template services/backend/.env
   cp env.template services/builder-service/.env
   ```

3. Database is running and Prisma clients are generated:
   ```bash
   npm run db:generate
   ```

## Test Individual Services

### Test 1: Web Application

Start the web application:
```bash
npm run dev:web
```

**Expected:**
- Service starts on port 3000
- Console shows "ready - started server on 0.0.0.0:3000"
- Navigate to http://localhost:3000 shows the application

**Stop:** Press Ctrl+C

### Test 2: Backend Service

Start the backend service:
```bash
npm run dev:backend
```

**Expected:**
- Service starts on port 4000
- Console shows "Server listening at http://0.0.0.0:4000"
- Navigate to http://localhost:4000/health shows health check response

**Stop:** Press Ctrl+C

### Test 3: Builder Service

Start the builder service:
```bash
npm run dev:builder
```

**Expected:**
- Service starts on port 4001
- Console shows "Server listening at http://0.0.0.0:4001"
- Navigate to http://localhost:4001/health shows health check response

**Stop:** Press Ctrl+C

### Test 4: Pet Licensing App

Start the pet licensing application:
```bash
npm run dev:licensing
```

**Expected:**
- Service starts on port 3001
- Console shows "ready - started server on 0.0.0.0:3001"
- Navigate to http://localhost:3001 shows the licensing application

**Stop:** Press Ctrl+C

## Test All Services Together

### Test 5: Start All Services with npm run dev

Before starting, ensure no ports are in use:
```bash
npm run ports:check
```

If ports are busy, kill them:
```bash
npm run ports:kill
```

Start all services:
```bash
npm run dev
```

**Expected:**
- All services start in parallel
- Console shows nx output for each service
- Services should appear in this order:
  - web (port 3000)
  - pet-licensing (port 3001)
  - backend (port 4000)
  - builder-service (port 4001)
  - test (port 4002) - optional

**Verify all services are running:**

Open multiple terminal tabs/windows and run:
```bash
# Terminal 1: Check web
curl -I http://localhost:3000

# Terminal 2: Check pet licensing
curl -I http://localhost:3001

# Terminal 3: Check backend
curl http://localhost:4000/health

# Terminal 4: Check builder service
curl http://localhost:4001/health
```

**Stop:** Press Ctrl+C in the terminal running npm run dev

## Test Alternative Commands

### Test 6: npm run start

```bash
npm run start
```

**Expected:** Same as `npm run dev` - all services start

### Test 7: npm run start:fast (skip cache)

```bash
npm run start:fast
```

**Expected:** All services start without nx cache

### Test 8: npm run dev:all (explicit)

```bash
npm run dev:all
```

**Expected:** All services with dev target start

## Test Database Commands

### Test 9: Generate Prisma Clients

```bash
npm run db:generate
```

**Expected:**
- Prisma generate runs for backend
- Prisma generate runs for builder-service
- Both complete successfully
- Console shows "Generated Prisma Client" for both services

## Test Port Management

### Test 10: Check Ports

```bash
npm run ports:check
```

**Expected:**
- Lists all development ports (3000, 3001, 4000, 4001, 4002)
- Shows which ports are in use and by which process

### Test 11: Check Ports Verbose

```bash
npm run ports:check:verbose
```

**Expected:**
- Shows detailed information about each port
- Shows process names and command lines
- Color-coded output

### Test 12: Kill Ports

Start some services, then:
```bash
npm run ports:kill
```

**Expected:**
- All processes on dev ports are killed
- Ports become available
- Console shows which processes were killed

## Verification Checklist

After running all tests, verify:

- [ ] All individual service commands work (`dev:web`, `dev:backend`, etc.)
- [ ] `npm run dev` starts all services automatically
- [ ] All services run on correct ports
- [ ] No port conflicts occur
- [ ] Services can be stopped cleanly with Ctrl+C
- [ ] Port management scripts work correctly
- [ ] `db:generate` runs for all Prisma services
- [ ] Alternative start commands work (`start`, `start:fast`, `dev:all`)

## Troubleshooting

### Services Don't Start

1. **Check dependencies:**
   ```bash
   npm install
   ```

2. **Check environment files exist:**
   ```bash
   ls apps/web/.env.local
   ls services/backend/.env
   ls services/builder-service/.env
   ```

3. **Generate Prisma clients:**
   ```bash
   npm run db:generate
   ```

### Port Already in Use

```bash
npm run ports:kill
```

Or manually:
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9
```

### nx Command Not Found

Make sure dependencies are installed:
```bash
npm install
```

The nx CLI should be in `node_modules/.bin/nx`

### Services Start But Don't Respond

Check logs in the terminal for errors. Common issues:
- Database connection issues
- Missing environment variables
- Port conflicts

## Success Criteria

✅ **Implementation Successful If:**

1. `npm run dev` starts all services without manual project specification
2. All services run on documented ports
3. Individual service commands work
4. Port management prevents conflicts
5. New services can be added by just creating project.json with dev target
6. No need to update package.json when adding new services

## Related Documentation

- [Port Configuration](/docs/development/port-configuration.md)
- [Environment Setup](/docs/guides/environment-setup.md)
- [Development Workflow](/docs/development/dev-workflow.md)

