# All Pet Plus - E-Commerce Platform

High-performance, headless e-commerce storefront for customizable dog harnesses with **interactive 3D preview**, **AI-guided design assistance**, and **micro-frontend architecture**. Built with Next.js 15, React Three Fiber, Fastify, tRPC, and hybrid microservices in an NX monorepo.

## ✨ Key Features

### 🎨 **Complete Design System**
- **20 UI Components** - Button, Card, Input, Modal, Tabs, Progress, Tooltip, and more
- **AI-Enhanced UX** - Contextual hints, suggestions, and assistance throughout
- **Accessibility First** - WCAG 2.1 AA compliant, keyboard navigation, screen reader support
- **Unified Motion** - Framer Motion animations across UI and 3D elements

### 🎯 **Interactive 3D Builder**
- **React Three Fiber** - Real-time 3D harness preview
- **Material System** - 6 colorways + 5 hardware finishes with smooth transitions
- **Camera Controls** - Drag to rotate, scroll to zoom
- **Smart Fallbacks** - WebGL detection with graceful 2D illustrations
- **Performance Optimized** - Code splitting, lazy loading, adaptive quality

### 🔐 **Authentication & Personalization**
- **Clerk Integration** - Branded auth modals and user management
- **Pet Profiles** - Comprehensive pet management with health & behavior tracking
- **Saved Designs** - Persistent builder configurations linked to pets
- **Order Tracking** - Real-time order status updates
- **AI Recommendations** - Personalized style and sizing suggestions

### ⚡ **Performance & Reliability**
- **Web Vitals Monitoring** - CLS, INP, FCP, LCP, TTFB tracking
- **60 FPS Target** - Hardware-accelerated rendering
- **Optimized Bundle** - Code splitting, tree-shaking, lazy loading
- **Mobile-First** - Responsive design with touch-optimized controls

### 🏗️ **Microservices Architecture**
- **Hybrid Approach** - Modular monolith → extract services as needed
- **Domain-Driven Design** - Clear business boundaries (Builder, Pet, User, Order)
- **tRPC Type Safety** - 100% type coverage from database to UI
- **Micro-Frontends** - Independent apps integrated via dashboard
- **Event-Driven** - Redis pub/sub for inter-service communication

## Repository Structure

```
.
├── apps/
│   ├── web/                    # Main Next.js app + Dashboard (Port 3000)
│   └── pet-licensing/          # Pet licensing micro-frontend (Port 3001)
│
├── services/
│   ├── backend/                # Modular monolith (Port 4000)
│   │   └── src/modules/        # Domain modules (builder, pet, order, user)
│   └── builder-service/        # Extractable builder service (Port 4002)
│
├── libs/
│   ├── api/                    # tRPC routers (type-safe API layer)
│   ├── domain/                 # Business logic (builder, pet, user, order)
│   ├── messaging/              # Event bus (inter-service communication)
│   └── shared/                 # Common utilities
│
├── docs/                       # Comprehensive documentation
│   ├── architecture/           # System design docs
│   ├── development/            # Developer guides
│   ├── guides/                 # Setup & how-to guides
│   └── ops/                    # Deployment & operations
│
└── .cursor/rules/              # AI development rules (8 organized files)
```

## Getting Started

### 1. Install dependencies:
```bash
npm install
```

### 2. Set up environment files:
```bash
./scripts/setup-env.sh
```

### 3. Configure environment variables
See [Environment Setup Guide](./docs/guides/environment-setup.md)
- Complete guide for all required API keys and services
- Includes Clerk, Shopify, Analytics, and more

### 4. Run database migrations:
```bash
cd services/backend
npx prisma db push
```

### 5. Start development:

**Option A: Simple (Modular Monolith)**
```bash
npm run dev
```

**Option B: Microservices Mode**
```bash
make dev-services  # Runs all services in Docker
```

**Option C: Specific Services**
```bash
make dev-infra          # Just Postgres + Redis
make start-web          # Main app (3000)
make start-builder      # Builder service (4002)
```

## Available Commands

### Development:
```bash
npm run dev              # Run web + backend (default)
npm run dev:all          # Run ALL apps + services (auto-includes scaffolded)
npm run dev:frontend     # Run all frontend apps
npm run dev:backend-all  # Run all backend services

# Specific projects:
nx dev web              # Start main app only (port 3000)
nx dev pet-licensing    # Start licensing app only (port 3001)
nx serve backend        # Start backend (port 4000)
```

**See:** [Dev Workflow Guide](./docs/development/dev-workflow.md) for complete details

### Microservices:
```bash
make dev-services       # Start all services in Docker
make hybrid-status      # Check status of all services
make logs-all           # View all service logs
```

### Database:
```bash
make db-migrate         # Run migrations
make db-studio          # Open Prisma Studio
make db-seed            # Seed test data
```

### Testing & Quality:
```bash
npm run lint            # Lint all apps
npm run test            # Run tests for all apps
npm run typecheck       # TypeScript type checking
npm run build           # Build all apps
```

### Utilities:
```bash
make graph              # Show NX dependency graph
make clean              # Clean build artifacts
make help               # Show all commands
```

## 🚀 Creating New Services (AUTOMATED! ⚡)

### **NEW: Scaffold Script** - Automated Project Creation
```bash
# Interactive menu to create:
# 1. Frontend App (Next.js micro-frontend)
# 2. Backend Service (Fastify microservice)
# 3. Backend Module (in services/backend)

npm run scaffold
```

**Features:**
- ✅ **Auto port assignment** - Finds next available port
- ✅ **Complete boilerplate** - All config files, templates, docs
- ✅ **NX integration** - Ready to use with `nx dev/serve`
- ✅ **Best practices** - TypeScript, error handling, patterns
- ✅ **Zero manual work** - Just answer 3 questions!

**Time to working service:** 2 minutes! 🎉

See: [Scaffold Script Guide](./docs/guides/scaffold-script.md)

---

### Manual Creation (Alternative)

**New Micro-Frontend:**
```bash
# See: docs/guides/create-new-microfrontend.md
cp -r apps/pet-licensing apps/pet-insurance
# Update port, content, add to dashboard
```

**New Microservice:**
```bash
# See: docs/guides/create-new-microservice.md
cp -r services/builder-service services/pet-insurance
# Update port, create domain, add tRPC router
```

**New Backend Module:**
```bash
mkdir -p services/backend/src/modules/[name]
# Copy service pattern, add domain types
```

## 📚 Documentation

**Start here:** [Documentation Index](./docs/README.md)

### Quick Start Guides
- [**Create New Micro-Frontend**](./docs/guides/CREATE_NEW_MICROFRONTEND.md) - 20 min guide
- [**Create New Microservice**](./docs/guides/CREATE_NEW_MICROSERVICE.md) - 15 min guide
- [**Environment Setup**](./docs/guides/environment-setup.md) - Complete setup guide
- [**Running Microservices**](./docs/guides/running-microservices.md) - Dev workflows

### Architecture
- [**Microservices Architecture**](./docs/architecture/microservices-architecture.md) - Full design
- [**Micro-Frontend Pattern**](./docs/architecture/MICROFRONTEND_PATTERN.md) - Frontend architecture
- [**Hybrid Implementation**](./docs/architecture/hybrid-architecture-implementation.md) - Current approach
- [**Architecture Audit**](./docs/architecture/ARCHITECTURE_AUDIT_COMPLETE.md) - Ease of extensibility

### Development
- [**tRPC Usage Examples**](./docs/guides/trpc-usage-examples.md) - Type-safe API patterns
- [**Code Patterns**](./docs/development/code-patterns.md) - Coding conventions
- [**Testing Guide**](./docs/development/testing-guide.md) - Testing strategies

### AI Development
- **`.cursor/rules/`** - 8 organized development rules for AI assistants
- **`CLAUDE.md`** - AI assistant guidelines

## Technology Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **React**: 19.0.0
- **Styling**: Tailwind CSS v4
- **State**: Zustand with persistence
- **Type Safety**: TypeScript 5.7
- **3D**: React Three Fiber

### Backend
- **API Layer**: tRPC (end-to-end type safety)
- **Framework**: Fastify 4
- **Database**: PostgreSQL with Prisma 5
- **Cache**: Redis with ioredis
- **Queue**: BullMQ
- **Auth**: Clerk

### Infrastructure
- **Monorepo**: NX 20.3
- **Containers**: Docker & Docker Compose
- **Deployment**: Vercel (frontend) + Fly.io (backend)
- **Package Manager**: npm 10.7.0

## Architecture Highlights

### Type Safety: 100% ✅
```typescript
// One definition, works everywhere
import { PetProfile, BuilderConfig } from '@pet/domain';

// Used in all apps and services with full autocomplete!
```

### Micro-Frontends: Infinite Extensibility ✅
```
Dashboard → Aggregates independent apps
├── My Pets (built-in)
├── Licensing (micro-frontend at port 3001)
├── Insurance (future - port 3002)
└── Add unlimited services!
```

### Hybrid Microservices: Smart Scaling ✅
```
Start: Modular monolith (simple)
Scale: Extract hot services (builder, webhooks)
Keep: Cold services in monolith (cost-effective)
```

### Shared Domain Logic: DRY ✅
```typescript
// Define business logic once
libs/domain/
├── builder/    # Design logic
├── pet/        # Pet management
├── user/       # User logic
└── order/      # Order logic

// Use everywhere!
```

## Quick Commands

```bash
# Scaffolding (NEW!)
npm run scaffold            # Create new app/service interactively

# Development
make dev                    # Simple mode
make dev-services           # Microservices mode
make hybrid-dev             # Infrastructure + local services

# Service Management
make start-web              # Main app (3000)
make start-builder          # Builder service (4002)
npx nx dev pet-licensing    # Licensing app (3001)

# Database
make db-migrate             # Run migrations
make db-studio              # Prisma Studio

# Deployment
make deploy-staging         # Deploy to staging
make deploy-production      # Deploy to production

# Utilities
make graph                  # Dependency graph
make hybrid-status          # Check all services
make help                   # Show all commands
```

## Architecture Benefits

- ✅ **2 min to create new service** - Automated scaffolding! 🚀
- ✅ **100% type safety** - tRPC + domain libraries
- ✅ **Independent deployment** - Each service deploys separately
- ✅ **Shared pet data** - Single source of truth
- ✅ **Cost optimized** - Scale only what needs it
- ✅ **Team ready** - Clear ownership boundaries
- ✅ **Production grade** - Docker, health checks, monitoring

## External Resources
- [NX Documentation](https://nx.dev)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [Fastify Documentation](https://fastify.dev)
- [tRPC Documentation](https://trpc.io)

---

**Ready to build the future of pet e-commerce!** 🐾✨

For detailed guides, see `/docs/README.md`