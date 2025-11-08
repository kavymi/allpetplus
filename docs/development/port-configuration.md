# Port Configuration

**Purpose:** Documents port assignments for all services in the AllPetPlus monorepo  
**Status:** Active  
**Last Updated:** 2025-11-07

## Port Assignments

### Frontend Applications

| Port | Service | Description |
|------|---------|-------------|
| 3000 | apps/web | Main web application (Next.js) |
| 3001 | apps/pet-licensing | Pet licensing micro-frontend (Next.js) |
| 300X | future apps | Reserved for future frontend applications |

### Backend Services

| Port | Service | Description |
|------|---------|-------------|
| 4000 | services/backend | Main backend API (Fastify) |
| 4001 | services/builder-service | Builder service microservice (Fastify) |
| 4002 | services/test | Test service (development only) |
| 400X | future services | Reserved for future backend services |

## Running Services

### Start All Services

Run all services in parallel (automatically discovers all services with `dev` target):

```bash
npm run dev
```

This command will start:
- apps/web (port 3000)
- apps/pet-licensing (port 3001)
- services/backend (port 4000)
- services/builder-service (port 4001)
- services/test (port 4002)

### Start Individual Services

Start specific services:

```bash
npm run dev:web        # Web app only (port 3000)
npm run dev:backend    # Backend only (port 4000)
npm run dev:builder    # Builder service only (port 4001)
npm run dev:licensing  # Pet licensing app only (port 3001)
```

### Alternative Start Commands

```bash
npm run start          # Same as dev (all services)
npm run start:fast     # Skip nx cache for fresh start
npm run dev:all        # Explicitly run all dev targets
```

## Port Management

### Check Which Ports Are In Use

On macOS/Linux:
```bash
lsof -i :3000
lsof -i :4000
```

On Windows:
```bash
netstat -ano | findstr :3000
netstat -ano | findstr :4000
```

### Kill Process on Specific Port

On macOS/Linux:
```bash
lsof -ti:3000 | xargs kill -9
lsof -ti:4000 | xargs kill -9
```

On Windows:
```bash
# Find PID first
netstat -ano | findstr :3000
# Then kill it
taskkill /PID <PID> /F
```

### Using Port Management Script (Optional)

If the port management script has been added:

```bash
npm run ports:check     # Check which ports are in use
npm run ports:kill      # Kill all dev ports (3000, 3001, 4000, 4001, 4002)
```

## Port Configuration in Project Files

### Frontend Apps (Next.js)

Ports are configured in `project.json`:

```json
{
  "targets": {
    "dev": {
      "executor": "@nx/next:server",
      "options": {
        "port": 3000  // ← Port number here
      }
    }
  }
}
```

### Backend Services (Fastify)

Ports are configured in each service's main file or environment variables:

```typescript
// services/backend/src/main.ts
const PORT = process.env.PORT || 4000;
```

## Adding New Services

When adding new services:

1. **Frontend apps** → Use ports 3002, 3003, 3004, etc.
2. **Backend services** → Use ports 4003, 4004, 4005, etc.

Update this documentation when adding new services.

## Troubleshooting

### Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
1. Check what's using the port: `lsof -i :3000`
2. Kill the process: `lsof -ti:3000 | xargs kill -9`
3. Or use a different port in the service configuration

### Services Don't Start

**Check:**
1. Are all environment files set up? (`.env.local`, `.env`)
2. Are dependencies installed? Run `npm install` in root
3. Is database running? Check Prisma connection
4. Check individual service logs for errors

### Database Connection Issues

If services can't connect to database:

1. Ensure Prisma client is generated: `npm run db:generate`
2. Check database credentials in `.env` files
3. Verify database is running and accessible

## Related Documentation

- [Environment Setup](/docs/guides/environment-setup.md)
- [Development Workflow](/docs/development/dev-workflow.md)
- [Creating New Services](/docs/guides/CREATE_NEW_MICROSERVICE.md)
- [Creating New Micro-frontends](/docs/guides/CREATE_NEW_MICROFRONTEND.md)

