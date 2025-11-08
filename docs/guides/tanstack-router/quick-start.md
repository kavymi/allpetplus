# Quick Start - TanStack Router App

## ⚡ Commands

```bash
# Development
npx nx dev web              # Start dev server on port 3000
cd apps/web && npx vite     # Or run Vite directly

# Build
npx nx build web            # Build for production
cd apps/web && npx vite build  # Or run Vite directly

# Preview
npx nx start web            # Preview production build

# Test
npx nx lint web             # Lint code
npx nx test web             # Run Jest tests
npx nx e2e web              # Run Playwright E2E tests
```

## 🔑 Environment Setup

1. Copy environment template:
```bash
cp apps/web/env.template apps/web/.env.local
```

2. Add your keys:
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
VITE_APP_URL=http://localhost:3000
VITE_API_URL=http://localhost:4000/trpc
```

## 📂 Important Files

- `app/routes/__root.tsx` - Root layout with providers
- `app/routes/` - All route files (file-based routing)
- `vite.config.ts` - Build configuration
- `src/components/` - React components
- `src/lib/` - Utilities

## 🎯 Key Differences from Next.js

| Next.js | TanStack Router |
|---------|-----------------|
| `import Link from 'next/link'` | `import { Link } from '@tanstack/react-router'` |
| `<Link href="/path">` | `<Link to="/path">` |
| `useRouter().push('/path')` | `useRouter().navigate({ to: '/path' })` |
| `usePathname()` | `useLocation().pathname` |
| `useSearchParams()` | `useSearch()` |
| `redirect('/path')` | `throw redirect({ to: '/path' })` |

## 🏗️ Architecture

```
Browser
   ↓
TanStack Router (client-side routing)
   ↓
tRPC Client (type-safe API)
   ↓
Backend on port 4000
```

## 🐛 Common Issues

**"Cannot find module..."**
- Run `npm install` from root
- Check path aliases in `vite.config.ts`

**"Clerk is not defined"**
- Add `VITE_CLERK_PUBLISHABLE_KEY` to `.env.local`

**Build fails**
- Clear cache: `rm -rf node_modules/.vite dist`
- Rebuild: `npm install && npx nx build web`

**Hot reload not working**
- Restart dev server
- Check browser console for errors

## 📊 Build Output

- **Client**: `dist/apps/web/client/`
- **Assets**: Automatically optimized
- **Fonts**: @fontsource packages (no external requests)
- **Chunks**: Automatic code splitting

## 🚀 Deployment

Already configured for Vercel:
1. Set environment variables in Vercel dashboard
2. Push code
3. Auto-deploys!

Build command: `nx build web`
Output directory: `dist/apps/web/client`

---

**Status**: ✅ Ready to use
**Build Time**: ~3.8s
**Framework**: TanStack Router + Vite

