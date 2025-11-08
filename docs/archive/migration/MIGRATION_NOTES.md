# TanStack Start Migration Notes

## Completed Migrations

✅ Dependencies updated (TanStack Start, Vite, removed Next.js)
✅ Vite configuration created with monorepo support
✅ Nx configuration updated to use @nx/vite
✅ Root route created with providers and global styles
✅ All 20+ pages migrated to TanStack Router routes
✅ Clerk authentication adapter created
✅ tRPC API route migrated to TanStack Start
✅ SEO metadata migrated to route head() functions

## Remaining Manual Updates

### 1. Replace Next.js Link Components

Files using `next/link` (20 files) need to be updated:

**Find:** `import Link from 'next/link'`
**Replace:** `import { Link } from '@tanstack/react-router'`

**Find:** `<Link href="/path">`
**Replace:** `<Link to="/path">`

Key files to update:
- `src/components/ui/global-header.tsx`
- `src/components/dashboard/dashboard-nav.tsx`
- `src/components/landing/landing-header.tsx`
- `src/components/builder/saved-designs-shell.tsx`
- All dashboard page components

### 2. Replace Next.js Image Components

Files using `next/image` (8 files) need to be updated:

**Find:** `import Image from 'next/image'`
**Replace:** Use regular `<img>` tags

**Find:** `<Image src="/path" alt="..." width={x} height={y} />`
**Replace:** `<img src="/path" alt="..." style={{ width: 'x px', height: 'y px' }} />`

Note: Vite will handle image optimization during build.

Key files to update:
- `src/components/cart/cart-item-card.tsx`
- `src/components/catalog/product-detail-shell.tsx`
- `src/components/comparison/comparison-table.tsx`

### 3. Replace Next.js Navigation Hooks

Files using `next/navigation` (13 files):

**Find:** `import { useRouter, usePathname } from 'next/navigation'`
**Replace:** `import { useRouter, useLocation } from '@tanstack/react-router'`

**Find:** `const router = useRouter(); router.push('/path')`
**Replace:** `const router = useRouter(); router.navigate({ to: '/path' })`

**Find:** `const pathname = usePathname()`
**Replace:** `const location = useLocation(); const pathname = location.pathname`

**Find:** `redirect('/path')`
**Replace:** `throw redirect({ to: '/path' })`

Key files to update:
- `src/components/builder/builder-shell.tsx`
- `src/components/tracking/order-lookup-form.tsx`
- `src/components/ui/global-header.tsx`

### 4. Remove 'use client' Directives

TanStack Start doesn't need 'use client' directives. Search for and remove all instances.

**Find:** `'use client';` at the top of files
**Replace:** Remove the line entirely

### 5. Update Environment Variables

**Old (Next.js):** `process.env.NEXT_PUBLIC_*`
**New (Vite):** `import.meta.env.VITE_*`

Update `.env` file names:
- `NEXT_PUBLIC_APP_URL` → `VITE_APP_URL`
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` → `VITE_CLERK_PUBLISHABLE_KEY`

## Testing Checklist

After manual updates, test:

- [ ] Home page loads
- [ ] Builder functionality works
- [ ] Catalog and product pages load
- [ ] Cart operations work
- [ ] Checkout redirects properly
- [ ] Dashboard loads (with auth)
- [ ] Order tracking works
- [ ] All links navigate correctly
- [ ] Images load properly
- [ ] Forms submit correctly

## Known Issues

1. **Clerk Integration**: Uses custom adapter - may need adjustments based on your authentication flow
2. **Server-Side Data**: Some pages use server-side data fetching - verify loaders work correctly
3. **Image Optimization**: Less automatic than Next.js - consider adding vite-imagetools plugin
4. **Suspense Boundaries**: May need adjustments for optimal loading states

## Development Commands

```bash
# Development
nx dev web

# Build
nx build web

# Preview production build
nx start web

# Type check
nx typecheck web
```

## Deployment

See `vercel.json` for Vercel deployment configuration.
Build output: `dist/apps/web/client`

