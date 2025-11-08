# Create New Microservice - Step-by-Step Guide

**Time to Create:** 15 minutes  
**Difficulty:** Easy  
**Pattern:** Proven, repeatable, documented

---

## 🎯 When to Create a Microservice

### Backend Service Checklist:

Create separate backend service when **3+ are true:**
- [ ] Traffic >1000 requests/min
- [ ] Needs different scaling (CPU vs memory)
- [ ] Separate team ownership
- [ ] Complex domain logic (>1000 lines)
- [ ] Different technology would help
- [ ] Independent deployment needed

**Otherwise:** Create module in `services/backend/src/modules/`

---

## 🚀 Quick Start: Create New Backend Microservice

### Step 1: Create Service Directory (2 min)

```bash
# Example: pet-insurance-service
mkdir -p services/pet-insurance/src/{routes,workers,plugins,utils}
cd services/pet-insurance
```

### Step 2: Copy Template Files (3 min)

**package.json:**
```json
{
  "name": "@pet/pet-insurance",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "tsx watch src/main.ts",
    "build": "tsc",
    "start": "node dist/main.js"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "fastify": "^4.26.2",
    "zod": "^3.22.4"
  }
}
```

**src/main.ts:**
```typescript
import Fastify from 'fastify';
import cors from '@fastify/cors';

const PORT = parseInt(process.env.PORT || '4005', 10);

const buildServer = async () => {
  const server = Fastify({ logger: { level: 'info' } });
  
  await server.register(cors);
  
  server.get('/healthz', async () => ({
    status: 'healthy',
    service: 'pet-insurance',
    timestamp: new Date().toISOString(),
  }));
  
  return server;
};

const start = async () => {
  const server = await buildServer();
  await server.listen({ port: PORT, host: '0.0.0.0' });
  console.log(`🚀 Pet Insurance Service on http://0.0.0.0:${PORT}`);
};

start();
```

### Step 3: Add NX Project Config (2 min)

**project.json:**
```json
{
  "name": "pet-insurance",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "services/pet-insurance/src",
  "projectType": "application",
  "tags": ["type:service", "scope:backend", "domain:pet-insurance"],
  "targets": {
    "serve": {
      "executor": "nx:run-commands",
      "options": {
        "command": "cd services/pet-insurance && npm run dev"
      }
    },
    "build": {
      "executor": "@nx/node:build",
      "options": {
        "outputPath": "dist/services/pet-insurance",
        "main": "services/pet-insurance/src/main.ts",
        "tsConfig": "services/pet-insurance/tsconfig.json"
      }
    }
  }
}
```

### Step 4: Add to Docker Compose (3 min)

**docker-compose.microservices.yml:**
```yaml
  pet-insurance:
    build: ./services/pet-insurance
    ports:
      - "4005:4005"
    environment:
      DATABASE_URL: postgresql://harness:dev_password@postgres:5432/harness_hero
      REDIS_URL: redis://redis:6379
      PORT: 4005
    depends_on:
      - postgres
      - redis
```

### Step 5: Create Domain in libs/domain (5 min)

```bash
mkdir -p libs/domain/src/lib/insurance
```

**libs/domain/src/lib/insurance/types.ts:**
```typescript
export interface PetInsurance {
  id: string;
  petId: string;
  policyNumber: string;
  provider: string;
  coverage: 'BASIC' | 'PREMIUM' | 'COMPREHENSIVE';
  monthlyPremium: number;
  deductible: number;
  startDate: Date;
  endDate: Date;
  status: 'ACTIVE' | 'EXPIRED' | 'CANCELLED';
}
```

### Step 6: Add tRPC Router (optional) (3 min)

**libs/api/src/routers/insurance.ts:**
```typescript
import { router, protectedProcedure } from '../trpc';

export const insuranceRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    // Call insurance service
    const response = await fetch('http://insurance-service:4005/api/policies');
    return response.json();
  }),
});
```

**Update libs/api/src/root.ts:**
```typescript
import { insuranceRouter } from './routers/insurance';

export const appRouter = router({
  designs: designsRouter,
  pets: petsRouter,
  insurance: insuranceRouter,  // ✅ Add here
});
```

### Done! ✅

```bash
# Start new service
npx nx serve pet-insurance

# Or all services
make dev-services
```

---

## 📋 Checklist for New Service

- [ ] Directory created (`services/[name]/`)
- [ ] package.json with scripts
- [ ] src/main.ts with Fastify
- [ ] project.json for NX
- [ ] Domain types in libs/domain/
- [ ] tRPC router (optional)
- [ ] Docker Compose entry
- [ ] Health check endpoint
- [ ] Documentation

**Time:** ~15 minutes total

---

## 🎯 Template Files to Copy

**From:** `services/builder-service/`  
**To:** Your new service

**Just update:**
- Service name
- Port number
- Domain logic

**Everything else** is ready to use!

---

**See full example:** `services/builder-service/`

