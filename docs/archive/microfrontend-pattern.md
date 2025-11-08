# Micro-Frontend Pattern - Pet Services Integration

**Date:** October 8, 2025  
**Pattern:** Independent Apps with Dashboard Aggregation  
**Example:** Pet Licensing Service

---

## 🎯 Architecture Vision

### Central Dashboard + Independent Pet Services

```
┌────────────────────────────────────────────────────────────┐
│         Main Dashboard (apps/web/dashboard)                │
│                                                             │
│  ┌──────────┬──────────┬──────────┬──────────┬─────────┐  │
│  │          │          │          │          │         │  │
│  │ My Pets  │Licensing │Insurance │  Vet AI  │  More   │  │
│  │          │          │          │          │         │  │
│  │ Built-in │ iframe   │ iframe   │ iframe   │ iframe  │  │
│  │          │ 3001     │ 3002     │ 3003     │ 300X    │  │
│  └────┬─────┴────┬─────┴────┬─────┴────┬─────┴─────────┘  │
│       │          │           │          │                   │
└───────┼──────────┼───────────┼──────────┼───────────────────┘
        │          │           │          │
        │          │           │          │
        ▼          ▼           ▼          ▼
    apps/web   apps/        apps/      apps/
               pet-licensing pet-ins    vet-ai
               (Standalone)  (Standalone)(Standalone)
```

### Key Principles:

1. **Independence** - Each pet service is a standalone app
2. **Integration** - All accessible via central dashboard
3. **Shared Data** - Pet profiles via `@pet/domain`
4. **Flexibility** - Can run standalone OR embedded
5. **Team Ownership** - Different teams can own different services

---

## 📦 Implementation Pattern

### 1. Create Standalone App

```
apps/pet-licensing/
├── src/app/
│   ├── page.tsx              # Public landing page
│   ├── apply/                # Application flow
│   ├── verify/               # Verification
│   └── dashboard/            # Embedded view for dashboard
├── package.json              # Own dependencies
└── next.config.ts            # Port 3001
```

**Can access:**
- Standalone: `https://licensing.harnesshero.com`
- Public: `https://licensing.harnesshero.com` (marketing)
- Embedded: `https://harnesshero.com/dashboard/licensing` (iframe)

### 2. Integrate into Dashboard

**File:** `apps/web/src/app/(dashboard)/licensing/page.tsx`

```typescript
export default function LicensingTab() {
  return (
    <div>
      <h1>Pet Licensing</h1>
      
      {/* Load micro-frontend */}
      <iframe
        src="http://localhost:3001/dashboard"
        className="w-full h-screen"
      />
    </div>
  );
}
```

### 3. Share Data via Domain Library

```typescript
// apps/pet-licensing can import:
import { PetProfile, recommendHarnessSize } from '@pet/domain/pet';

// Get pet data via tRPC (same as main app)
const { data: pets } = trpc.pets.list.useQuery();
```

---

## 🎯 Service Matrix

| Service | Type | Port | Integration | Status |
|---------|------|------|-------------|--------|
| **Main Web** | Core | 3000 | - | ✅ Running |
| **Dashboard** | Built-in | 3000 | - | ✅ Complete |
| **My Pets** | Built-in | 3000 | - | ✅ Complete |
| **Pet Licensing** | Micro-FE | 3001 | iframe | ✅ Created |
| **Pet Insurance** | Micro-FE | 3002 | iframe | 🚧 Future |
| **Vet Services** | Micro-FE | 3003 | iframe | 🚧 Future |
| **Pet Training** | Micro-FE | 3004 | iframe | 🚧 Future |

---

## 🔧 Development Workflow

### Run Individual Service:
```bash
# Pet licensing standalone
nx dev pet-licensing  # Port 3001

# Main app
nx dev web  # Port 3000

# Both
nx run-many --target=dev --projects=web,pet-licensing --parallel=2
```

### Test Integration:
```bash
# 1. Start both apps
Terminal 1: nx dev web             # Main app on 3000
Terminal 2: nx dev pet-licensing   # Licensing on 3001

# 2. Visit dashboard
http://localhost:3000/dashboard/licensing

# 3. See licensing app embedded!
```

---

## 💡 When to Create Micro-Frontend

### ✅ Create Separate App When:

1. **Independent business domain** - Pet licensing, insurance, vet services
2. **Standalone value** - Can be accessed outside dashboard
3. **Different deployment cycle** - Updates frequently/independently  
4. **Team ownership** - Separate team builds/maintains
5. **Public landing page** - Needs own marketing site

### ❌ Keep in Main App When:

1. **Core functionality** - My Pets, Orders, Settings
2. **Tightly coupled** - Shares lots of state with main app
3. **Low complexity** - Simple CRUD operations
4. **Same team** - No benefit to separation
5. **No standalone value** - Only makes sense in dashboard

---

## 🏗️ Current Architecture

```
apps/
├── web/                      # Main app (Port 3000)
│   ├── (public)/            # Marketing pages
│   ├── (builder)/           # Harness builder
│   ├── (catalog)/           # Products
│   └── (dashboard)/         # Dashboard shell
│       ├── page.tsx         # Overview
│       ├── pets/            # Built-in: Pet management
│       ├── licensing/       # ✨ Embedded: Pet licensing
│       ├── designs/         # Built-in: Saved designs
│       └── orders/          # Built-in: Orders
│
└── pet-licensing/            # ✨ Micro-frontend (Port 3001)
    ├── page.tsx              # Public landing
    ├── apply/                # Application flow
    └── dashboard/            # Embedded in main dashboard
```

---

## 📊 Data Sharing Strategy

### Shared Domain Library
```typescript
// All apps import from same source
import { PetProfile } from '@pet/domain/pet';
import { UserProfile } from '@pet/domain/user';

// Works in:
- apps/web
- apps/pet-licensing
- apps/pet-insurance (future)
- services/backend
```

### Shared API (tRPC)
```typescript
// All apps use same tRPC client
import { trpc } from '@pet/api';

const { data: pets } = trpc.pets.list.useQuery();
// Works in both main app AND micro-frontends!
```

### Communication Between Apps

**Option A: Iframe PostMessage**
```typescript
// Pet licensing sends message to parent
window.parent.postMessage({
  type: 'license.approved',
  petId: '123',
}, '*');

// Dashboard listens
window.addEventListener('message', (event) => {
  if (event.data.type === 'license.approved') {
    // Refresh pet data
  }
});
```

**Option B: Shared State (localStorage/cookies)**
```typescript
// Both apps read/write same storage
localStorage.setItem('selectedPetId', petId);
```

**Option C: URL Parameters**
```typescript
// Dashboard passes context
<iframe src="/dashboard?petId=123" />

// Licensing app reads params
const petId = searchParams.get('petId');
```

---

## ✅ What Was Created

### Pet Licensing App Structure:
```
apps/pet-licensing/
├── src/
│   ├── app/
│   │   ├── layout.tsx           ✅ Root layout
│   │   ├── page.tsx             ✅ Public landing page
│   │   ├── apply/
│   │   │   └── page.tsx         ✅ Application form
│   │   └── dashboard/
│   │       └── page.tsx         ✅ Embedded dashboard view
│   └── styles/
│       └── globals.css          ✅ Styles
├── next.config.ts               ✅ Config (port 3001)
├── tsconfig.json                ✅ TypeScript config
├── project.json                 ✅ NX project config
└── package.json                 ✅ Dependencies
```

### Dashboard Integration:
```
apps/web/src/app/(dashboard)/
└── licensing/
    └── page.tsx                 ✅ Licensing tab (iframe)
```

### Navigation Updated:
```
Dashboard tabs now include:
- Overview
- My Pets (built-in)
- Licensing ✨ NEW (micro-frontend)
- Saved Designs
- Orders
- Documents
- Settings
```

---

## 🚀 Usage Guide

### Access Licensing Standalone:
```
http://localhost:3001
- Public landing page
- Application flow
- Can operate independently
```

### Access via Dashboard:
```
http://localhost:3000/dashboard/licensing
- Embedded in dashboard
- Integrated with pet profiles
- Seamless UX
```

### Develop Licensing App:
```bash
# Just licensing
nx dev pet-licensing

# With dashboard
nx run-many --target=dev --projects=web,pet-licensing --parallel=2
```

---

## 📋 Pattern for Future Pet Services

### To Add New Pet Micro-Frontend:

**1. Create App:**
```bash
mkdir -p apps/pet-[service]
# Copy structure from pet-licensing
```

**2. Add to Dashboard:**
```typescript
// apps/web/src/app/(dashboard)/[service]/page.tsx
<iframe src="http://localhost:300X/dashboard" />
```

**3. Update Navigation:**
```typescript
// Add to dashboard-nav.tsx
{ href: '/dashboard/[service]', label: '[Service]', icon: '🎯' }
```

**4. Share Data:**
```typescript
// Service uses shared domain
import { PetProfile } from '@pet/domain/pet';
import { trpc } from '@pet/api';
```

**That's it!** Each new service follows same pattern!

---

## ✨ Benefits

### Independence ✅
- Each service has own repo (in monorepo)
- Own deployment schedule
- Own team ownership
- Own technology choices

### Integration ✅
- All accessible via dashboard
- Shared pet data
- Seamless user experience
- Single login (Clerk)

### Flexibility ✅
- Can run standalone (licensing.harnesshero.com)
- Can embed in dashboard
- Can be mobile app later
- Can change tech stack if needed

---

## 🎯 Next Steps

### This Week:
1. ✅ Pet licensing app created
2. ✅ Dashboard integration complete
3. 🚧 Add licensing form
4. 🚧 Add backend licensing module

### This Month:
1. Complete licensing application flow
2. Add pet-insurance micro-frontend
3. Add vet-services micro-frontend
4. Refine integration patterns

### This Quarter:
1. Module Federation (vs iframe)
2. Shared component library
3. Mobile apps reuse micro-frontends
4. Analytics across services

---

## 📚 Documentation

**Architecture:**
- `/docs/architecture/microfrontend-architecture.md` - Full design
- `/docs/architecture/MICROFRONTEND_PATTERN.md` - This guide

**Implementation:**
- `apps/pet-licensing/` - Example implementation
- `apps/web/src/app/(dashboard)/licensing/` - Integration example

---

**Pattern complete! Each new pet service follows this model!** 🎉

