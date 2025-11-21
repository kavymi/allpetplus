# Products CO Migration Guide

**Date:** November 18, 2025  
**Migration Type:** Code separation and micro-frontend extraction  
**Status:** Core migration complete, routes pending

## Overview

This document tracks the migration of all product-related code from `apps/web` (original harness builder app) into `apps/products-co` (comprehensive e-commerce micro-frontend), while transforming `apps/web` into the Pet Solutions Alliance hub.

## What Was Moved

### Components Migrated ✅

**From:** `apps/web/src/components/`  
**To:** `apps/products-co/src/components/`

| Component Directory | Status | Notes |
|---------------------|--------|-------|
| `builder/` | ✅ Migrated | All builder components including 3D system |
| `builder/3d/` | ✅ Extended | Added leash model, updated for product types |
| `cart/` | ✅ Migrated | Shopping cart UI components |
| `catalog/` | ✅ Migrated | Product browsing components |
| `comparison/` | ✅ Migrated | Product comparison features |
| `recommendations/` | ✅ Migrated | Smart upsell components |
| `social/` | ✅ Migrated | Share functionality |
| `ui/` | ✅ Copied | Shared UI primitives |

### Libraries Migrated ✅

**From:** `apps/web/src/lib/`  
**To:** `apps/products-co/src/lib/`

| Library | Status | Notes |
|---------|--------|-------|
| `shopify/` | ✅ Copied | Full Shopify integration |
| `cart-storage.ts` | ✅ Copied | Cart persistence |
| `cart-cookies.ts` | ✅ Copied | Cart cookie management |
| `utils.ts` | ✅ Copied | General utilities |
| `config.ts` | ✅ Copied | Configuration |

### Styles Migrated ✅

**From:** `apps/web/app/styles/globals.css`  
**To:** `apps/products-co/src/styles/globals.css`

- Full design system tokens
- CSS variables for theming
- Tailwind v4 configuration

## What Remains in apps/web

### Core Responsibilities
- Pet Solutions Alliance landing page (hub)
- Centralized dashboard for all divisions
- Pet management (not product-specific)
- User settings and profile
- Global navigation
- Authentication (Clerk)

### Components to Keep
- `landing/` - Alliance landing components (to be repurposed)
- `dashboard/` - Dashboard navigation
- `pet/` - Pet management components
- `ui/` - Shared UI (can remain for now)

### Routes to Keep
- `/` - Alliance hub landing
- `/dashboard/` - Centralized dashboard
- `/dashboard/pets/` - Pet management
- `/dashboard/settings/` - User settings
- Authentication routes

## Pending Migrations

### Routes to Migrate ⏳

**Builder Routes:**
- `apps/web/app/routes/builder/` → `apps/products-co/src/app/builder/`
- `apps/web/app/routes/builder.tsx` → Delete, add redirect

**Catalog Routes:**
- `apps/web/app/routes/catalog/` → `apps/products-co/src/app/catalog/`
- `apps/web/app/routes/catalog.tsx` → Delete, add redirect

**Commerce Routes:**
- `apps/web/app/routes/cart.tsx` → `apps/products-co/src/app/cart/`
- `apps/web/app/routes/checkout.tsx` → `apps/products-co/src/app/checkout/`
- `apps/web/app/routes/product.$handle.tsx` → `apps/products-co/src/app/products/`

### Cleanup to Complete ⏳

**Remove from apps/web:**
```bash
# After routes are migrated
rm -rf apps/web/src/components/builder/
rm -rf apps/web/src/components/cart/
rm -rf apps/web/src/components/catalog/
rm -rf apps/web/src/components/comparison/
rm -rf apps/web/src/components/recommendations/
rm -rf apps/web/src/components/social/
rm -rf apps/web/app/routes/builder/
rm -rf apps/web/app/routes/catalog/
rm apps/web/app/routes/cart.tsx
rm apps/web/app/routes/checkout.tsx
```

## Integration Architecture

### Separation of Concerns

**Products CO Owns:**
- All product sales (custom + ready-made)
- Custom builder system
- Shopping cart
- Subscription boxes
- Product orders
- Product-related dashboard views

**Web App (Alliance Hub) Owns:**
- Alliance landing page
- Global dashboard aggregation
- Pet management (cross-division)
- User authentication and settings
- Division navigation and links
- Shared order tracking (cross-division)

### Communication Pattern

```
Apps/Web (Alliance Hub)
    ↓ Links to
Products CO (E-commerce)
    ↓ Links back to
Apps/Web Dashboard
    ↓ Embeds via iframe
Products CO Dashboard
```

## Domain Types Organization

### Existing Domains
- `@pet/domain/builder` - Builder-specific types (harness-focused)
- `@pet/domain/products-co` - **NEW** Comprehensive product types

### Migration Strategy
- Keep existing builder domain for backward compatibility
- New products-co domain is authoritative for all product types
- Gradually deprecate old builder domain

## Environment Variables

### Products CO Needs:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT=...
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=...
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
```

### Web App Needs:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_PRODUCTS_URL=http://localhost:3001
NEXT_PUBLIC_LICENSING_URL=http://localhost:3002
# ... other division URLs
```

## Testing Strategy

### Integration Tests Needed
1. **Cross-App Navigation** - Verify links work between apps
2. **Dashboard Iframe** - Products dashboard loads in main dashboard
3. **Shared Auth** - User auth persists across apps
4. **Cart Sync** - Cart state consistent
5. **Design Persistence** - Saved designs accessible from both apps

### Performance Tests
1. **Bundle Size** - Products CO bundle < 500KB gzipped
2. **3D Loading** - First render < 2 seconds
3. **Page Load** - First contentful paint < 1.5 seconds

## Deployment Considerations

### Separate Deployments
- Products CO will deploy independently to Vercel
- Web app deploys separately
- No shared deployment lifecycle

### Domain Configuration
- Production: `products.allpetplus.com` (Products CO)
- Production: `allpetplus.com` (Alliance Hub)
- CORS configuration for cross-domain communication

### Environment Variables
- Configure production URLs for cross-app links
- Update iframe src for production
- Ensure Shopify credentials per environment

## Rollback Plan

If issues arise:
1. Products CO can be taken offline
2. Users redirected to original web app
3. Original web app still has all code (not deleted yet)
4. Zero downtime rollback possible

## Migration Checklist

**Phase 1: Setup** ✅
- [x] Create products-co micro-frontend
- [x] Add dependencies (3D, state, API)
- [x] Configure domain types
- [x] Set up tRPC router

**Phase 2: Component Migration** ✅
- [x] Copy builder components
- [x] Copy 3D preview system
- [x] Extend for multiple product types
- [x] Copy cart components
- [x] Copy catalog components
- [x] Copy Shopify integration
- [x] Copy design system

**Phase 3: Integration** ✅
- [x] Create dashboard tab in main app
- [x] Build products-co dashboard page
- [x] Create cross-app navigation
- [x] Apply consistent styling

**Phase 4: Routes (Pending)** ⏳
- [ ] Migrate builder routes
- [ ] Migrate catalog routes
- [ ] Migrate cart/checkout routes
- [ ] Create subscription routes
- [ ] Add redirects in web app

**Phase 5: Cleanup (Pending)** ⏳
- [ ] Remove migrated components from web app
- [ ] Remove migrated routes from web app
- [ ] Transform web landing to alliance hub
- [ ] Update all cross-references
- [ ] Clean up dependencies

**Phase 6: Testing (Pending)** ⏳
- [ ] E2E tests for critical flows
- [ ] Cross-app navigation tests
- [ ] Performance tests
- [ ] Accessibility audit

**Phase 7: Documentation (In Progress)** ⏳
- [x] Implementation guide
- [x] Migration documentation
- [ ] User documentation
- [ ] Developer setup guide
- [ ] Deployment documentation

## Success Metrics

**Technical:**
- Products CO runs independently on port 3001
- Dashboard iframe integration functional
- Cross-app navigation seamless
- No code duplication
- Clean separation of concerns

**Business:**
- All product sales consolidated in one place
- Unified builder for all product types
- Ready for subscription box launch
- Scalable for new product categories
- Foundation for 11 other division micro-frontends

## Contact & Support

For questions about this migration:
- See `/docs/features/products-co-implementation.md`
- Check `/docs/architecture/microfrontend-architecture.md`
- Review `.cursor/rules/creating-services.mdc`

---

**Last Updated:** November 18, 2025  
**Next Review:** When route migration is complete

