# Monorepo Organization Analysis - Apps & Services Structure

**Date:** October 8, 2025  
**Focus:** Application and Service Architecture for Monorepo

---

## Executive Summary

**Overall Assessment: ✅ GOOD with Opportunities for Enhancement**

Your monorepo organization follows NX best practices and is well-suited for growth. The separation between `apps/` and `services/` is **appropriate** for your use case. However, there are opportunities to better leverage the monorepo structure for code sharing and scalability.

### Key Findings

✅ **What's Working Well:**
- Clear separation: frontend in `apps/`, backend in `services/`
- Proper NX workspace configuration
- Shared library structure in place (`libs/shared/`)
- Good TypeScript path alias setup
- npm workspaces properly configured

⚠️ **Opportunities for Improvement:**
- **Underutilized shared library** - Only 3 imports across entire codebase
- **Missing domain-specific libraries** - No shared business logic
- **No code sharing between apps/services** - Frontend and backend are isolated
- **Inconsistent import patterns** - Local `@/` vs monorepo `@pet/` aliases
- **Single app/service** - Monorepo benefits not fully realized yet

---

## Current Structure Analysis

### Directory Organization

```
pet/
├── apps/                    ✅ GOOD - Application layer
│   └── web/                ✅ Next.js 15 frontend
│
├── services/               ✅ GOOD - Backend services
│   └── backend/           ✅ Fastify API
│
└── libs/                   ⚠️ UNDERUTILIZED
    └── shared/            ⚠️ Only 3 imports total
```

### Is `apps/` vs `services/` the Right Split?

**✅ YES - This is a solid pattern for your use case.**

#### Why This Works:

1. **Clear Mental Model**
   - `apps/` = User-facing applications (frontend, mobile apps)
   - `services/` = Backend services (APIs, workers, microservices)
   - Easy for developers to understand where code lives

2. **Deployment Flexibility**
   - Apps can deploy to Vercel/Netlify
   - Services can deploy to Fly.io/AWS/Docker
   - Different deployment strategies per layer

3. **Future Scalability**
   - Easy to add more apps (mobile app, admin dashboard)
   - Easy to add more services (notifications, analytics, webhooks)
   - Clear boundaries for team ownership

#### Alternative Patterns (Why You Shouldn't Change):

❌ **Single `apps/` folder** - Less clear what's frontend vs backend  
❌ **`packages/` for everything** - Too generic, loses semantic meaning  
❌ **Flat structure** - Doesn't scale, harder to understand  

---

## Code Sharing Analysis

### Current Usage: ⚠️ MINIMAL

```bash
# Actual usage of shared library:
@pet/shared imports: 3 total
  - apps/web/src/lib/config.ts: 1
  - services/backend/src/config.ts: 1
  - docs/guides/environment-setup.md: 1 (documentation)
```

**Problem:** You have a shared library but aren't using it! This is a huge missed opportunity.

### What Should Be Shared?

#### 1. **Types & Interfaces** (Currently minimal usage)

**Current State:**
```typescript
// libs/shared/src/lib/types.ts
export interface User { ... }
export interface Pet { ... }
```

**Reality:** Your actual types are scattered:
- `apps/web/src/lib/shopify/types.ts` - Shopify types
- Individual component types
- No shared types between frontend/backend

**Recommendation: ⭐ HIGH PRIORITY**
```
libs/
└── shared/
    └── src/
        └── lib/
            └── types/
                ├── index.ts
                ├── shopify.types.ts      # Shared Shopify types
                ├── builder.types.ts      # Builder configuration types
                ├── order.types.ts        # Order/Cart types
                ├── user.types.ts         # User/Auth types
                └── api.types.ts          # API request/response types
```

**Benefits:**
- ✅ Frontend and backend use **identical** types
- ✅ Type safety across the entire stack
- ✅ Single source of truth
- ✅ Refactor once, fix everywhere

#### 2. **Constants** (Not currently shared)

**What should be shared:**
```typescript
// libs/shared/src/lib/constants/
export const HARNESS_SIZES = ['XS', 'S', 'M', 'L', 'XL'] as const;
export const AVAILABLE_COLORS = { ... };
export const HARDWARE_FINISHES = { ... };
export const MAX_CART_QUANTITY = 10;
export const API_RATE_LIMITS = { ... };
```

**Why it matters:**
- Backend validates with same rules as frontend
- No discrepancies between client/server
- Easy to update business rules

#### 3. **Validation Schemas** (Missing entirely)

**Recommendation: ⭐ HIGH PRIORITY**
```typescript
// libs/shared/src/lib/validation/
import { z } from 'zod';

export const BuilderConfigSchema = z.object({
  size: z.enum(['XS', 'S', 'M', 'L', 'XL']),
  color: z.string(),
  hardware: z.string(),
  // ... shared validation logic
});

export type BuilderConfig = z.infer<typeof BuilderConfigSchema>;
```

**Benefits:**
- ✅ Frontend validates before sending
- ✅ Backend validates again (defense in depth)
- ✅ Same validation logic = no mismatch bugs
- ✅ Type-safe with TypeScript inference

#### 4. **Utility Functions** (Minimal current usage)

**Currently:**
```typescript
// libs/shared/src/lib/utils.ts - Generic utilities
formatDate()
generateId()
debounce()
deepClone()
```

**What's missing - Domain-specific utilities:**
```typescript
// libs/shared/src/lib/utils/
export const priceUtils = {
  formatPrice: (cents: number) => `$${(cents / 100).toFixed(2)}`,
  calculateTotal: (items: CartItem[]) => { ... },
  applyDiscount: (price: number, code: string) => { ... },
};

export const builderUtils = {
  validateConfig: (config: BuilderConfig) => { ... },
  generateShareUrl: (config: BuilderConfig) => { ... },
  configToShopifyVariant: (config: BuilderConfig) => { ... },
};
```

---

## Recommended Library Structure

### Current (Underutilized):
```
libs/
└── shared/
    └── src/
        ├── index.ts
        └── lib/
            ├── constants.ts
            ├── env.ts
            ├── types.ts         # Generic types only
            └── utils.ts         # Generic utils only
```

### Recommended (Domain-Driven):
```
libs/
├── shared/                      # Cross-cutting utilities
│   └── src/lib/
│       ├── constants/
│       │   ├── index.ts
│       │   ├── app.constants.ts
│       │   └── business.constants.ts
│       ├── types/
│       │   ├── index.ts
│       │   ├── common.types.ts
│       │   └── api.types.ts
│       └── utils/
│           ├── index.ts
│           ├── format.utils.ts
│           ├── validation.utils.ts
│           └── date.utils.ts
│
├── domain/                      # 🆕 Domain logic
│   └── src/lib/
│       ├── builder/
│       │   ├── types.ts         # BuilderConfig, etc.
│       │   ├── constants.ts     # Available options
│       │   ├── validation.ts    # Zod schemas
│       │   └── utils.ts         # Builder-specific logic
│       ├── commerce/
│       │   ├── types.ts         # Cart, Order, Product types
│       │   ├── pricing.ts       # Price calculations
│       │   └── shopify.ts       # Shopify integration logic
│       └── user/
│           ├── types.ts         # User, Auth types
│           └── permissions.ts   # Authorization logic
│
└── ui-primitives/              # 🆕 (Future) Shared UI components
    └── src/
        ├── button/
        ├── card/
        └── modal/
```

---

## Import Pattern Recommendations

### Current Problem: Inconsistent Patterns

**Frontend uses local imports:**
```typescript
// apps/web/src/components/builder/options-pane.tsx
import { cn } from '@/lib/utils';  // Local import
import type { BuilderConfig } from './config';  // Relative import
```

**Should use monorepo aliases for shared code:**
```typescript
import { cn } from '@pet/shared';  // ❌ Not currently used
import { BuilderConfig } from '@pet/domain/builder';  // ❌ Doesn't exist yet
```

### Recommended Pattern: 🎯

**Rule of Thumb:**
1. **Shared across apps/services** → Use `@pet/*` imports
2. **App-specific code** → Use `@/` imports (Next.js convention)
3. **Same directory** → Use relative imports `./`

**Example:**
```typescript
// apps/web/src/components/builder/options-pane.tsx

// ✅ Shared types from monorepo
import { BuilderConfig, BuilderStep } from '@pet/domain/builder';
import { formatPrice } from '@pet/shared/utils';

// ✅ App-specific utilities
import { trackEvent } from '@/lib/analytics';
import { api } from '@/lib/api';

// ✅ Local component imports
import { OptionCard } from './option-card';
```

---

## Scalability Assessment

### Current: 1 App + 1 Service ⚠️

**Monorepo benefits not fully realized yet.**

Your structure is **ready for growth** but currently underutilized:

```
✅ Structure supports:
   - Multiple frontend apps
   - Multiple backend services
   - Shared libraries

⚠️ Currently only:
   - 1 frontend (web)
   - 1 backend (API)
   - 1 shared lib (barely used)
```

### Future Growth Scenarios

#### Scenario 1: Mobile App 📱

**Easy to add:**
```
apps/
├── web/                 # Existing Next.js
└── mobile/             # 🆕 React Native
    ├── ios/
    ├── android/
    └── src/
        └── (shares @pet/domain and @pet/shared)
```

**Benefits of monorepo:**
- ✅ Share business logic via `@pet/domain`
- ✅ Share types and validation
- ✅ Single repository for both apps
- ✅ Coordinated releases

#### Scenario 2: Admin Dashboard 🎛️

```
apps/
├── web/                # Customer-facing
├── admin/             # 🆕 Internal dashboard
└── mobile/            # Mobile app

services/
├── backend/           # Main API
└── admin-api/        # 🆕 Admin-specific endpoints
```

#### Scenario 3: Microservices 🏗️

```
services/
├── backend/           # Main API
├── notifications/    # 🆕 Email/SMS service
├── analytics/        # 🆕 Analytics service
└── webhooks/         # 🆕 Webhook processor

libs/
└── domain/           # Shared by all services
```

---

## Performance & Build Optimization

### Current NX Configuration: ✅ Good

```json
// nx.json
{
  "tasksRunnerOptions": {
    "cacheableOperations": ["build", "lint", "test"],
    "parallel": 3
  }
}
```

**What's working:**
- ✅ Build caching enabled
- ✅ Parallel execution (3 processes)
- ✅ Dependency graph tracking
- ✅ Affected commands support

### Optimization Opportunities

#### 1. **Buildable Libraries** ⭐

**Current:**
```json
// libs/shared/project.json - Not optimized for caching
{
  "targets": {
    "build": { ... }
  }
}
```

**Recommendation:**
```json
// Make libs/shared buildable for better caching
{
  "targets": {
    "build": {
      "executor": "@nx/js:tsc",
      "outputs": ["{options.outputPath}"],
      "options": {
        "outputPath": "dist/libs/shared",
        "main": "libs/shared/src/index.ts",
        "tsConfig": "libs/shared/tsconfig.lib.json"
      }
    }
  }
}
```

**Benefits:**
- ✅ Faster builds (libs build once, cached)
- ✅ Better parallelization
- ✅ Explicit dependency graph

#### 2. **Project Tags** 🏷️

**Add to project.json files:**
```json
// apps/web/project.json
{
  "tags": ["type:app", "scope:frontend"]
}

// services/backend/project.json
{
  "tags": ["type:service", "scope:backend"]
}

// libs/shared/project.json
{
  "tags": ["type:lib", "scope:shared"]
}
```

**Benefits:**
- ✅ Enforce import rules (frontend can't import backend)
- ✅ Better graph visualization
- ✅ Easier to run related projects

#### 3. **Dependency Constraints**

**Add to root `.eslintrc.json`:**
```json
{
  "overrides": [
    {
      "files": ["*.ts", "*.tsx"],
      "rules": {
        "@nx/enforce-module-boundaries": [
          "error",
          {
            "depConstraints": [
              {
                "sourceTag": "scope:frontend",
                "onlyDependOnLibsWithTags": ["scope:shared", "scope:frontend"]
              },
              {
                "sourceTag": "scope:backend",
                "onlyDependOnLibsWithTags": ["scope:shared", "scope:backend"]
              }
            ]
          }
        ]
      }
    }
  ]
}
```

**Prevents:**
- ❌ Frontend importing backend code
- ❌ Circular dependencies
- ❌ Unwanted coupling

---

## Comparison: Your Structure vs Alternatives

### Your Structure: `apps/` + `services/` ✅

**Pros:**
- ✅ Clear semantic meaning
- ✅ Easy to understand at a glance
- ✅ Maps to deployment strategy
- ✅ Scales with different types of services

**Cons:**
- ⚠️ Slightly more directories
- ⚠️ Need to document the distinction

### Alternative 1: Everything in `apps/` ❌

```
apps/
├── web/              # Frontend
├── api/              # Backend
└── mobile/           # Mobile app
```

**Pros:**
- Simpler structure

**Cons:**
- ❌ Less clear what's user-facing vs backend
- ❌ Doesn't scale well with microservices
- ❌ Harder to set different deployment strategies

**Verdict:** ❌ Not recommended for your use case

### Alternative 2: `packages/` for everything ❌

```
packages/
├── web/
├── api/
├── shared/
└── mobile/
```

**Pros:**
- Common pattern in npm workspaces

**Cons:**
- ❌ Too generic - loses semantic structure
- ❌ Harder to distinguish layers
- ❌ Not aligned with NX best practices

**Verdict:** ❌ Not recommended for NX monorepos

---

## Action Plan: Leverage Your Monorepo

### Phase 1: Enhance Code Sharing (2-3 days) ⭐ HIGH PRIORITY

1. **Extract Shared Types**
   ```bash
   # Create domain library
   nx g @nx/js:lib domain --directory=libs/domain
   
   # Move types to libs/domain/src/lib/
   - builder/types.ts
   - commerce/types.ts
   - user/types.ts
   ```

2. **Add Validation Schemas**
   ```bash
   # Install Zod in shared lib
   cd libs/domain && npm install zod
   
   # Create validation schemas
   libs/domain/src/lib/builder/validation.ts
   libs/domain/src/lib/commerce/validation.ts
   ```

3. **Update Imports**
   ```bash
   # Replace local types with @pet/domain
   Find: import type { BuilderConfig } from './config'
   Replace: import { BuilderConfig } from '@pet/domain/builder'
   ```

### Phase 2: Organize by Domain (1 week)

4. **Extract Shared Constants**
   ```typescript
   // libs/domain/src/lib/builder/constants.ts
   export const HARNESS_SIZES = [...] as const;
   export const COLORS = { ... };
   export const HARDWARE = { ... };
   ```

5. **Shared Business Logic**
   ```typescript
   // libs/domain/src/lib/commerce/pricing.ts
   export function calculateTotal(items: CartItem[]): number { ... }
   export function applyDiscount(total: number, code: string): number { ... }
   ```

### Phase 3: Optimize Build (1-2 days)

6. **Make Libraries Buildable**
   - Configure build targets for all libs
   - Set up proper outputs

7. **Add Project Tags**
   - Tag all projects
   - Set up module boundary rules

8. **Document Structure**
   - Update architecture docs
   - Create import convention guide

---

## Best Practices Summary

### ✅ DO:

1. **Use `@pet/*` for shared code**
   ```typescript
   import { BuilderConfig } from '@pet/domain/builder';
   ```

2. **Keep apps/services independent**
   - No direct imports between apps
   - Share via libraries only

3. **Use tags for organization**
   ```json
   "tags": ["type:app", "scope:frontend"]
   ```

4. **Leverage buildable libraries**
   - Faster builds
   - Better caching

5. **Share types and validation**
   - Single source of truth
   - Type safety across stack

### ❌ DON'T:

1. **Import between apps/services**
   ```typescript
   // ❌ NEVER DO THIS
   import { something } from '@pet/backend/utils';
   ```

2. **Duplicate business logic**
   - Extract to shared library instead

3. **Mix concerns in libraries**
   - Keep libs focused on one domain

4. **Skip the shared library**
   - Use it! That's the point of monorepo

---

## Conclusion

### Overall Grade: **B+ (Good, with room for improvement)**

**What's Working:**
- ✅ Solid foundation with NX
- ✅ Good separation (apps vs services)
- ✅ Proper workspace configuration
- ✅ Ready for growth

**What Needs Work:**
- ⚠️ **Underutilized shared libraries** - Only 3 imports!
- ⚠️ **No domain libraries** - Missing shared business logic
- ⚠️ **Inconsistent patterns** - Mix of local and monorepo imports

**Verdict:**
**Your `apps/` + `services/` structure is GOOD and appropriate.** Don't change it. Instead, focus on:

1. 🎯 **Better leveraging your shared library**
2. 🎯 **Creating domain-specific libraries**
3. 🎯 **Establishing consistent import patterns**

With these improvements, you'll have an **A+ enterprise-grade monorepo** that truly leverages the benefits of the monorepo approach.

---

**Next Steps:**
1. Review this analysis with the team
2. Implement Phase 1 (Extract shared types) - Highest ROI
3. Document import conventions
4. Set up module boundary rules

**For implementation details, see:**
- [Code Patterns](../development/code-patterns.md)
- [Architecture Overview](./architecture.md)
