# Products CO Implementation

**Status:** Core Implementation Complete  
**Date:** November 18, 2025  
**Version:** 1.0

## Overview

The Products CO is a comprehensive e-commerce micro-frontend that consolidates all pet product sales including custom gear, ready-made products, and subscription boxes. It operates as an independent Next.js application integrated into the Pet Solutions Alliance ecosystem.

## Architecture

### Micro-Frontend Structure

```
apps/products-co/
├── src/
│   ├── app/                    # Next.js app router pages
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── page.tsx            # Products CO landing
│   │   ├── dashboard/          # Embedded dashboard
│   │   ├── builder/            # Custom builder (to be implemented)
│   │   ├── catalog/            # Product catalog (to be implemented)
│   │   ├── cart/               # Shopping cart (to be implemented)
│   │   └── subscriptions/      # Subscription boxes (to be implemented)
│   ├── components/
│   │   ├── builder/            # Unified builder for all products
│   │   │   ├── 3d/             # 3D preview system
│   │   │   │   ├── harness-model.tsx
│   │   │   │   ├── collar-model.tsx
│   │   │   │   ├── leash-model.tsx
│   │   │   │   └── *-scene.tsx
│   │   │   ├── builder-shell.tsx
│   │   │   ├── options-pane.tsx
│   │   │   ├── preview-pane.tsx
│   │   │   ├── use-builder.ts  # Zustand store
│   │   │   └── config.ts       # Product-type aware config
│   │   ├── catalog/            # Product browsing
│   │   ├── cart/               # Shopping cart UI
│   │   ├── navigation/         # Shared navigation
│   │   └── ui/                 # Reusable components
│   └── lib/
│       └── shopify/            # Shopify integration
├── package.json                # Dependencies with 3D libs
└── tsconfig.json

libs/domain/src/lib/products-co/
├── types.ts                    # Comprehensive domain types
├── validation.ts               # Zod validation schemas
└── utils.ts                    # Domain utilities

libs/api/src/routers/
└── products-co.ts              # tRPC router with full API
```

### Integration Points

**Dashboard Integration:**
- Main app (`apps/web`) includes Products tab in dashboard navigation
- Products dashboard embedded via iframe: `apps/web/app/routes/dashboard/products.tsx`
- Links to `http://localhost:3001/dashboard`

**Cross-App Navigation:**
- Products CO nav links back to main alliance hub (`http://localhost:3000`)
- Dashboard link points to centralized dashboard
- Shared design system for consistency

## Features Implemented

### 1. Micro-Frontend Scaffold ✅
- Created via automated script
- Port: 3001
- Full Next.js 15 structure with App Router
- TypeScript configuration
- Auto-generated domain types and tRPC router

### 2. Builder System ✅
**Product Type Support:**
- Harness
- Collar
- Leash
- Bandana
- Clothing

**Features:**
- Product type selection in builder config
- Extended Zustand store with product-specific options
- URL persistence for shareable designs
- Undo/redo functionality

**3D Preview System:**
- Harness model (existing)
- Collar model (existing)
- Leash model (NEW)
- Real-time 3D rendering with Three.js/R3F
- Smooth color transitions with Framer Motion
- Interactive camera controls

### 3. Domain Types ✅
**Comprehensive types for:**
- Products (Product, ProductVariant)
- Custom Designs (SavedDesign, ProductConfig)
- Subscriptions (SubscriptionBox, UserSubscription)
- Orders (Order, OrderItem)
- Cart (Cart, CartItem)
- Pricing (PriceBreakdown)

**Validation schemas with Zod for:**
- All inputs and mutations
- Type-safe API contracts
- Client and server validation

### 4. tRPC API ✅
**Complete API coverage:**
- Products: list, getById, getBySlug
- Designs: list, save, update, delete
- Orders: list, getById, create
- Subscriptions: list, create, update, cancel
- Cart: get, add, update, remove, clear

**Architecture:**
- Type-safe end-to-end
- Protected and public procedures
- Ready for Shopify integration

### 5. Dashboard Integration ✅
**Main App:**
- Products tab added to dashboard nav
- Iframe integration at `/dashboard/products`

**Products CO Dashboard:**
- Quick stats (designs, orders, subscriptions)
- Action cards for key features
- Links to builder, catalog, subscriptions
- Clean, modern UI with design system

### 6. Navigation ✅
**Products CO Navigation:**
- Links to Home, Shop, Custom Builder, Subscriptions
- Shopping cart icon with badge
- Link back to main alliance dashboard
- Sticky header with backdrop blur

**Shared Design System:**
- CSS variables for theming
- Consistent colors, typography, spacing
- Copied from main app for uniformity

## Technology Stack

**Frontend:**
- Next.js 15 (App Router)
- React 19
- TypeScript 5.7
- Tailwind CSS v4

**3D & Animation:**
- Three.js
- @react-three/fiber
- @react-three/drei
- Framer Motion

**State Management:**
- Zustand (builder state)
- Zustand persist middleware

**API & Data:**
- tRPC
- Zod validation
- Shopify integration (Storefront & Admin APIs)

**Build System:**
- NX monorepo
- npm workspaces

## Environment Setup

### Required Environment Variables

**products-co/.env.local:**
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT=...
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=...
```

## Running Locally

### Start Products CO:
```bash
# From project root
npx nx dev products-co

# Or directly
cd apps/products-co
npm run dev
```

Visit: `http://localhost:3001`

### Start with Main App:
```bash
# Terminal 1: Main app
npx nx dev web

# Terminal 2: Products CO
npx nx dev products-co
```

## Integration Workflow

### 1. User Journey
```
Main App (localhost:3000)
    ↓
User clicks Dashboard
    ↓
Dashboard → Products Tab
    ↓
Products Dashboard (iframe: localhost:3001/dashboard)
    ↓
User clicks "Start New Design"
    ↓
Opens Products CO Builder (localhost:3001/builder)
```

### 2. Cross-App Links
- Main app links to Products CO for all product-related features
- Products CO links back to main dashboard
- Shared navigation maintains context

## Pending Implementation

### High Priority
1. **Product Catalog Pages** - Browse ready-made products
2. **Shopping Cart** - Zustand store + UI + Shopify integration
3. **Subscription Box Pages** - Landing, tier selection, customization
4. **Builder Routes** - Actual builder pages using migrated components

### Medium Priority
5. **Web App Transformation** - Repurpose as Pet Solutions Alliance hub
6. **Order History** - Full order tracking UI
7. **Saved Designs Gallery** - Browse and manage custom designs

### Lower Priority
8. **E2E Tests** - Playwright tests for critical flows
9. **Performance** - Lazy loading, code splitting, optimization
10. **Additional 3D Models** - Bandana and clothing models

## Code Migration Status

**Completed Migrations:**
- ✅ Builder components from apps/web
- ✅ 3D preview system (harness, collar, leash)
- ✅ Cart components
- ✅ Catalog components
- ✅ UI components
- ✅ Shopify integration library
- ✅ Design system (globals.css)

**Pending Migrations:**
- ⏳ Builder routes/pages
- ⏳ Catalog routes/pages
- ⏳ Cart routes/pages
- ⏳ Remove migrated code from apps/web

## API Endpoints (tRPC)

### Products
```typescript
productsCoRouter.listProducts({ category, productType, limit, offset })
productsCoRouter.getProductById({ id })
productsCoRouter.getProductBySlug({ slug })
```

### Custom Designs
```typescript
productsCoRouter.listMyDesigns()
productsCoRouter.saveDesign({ name, productType, config })
productsCoRouter.updateDesign({ id, name, config, status })
productsCoRouter.deleteDesign({ id })
```

### Orders
```typescript
productsCoRouter.listMyOrders({ limit, offset, status })
productsCoRouter.getOrderById({ id })
productsCoRouter.createOrder({ items, shippingAddress })
```

### Subscriptions
```typescript
productsCoRouter.listSubscriptionBoxes()
productsCoRouter.createSubscription({ subscriptionBoxId, tier, preferences })
productsCoRouter.updateSubscription({ id, preferences, status })
productsCoRouter.cancelSubscription({ id })
```

### Cart
```typescript
productsCoRouter.getCart()
productsCoRouter.addToCart({ productId, variantId, quantity, customConfig })
productsCoRouter.updateCartItem({ itemId, quantity })
productsCoRouter.removeFromCart({ itemId })
```

## Development Guidelines

### Adding New Product Types
1. Add to `ProductType` in `libs/domain/src/lib/products-co/types.ts`
2. Create 3D model in `apps/products-co/src/components/builder/3d/`
3. Add product type option in builder config
4. Update builder preview to show correct 3D model

### Creating New Pages
1. Add route in `apps/products-co/src/app/`
2. Use shared components from `src/components/`
3. Follow design system patterns
4. Add to navigation if needed

### Integrating with Shopify
1. Use existing Shopify client in `apps/products-co/src/lib/shopify/`
2. Extend queries in `queries.ts` for new product types
3. Implement tRPC procedures with Shopify calls
4. Handle cart sync with Shopify Storefront API

## Success Criteria

**Completed:**
- ✅ Products CO accessible at localhost:3001
- ✅ Builder system supports multiple product types
- ✅ 3D preview system extended with new models
- ✅ Comprehensive domain types and validation
- ✅ Complete tRPC API structure
- ✅ Dashboard integration working
- ✅ Navigation with cross-app links
- ✅ Consistent design system applied

**In Progress:**
- ⏳ Product catalog functional
- ⏳ Shopping cart integrated with Shopify
- ⏳ Subscription boxes can be ordered
- ⏳ All builder routes implemented
- ⏳ Web app repurposed as alliance hub
- ⏳ Old code removed from web app

## Troubleshooting

### Port Conflicts
If port 3001 is in use:
1. Update `package.json` dev script
2. Update environment variables
3. Update iframe src in dashboard integration

### Import Errors
Ensure monorepo aliases are configured:
```json
{
  "@pet/api": "libs/api/src/index.ts",
  "@pet/domain": "libs/domain/src/index.ts",
  "@pet/shared": "libs/shared/src/index.ts",
  "@/": "apps/products-co/src/"
}
```

### 3D Preview Not Rendering
1. Check Three.js dependencies installed
2. Verify WebGL support in browser
3. Check console for shader errors

## Next Steps

1. **Implement Catalog Pages** - Create product listing and detail pages
2. **Build Cart System** - Implement shopping cart with Shopify sync
3. **Create Subscription Pages** - Build subscription box flow
4. **Complete Builder Routes** - Wire up builder components to routes
5. **Transform Web App** - Repurpose main app as alliance hub
6. **Clean Up Migration** - Remove old code from apps/web
7. **Test Integration** - E2E tests for cross-app flows
8. **Performance Optimization** - Lazy loading and code splitting
9. **Documentation** - User guides and API documentation
10. **Deployment** - Configure production environment

## Related Documentation

- [Pet Solutions Alliance Master](/docs/features/pet-solutions-alliance-master.md)
- [Products CO Business Plan](/docs/features/pet-alliance-products-co.md)
- [Micro-Frontend Architecture](/docs/architecture/microfrontend-architecture.md)
- [Builder Architecture](/docs/architecture/component-architecture.md)
- [3D Preview System](/docs/architecture/3d-preview-system.md)
- [tRPC Usage Guide](/docs/guides/trpc-usage-examples.md)

---

**Division:** Products CO (4 of 12)  
**Document Version:** 1.0  
**Last Updated:** November 18, 2025

