# Scaffold Script - Quick Project Creation

**Time Saved:** 15-20 minutes per project  
**Complexity:** Automated 🎉

---

## 🚀 Quick Start

The scaffold script automates the creation of new frontend apps and backend services with all the necessary boilerplate.

```bash
# Run from project root
npm run scaffold

# Or directly
./scripts/scaffold.sh
```

---

## 📋 What It Creates

### 1. Frontend App (Next.js Micro-Frontend)

Creates a complete Next.js 15 application with:

- ✅ **Project structure** - All necessary directories
- ✅ **Configuration files** - package.json, tsconfig.json, project.json, next.config.ts
- ✅ **Page templates** - Landing page, dashboard page, layout
- ✅ **Styling setup** - Tailwind CSS v4 with globals.css
- ✅ **NX integration** - Ready to use with `nx dev [app-name]`
- ✅ **Auto port assignment** - Finds next available port (3000+)
- ✅ **Environment template** - .env.template with common vars
- ✅ **README** - Complete documentation
- ✅ **ESLint config** - Linting setup

**Creates:**
```
apps/[app-name]/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # Root layout
│   │   ├── page.tsx            # Public landing page
│   │   └── dashboard/
│   │       └── page.tsx        # Dashboard embedded view
│   ├── components/             # Component directory
│   ├── lib/                    # Utilities
│   └── styles/
│       └── globals.css         # Tailwind setup
├── public/                     # Static assets
├── package.json                # Dependencies
├── next.config.ts              # Next.js config
├── tsconfig.json               # TypeScript config
├── project.json                # NX config
├── eslint.config.mjs          # ESLint config
├── env.template                # Environment variables
└── README.md                   # Documentation
```

### 2. Backend Service (Fastify Microservice)

Creates a complete Fastify microservice with:

- ✅ **Project structure** - Routes, workers, plugins, utils directories
- ✅ **Configuration files** - package.json, tsconfig.json, project.json
- ✅ **Fastify server** - Main server with CORS and health check
- ✅ **NX integration** - Ready to use with `nx serve [service-name]`
- ✅ **Auto port assignment** - Finds next available port (4000+)
- ✅ **Docker setup** - Dockerfile ready for deployment
- ✅ **Environment template** - .env.template with database, Redis, etc.
- ✅ **README** - Complete documentation with integration examples

**Creates:**
```
services/[service-name]/
├── src/
│   ├── main.ts                 # Server entry point
│   ├── routes/                 # API routes
│   ├── workers/                # Background workers
│   ├── plugins/                # Fastify plugins
│   └── utils/                  # Utilities
├── package.json                # Dependencies
├── tsconfig.json               # TypeScript config
├── project.json                # NX config
├── Dockerfile                  # Docker setup
├── .env.template               # Environment variables
└── README.md                   # Documentation
```

### 3. Backend Module (in services/backend)

Creates a service module in the main backend:

- ✅ **Service class** - Complete CRUD template
- ✅ **TypeScript types** - Proper interfaces
- ✅ **Index export** - Module exports

**Creates:**
```
services/backend/src/modules/[module-name]/
├── service.ts                  # Service class with CRUD methods
└── index.ts                    # Module exports
```

---

## 🎯 Interactive Menu

When you run the script, you'll see:

```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  All Pet Plus - Project Scaffold
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

What would you like to create?

  1) Frontend App (Next.js micro-frontend)
  2) Backend Service (Fastify microservice)
  3) Backend Module (in services/backend)
  4) Exit

Select option (1-4):
```

---

## 📝 Example Usage

### Creating a Frontend App

```bash
$ npm run scaffold

Select option: 1

App name (kebab-case, e.g., pet-insurance): pet-grooming
Port number (suggested: 3002): 3002
Description: Pet grooming scheduling and management

✓ Creating frontend app: pet-grooming on port 3002
✓ Creating directory structure...
✓ Creating package.json...
✓ Creating next.config.ts...
✓ Creating tsconfig.json...
✓ Creating project.json...
✓ Creating layout.tsx...
✓ Creating page.tsx...
✓ Creating dashboard page...
✓ Creating globals.css...
✓ Creating eslint.config.mjs...
✓ Creating env.template...
✓ Creating README.md...

✓ Frontend app created successfully!

Next steps:
1. Install dependencies: npm install
2. Create domain types in: libs/domain/src/lib/pet-grooming/
3. Add tRPC router in: libs/api/src/routers/pet-grooming.ts
4. Start dev server: npx nx dev pet-grooming

To integrate into dashboard:
5. Create: apps/web/src/app/(dashboard)/pet-grooming/page.tsx
6. Update: apps/web/src/components/dashboard/dashboard-nav.tsx

Visit: http://localhost:3002
```

### Creating a Backend Service

```bash
$ npm run scaffold

Select option: 2

Service name (kebab-case, e.g., pet-insurance): pet-grooming
Port number (suggested: 4005): 4005
Description: Pet grooming scheduling and booking service

✓ Creating backend service: pet-grooming on port 4005
✓ Creating directory structure...
✓ Creating package.json...
✓ Creating main.ts...
✓ Creating tsconfig.json...
✓ Creating project.json...
✓ Creating .env.template...
✓ Creating Dockerfile...
✓ Creating README.md...

✓ Backend service created successfully!

Next steps:
1. Install dependencies: npm install
2. Create domain types in: libs/domain/src/lib/pet-grooming/
3. Add tRPC router in: libs/api/src/routers/pet-grooming.ts
4. Copy .env.template to .env and configure
5. Start dev server: npx nx serve pet-grooming

To add to Docker Compose:
6. Update: docker-compose.microservices.yml

Visit: http://localhost:4005/healthz
```

### Creating a Backend Module

```bash
$ npm run scaffold

Select option: 3

Module name (kebab-case, e.g., pet-insurance): pet-grooming
Description: Pet grooming scheduling logic

✓ Creating backend module: pet-grooming
✓ Creating service.ts...
✓ Creating index.ts...

✓ Backend module created successfully!

Next steps:
1. Create domain types in: libs/domain/src/lib/pet-grooming/
2. Implement service logic in: services/backend/src/modules/pet-grooming/service.ts
3. Add tRPC router in: libs/api/src/routers/pet-grooming.ts
```

---

## 🎨 Features

### Auto Port Assignment

The script automatically finds the next available port:

- **Frontend apps**: Scans `apps/*/package.json` for highest port, increments by 1
- **Backend services**: Scans `services/*/src/main.ts` for highest port, increments by 1

**Port Conventions:**
- Frontend: 3000, 3001, 3002, 3003...
- Backend: 4000, 4001, 4002, 4003...

### Name Conversion

Automatically converts kebab-case to PascalCase:

```bash
Input:  pet-insurance
Output: PetInsurance (for class names, titles)
```

### Complete Boilerplate

Every file includes:

- ✅ **Proper TypeScript** - Strict types, no `any`
- ✅ **Modern syntax** - ES2022+, async/await
- ✅ **Best practices** - Error handling, logging
- ✅ **Project patterns** - Follows established conventions
- ✅ **Documentation** - Inline comments and README

---

## 🔗 Integration Steps (After Scaffolding)

### 1. Create Domain Types

```bash
mkdir -p libs/domain/src/lib/[name]
```

**libs/domain/src/lib/[name]/types.ts:**
```typescript
export interface YourType {
  id: string;
  // ... your fields
}
```

**libs/domain/src/lib/[name]/index.ts:**
```typescript
export * from './types';
```

**libs/domain/src/index.ts:**
```typescript
export * from './lib/[name]';
```

### 2. Add tRPC Router

**libs/api/src/routers/[name].ts:**
```typescript
import { router, protectedProcedure } from '../trpc';
import { z } from 'zod';

export const [name]Router = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    // Implementation
  }),
});
```

**libs/api/src/root.ts:**
```typescript
import { [name]Router } from './routers/[name]';

export const appRouter = router({
  // ... existing routers
  [name]: [name]Router,  // Add this
});
```

### 3. Integrate Frontend into Dashboard

**apps/web/src/app/(dashboard)/[name]/page.tsx:**
```typescript
export default function [Name]Tab() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">[Name]</h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <iframe
          src="http://localhost:[PORT]/dashboard"
          className="w-full h-[800px] border-0"
          title="[Name] Dashboard"
        />
      </div>
    </div>
  );
}
```

**apps/web/src/components/dashboard/dashboard-nav.tsx:**
```typescript
const navItems = [
  // ... existing items
  { href: '/dashboard/[name]', label: '[Name]', icon: '🎯' },
];
```

### 4. Start Development

```bash
# Frontend app
npx nx dev [app-name]

# Backend service
npx nx serve [service-name]

# Both together
npx nx run-many --target=dev --projects=web,[app-name]
```

---

## 💡 Best Practices

### When to Use Each Option

**Frontend App (Option 1):**
- ✅ Standalone landing page needed
- ✅ Complex feature (>20 components)
- ✅ Separate team ownership
- ✅ Different deployment cycle

**Backend Service (Option 2):**
- ✅ High traffic (>1000 req/min)
- ✅ Different scaling needs
- ✅ Complex domain logic
- ✅ Independent deployment

**Backend Module (Option 3):**
- ✅ Simple CRUD operations
- ✅ Shared with other modules
- ✅ Low/medium traffic
- ✅ Coupled business logic

---

## 🐛 Troubleshooting

### Permission Denied

```bash
chmod +x scripts/scaffold.sh
```

### Port Already in Use

The script auto-detects ports, but if you specify a custom port and it's in use:

```bash
# Check what's using the port
lsof -i :3002

# Kill the process
kill -9 [PID]
```

### Script Not Found

Run from project root:

```bash
cd /path/to/pet
npm run scaffold
```

---

## 📚 Related Documentation

- [Create New Micro-Frontend Guide](/docs/guides/create-new-microfrontend.md) - Manual steps
- [Create New Microservice Guide](/docs/guides/create-new-microservice.md) - Manual steps
- [tRPC Usage Examples](/docs/guides/trpc-usage-examples.md) - API integration
- [Architecture Overview](/docs/architecture/architecture.md) - System design

---

## ✨ What's Next?

After scaffolding, you typically:

1. **Install dependencies** - `npm install`
2. **Create domain types** - Define your data models
3. **Add tRPC router** - Type-safe API
4. **Implement business logic** - Service layer
5. **Build UI components** - React components
6. **Test integration** - Verify everything works
7. **Update documentation** - Document your feature

**Total time from scaffold to working feature:** ~1-2 hours vs 4-6 hours manually! 🎉

---

**Enjoy faster development with automated scaffolding!** 🚀


