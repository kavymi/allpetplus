# Micro-Frontend Architecture - Updated Patterns
**Date:** October 23, 2025  
**Status:** ✅ Clarified architecture patterns

---

## 🏗️ Architecture Overview

### Key Principles

1. **Single Centralized Dashboard** - Lives in `apps/web` at `/dashboard`
2. **Shared Navigation** - All micro-frontends use common top nav component
3. **Two Micro-Frontend Patterns** - Landing only, or Landing + Dashboard integration
4. **Independent Deployment** - Each micro-frontend can deploy separately

---

## 📐 Micro-Frontend Patterns

### Pattern 1: Landing Page Only

**Use Case:**  
- Pure marketing/public content
- No user dashboard features needed
- Standalone product/service landing pages

**Structure:**
```
apps/[feature-name]/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Public landing page
│   │   ├── about/page.tsx        # About page
│   │   ├── pricing/page.tsx      # Pricing
│   │   └── contact/page.tsx      # Contact
│   └── components/
│       └── nav/
│           └── shared-nav.tsx    # Shared top nav with Dashboard link
```

**Navigation:**
```typescript
// Shared top nav includes:
- Brand logo → Home
- Feature name → Feature home
- Dashboard link → http://localhost:3000/dashboard (centralized)
- Get Started button
```

**Example:**
- Pet Grooming marketing site
- Pet Training landing page
- Vet Services information site

**NO dashboard integration** - Just public pages + link to centralized dashboard

---

### Pattern 2: Landing Page + Dashboard Tab

**Use Case:**
- Has both public marketing AND user dashboard features
- Needs tab in centralized dashboard
- Users manage feature-specific data

**Structure:**
```
apps/[feature-name]/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Public landing page
│   │   ├── about/page.tsx        # About page
│   │   ├── dashboard/
│   │   │   └── page.tsx          # Dashboard-specific content (rendered in iframe)
│   │   └── apply/page.tsx        # Application/signup flow
│   └── components/
│       └── nav/
│           └── shared-nav.tsx    # Shared top nav with Dashboard link
```

**Navigation:**
```typescript
// Shared top nav (same as Pattern 1) includes:
- Brand logo → Home
- Feature name → Feature home
- Dashboard link → http://localhost:3000/dashboard (centralized)
- Get Started button
```

**Dashboard Integration:**
```typescript
// In apps/web (main dashboard):
// apps/web/src/app/(dashboard)/[feature-name]/page.tsx

export default function FeatureTab() {
  return (
    <iframe
      src="http://localhost:3001/dashboard"  // Points to micro-frontend's dashboard page
      className="w-full min-h-screen border-0"
      title="Feature Dashboard"
    />
  );
}
```

**Example:**
- Pet Licensing (has licensing management dashboard tab)
- Pet Insurance (has policy management dashboard tab)
- Vet Portal (has appointment management dashboard tab)

---

## 🎯 Centralized Dashboard Architecture

### Dashboard Location

**Single Source:**  
`apps/web/src/app/(dashboard)/` - The ONE centralized dashboard

**Structure:**
```
apps/web/src/app/(dashboard)/
├── layout.tsx                    # Dashboard shell with nav
├── page.tsx                      # Dashboard home (overview)
├── pets/                         # Built-in: Pet management
├── designs/                      # Built-in: Design management
├── pet-licensing/                # Micro-frontend tab (iframe)
│   └── page.tsx                  # → iframe to apps/pet-licensing/dashboard
├── pet-insurance/                # Micro-frontend tab (iframe)
│   └── page.tsx                  # → iframe to apps/pet-insurance/dashboard
└── vet-portal/                   # Micro-frontend tab (iframe)
    └── page.tsx                  # → iframe to apps/vet-portal/dashboard
```

### Dashboard Navigation

**Main Dashboard Nav** (`apps/web`):
```typescript
// apps/web/src/components/dashboard/dashboard-nav.tsx

const tabs = [
  { href: '/dashboard', label: 'Overview', icon: '🏠' },
  { href: '/dashboard/pets', label: 'Pets', icon: '🐾' },
  { href: '/dashboard/designs', label: 'Designs', icon: '🎨' },
  { href: '/dashboard/pet-licensing', label: 'Licensing', icon: '📋' },  // → iframe
  { href: '/dashboard/pet-insurance', label: 'Insurance', icon: '🛡️' },  // → iframe
  { href: '/dashboard/vet-portal', label: 'Vet Portal', icon: '🏥' },    // → iframe
];
```

---

## 🔗 Shared Navigation Component

### Implementation

**Location:** Each micro-frontend has its own copy (could be shared in future)

**Code:**
```typescript
// apps/[feature]/src/components/nav/shared-nav.tsx

import Link from 'next/link';

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';

export function SharedNav(): React.ReactElement {
  return (
    <nav className="border-b border-[var(--color-border)] bg-white/90 backdrop-blur-sm sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left: Branding */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-[var(--color-primary)]">
              All Pet Plus
            </Link>
            <Link href="/" className="text-sm font-medium hover:text-[var(--color-primary)]">
              Feature Name
            </Link>
          </div>
          
          {/* Right: Navigation */}
          <div className="flex items-center gap-6">
            <Link 
              href={`${DASHBOARD_URL}/dashboard`}
              className="text-sm font-medium hover:text-[var(--color-primary)]"
            >
              Dashboard
            </Link>
            <Link
              href="/get-started"
              className="rounded-full bg-[var(--color-primary)] px-4 py-2 text-sm font-semibold text-white hover:opacity-90"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

---

## 🌐 URL Structure

### Landing Pages (Public)

```
http://pet-licensing.com/              → Landing page
http://pet-licensing.com/about         → About
http://pet-licensing.com/apply         → Application form
http://pet-licensing.com/pricing       → Pricing
```

### Dashboard (Centralized)

```
http://harnesshero.com/dashboard                    → Dashboard home
http://harnesshero.com/dashboard/pets               → Pet management (built-in)
http://harnesshero.com/dashboard/designs            → Design management (built-in)
http://harnesshero.com/dashboard/pet-licensing      → iframe → pet-licensing.com/dashboard
http://harnesshero.com/dashboard/pet-insurance      → iframe → pet-insurance.com/dashboard
```

---

## 🎨 Visual Flow

```
┌─────────────────────────────────────────────────────────────────┐
│  Micro-Frontend 1: Pet Licensing (apps/pet-licensing)          │
│  Port: 3001                                                     │
├─────────────────────────────────────────────────────────────────┤
│  [Shared Nav]  All Pet Plus | Pet Licensing | Dashboard →      │
├─────────────────────────────────────────────────────────────────┤
│  Public Pages:                                                  │
│  - / (landing)                                                  │
│  - /about                                                       │
│  - /apply                                                       │
│  - /dashboard (embedded content for iframe)                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Micro-Frontend 2: Pet Grooming (apps/pet-grooming)            │
│  Port: 3002                                                     │
├─────────────────────────────────────────────────────────────────┤
│  [Shared Nav]  All Pet Plus | Pet Grooming | Dashboard →       │
├─────────────────────────────────────────────────────────────────┤
│  Public Pages:                                                  │
│  - / (landing)                                                  │
│  - /services                                                    │
│  - /pricing                                                     │
│  - /contact                                                     │
│  NO /dashboard page (landing only pattern)                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  Main Dashboard: Harness Hero (apps/web)                       │
│  Port: 3000                                                     │
├─────────────────────────────────────────────────────────────────┤
│  Dashboard Routes:                                              │
│  - /dashboard → Home (overview)                                 │
│  - /dashboard/pets → Built-in pet management                    │
│  - /dashboard/designs → Built-in design management              │
│  - /dashboard/pet-licensing → <iframe src="3001/dashboard" />   │
│  - /dashboard/pet-insurance → <iframe src="3003/dashboard" />   │
│                                                                 │
│  Public Routes:                                                 │
│  - / → Main landing                                             │
│  - /catalog → Product catalog                                   │
│  - /builder → Harness builder                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 When to Use Each Pattern

### Use **Landing Page Only** when:
- ✅ Pure marketing/informational content
- ✅ No user-specific features
- ✅ No data management needed
- ✅ Want fast, simple deployment
- ✅ SEO-focused content

**Examples:**
- Product launch pages
- Service information sites
- Marketing campaigns
- Partner portals (public info only)

### Use **Landing + Dashboard Tab** when:
- ✅ Has user-specific features
- ✅ Needs data management UI
- ✅ Users need to manage/view their data
- ✅ Requires authentication
- ✅ Complex workflows

**Examples:**
- Pet Licensing (manage licenses)
- Pet Insurance (manage policies)
- Vet Portal (manage appointments)
- Training Programs (track progress)

---

## 📝 Creation Checklist

### For Landing Page Only:

1. ✅ Create Next.js app in `apps/[feature-name]`
2. ✅ Add shared navigation component
3. ✅ Create public landing pages
4. ✅ Configure port (300X)
5. ✅ Add to deployment pipeline

**DO NOT:**
- ❌ Create /dashboard page
- ❌ Add dashboard tab in apps/web
- ❌ Create iframe integration

### For Landing + Dashboard Tab:

1. ✅ Create Next.js app in `apps/[feature-name]`
2. ✅ Add shared navigation component
3. ✅ Create public landing pages
4. ✅ **Create /dashboard page** (for iframe content)
5. ✅ Configure port (300X)
6. ✅ **Add dashboard tab** in `apps/web/src/app/(dashboard)/[feature-name]/page.tsx`
7. ✅ **Update dashboard navigation** in `apps/web`
8. ✅ Add to deployment pipeline

---

## 🔧 Implementation Guide

### Step 1: Create Micro-Frontend

```bash
# Use scaffold script
./scripts/scaffold.sh

# Choose:
# 1) Landing Page Only
# or
# 2) Landing Page + Dashboard Tab
```

### Step 2: Add Shared Navigation

**All micro-frontends include:**
```typescript
import { SharedNav } from '@/components/nav/shared-nav';

export default function Page() {
  return (
    <>
      <SharedNav />  {/* Shared navigation with Dashboard link */}
      <main>{/* Your content */}</main>
    </>
  );
}
```

### Step 3: Dashboard Integration (Pattern 2 only)

**A. Create dashboard content page in micro-frontend:**
```typescript
// apps/[feature]/src/app/dashboard/page.tsx

'use client';

export default function FeatureDashboard() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Feature Management</h2>
      {/* Dashboard-specific UI */}
    </div>
  );
}
```

**B. Create iframe tab in main dashboard:**
```typescript
// apps/web/src/app/(dashboard)/[feature-name]/page.tsx

export default function FeatureTab() {
  return (
    <div className="h-full">
      <iframe
        src={`${process.env.NEXT_PUBLIC_FEATURE_URL || 'http://localhost:3001'}/dashboard`}
        className="w-full h-screen border-0"
        title="Feature Dashboard"
      />
    </div>
  );
}
```

**C. Update dashboard navigation:**
```typescript
// apps/web/src/components/dashboard/dashboard-nav.tsx

const dashboardTabs = [
  { href: '/dashboard', label: 'Overview', icon: '🏠' },
  { href: '/dashboard/pets', label: 'Pets', icon: '🐾' },
  { href: '/dashboard/designs', label: 'Designs', icon: '🎨' },
  { href: '/dashboard/[feature-name]', label: 'Feature Name', icon: '📋' },  // ADD THIS
];
```

---

## 🔄 Data Flow

### Landing Page Only

```
User visits landing page
    ↓
Micro-frontend serves public pages
    ↓
User clicks "Dashboard" in shared nav
    ↓
Redirects to main dashboard (apps/web)
    ↓
User manages all features in centralized dashboard
```

### Landing + Dashboard Tab

```
User visits landing page
    ↓
Micro-frontend serves public pages
    ↓
User clicks "Get Started" / signs up
    ↓
User clicks "Dashboard" in shared nav
    ↓
Main dashboard loads (apps/web)
    ↓
User clicks feature tab
    ↓
Feature-specific dashboard content loads in iframe
```

---

## 🎯 Decision Tree

```
Need a new feature?
    │
    ├─ Public pages only? ────────────────→ Landing Page Only
    │   Examples: Marketing sites,
    │   information pages, SEO landing pages
    │
    └─ Has user dashboard features? ──────→ Landing + Dashboard Tab
        Examples: License management,
        policy management, appointment booking
```

---

## 💡 Key Architectural Points

### 1. Single Dashboard (apps/web)

**The main dashboard at `apps/web` is:**
- The centralized hub for ALL user features
- Where users manage pets, designs, orders
- Where micro-frontend tabs are embedded

**It is NOT:**
- Duplicated across micro-frontends
- Embedded in each micro-frontend

### 2. Shared Top Navigation

**Every micro-frontend includes:**
- Brand logo (All Pet Plus)
- Feature name
- **Link to Dashboard** (points to apps/web)
- Call-to-action button

**Purpose:**
- Consistent branding across all properties
- Easy access to centralized dashboard
- Unified user experience

### 3. Dashboard Tabs vs Dashboard Pages

**Dashboard Tabs** (in apps/web):
- Physical tabs in the centralized dashboard
- Render iframe pointing to micro-frontend's /dashboard page

**Dashboard Pages** (in micro-frontends):
- Content pages meant to be displayed in iframe
- Only exist for Pattern 2 (Landing + Dashboard Tab)
- Don't have their own navigation (parent dashboard provides nav)

---

## 📚 Examples

### Example 1: Pet Grooming (Landing Only)

**URLs:**
- `http://pet-grooming.com/` - Landing page
- `http://pet-grooming.com/services` - Services list
- `http://pet-grooming.com/pricing` - Pricing tiers

**Navigation:**
```
[All Pet Plus] [Pet Grooming] [Dashboard →] [Book Now]
                                      ↓
                    http://harnesshero.com/dashboard
```

**No dashboard tab** - Users book appointments but manage them in main dashboard

---

### Example 2: Pet Licensing (Landing + Dashboard)

**URLs:**
- `http://pet-licensing.com/` - Landing page
- `http://pet-licensing.com/apply` - Application
- `http://pet-licensing.com/dashboard` - **Dashboard content (for iframe)**

**Navigation:**
```
[All Pet Plus] [Pet Licensing] [Dashboard →] [Apply Now]
                                        ↓
                      http://harnesshero.com/dashboard
```

**Dashboard Integration:**
```
Main Dashboard → Licensing Tab → <iframe src="pet-licensing.com/dashboard" />
```

**User Experience:**
1. User visits `pet-licensing.com` (landing)
2. User applies for license
3. User clicks "Dashboard" in top nav
4. Arrives at `harnesshero.com/dashboard`
5. Sees "Licensing" tab
6. Clicks tab → sees iframe with `pet-licensing.com/dashboard` content

---

## 🛠️ Development Workflow

### Starting Development

```bash
# Start main dashboard
npm run dev:web  # Port 3000

# Start micro-frontend(s)
npx nx dev pet-licensing  # Port 3001
npx nx dev pet-insurance  # Port 3002
```

### Testing Dashboard Integration

1. Visit main dashboard: `http://localhost:3000/dashboard`
2. Click micro-frontend tab (e.g., "Licensing")
3. Should load iframe: `http://localhost:3001/dashboard`
4. Verify content renders correctly in iframe
5. Test navigation between tabs

---

## 🎨 Design Consistency

### Shared Elements

**All micro-frontends share:**
- Top navigation component (structure, not code yet)
- Brand colors (CSS variables)
- Typography (fonts)
- Button styles
- Design system principles

### Future: Shared Component Library

**Potential evolution:**
```
libs/ui-kit/
└── src/
    ├── nav/
    │   └── shared-nav.tsx  # Single source of truth
    ├── button/
    └── card/
```

All micro-frontends import from `@pet/ui-kit`

---

## 📖 Related Documentation

- [Micro-Frontend Creation Guide](../guides/create-new-microfrontend.md)
- [Micro-Frontend Architecture](./microfrontend-architecture.md)  
- [Dashboard Architecture Decision](../archive/dashboard-architecture-decision.md)

---

## ✨ Summary

**Two patterns, one dashboard:**

1. **Landing Only** = Public pages + shared nav → **NO** dashboard content
2. **Landing + Dashboard** = Public pages + shared nav + **dashboard content** (embedded via iframe in main dashboard)

**One centralized dashboard** (`apps/web`) where ALL user features are managed.

**Shared navigation** on all micro-frontends with link to centralized dashboard.

This architecture provides:
- ✅ Consistent user experience
- ✅ Single dashboard for all features  
- ✅ Independent deployment of micro-frontends
- ✅ Clear separation of concerns
- ✅ Scalable growth pattern

