# Products CO - E-commerce Micro-Frontend

**Division:** 4 of 12 - Pet Solutions Alliance  
**Port:** 3001  
**Status:** Core implementation complete

## Overview

The Products CO is a comprehensive e-commerce platform for customizable pet gear and lifestyle products. This micro-frontend consolidates all product sales including custom-built items, ready-made products, and subscription boxes.

## Features

### ✨ Custom Builder
- **Multi-product support:** Harnesses, collars, leashes, bandanas, clothing
- **3D preview system:** Real-time interactive 3D rendering
- **Product-type aware:** Different options per product category
- **Save & share:** URL persistence and design saving
- **Lazy loaded:** Performance-optimized code splitting

### 🛍️ Product Catalog
- **Category filtering:** Browse by product type
- **Ready-made products:** High-quality pre-designed items
- **Mock data ready:** Structure in place for Shopify integration

### 🛒 Shopping Cart
- **Persistent state:** Zustand with localStorage
- **Slide-out sidebar:** Smooth animations
- **Quantity management:** Add, update, remove items
- **Live count:** Badge in navigation

### 📦 Subscription Boxes
- **Two tiers:** Essential ($39.99/mo) and Deluxe ($79.99/mo)
- **Customization:** Pet preferences and options
- **FAQ section:** Common questions answered

### 📊 Dashboard
- **Quick stats:** Designs, orders, subscriptions
- **Action cards:** Links to key features
- **Embedded view:** Works in main app dashboard iframe

## Getting Started

### Prerequisites
- Node.js 24+
- npm 10.7.0+
- Main app running (for cross-app features)

### Installation

```bash
# From project root
npm install

# Start products-co
npx nx dev products-co

# Or directly
cd apps/products-co
npm run dev
```

Visit: `http://localhost:3001`

### Environment Setup

1. Copy `env.template` to `.env.local`
2. Add required environment variables:

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT=...
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=...
```

## Project Structure

```
apps/products-co/
├── src/
│   ├── app/                    # Pages (Next.js App Router)
│   │   ├── layout.tsx          # Root layout with nav
│   │   ├── page.tsx            # Landing page
│   │   ├── builder/            # Custom builder pages
│   │   ├── catalog/            # Product catalog
│   │   ├── cart/               # Shopping cart page
│   │   ├── subscriptions/      # Subscription boxes
│   │   └── dashboard/          # Embedded dashboard
│   ├── components/
│   │   ├── builder/            # Builder system
│   │   │   ├── 3d/             # 3D preview models
│   │   │   ├── builder-shell.tsx
│   │   │   ├── options-pane.tsx
│   │   │   ├── preview-pane.tsx
│   │   │   ├── use-builder.ts  # Zustand store
│   │   │   └── config.ts       # Product configs
│   │   ├── catalog/            # Catalog components
│   │   ├── cart/               # Cart components
│   │   │   └── cart-sidebar.tsx
│   │   ├── navigation/         # App navigation
│   │   │   └── products-nav.tsx
│   │   └── ui/                 # Reusable UI
│   ├── lib/
│   │   ├── shopify/            # Shopify integration
│   │   ├── cart-store.ts       # Cart state
│   │   └── utils.ts
│   └── styles/
│       └── globals.css         # Design system
├── e2e/                        # Playwright tests
├── package.json
├── playwright.config.ts
└── tsconfig.json
```

## Technology Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript 5.7
- **Styling:** Tailwind CSS v4
- **3D:** Three.js, @react-three/fiber, @react-three/drei
- **Animation:** Framer Motion
- **State:** Zustand with persistence
- **API:** tRPC with Zod validation
- **Testing:** Playwright
- **Build:** NX monorepo

## Integration with Alliance

### Main App Integration
Products CO integrates with the main Pet Solutions Alliance app:

1. **Dashboard Tab:** Products dashboard embedded in main dashboard
2. **Cross-App Links:** Navigation between alliance hub and products
3. **Shared Auth:** Uses same Clerk authentication
4. **Design System:** Consistent styling across all apps

### Access Points
- **Standalone:** `http://localhost:3001`
- **Dashboard:** `http://localhost:3000/dashboard/products` (iframe)
- **From Alliance:** Click "Products" in main app

## Development Commands

```bash
# Development
npm run dev              # Start dev server (port 3001)

# Building
npm run build            # Production build
npm run start            # Start production server

# Quality
npm run lint             # Run ESLint
npx nx typecheck products-co  # Type checking

# Testing
npx playwright test      # Run E2E tests
npx playwright test --ui # Interactive test UI
npx playwright test --headed  # See browser
```

## Key Features to Implement Next

### High Priority
1. **Builder Routes** - Wire up existing components to pages
2. **Shopify Integration** - Replace mock data with real products
3. **Checkout Flow** - Complete purchase process
4. **Design Saving** - Persist custom designs to database

### Medium Priority
5. **Order History** - Display past orders
6. **Product Detail** - Individual product pages
7. **Search** - Product search functionality
8. **Filters** - Advanced catalog filtering

### Lower Priority
9. **Reviews** - Product reviews and ratings
10. **Wishlist** - Save favorite products
11. **Recommendations** - Smart product suggestions
12. **AR Preview** - Mobile AR try-on

## API Endpoints (tRPC)

### Products
```typescript
trpc.productsCoRouter.listProducts.useQuery({ category, productType })
trpc.productsCoRouter.getProductById.useQuery({ id })
```

### Custom Designs
```typescript
trpc.productsCoRouter.listMyDesigns.useQuery()
trpc.productsCoRouter.saveDesign.useMutation()
```

### Shopping Cart
```typescript
trpc.productsCoRouter.addToCart.useMutation()
trpc.productsCoRouter.getCart.useQuery()
```

### Subscriptions
```typescript
trpc.productsCoRouter.listSubscriptionBoxes.useQuery()
trpc.productsCoRouter.createSubscription.useMutation()
```

## Troubleshooting

### Port Already in Use
```bash
# Change port in package.json
"dev": "next dev -p 3002"
```

### Import Errors
Ensure monorepo packages are built:
```bash
npx nx build domain
npx nx build shared  
npx nx build api
```

### 3D Not Rendering
1. Check WebGL support in browser
2. Verify Three.js dependencies installed
3. Check browser console for errors

### Cart Not Persisting
Check localStorage is enabled and not full

## Documentation

- **Implementation Guide:** `/docs/features/products-co-implementation.md`
- **Migration Guide:** `/docs/architecture/products-co-migration.md`
- **Summary:** `/docs/architecture/products-co-implementation-summary.md`
- **Business Plan:** `/docs/features/pet-alliance-products-co.md`

## Contributing

Follow the patterns established in this codebase:
1. TypeScript strict mode (no `any` types)
2. Comprehensive error handling
3. Loading and empty states
4. Accessibility features
5. Responsive design
6. Performance optimization

See: `/.cursor/rules/` for complete development guidelines

---

**Created:** November 18, 2025  
**Version:** 1.0  
**Maintainer:** All Pet Plus Team
