# Glossary - Technical Terms and Concepts

**Last Updated:** October 23, 2025  
**Purpose:** Standard terminology reference for All Pet Plus codebase

---

## Project-Specific Terms

### All Pet Plus
The main e-commerce platform for customizable dog harnesses with 3D preview and AI-guided design assistance.

---

## Architecture Terms

### Micro-Frontend
**Spelling:** `micro-frontend` (with hyphen)  
**Definition:** An independent frontend application that can run standalone or be embedded in a larger application.

**In our codebase:**
- `apps/pet-licensing/` is a micro-frontend
- Can run at its own URL: `pet-licensing.harnesshero.com`
- Can be embedded in dashboard via iframe

**Related files:**
- `/docs/architecture/microfrontend-architecture.md`
- `/docs/guides/create-new-microfrontend.md`

---

### Microservice
**Definition:** An independently deployable service that handles a specific business capability.

**In our codebase:**
- `services/builder-service/` is an extractable microservice
- Currently using hybrid approach (modular monolith → microservices)

**Related files:**
- `/docs/architecture/microservices-architecture.md`
- `/docs/guides/create-new-microservice.md`

---

### Modular Monolith
**Definition:** A monolithic application organized into distinct modules with clear boundaries, but running as a single process.

**In our codebase:**
- `services/backend/src/modules/` contains domain modules
- Modules: builder, pet, order, user, webhook
- Can be extracted to microservices when needed

**Benefits:**
- Simpler than microservices initially
- Clear boundaries enable future extraction
- Lower infrastructure cost

---

### Hybrid Architecture
**Definition:** Architecture that combines modular monolith with extractable microservices.

**Our approach:**
1. Start with modular monolith (simple)
2. Extract high-traffic modules to microservices (as needed)
3. Keep low-traffic modules in monolith (cost-effective)

**Related:** `/docs/architecture/hybrid-architecture-implementation.md`

---

### Domain-Driven Design (DDD)
**Definition:** Software design approach that structures code around business domains.

**Our domains:**
- **Builder:** Design creation and management
- **Pet:** Pet profile management
- **Order:** Order tracking and fulfillment
- **User:** User authentication and profiles
- **Webhook:** External system integrations

---

## API & Communication Terms

### tRPC
**Definition:** TypeScript RPC (Remote Procedure Call) framework for building type-safe APIs.

**In our codebase:**
- Location: `libs/api/`
- Provides 100% type safety from frontend to backend
- No manual API client needed
- Autocomplete and compile-time type checking

**Example:**
```typescript
// Frontend automatically knows return type
const { data } = trpc.designs.list.useQuery();
```

**Related:** `/docs/guides/trpc-usage-examples.md`

---

### Event Bus
**Definition:** Messaging system for asynchronous communication between services.

**In our codebase:**
- Location: `libs/messaging/`
- Implementation: Redis Pub/Sub
- Used for decoupled service communication

**Example:**
```typescript
// Service A publishes
await eventBus.publish('design.created', { designId, userId });

// Service B subscribes
eventBus.subscribe('design.created', async (event) => {
  // Handle event
});
```

---

### API Gateway
**Definition:** Single entry point for all client requests, routing to appropriate services.

**Status in our codebase:** Not yet implemented (future consideration)

**Current approach:** tRPC acts as aggregation layer

---

## Database Terms

### Prisma
**Definition:** Next-generation TypeScript ORM (Object-Relational Mapping) for databases.

**In our codebase:**
- Location: `services/backend/prisma/`
- Schema: `schema.prisma`
- Type-safe database queries
- Automatic migration generation

---

### Connection Pooling
**Definition:** Maintaining a pool of database connections for efficient reuse.

**In our codebase:** Configured in Prisma client

---

### Database Per Service
**Definition:** Microservices pattern where each service has its own database.

**Status:** Not yet implemented (currently shared database)

**Future plan:** Separate databases when services are extracted

---

## Frontend Terms

### Next.js App Router
**Definition:** Next.js 15 routing system using the `app/` directory.

**In our codebase:**
- All apps use App Router
- File-system based routing
- Server and client components

---

### Server Components
**Definition:** React components that render on the server.

**Benefits:**
- Zero JavaScript to client
- Direct database access
- Better performance

---

### Client Components
**Definition:** React components that run in the browser.

**Marker:** `'use client'` directive at top of file

**When to use:**
- Interactivity (onClick, useState)
- Browser APIs (localStorage, window)
- Real-time updates

---

### Zustand
**Definition:** Lightweight state management library for React.

**In our codebase:**
- Used for builder state
- Persistent state with localStorage
- Simpler than Redux

---

## Development Terms

### NX (Nx)
**Definition:** Build system and monorepo tooling.

**In our codebase:**
- Manages all apps and services
- Caching for faster builds
- Affected commands (test only changed code)
- Dependency graph visualization

**Commands:**
```bash
nx dev web              # Run web app
nx affected --target=test  # Test affected projects
nx graph                # Show dependency graph
```

---

### Monorepo
**Definition:** Single repository containing multiple projects.

**Our monorepo structure:**
```
apps/      → Frontend applications
services/  → Backend services
libs/      → Shared libraries
```

**Benefits:**
- Shared code via `@pet/*` imports
- Atomic commits across projects
- Consistent tooling

---

### Workspace
**Definition:** The root of the monorepo containing all projects.

**Root:** `/Users/kavyrattana/Coding/pet/`

---

### Affected Commands
**Definition:** NX feature to run tasks only on changed projects.

**Example:**
```bash
nx affected --target=test    # Test only changed code
nx affected --target=build   # Build only changed projects
```

---

### Module Federation
**Definition:** Webpack feature for loading modules from remote applications.

**Status:** Not yet implemented (future consideration for micro-frontends)

**Current approach:** Iframe integration

---

## Build & Deployment Terms

### Hot Module Replacement (HMR)
**Definition:** Update code in running app without full reload.

**In our codebase:** Enabled in Next.js dev server

---

### Docker Compose
**Definition:** Tool for defining and running multi-container Docker applications.

**Our compose files:**
- `docker-compose.yml` - Basic setup
- `docker-compose.dev.yml` - Development with infrastructure
- `docker-compose.microservices.yml` - Full microservices stack

---

### Health Check
**Definition:** Endpoint to verify service is running correctly.

**In our services:**
```typescript
// GET /healthz
{
  status: 'healthy',
  service: 'builder-service',
  timestamp: '2025-10-23T...'
}
```

---

### Readiness Probe
**Definition:** Check if service is ready to accept traffic.

**In our services:** `GET /ready`

---

## Testing Terms

### Unit Test
**Definition:** Test of individual functions or components in isolation.

**Framework:** Jest

---

### Integration Test
**Definition:** Test of multiple components working together.

**Framework:** Jest

---

### End-to-End (E2E) Test
**Definition:** Test of entire user workflows through the UI.

**Framework:** Playwright

**Related:** `/docs/development/playwright-guide.md`

---

### Test Coverage
**Definition:** Percentage of code executed by tests.

**Target:** (To be defined)

---

## Code Quality Terms

### Linter
**Definition:** Tool that analyzes code for potential errors and style issues.

**Our linter:** ESLint

---

### Type Checking
**Definition:** Verifying TypeScript types are correct.

**Command:** `npm run typecheck`

---

### Continuous Integration (CI)
**Definition:** Automated testing and building on every commit.

**Status:** (To be implemented)

---

## Security Terms

### HMAC (Hash-based Message Authentication Code)
**Definition:** Cryptographic signature to verify webhook authenticity.

**Used for:** Shopify webhook verification

---

### JWT (JSON Web Token)
**Definition:** Token format for authentication.

**Used by:** Clerk authentication

---

### Environment Variable
**Definition:** Configuration value stored outside code.

**Our files:**
- `apps/web/.env.local`
- `services/backend/.env`

**Never commit:** Secrets, API keys, passwords

---

## Business Domain Terms

### Builder
**Definition:** The 3D harness customization tool.

**Features:**
- Real-time 3D preview
- Color and hardware selection
- Custom text engraving

---

### Saved Design
**Definition:** User's customized harness configuration saved to database.

**Database model:** `SavedDesign`

---

### Order Meta
**Definition:** Order information stored in our database, linked to Shopify order.

**Database model:** `OrderMeta`

---

### Pet Profile
**Definition:** Information about a user's pet.

**Database model:** `PetProfile`

**Fields:** Name, breed, size, health info, behavior

---

## Common Abbreviations

| Abbreviation | Full Term | Meaning |
|--------------|-----------|---------|
| **API** | Application Programming Interface | How software talks to software |
| **CDN** | Content Delivery Network | Distributed file hosting |
| **CI/CD** | Continuous Integration/Deployment | Automated build and deploy |
| **CRUD** | Create, Read, Update, Delete | Basic data operations |
| **DDD** | Domain-Driven Design | Design approach |
| **DX** | Developer Experience | How easy it is to develop |
| **E2E** | End-to-End | Full user workflow testing |
| **HMR** | Hot Module Replacement | Live code updates |
| **ORM** | Object-Relational Mapping | Database abstraction |
| **P95** | 95th Percentile | Performance metric |
| **RPC** | Remote Procedure Call | Calling remote functions |
| **SPA** | Single Page Application | Client-side rendered app |
| **SSR** | Server-Side Rendering | HTML rendered on server |
| **UX** | User Experience | How users feel using the app |

---

## Naming Conventions

### File Naming

**Documentation:**
```
✅ kebab-case.md          (preferred)
❌ SCREAMING_CASE.md      (avoid)
❌ PascalCase.md          (avoid for docs)
```

**Components:**
```
✅ PascalCase.tsx         (React components)
✅ kebab-case.tsx         (non-component files)
```

### Variable Naming

**TypeScript/JavaScript:**
```
✅ camelCase              (variables, functions)
✅ PascalCase             (types, interfaces, classes)
✅ SCREAMING_SNAKE_CASE   (constants)
```

---

## Path Aliases

### Import Path Conventions

```typescript
// Shared monorepo libraries
import { BuilderConfig } from '@pet/domain/builder';
import { trpc } from '@pet/api';
import { formatPrice } from '@pet/shared';

// App-local imports (apps/web)
import { Button } from '@/components/ui/button';
import { config } from '@/lib/config';

// Relative imports (same directory)
import { helper } from './helper';
```

**Pattern:**
- `@pet/*` = Shared across monorepo
- `@/` = App-local (specific to one app)
- `./` = Same directory

---

## Styling Terms

### Tailwind CSS
**Definition:** Utility-first CSS framework.

**Version:** v4 (with CSS variables)

**In our codebase:**
```typescript
// Use CSS variables for theming
className="bg-[var(--color-surface)]"
```

---

### CSS Variables
**Definition:** Reusable CSS values defined once.

**Our variables:**
```css
--color-primary
--color-surface
--color-foreground
--transition-base
```

---

## When in Doubt

**General rule:** Use the terminology as it appears in the codebase.

**Check:**
1. Existing documentation
2. Code comments
3. Variable/file names
4. This glossary

**Ask:** If unsure, check with team or create discussion

---

## Related Documentation

- [Code Patterns](/docs/development/code-patterns.md) - Coding conventions
- [Architecture Overview](/docs/architecture/architecture.md) - System design
- [Development Guide](/docs/development/development-guide.md) - Daily workflow

---

## Contributing to This Glossary

When adding new terms:
1. Use the existing format
2. Provide clear definition
3. Include codebase examples
4. Link to related documentation
5. Keep alphabetically organized within sections

---

**Last Updated:** October 23, 2025  
**Maintained by:** Development Team

