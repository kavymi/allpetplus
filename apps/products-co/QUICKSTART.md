# Products CO Quick Start Guide

**Get up and running in 5 minutes** 🚀

## Prerequisites

- Node.js 24+
- npm 10.7.0+
- Project cloned and at root

## Start Development

```bash
# Install dependencies (if not already done)
npm install

# Start Products CO (port 3001)
npx nx dev products-co

# In another terminal, start Alliance Hub (port 3000)
npx nx dev web
```

**Visit:**
- Products CO: http://localhost:3001
- Alliance Hub: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard/products

## What Works Right Now

### ✅ Pages You Can Visit

**Products CO (localhost:3001):**
- `/` - Landing page
- `/catalog` - Product catalog with filtering
- `/subscriptions` - Subscription box tiers
- `/dashboard` - Products dashboard
- `/builder` - Builder (loads but needs routes)

**Alliance Hub (localhost:3000):**
- `/` - Alliance landing with 12 divisions
- `/dashboard` - Main dashboard
- `/dashboard/products` - Products tab (iframe embed)

### ✅ Features You Can Test

1. **Browse Catalog** - Click categories, view products
2. **Filter Products** - Click Collars/Leashes/etc
3. **View Subscriptions** - See two tier options
4. **Navigate Cross-App** - Click between apps
5. **Dashboard Integration** - See iframe embed

## Quick Tests

### Test 1: Cross-App Navigation
```bash
1. Visit http://localhost:3000
2. Click "Products CO" card
3. Verify it goes to http://localhost:3001
```

### Test 2: Catalog Filtering
```bash
1. Visit http://localhost:3001/catalog
2. Click "Collars" button
3. Verify only collar product shows
```

### Test 3: Dashboard Embed
```bash
1. Visit http://localhost:3000/dashboard
2. Click "My Products" tab
3. Verify iframe loads products dashboard
```

## Common Issues

### Port Already in Use
```bash
# Kill processes on ports
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9
```

### Module Not Found
```bash
# Rebuild libraries
npx nx build domain
npx nx build shared
npx nx build api
```

### Changes Not Showing
```bash
# Clear Next.js cache
rm -rf apps/products-co/.next
```

## File Locations

**Key Files:**
- Components: `apps/products-co/src/components/`
- Pages: `apps/products-co/src/app/`
- Domain Types: `libs/domain/src/lib/products-co/`
- API Router: `libs/api/src/routers/products-co.ts`

**Key Components:**
- Builder: `src/components/builder/`
- 3D Models: `src/components/builder/3d/`
- Cart: `src/components/cart/`
- Catalog: `src/components/catalog/`

## Next Development Tasks

### High Priority
1. **Implement Builder Routes**
   - Create `apps/products-co/src/app/builder/page.tsx`
   - Wire up builder components
   - Test product type switching

2. **Connect Shopify**
   - Add environment variables
   - Replace mock data
   - Test real products

3. **Add Navigation**
   - Add ProductsNav back to layout
   - Verify cart icon works
   - Test all nav links

### Medium Priority
4. Add product detail pages
5. Implement cart functionality
6. Connect Shopify checkout
7. Build saved designs gallery

## Helpful Commands

```bash
# Development
npx nx dev products-co          # Start products-co
npx nx dev web                  # Start alliance hub

# Building
npx nx build products-co        # Build for production
npx nx typecheck products-co    # Type checking
npx nx lint products-co         # Linting

# Testing
cd apps/products-co
npx playwright test             # Run E2E tests
npx playwright test --ui        # Interactive test UI
```

## Documentation

**Read These First:**
- `apps/products-co/README.md` - Full app documentation
- `docs/features/products-co-implementation.md` - Implementation guide
- `docs/architecture/products-co-migration.md` - Migration details
- `docs/testing/products-co-testing-report.md` - Test results

## Need Help?

**Common Questions:**
- How do I add a new product type? → See `config.ts`
- How do I add a new page? → Add to `src/app/`
- How do I use tRPC? → See `libs/api/src/routers/products-co.ts`
- How do I add a 3D model? → See `src/components/builder/3d/`

**Resources:**
- Project rules: `/.cursor/rules/`
- Architecture docs: `/docs/architecture/`
- Development guides: `/docs/development/`

---

**Last Updated:** November 18, 2025  
**Version:** 1.0  
**Status:** Phase 1 Complete ✅

