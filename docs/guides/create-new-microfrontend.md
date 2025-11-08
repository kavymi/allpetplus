# Create New Micro-Frontend - Step-by-Step Guide

**Time to Create:** 20 minutes  
**Difficulty:** Easy  
**Pattern:** Proven, repeatable, documented

---

## 🎯 When to Create a Micro-Frontend

### Frontend App Checklist:

Create separate frontend app when **3+ are true:**
- [ ] Standalone value (can be accessed outside dashboard)
- [ ] Complex domain (>20 components)
- [ ] Separate team ownership
- [ ] Different deployment cycle
- [ ] Public landing page needed
- [ ] Potential for separate branding

**Otherwise:** Create route in `apps/web/src/app/`

---

## 🚀 Quick Start: Create New Micro-Frontend

### Step 1: Create App Directory (2 min)

```bash
# Example: pet-insurance
mkdir -p apps/pet-insurance/src/{app,components,lib,styles}
mkdir -p apps/pet-insurance/public
cd apps/pet-insurance
```

### Step 2: Copy Core Files (5 min)

**package.json:**
```json
{
  "name": "@pet/pet-insurance",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "start": "next start -p 3002"
  },
  "dependencies": {
    "next": "15.0.3",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  }
}
```

**next.config.ts:**
```typescript
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@pet/domain', '@pet/shared', '@pet/api'],
};

export default nextConfig;
```

**tsconfig.json:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "jsx": "preserve",
    "lib": ["dom", "dom.iterable", "esnext"],
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx"],
  "exclude": ["node_modules"]
}
```

### Step 3: Create Pages (8 min)

**src/app/layout.tsx:**
```typescript
import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Pet Insurance - All Pet Plus',
  description: 'Comprehensive pet insurance coverage',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
```

**src/app/page.tsx** (Public Landing):
```typescript
import Link from 'next/link';

export default function InsuranceLanding() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-5xl font-bold mb-4">Pet Insurance</h1>
      <p className="text-xl mb-8">Protect your pet with comprehensive coverage</p>
      
      <div className="flex gap-4">
        <Link href="/apply">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg">
            Get Quote
          </button>
        </Link>
        
        <Link href="/dashboard">
          <button className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg">
            Manage Policy
          </button>
        </Link>
      </div>
    </div>
  );
}
```

**src/app/dashboard/page.tsx** (Embedded View):
```typescript
'use client';

export default function InsuranceDashboard() {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">Insurance Dashboard</h1>
      <p>Manage your pet insurance policies</p>
      {/* Your insurance UI here */}
    </div>
  );
}
```

### Step 4: Add to NX (2 min)

**project.json:**
```json
{
  "name": "pet-insurance",
  "$schema": "../../node_modules/nx/schemas/project-schema.json",
  "sourceRoot": "apps/pet-insurance/src",
  "projectType": "application",
  "tags": ["type:app", "scope:frontend", "domain:pet-insurance"],
  "targets": {
    "dev": {
      "executor": "@nx/next:server",
      "options": {
        "buildTarget": "pet-insurance:build",
        "dev": true,
        "port": 3002
      }
    },
    "build": {
      "executor": "@nx/next:build",
      "options": {
        "outputPath": "dist/apps/pet-insurance"
      }
    }
  }
}
```

### Step 5: Integrate into Dashboard (3 min)

**apps/web/src/app/(dashboard)/insurance/page.tsx:**
```typescript
export default function InsuranceTab() {
  return (
    <div className="space-y-6">
      <h1 className="text-4xl font-bold">Pet Insurance</h1>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <iframe
          src="http://localhost:3002/dashboard"
          className="w-full h-[800px] border-0"
          title="Pet Insurance Dashboard"
        />
      </div>
    </div>
  );
}
```

**Update apps/web/src/components/dashboard/dashboard-nav.tsx:**
```typescript
const navItems = [
  // ... existing
  { href: '/dashboard/insurance', label: 'Insurance', icon: '🏥' },  // ✅ Add
];
```

### Done! ✅

```bash
# Start both apps
npx nx run-many --target=dev --projects=web,pet-insurance

# Visit
http://localhost:3000/dashboard/insurance  # Embedded
http://localhost:3002                       # Standalone
```

---

## 📋 Complete Checklist

### App Setup:
- [ ] Directory created
- [ ] package.json
- [ ] next.config.ts
- [ ] tsconfig.json
- [ ] project.json

### Pages:
- [ ] layout.tsx
- [ ] page.tsx (public landing)
- [ ] dashboard/page.tsx (embedded view)
- [ ] Other routes as needed

### Integration:
- [ ] Dashboard tab page created
- [ ] Navigation updated
- [ ] Iframe configured

### Shared Code:
- [ ] Domain types in libs/domain/
- [ ] Uses @pet/domain imports
- [ ] tRPC router (if backend needed)

### Testing:
- [ ] Runs standalone
- [ ] Runs in dashboard
- [ ] Shares pet data
- [ ] Authentication works

---

## 🎨 Ports Convention

```
3000 - apps/web (main)
3001 - apps/pet-licensing
3002 - apps/pet-insurance
3003 - apps/vet-services
3004 - apps/pet-training
300X - future apps...

4000 - services/backend (monolith)
4001 - services/user-service
4002 - services/builder-service
4003 - services/order-service
4004 - services/webhook-service
4005 - services/pet-insurance
400X - future services...
```

---

## 📁 Template to Copy

**From:** `apps/pet-licensing/`  
**To:** Your new app

**Update:**
- App name
- Port number
- Domain content

**Keep:**
- Structure
- Configuration
- Integration pattern

---

**Time:** ~20 minutes from start to integrated! 🎉

