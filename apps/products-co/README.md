# Products CO - E-commerce Micro-Frontend

**Division:** 4 of 12 - Pet Solutions Alliance  
**Port:** 3001  
**Status:** ✅ PRODUCTION READY

## Quick Start

### Development
```bash
npm run dev
# Visit http://localhost:3001
```

### Production Build
```bash
./build.sh
# Or: unset NODE_ENV && npm run build
```

**⚠️ Important:** Use `./build.sh` or ensure `NODE_ENV` is not set to "development" when building.

### Start Production Server
```bash
npm start
# Runs on http://localhost:3001
```

## Features

- ✅ **Landing Page** - E-commerce homepage
- ✅ **Product Catalog** - Browse with category filtering
- ✅ **Subscription Boxes** - Essential & Deluxe tiers
- ✅ **Dashboard** - Manage designs, orders, subscriptions
- ✅ **Builder Placeholder** - Ready for full implementation
- ✅ **Responsive Design** - Mobile, tablet, desktop

## Technology Stack

- **Framework:** Next.js 15.1.3 with Turbopack
- **React:** 19.0.0
- **TypeScript:** 5.7
- **Styling:** Tailwind CSS v3

## Project Structure

```
apps/products-co/
├── app/
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Landing page
│   ├── globals.css         # Global styles
│   ├── builder/            # Custom builder
│   ├── catalog/            # Product catalog
│   ├── subscriptions/      # Subscription boxes
│   └── dashboard/          # Products dashboard
├── public/
├── build.sh                # Production build script ⚠️ Use this!
├── package.json
└── README.md
```

## Integration

### Main App Dashboard
Products CO dashboard is embedded in the main app at:
- **URL:** http://localhost:3000/dashboard/products
- **Method:** iframe integration
- **Status:** Working perfectly

### Cross-App Navigation
- Main app links to products-co for all product features
- Products CO links back to main dashboard
- Seamless user experience across apps

## Build Instructions

### Important: NODE_ENV Issue

**Problem:** Next.js builds fail if `NODE_ENV=development` is set in your shell.

**Solution:** Use the provided build script:
```bash
./build.sh
```

Or manually:
```bash
unset NODE_ENV && npm run build
```

Or with clean environment:
```bash
env -i PATH=$PATH HOME=$HOME npm run build
```

### Check Your Environment
```bash
# Check if NODE_ENV is set
echo $NODE_ENV

# If it shows "development", unset it:
unset NODE_ENV
```

## Development

```bash
npm run dev              # Start dev server (port 3001)
npm run build            # Production build (use ./build.sh instead)
npm start                # Start production server
npm run lint             # Lint code
```

## Pages

- `/` - Products CO landing page
- `/catalog` - Product catalog with filtering
- `/subscriptions` - Subscription box tiers
- `/dashboard` - Products management dashboard
- `/builder` - Custom builder (placeholder)

## Environment Variables

Create `.env.local`:
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3001
NEXT_PUBLIC_MAIN_APP_URL=http://localhost:3000
```

## Documentation

- **Implementation:** `/docs/features/products-co-implementation.md`
- **Testing:** `/docs/testing/products-co-testing-report.md`
- **Build Fix:** `/docs/archive/BUILD_FIXED_FINAL.md`
- **Quick Start:** `./QUICKSTART.md`

## Troubleshooting

### Build Fails
```bash
# Ensure NODE_ENV is not set to development
unset NODE_ENV

# Use the build script
./build.sh
```

### Port in Use
```bash
# Change port in package.json scripts
"dev": "next dev --turbopack -p 3002"
```

### Hot Reload Not Working
```bash
# Next.js 15.1.3 uses Turbopack by default
# Should work out of the box
```

---

**Version:** 1.0  
**Last Updated:** November 18, 2025  
**Build Status:** ✅ WORKING
