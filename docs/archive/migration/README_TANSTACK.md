# All Pet Plus - TanStack Start Edition

## 🚀 Quick Start

```bash
# Install dependencies (if not already done)
npm install

# Start development server
nx dev web

# Build for production
nx build web

# Preview production build
nx start web
```

## 📁 Project Structure

```
app/
├── routes/          # TanStack Router file-based routes
├── lib/             # Utilities and helpers
├── styles/          # Global styles
├── client.tsx       # Client entry point
├── server.tsx       # Server entry point
└── router.tsx       # Router configuration

src/
├── components/      # React components (unchanged)
└── lib/             # App utilities (unchanged)
```

## 🔄 Migration Status

### ✅ Completed
- Dependencies migrated to TanStack Start
- All routes converted to TanStack Router
- Vite build system configured
- Clerk authentication adapter created
- tRPC API integrated
- Vercel deployment configured
- SEO metadata migrated

### ⏳ Manual Updates Needed
1. **Component Imports** (20 files): Replace `next/link` with `@tanstack/react-router`
2. **Image Components** (8 files): Replace `next/image` with `<img>`
3. **Navigation Hooks** (13 files): Update `next/navigation` to `@tanstack/react-router`
4. **Environment Variables**: Update `NEXT_PUBLIC_*` to `VITE_*`
5. **Remove 'use client'**: Delete all 'use client' directives

See `MIGRATION_NOTES.md` for detailed instructions.

## 🔧 Configuration Files

- `vite.config.ts` - Vite bundler configuration
- `app.config.ts` - TanStack Start configuration
- `vercel.json` - Vercel deployment settings
- `tsconfig.json` - TypeScript configuration

## 🌍 Environment Variables

Create `.env.local` with:

```bash
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Application
VITE_APP_URL=http://localhost:3000

# Shopify (optional)
SHOPIFY_STORE_DOMAIN=...
SHOPIFY_STOREFRONT_ACCESS_TOKEN=...
```

## 📝 Key Features

- **Full-Stack SSR**: Server-side rendering with streaming
- **Type-Safe APIs**: tRPC integration with monorepo libs
- **File-Based Routing**: TanStack Router with nested routes
- **Authentication**: Clerk integration (custom adapter)
- **Monorepo Support**: Works with @pet/* shared libraries
- **Vercel Ready**: Optimized for Vercel deployment

## 🧪 Testing

```bash
# Type check
nx typecheck web

# Lint
nx lint web

# E2E tests (after updating)
nx e2e web
```

## 📚 Documentation

- `TANSTACK_START_MIGRATION_COMPLETE.md` - Full migration details
- `MIGRATION_NOTES.md` - Manual update instructions
- [TanStack Start Docs](https://tanstack.com/start/latest)
- [TanStack Router Docs](https://tanstack.com/router/latest)

## 🚢 Deployment

**Vercel:**
1. Set environment variables in Vercel dashboard
2. Push to repository
3. Vercel will auto-deploy using `vercel.json` config

**Build Output:**
- Client: `dist/apps/web/client/`
- Server: `dist/apps/web/server/`

## ⚡ Performance

- **Dev Server**: Vite HMR (faster than Next.js webpack)
- **Build**: Optimized with Rollup
- **Code Splitting**: Automatic route-based splitting
- **Tree Shaking**: Improved with Vite

## 🐛 Troubleshooting

**"Module not found"**
- Check path aliases in `vite.config.ts`
- Verify imports use `@/` or `@pet/*` correctly

**"Cannot find module '@tanstack/react-router'"**
- Run `npm install` to ensure all deps are installed

**"Clerk is not defined"**
- Check environment variables are set
- Verify `VITE_CLERK_PUBLISHABLE_KEY` is present

**Build errors**
- Update Next.js-specific imports (see MIGRATION_NOTES.md)
- Remove 'use client' directives
- Update environment variable references

## 📞 Support

For issues or questions:
1. Check `MIGRATION_NOTES.md` for common patterns
2. Review TanStack documentation
3. Check browser/terminal console for errors

---

**Framework**: TanStack Start RC  
**Router**: TanStack Router  
**Build Tool**: Vite 6  
**Deployment**: Vercel

