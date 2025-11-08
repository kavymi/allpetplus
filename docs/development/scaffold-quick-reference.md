# Scaffold Quick Reference Card

**⚡ Quick Access:** `npm run scaffold` or `./scripts/scaffold.sh`

---

## 🎯 Quick Decision Tree

```
Need a new feature? → Answer these questions:

1. Is it frontend or backend?
   └─ Frontend → Go to #2
   └─ Backend → Go to #3

2. Frontend needs:
   ├─ Only public pages? → Pattern 1
   └─ Dashboard management? → Pattern 2

3. Backend needs:
   ├─ High traffic (>1000 req/min)? → Pattern 3
   ├─ Heavy operations? → Pattern 3
   ├─ Simple CRUD? → Pattern 4
   └─ Shared transactions? → Pattern 4
```

---

## 📋 Four Patterns At-a-Glance

| # | Pattern | When | Time | Port |
|---|---------|------|------|------|
| **1** | Landing Only | Marketing, SEO | 5 min | 300X |
| **2** | Landing + Dashboard | User features | 10 min | 300X |
| **3** | Microservice | High traffic, isolation | 10 min | 400X |
| **4** | Backend Module | Simple CRUD | 5 min | N/A |

---

## 🚀 Common Use Cases

### "Add Pet Grooming Feature"
```bash
npm run scaffold
→ Select: 2 (Landing + Dashboard)
→ Name: pet-grooming
→ Port: (suggested)
→ Description: Pet grooming scheduling

Time: 10 min | Creates: 50+ files | Port: 300X
```

### "Add Email Service"
```bash
npm run scaffold
→ Select: 3 (Backend Service)
→ Name: email-service
→ Port: (suggested)
→ Description: Transactional email service

Time: 10 min | Creates: 40+ files | Port: 400X
```

### "Add User Settings CRUD"
```bash
npm run scaffold
→ Select: 4 (Backend Module)
→ Name: user-settings
→ Description: User preferences and settings

Time: 5 min | Creates: 20+ files | No new port
```

---

## 📦 What Gets Auto-Created

### Every Pattern Includes:

✅ Complete project structure  
✅ All configuration files  
✅ Domain types in `libs/domain/`  
✅ tRPC router in `libs/api/`  
✅ Exports auto-updated  
✅ README with instructions

### Plus Pattern-Specific:

- **Pattern 1 & 2:** Next.js app, landing page, TypeScript config
- **Pattern 2:** Dashboard page for iframe embedding
- **Pattern 3:** Fastify service, Dockerfile, Docker Compose entry
- **Pattern 4:** Service class with CRUD methods

---

## ⚡ Post-Scaffold Checklist

### Immediate (2 min):
- [ ] Run `npm install` from project root
- [ ] Review generated files

### Customize (10-15 min):
- [ ] Update `libs/domain/src/lib/[name]/types.ts` with your types
- [ ] Implement `libs/api/src/routers/[name].ts` logic
- [ ] Customize landing page (Pattern 1 & 2)
- [ ] Customize dashboard page (Pattern 2 only)

### Integrate (5 min for Pattern 2):
- [ ] Create `apps/web/src/app/(dashboard)/[name]/page.tsx`
- [ ] Update `apps/web/src/components/dashboard/dashboard-nav.tsx`

### Test (5 min):
- [ ] Start dev server: `npx nx dev [name]`
- [ ] Test standalone: `http://localhost:300X`
- [ ] Test in dashboard: `http://localhost:3000/dashboard/[name]`

---

## 🎨 Port Conventions

### Frontend (300X):
```
3000 - apps/web (main)
3001 - apps/pet-licensing
3002 - apps/pet-insurance
3003 - apps/vet-services
3004+ - YOUR NEW APPS
```

### Backend (400X):
```
4000 - services/backend (main)
4002 - services/builder-service
4003+ - YOUR NEW SERVICES
```

---

## 🔍 Pattern Details

### Pattern 1: Landing Page Only

**Use When:**
- Marketing/SEO content
- Product pages
- Blog/articles
- No user-specific data

**You Get:**
- Public landing at `localhost:300X`
- Shared nav to Dashboard
- NO dashboard tab
- Complete Next.js app

**Time:** ~5 min (scaffold + customize)

---

### Pattern 2: Landing + Dashboard Tab

**Use When:**
- User features
- Data management
- Account settings
- CRUD operations

**You Get:**
- Public landing at `localhost:300X`
- Dashboard page at `localhost:300X/dashboard`
- Iframe integration needed
- Complete Next.js app

**Time:** ~10 min (scaffold + customize + integrate)

**Extra Steps:**
```typescript
// 1. Create dashboard tab
// apps/web/src/app/(dashboard)/[name]/page.tsx
export default function Tab() {
  return <iframe src="http://localhost:300X/dashboard" />;
}

// 2. Update nav
// apps/web/src/components/dashboard/dashboard-nav.tsx
{ href: '/dashboard/[name]', label: '...', icon: '🎯' }
```

---

### Pattern 3: Backend Microservice

**Use When:**
- High traffic (>1000 req/min)
- Heavy operations (images, AI, etc.)
- Independent scaling needed
- Fault isolation important

**You Get:**
- Fastify service on `localhost:400X`
- Dockerfile
- Docker Compose entry
- Health check endpoint

**Time:** ~10 min (scaffold + implement + test)

**Verify:**
```bash
curl http://localhost:400X/healthz
```

---

### Pattern 4: Backend Module

**Use When:**
- Simple CRUD (<500 req/min)
- Shared transactions
- Coupled logic
- Easier debugging preferred

**You Get:**
- Service class in `services/backend/src/modules/[name]/`
- CRUD methods template
- Runs in main backend (port 4000)

**Time:** ~5 min (scaffold + implement)

**Connect to tRPC:**
```typescript
// libs/api/src/routers/[name].ts
import { [Name]Service } from '@pet/backend/modules/[name]/service';

list: protectedProcedure.query(async ({ ctx }) => {
  const service = new [Name]Service(ctx.db);
  return service.list(ctx.userId);
});
```

---

## 💡 Tips & Tricks

### Naming Conventions
```bash
✅ GOOD: pet-grooming, pet-insurance, email-service
❌ BAD: PetGrooming, pet_insurance, emailService
```

### Port Selection
```bash
# Just press Enter to accept suggested port
Port number (suggested: 3002): [Enter]
```

### Quick Start Both Apps
```bash
# Start frontend + main dashboard
npx nx run-many --target=dev --projects=web,[your-app]

# Start all services
npm run dev
```

### Finding Generated Files
```bash
# Your app
apps/[name]/

# Domain types
libs/domain/src/lib/[name]/

# tRPC router
libs/api/src/routers/[name].ts

# Service (Pattern 3)
services/[name]/

# Module (Pattern 4)
services/backend/src/modules/[name]/
```

---

## 🆘 Quick Troubleshooting

### "Port already in use"
```bash
npm run ports:check    # See what's using ports
npm run ports:kill     # Kill all dev servers
```

### "Permission denied"
```bash
chmod +x scripts/scaffold.sh
```

### "Module not found"
```bash
npm install  # Install dependencies
```

### "TypeScript errors"
```bash
# Domain types not found
npx nx build domain shared

# Check exports
cat libs/domain/src/index.ts
cat libs/api/src/root.ts
```

---

## 📚 Learn More

- **Full Analysis:** `/docs/development/scaffold-analysis.md`
- **Detailed Guide:** `/docs/guides/scaffold-script.md`
- **Manual Alternatives:**
  - `/docs/guides/create-new-microfrontend.md`
  - `/docs/guides/create-new-microservice.md`

---

## 🎯 Real-World Examples

### Example 1: Pet Training Feature
```bash
✅ Pattern: 2 (Landing + Dashboard)
✅ Reason: Needs landing page + user training dashboard
✅ Time: ~10 minutes
✅ Port: 3004

$ npm run scaffold
Select: 2
Name: pet-training
Port: 3004
Description: Pet training programs and progress tracking

→ Customize domain types (training sessions, progress)
→ Build dashboard UI (training plan, progress charts)
→ Integrate into main dashboard
```

### Example 2: Analytics Service
```bash
✅ Pattern: 3 (Microservice)
✅ Reason: Heavy data processing, high volume
✅ Time: ~10 minutes
✅ Port: 4003

$ npm run scaffold
Select: 3
Name: analytics-service
Port: 4003
Description: User behavior analytics and reporting

→ Implement analytics aggregation logic
→ Add to Docker Compose
→ Connect via tRPC
```

### Example 3: Pet Preferences
```bash
✅ Pattern: 4 (Backend Module)
✅ Reason: Simple CRUD, low traffic, shared DB
✅ Time: ~5 minutes
✅ Port: N/A (runs in main backend)

$ npm run scaffold
Select: 4
Name: pet-preferences
Description: Pet dietary and behavioral preferences

→ Implement CRUD in service class
→ Connect to tRPC router
→ Add to existing dashboard page
```

---

## ⚡ Speed Comparison

| Task | Manual | Scaffold | Savings |
|------|--------|----------|---------|
| Frontend | 15-20 min | 2 min | **87%** |
| Microservice | 15-20 min | 2 min | **87%** |
| Module | 10-15 min | 2 min | **80%** |

**Plus:** Zero manual errors, 100% consistent patterns! 🎉

---

**Keep this handy for daily development!** 📌

