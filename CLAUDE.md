# Claude AI Assistant Guidelines - All Pet Plus

**Version:** 2.0  
**Last Updated:** October 8, 2025  
**Purpose:** Comprehensive guide for AI assistants working on All Pet Plus

---

## 📋 Essential Rules

**All Cursor-specific rules are in:** `.cursor/rules/`

### Quick Reference:
- **Architecture patterns** → `.cursor/rules/architecture.mdc`
- **tRPC usage** → `.cursor/rules/trpc-patterns.mdc`
- **Import conventions** → `.cursor/rules/monorepo-imports.mdc`
- **Code quality** → `.cursor/rules/code-quality.mdc`
- **Component patterns** → `.cursor/rules/component-patterns.mdc`
- **Documentation** → `.cursor/rules/documentation.mdc`
- **AI guidelines** → `.cursor/rules/ai-guidelines.mdc`
- **Development** → `.cursor/rules/development.mdc`

**See:** `.cursor/rules/README.md` for complete index

---

## 🎯 Overview

You are working with All Pet Plus, a sophisticated e-commerce platform for customizable dog harnesses. This is a production-grade NX monorepo using cutting-edge web technologies with a focus on performance, accessibility, and delightful user experience.

### Project Philosophy
- **Performance First**: Core Web Vitals are non-negotiable (<1s TTFB, CLS <0.1)
- **Type Safety**: 100% type coverage from database to UI
- **Accessibility Always**: WCAG 2.1 AA compliant
- **Developer Experience**: tRPC, excellent tooling, comprehensive docs
- **User Delight**: Playful interactions with practical e-commerce functionality

## Architecture Overview

### Repository Structure
```
/Users/kavyrattana/Coding/pet/
├── apps/web/              # Next.js 15 frontend application
├── services/backend/      # Fastify API server
├── libs/                  # Shared libraries
│   ├── shared/           # Common types and utilities
│   ├── ui/               # Shared UI components
│   └── utils/            # Shared utilities
├── docs/                 # Architecture and setup documentation
└── tools/                # Build and analysis tools
```

### Tech Stack Deep Dive

#### Frontend (apps/web)
- **Framework**: Next.js 15.5.4 with App Router
- **React**: Version 19.1.0 (latest stable)
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **State Management**: Zustand with persistence
- **Type Safety**: TypeScript 5.7.2 with strict mode
- **Fonts**: Geist Sans & Geist Mono with next/font optimization

#### Backend (services/backend)
- **Framework**: Fastify 4.26.2 (high-performance Node.js server)
- **Database**: PostgreSQL with Prisma ORM 5.7.0
- **Caching**: Redis 4.6.11 with ioredis
- **Queue**: BullMQ 5.1.0 for background jobs
- **Authentication**: Clerk integration
- **Validation**: Zod schemas

#### Infrastructure
- **Build System**: NX 20.3.0 monorepo tooling
- **Package Manager**: npm 10.7.0 with workspaces
- **Node Version**: >=20.0.0 required
- **Testing**: Jest, Cypress, Playwright
- **CI/CD**: GitHub Actions with staged deployments

## Key Features

### 1. Product Builder
- **Location**: `apps/web/src/components/builder/`
- **Purpose**: Interactive harness customization with real-time preview
- **Key Components**:
  - `builder-shell.tsx`: Main orchestrator component
  - `use-builder.ts`: Zustand store for builder state
  - `preview-pane.tsx`: Real-time visual preview
  - `options-pane.tsx`: Selection interface
  - `step-navigation.tsx`: Multi-step wizard navigation

### 2. Commerce Integration
- **Platform**: Shopify Headless
- **APIs**: Storefront API (public), Admin API (backend)
- **Features**:
  - Product catalog sync
  - Dynamic pricing calculation
  - Draft order creation
  - Webhook processing for order updates

### 3. Design System
- **Colors** (Playful Modern Palette):
  - Primary: Sky Blue `#3BAFDA`
  - Secondary: Peach Coral `#FF7A59`
  - Success: Mint `#68D391`
  - Neutrals: Carefully crafted gray scale
- **Typography**: System font stack with Geist fonts
- **Spacing**: Consistent scale using Tailwind
- **Components**: Accessible, motion-aware, responsive

## Data Models (Prisma Schema)

### Core Entities
1. **UserProfile**: Clerk-authenticated users with preferences
2. **SavedDesign**: User's harness configurations with sharing
3. **BuilderPreset**: Curated starting templates
4. **OrderMeta**: Shopify order tracking and status
5. **WebhookLog**: Idempotent webhook processing
6. **ExperimentAssignment**: A/B testing assignments
7. **AnalyticsEvent**: User behavior tracking

### Database Design Principles
- UUID primary keys for security
- Soft deletes where appropriate
- JSONB for flexible schema evolution
- Proper indexes for query performance
- Audit logging for compliance

## API Design

### Frontend Routes (Next.js App Router)
```
/                          # Marketing homepage (SSG)
/builder/[configId]        # Harness builder (SSR + Client)
/catalog/[category]        # Product listings (ISR)
/product/[handle]          # Product detail (SSR)
/order/[orderId]          # Order tracking (SSR)
```

### Backend Endpoints (Fastify)
```
GET  /healthz              # Health check with service status
POST /api/designs          # Save user designs
GET  /api/designs/:id      # Retrieve saved design
POST /api/webhooks/shopify # Shopify webhook receiver
GET  /api/orders/:maskedId # Order status lookup
```

## State Management Patterns

### Builder State (Zustand)
```typescript
interface BuilderState {
  currentStep: number;
  selection: {
    size: string;
    colorway: ColorOption;
    hardware: HardwareOption;
    personalization?: PersonalizationOption;
  };
  price: PriceBreakdown;
  // Methods
  updateSelection: (updates: Partial<Selection>) => void;
  calculatePrice: () => void;
  undo: () => void;
  redo: () => void;
}
```

### URL State Synchronization
- Builder selections are encoded in URL parameters
- Enables shareable links and browser back/forward
- Graceful fallbacks for invalid states

## Performance Optimizations

### Frontend
1. **Image Optimization**:
   - Cloudinary transformations for responsive images
   - Sprite layering for builder preview
   - Next/image with priority hints

2. **Code Splitting**:
   - Route-based splitting via App Router
   - Dynamic imports for heavy components
   - Web Workers for preview rendering

3. **Caching Strategy**:
   - ISR for catalog pages (5 minute revalidation)
   - Client-side caching with React Query
   - Edge caching for static assets

### Backend
1. **Database Optimization**:
   - Connection pooling with Prisma
   - Materialized views for analytics
   - Proper indexes on frequently queried fields

2. **Caching Layers**:
   - Redis for session data
   - Stale-while-revalidate for Shopify data
   - Queue-based cache warming

## Security Considerations

### Authentication & Authorization
- Clerk JWTs for user authentication
- Short-lived tokens for API access
- Role-based permissions (future)

### Data Protection
- Email encryption at application level
- HMAC verification for webhooks
- Rate limiting on all endpoints
- Input validation with Zod schemas

### Infrastructure Security
- Environment variable management
- HTTPS everywhere
- Security headers via Next.js config
- Regular dependency updates

## Development Workflow

### Local Setup
```bash
# Install dependencies
npm install

# Set up environment files
cp apps/web/env.template apps/web/.env.local
cp services/backend/env.template services/backend/.env

# Start development servers
npm run dev  # Runs both frontend and backend
```

### Common Tasks
```bash
# Run specific app
nx dev web
nx serve backend

# Database operations
cd services/backend
npm run db:migrate      # Run migrations
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed demo data

# Testing
nx affected --target=test
nx affected --target=lint
nx e2e web-e2e

# Build for production
nx build web
nx build backend
```

## Code Quality Standards

### TypeScript Configuration
- Strict mode enabled
- No implicit any
- Explicit return types preferred
- Path aliases configured via tsconfig

### Linting & Formatting
- ESLint with Next.js config
- Prettier for consistent formatting
- Husky pre-commit hooks
- Commitlint for conventional commits

### Testing Strategy
- Unit tests for utilities and hooks
- Integration tests for API endpoints
- E2E tests for critical user flows
- Visual regression testing (planned)

## Common Patterns

### Error Handling
```typescript
// Frontend
try {
  const result = await api.saveDesign(design);
  toast.success('Design saved!');
} catch (error) {
  console.error('Failed to save design:', error);
  toast.error('Unable to save your design. Please try again.');
}

// Backend
fastify.setErrorHandler((error, request, reply) => {
  request.log.error(error);
  const statusCode = error.statusCode ?? 500;
  reply.status(statusCode).send({
    error: statusCode < 500 ? error.message : 'Internal server error',
  });
});
```

### Data Fetching
```typescript
// Server Component (Next.js)
async function ProductPage({ params }: { params: { handle: string } }) {
  const product = await getProduct(params.handle);
  return <ProductDetail product={product} />;
}

// Client Component with React Query
function useProduct(handle: string) {
  return useQuery({
    queryKey: ['product', handle],
    queryFn: () => fetchProduct(handle),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
```

## Troubleshooting Guide

### Common Issues
1. **Port conflicts**: Check if ports 3000 (web) or 3001 (backend) are in use
2. **Database connection**: Ensure PostgreSQL is running and credentials are correct
3. **Redis connection**: Required for backend to start successfully
4. **Node version**: Must be >=20.0.0 for all features to work

### Debug Commands
```bash
# Check NX workspace
nx graph

# Inspect dependencies
nx affected:dep-graph

# Clean build artifacts
npm run clean

# Reset database
cd services/backend && npm run db:reset
```

## Future Roadmap
1. **3D Preview**: WebGL-based harness visualization
2. **AI Size Recommendation**: ML model for perfect fit
3. **Social Features**: Share designs, community gallery
4. **Mobile App**: React Native implementation
5. **International**: Multi-currency and language support

## Important Links
- [NX Documentation](https://nx.dev)
- [Next.js App Router](https://nextjs.org/docs/app)
- [Fastify Docs](https://www.fastify.io/docs/)
- [Prisma Guide](https://www.prisma.io/docs/)
- [Shopify API](https://shopify.dev/docs/api)

## Project Documentation

Comprehensive documentation is available in the `/docs` folder:

### 📚 Essential Reading
- **[/docs/README.md](./docs/README.md)** - Documentation index and navigation guide
- **[/docs/architecture.md](./docs/architecture.md)** - Complete system architecture
- **[/docs/api-reference.md](./docs/api-reference.md)** - API documentation with examples
- **[/docs/component-architecture.md](./docs/component-architecture.md)** - Frontend component patterns
- **[/docs/code-patterns.md](./docs/code-patterns.md)** - Common code patterns and best practices

### 🛠️ Development Resources
- **[/docs/database-setup.md](./docs/database-setup.md)** - Database configuration
- **[/docs/environment-variables.md](./docs/environment-variables.md)** - Environment setup
- **[/docs/testing-guide.md](./docs/testing-guide.md)** - Testing strategies and examples
- **[/docs/troubleshooting-faq.md](./docs/troubleshooting-faq.md)** - Common issues and solutions

### 📈 Operations & Scaling
- **[/docs/performance-guide.md](./docs/performance-guide.md)** - Performance optimization
- **[/docs/database-scaling-plan.md](./docs/database-scaling-plan.md)** - Database scaling strategy
- **[/docs/ops/deploy.md](./docs/ops/deploy.md)** - Deployment procedures

## Using Documentation with AI

When working with this codebase:
1. **Always check /docs first** - Most questions are answered there
2. **Reference specific docs** - e.g., "Follow patterns in /docs/code-patterns.md"
3. **Use examples** - Documentation includes working code examples
4. **Stay consistent** - Follow documented conventions and patterns

Example AI prompts:
- "Create an API endpoint following /docs/api-reference.md patterns"
- "Build a component using /docs/component-architecture.md structure"
- "Debug this using /docs/troubleshooting-faq.md"

## 🤖 AI Assistant Workflow

### Before Starting ANY Task:

1. **Read Rules** - Check `.cursor/rules/` for relevant patterns
2. **Search Codebase** - Find similar implementations
3. **Check Docs** - Read `/docs/` for guides
4. **Plan Approach** - Think before acting

### While Working:

1. **Follow Templates** - Use patterns from `.cursor/rules/`
2. **Maintain Quality** - Follow code-quality.mdc standards
3. **Use tRPC** - Follow trpc-patterns.mdc
4. **Import Correctly** - Follow monorepo-imports.mdc
5. **Run Type Checks** - Verify types frequently: `npx nx typecheck web`
6. **Fix Errors Immediately** - Don't accumulate TypeScript errors

### After Completing:

1. **Run Build Verification** - Ensure your changes build:
   ```bash
   # Build libraries
   npx nx build domain shared messaging
   
   # Build web app
   NODE_ENV=production npx nx build web
   ```

2. **Run Linting** - Check code quality:
   ```bash
   npx nx lint web              # Web app
   npx nx lint domain           # Libraries
   ```

3. **Verify Quality** - Check against quality checklist
4. **Update Docs** - If architectural changes were made
5. **Learn** - Note what worked/didn't work
6. **Improve** - Apply learnings to future work

### Build Process (CRITICAL)

**Before any pull request or deployment:**

```bash
# Full verification workflow
npx nx run-many --target=build --projects=domain,shared,messaging
cd apps/web && NODE_ENV=production npx next build
npx nx lint web
```

**Quick checks during development:**
```bash
# Type check only (fast)
npx nx typecheck web

# Build specific project
npx nx build domain
```

**See:** `/docs/development/dev-workflow.md` for complete build process

---

## 🚀 Creating New Services

### When User Requests New Feature:

**Decision Tree:**

1. **Is it a frontend feature?**
   - Standalone value (landing page)? → **Micro-Frontend** (20 min)
   - Dashboard-only? → **Route in apps/web** (5 min)

2. **Is it a backend service?**
   - High traffic (>1000 req/min)? → **Microservice** (15 min)
   - Simple CRUD? → **Module in backend** (10 min)

### Micro-Frontend Template:
```bash
# Copy from apps/pet-licensing/
cp -r apps/pet-licensing apps/[new-service]

# Update:
- package.json (name, port 300X)
- Pages (content)
- Add dashboard tab
- Update navigation

# Time: ~20 minutes
```

### Microservice Template:
```bash
# Copy from services/builder-service/
cp -r services/builder-service services/[new-service]

# Update:
- package.json (name, port 400X)
- Create domain in libs/domain/
- Add to docker-compose
- Create tRPC router

# Time: ~15 minutes
```

### Backend Module Template:
```bash
# Copy from services/backend/src/modules/pet/
mkdir -p services/backend/src/modules/[name]

# Create:
- service.ts (business logic)
- Domain in libs/domain/
- tRPC router

# Time: ~10 minutes
```

### Always:
1. **Create domain first** (`libs/domain/src/lib/[name]/`)
2. **Use proven templates** (don't start from scratch)
3. **Integrate via tRPC** (type-safe)
4. **Update navigation** (if dashboard integration)
5. **Document** (update relevant docs)

**See:** `.cursor/rules/creating-services.mdc` for complete guide

---

## 📚 Complete Documentation Map

### Rules (Actionable)
- **`.cursor/rules/`** - 8 organized rule files with examples

### Architecture
- **`/docs/architecture/`** - System design, scaling, monorepo structure

### Development  
- **`/docs/development/`** - Code patterns, testing, performance

### Guides
- **`/docs/guides/`** - Setup, environment, tRPC, API keys

### Operations
- **`/docs/ops/`** - Deployment, monitoring, API reference

### Project Root
- **`CLAUDE.md`** - This file - AI assistant guide
- **`README.md`** - Project overview
- **`.cursorrules`** - Legacy rules (superseded by .cursor/rules/)

---

## 🎯 Success Checklist

AI assistants should achieve:
- ✅ Code accepted with minimal changes
- ✅ Perfect type safety (no `any`)
- ✅ Complete implementations (all states handled)
- ✅ Proper documentation
- ✅ Following established patterns
- ✅ Continuous improvement

---

## 📞 Support

**For specific topics:**
- Architecture questions? → `.cursor/rules/architecture.mdc`
- tRPC patterns? → `.cursor/rules/trpc-patterns.mdc`
- Import issues? → `.cursor/rules/monorepo-imports.mdc`
- Code quality? → `.cursor/rules/code-quality.mdc`

**For comprehensive guides:**
- Setup → `/docs/guides/`
- Patterns → `/docs/development/`
- Architecture → `/docs/architecture/`

---

**This documentation is maintained alongside the codebase. For detailed information on any topic, check `.cursor/rules/` first, then `/docs/` folder.**
