# User/Pet Dashboard - Architecture Decision

**Question:** Should the user/pet dashboard be a separate microservice (frontend + backend)?  
**Date:** October 8, 2025  
**Decision:** **Keep in main web app, pet module in modular backend** (for now)

---

## 🎯 Analysis

### Frontend: Separate App vs. Routes in Main App

#### Option A: Separate App (`apps/dashboard/`)
```
apps/
├── web/              # Public storefront
└── dashboard/        # 🆕 User dashboard
```

**When to choose:**
- ✅ Completely different UX/design system
- ✅ Different authentication (e.g., admin vs customer)
- ✅ Different deployment cadence
- ✅ Separate team ownership
- ✅ Want to deploy independently

**Trade-offs:**
- ⚠️ Code duplication (components, utilities)
- ⚠️ More complex deployment
- ⚠️ Harder to share layouts/navigation
- ⚠️ Higher maintenance burden

#### Option B: Routes in Main App (`apps/web/src/app/dashboard/`)
```
apps/web/src/app/
├── (public)/         # Marketing pages
├── (builder)/        # Builder flow
├── (dashboard)/      # 🆕 User dashboard
└── layout.tsx        # Shared layout
```

**When to choose:**
- ✅ Same users, same auth (Clerk)
- ✅ Shared design system
- ✅ Can reuse components
- ✅ Simpler deployment
- ✅ Shared navigation

**Trade-offs:**
- ⚠️ Single deployment (but usually fine)
- ⚠️ Can't deploy dashboard independently (usually not needed)

### Backend: Separate Service vs. Module

#### Option A: Separate Pet Service (`services/pet-service/`)
```
services/
├── backend/          # Main API
└── pet-service/      # 🆕 Pet management
```

**When to choose:**
- ✅ High traffic (>1000 req/min)
- ✅ Different scaling needs
- ✅ Separate team ownership
- ✅ Different technology stack
- ✅ Complex pet-related business logic

**Trade-offs:**
- ⚠️ More complex deployment
- ⚠️ Service communication overhead
- ⚠️ Distributed transactions
- ⚠️ Higher infrastructure cost

#### Option B: Pet Module in Backend (`services/backend/src/modules/pet/`)
```
services/backend/src/modules/
├── builder/
├── pet/              # ✅ Pet management
├── order/
└── user/
```

**When to choose:**
- ✅ Moderate traffic (<500 req/min)
- ✅ Tightly coupled with user management
- ✅ Shares database transactions
- ✅ Simpler to debug
- ✅ Lower infrastructure cost

---

## 📊 Traffic & Complexity Analysis

### User/Pet Dashboard Expected Traffic:

| Feature | Requests/Min | Complexity | CPU | Memory |
|---------|--------------|------------|-----|--------|
| List pets | Low (~10) | Low | Low | Low |
| View pet details | Low (~20) | Low | Low | Low |
| Add/edit pet | Very Low (~2) | Low | Low | Low |
| Upload photos | Low (~5) | Medium | Medium | Medium |
| Upload documents | Very Low (~1) | Low | Low | Medium |

**Assessment:** **Low to moderate traffic, not CPU intensive**

### Comparison to Other Features:

| Feature | Traffic | Extract? |
|---------|---------|----------|
| **Builder** | High (500+/min) | ✅ Yes - High traffic |
| **Webhooks** | Spiky (0-1000/min) | ✅ Yes - Auto-scale |
| **Pet Dashboard** | Low (50/min) | ❌ No - Keep in app |
| **Orders** | Medium (100/min) | ⏸️ Later |

---

## 🎯 Recommendation

### **Frontend: Keep in main web app** ✅

**Why:**
1. **Same users** - Authenticated customers
2. **Same design system** - Reuse components
3. **Shared layout** - Header, navigation, footer
4. **Simpler** - One deployment, one codebase
5. **Cost-effective** - No duplicate infrastructure

**Implementation:**
```
apps/web/src/app/
└── (dashboard)/              # Route group
    ├── layout.tsx            # Dashboard layout
    ├── page.tsx              # Dashboard home
    ├── pets/
    │   ├── page.tsx          # ✅ Already created!
    │   ├── [id]/
    │   │   └── page.tsx      # Pet details
    │   └── new/
    │       └── page.tsx      # Add pet
    └── settings/
        └── page.tsx          # User settings
```

### **Backend: Keep in modular backend** ✅

**Why:**
1. **Low traffic** - Doesn't justify separate service
2. **Coupled with users** - Shares user profile logic
3. **Shared transactions** - User + Pet in one DB transaction
4. **Simpler** - No service communication needed
5. **Can extract later** - Module is isolated, ready if needed

**Current:**
```
services/backend/src/modules/
└── pet/                      # ✅ Already created!
    ├── service.ts            # Business logic
    └── routes.ts             # HTTP endpoints (if needed)
```

---

## 🚀 Recommended Implementation

### Create Dashboard in Main App (Not Separate Service)

**Benefits:**
- ✅ Faster development
- ✅ Reuse existing components
- ✅ Shared authentication
- ✅ Lower complexity
- ✅ One deployment
- ✅ Can extract later if needed

**When to extract:**
- Dashboard traffic > 1000 req/min
- Need different tech stack
- Separate team owns it
- Want independent deployment

---

## 💡 Decision Framework

### Extract to Separate Frontend App When:
- [ ] **Different UX** - Completely different design
- [ ] **Different users** - Admin vs Customer vs Partner
- [ ] **Independent deploy** - Need separate release cycles
- [ ] **Team ownership** - Different team builds/maintains
- [ ] **Technology** - Needs different framework

### Keep in Main App When:
- [x] **Same users** - Authenticated customers ✅
- [x] **Same design** - Shared component library ✅
- [x] **Shared layout** - Header, nav, footer ✅
- [x] **Simple auth** - Same Clerk setup ✅
- [x] **Low traffic** - Doesn't justify separation ✅

**Score: 5/5 - Keep in main app!**

### Extract to Separate Backend Service When:
- [ ] **High traffic** - >1000 req/min
- [ ] **Different scaling** - CPU/memory needs differ
- [ ] **Team ownership** - Separate team
- [ ] **Technology** - Different stack would help
- [ ] **Independent deploy** - Frequent updates

### Keep in Modular Backend When:
- [x] **Low traffic** - <500 req/min ✅
- [x] **Coupled logic** - Shares transactions ✅
- [x] **Simple ops** - Easier to debug ✅
- [x] **Cost** - Lower infrastructure cost ✅
- [x] **Can extract later** - Module is isolated ✅

**Score: 5/5 - Keep in modular backend!**

---

## ✅ Final Decision

### Frontend Architecture:
```
apps/web/src/app/
├── (public)/                # Marketing
├── (builder)/               # Builder flow
├── (catalog)/               # Products
├── (dashboard)/             # ✨ User dashboard (NEW)
│   ├── page.tsx            # Dashboard home
│   ├── pets/               # Pet management
│   ├── orders/             # Order history
│   ├── designs/            # Saved designs
│   └── settings/           # User settings
└── layout.tsx              # Shared across all
```

**Decision:** ✅ **Keep in main web app** (not separate)

### Backend Architecture:
```
services/backend/src/modules/
├── builder/                 # Design CRUD
├── pet/                     # ✅ Pet management (already created)
├── order/                   # Order tracking
└── user/                    # User settings
```

**Decision:** ✅ **Keep in modular backend** (not separate service)

---

## 🎯 What This Means

**You get:**
- ✅ Fast development (reuse everything)
- ✅ Simple deployment (one app)
- ✅ Lower cost (no extra services)
- ✅ Easy debugging (one codebase)
- ✅ Future flexibility (can extract if needed)

**You avoid:**
- ❌ Over-engineering (premature optimization)
- ❌ Code duplication
- ❌ Complex service communication
- ❌ Higher infrastructure cost

---

**Next:** Let me implement the complete dashboard in the main web app!

**Related:**
- `/docs/architecture/microservices-architecture.md` - When to microservice
- `/docs/architecture/hybrid-architecture-implementation.md` - Modular approach

