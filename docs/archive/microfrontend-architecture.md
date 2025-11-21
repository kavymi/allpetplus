# Micro-Frontend Architecture - Pet Services

**Date:** October 8, 2025  
**Pattern:** Federated Dashboard with Independent Pet Microservices  
**Use Case:** Pet Licensing as First Micro-Frontend

---

## 🎯 Vision

**Central Dashboard** that aggregates multiple **independent pet microservices**, each with:
- Own microfrontend application
- Own backend service (optional)
- Own deployment lifecycle
- Own team ownership
- Integrated via dashboard tabs

```
┌─────────────────────────────────────────────────────┐
│           Dashboard (apps/web/dashboard)            │
│  ┌──────────┬──────────┬──────────┬──────────┐    │
│  │ My Pets  │Licensing │Insurance │  Vet AI  │    │
│  └────┬─────┴────┬─────┴────┬─────┴────┬─────┘    │
│       │          │           │          │          │
│       ▼          ▼           ▼          ▼          │
│  Built-in   Microfrontend Microfrontend Microfrontend│
└─────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture Pattern

### Option 1: Module Federation (Recommended) ⭐

**Best for:**
- Shared design system
- Same React version
- Dynamic loading
- Type safety across apps

**How it works:**
```
Dashboard App (Host)
├── Loads pet-licensing remotely
├── Renders in dashboard tab
└── Shares React, dependencies

Pet Licensing App (Remote)
├── Exposes components via Module Federation
├── Can run standalone (own landing page)
└── Integrated into dashboard
```

### Option 2: Iframe Integration

**Best for:**
- Completely independent tech stacks
- Different frameworks
- Strong isolation
- Legacy integration

**Trade-offs:**
- Less seamless UX
- Styling challenges
- Performance overhead

### Option 3: Monorepo Shared Routes

**Best for:**
- Same team
- Shared codebase
- Simple deployment

**Trade-offs:**
- Not truly independent
- Can't deploy separately

---

## 📋 Pet Licensing Micro-Frontend Design

### App Structure
```
apps/
├── web/                          # Main app + dashboard
├── pet-licensing/                # 🆕 Micro-frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── page.tsx         # Public landing page
│   │   │   ├── apply/
│   │   │   │   └── page.tsx     # License application
│   │   │   ├── verify/
│   │   │   │   └── page.tsx     # Verification
│   │   │   └── manage/
│   │   │       └── page.tsx     # Manage licenses
│   │   ├── components/
│   │   │   ├── licensing-form.tsx
│   │   │   ├── license-card.tsx
│   │   │   └── verification-flow.tsx
│   │   └── lib/
│   │       └── licensing-api.ts
│   ├── next.config.ts           # Module Federation config
│   └── package.json
│
└── pet-insurance/                # 🆕 Future micro-frontend
    └── (similar structure)
```

### Backend Service (Optional)
```
services/
├── pet-licensing-service/        # 🆕 Optional separate service
│   ├── src/
│   │   ├── main.ts
│   │   ├── routes/
│   │   │   ├── applications.ts
│   │   │   ├── licenses.ts
│   │   │   └── verification.ts
│   │   └── workers/
│   │       └── license-renewal.ts
│   └── prisma/
│       └── schema.prisma        # Licensing domain
│
OR keep in modular backend:
services/backend/src/modules/
└── licensing/                    # Module in main backend
```

---

## 🔧 Implementation: Module Federation

### Step 1: Configure Pet Licensing App

**File:** `apps/pet-licensing/next.config.ts`

```typescript
import { NextFederationPlugin } from '@module-federation/nextjs-mf';

module.exports = {
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'petLicensing',
        filename: 'static/chunks/remoteEntry.js',
        exposes: {
          './LicensingDashboard': './src/components/licensing-dashboard.tsx',
          './LicensingForm': './src/components/licensing-form.tsx',
          './LicenseList': './src/components/license-list.tsx',
        },
        shared: {
          react: { singleton: true, eager: true },
          'react-dom': { singleton: true, eager: true },
          '@pet/domain': { singleton: true },
        },
      })
    );
    return config;
  },
};
```

### Step 2: Configure Dashboard (Host)

**File:** `apps/web/next.config.ts`

```typescript
import { NextFederationPlugin } from '@module-federation/nextjs-mf';

module.exports = {
  webpack: (config, { isServer }) => {
    config.plugins.push(
      new NextFederationPlugin({
        name: 'dashboard',
        remotes: {
          petLicensing: `petLicensing@http://localhost:3001/_next/static/chunks/remoteEntry.js`,
          // Future:
          // petInsurance: `petInsurance@http://localhost:3002/_next/static/chunks/remoteEntry.js`,
          // vetAI: `vetAI@http://localhost:3003/_next/static/chunks/remoteEntry.js`,
        },
        shared: {
          react: { singleton: true },
          'react-dom': { singleton: true },
          '@pet/domain': { singleton: true },
        },
      })
    );
    return config;
  },
};
```

### Step 3: Load Remote in Dashboard

**File:** `apps/web/src/app/(dashboard)/licensing/page.tsx`

```typescript
'use client';

import dynamic from 'next/dynamic';
import { LoadingState } from '@/components/ui/loading-state';

// Dynamically import from pet-licensing micro-frontend
const LicensingDashboard = dynamic(
  () => import('petLicensing/LicensingDashboard'),
  {
    loading: () => <LoadingState message="Loading licensing..." />,
    ssr: false,
  }
);

export default function LicensingPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Pet Licensing</h1>
      <LicensingDashboard />
    </div>
  );
}
```

---

## 🎯 Simpler Alternative: Workspace Apps Pattern

Since you're in a monorepo, here's a **simpler, equally effective approach**:

### Create Separate Apps in Monorepo

```
apps/
├── web/                          # Main storefront + dashboard shell
├── pet-licensing/                # Pet licensing app (can run standalone)
├── pet-insurance/                # Pet insurance app (future)
└── vet-services/                 # Vet services app (future)
```

**Integration:**
```typescript
// Dashboard dynamically loads routes from other apps
// Via iframe or Module Federation
// Each app can also run standalone!
```

**Benefits:**
- ✅ True independence (separate deployments)
- ✅ Shared code via libs/
- ✅ Can run standalone OR integrated
- ✅ Team ownership per app
- ✅ Technology flexibility

---

## 🚀 Recommended Implementation

Let me implement the **Workspace Apps Pattern** - it's simpler and works perfectly in your NX monorepo!

### Structure:
```
apps/
├── web/                      # Main app + dashboard shell
│   └── src/app/(dashboard)/
│       ├── page.tsx          # Dashboard home
│       ├── pets/             # Built-in pet management
│       └── licensing/         # ⚠️ Iframe to pet-licensing app
│
├── pet-licensing/            # 🆕 Standalone licensing app
│   ├── src/app/
│   │   ├── page.tsx          # Public landing page
│   │   ├── apply/            # Application flow
│   │   └── dashboard/        # Licensing management
│   └── Port: 3001
│
└── pet-insurance/            # 🆕 Future
    └── Port: 3002
```

**Dashboard Integration:**
- Tab "Licensing" → Loads pet-licensing app (iframe or federation)
- Tab "Insurance" → Loads pet-insurance app
- Tab "My Pets" → Built-in to main app

---

## 💡 Decision Matrix

### When to Create Separate Micro-Frontend:

| Criteria | Pet Licensing | Pet Insurance | Vet Services |
|----------|---------------|---------------|--------------|
| **Different team?** | Possible | Yes | Yes |
| **Complex domain?** | Yes | Yes | Yes |
| **Public landing?** | Yes | Yes | Yes |
| **Independent deploy?** | Useful | Useful | Useful |
| **Different tech?** | No | Maybe | Maybe |
| **Verdict** | ✅ Separate | ✅ Separate | ✅ Separate |

### When to Keep in Main App:

| Criteria | My Pets | Orders | Settings |
|----------|---------|--------|----------|
| **Different team?** | No | No | No |
| **Complex domain?** | No | No | No |
| **Public landing?** | No | No | No |
| **Independent deploy?** | No | No | No |
| **Verdict** | ❌ Keep | ❌ Keep | ❌ Keep |

---

## 🎯 Proposed Architecture

### Micro-Frontend Pattern:

```
┌──────────────────────────────────────────────────────┐
│           Dashboard Hub (apps/web/dashboard)         │
│                                                       │
│  ┌──────────┬──────────┬──────────┬──────────┐      │
│  │          │          │          │          │      │
│  │ My Pets  │Licensing │Insurance │Vet AI    │      │
│  │          │          │          │          │      │
│  │ Built-in │Remote App│Remote App│Remote App│      │
│  └────┬─────┴────┬─────┴────┬─────┴────┬─────┘      │
│       │          │           │          │            │
│       ▼          ▼           ▼          ▼            │
│                                                       │
│  apps/web    apps/         apps/      apps/          │
│  (internal) pet-licensing  pet-ins    vet-ai         │
│              (3001)         (3002)     (3003)         │
└───────────────────────────────────────────────────────┘
```

### Data Flow:

```
Pet Licensing App
    ↓ tRPC
libs/api/licensing/
    ↓
services/backend/modules/licensing/
    OR
services/licensing-service/ (if extracted)
    ↓
Shared: libs/domain/pet/ (pet profile data)
```

---

## ✅ Recommendation

**Create pet-licensing as separate NX app with:**
1. **Standalone capability** - Own landing page, can run at pet-licensing.com
2. **Dashboard integration** - Embedded in dashboard tab
3. **Shared domain** - Uses `@pet/domain/pet` for pet data
4. **Optional backend** - Can use main backend modules OR separate service

**Start implementation now!**

---

**Next:** Shall I implement:
1. Pet Licensing as separate Next.js app (Module Federation)?
2. Pet Licensing as separate Next.js app (Iframe integration)?
3. Both, with documentation on when to use each?

Let me know and I'll build it!

