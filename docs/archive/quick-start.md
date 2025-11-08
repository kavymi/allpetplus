# Quick Start Guide - Get Running in 5 Minutes

**Time Required:** 5 minutes  
**Prerequisites:** Node 20+, npm 10+

---

## 🚀 Fastest Path to Running

### 1. Install Dependencies (1 min)
```bash
npm install
```

### 2. Setup Environment (1 min)
```bash
# Run automated setup
./scripts/setup-env.sh

# This creates:
# - apps/web/.env.local
# - services/backend/.env
```

### 3. Get Clerk Keys (2 min)
```bash
# Visit: https://dashboard.clerk.com/
# Create app → Copy API keys

# Paste into apps/web/.env.local:
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Paste into services/backend/.env:
CLERK_SECRET_KEY=sk_test_...
```

### 4. Get Shopify Keys (Optional - 2 min)
```bash
# Visit: https://admin.shopify.com/
# Settings → Apps → Develop apps

# Paste into apps/web/.env.local:
NEXT_PUBLIC_SHOPIFY_STOREFRONT_ENDPOINT=https://...
NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN=...
```

### 5. Start Development (10 sec)
```bash
npm run dev
```

**Visit:** http://localhost:3000 🎉

---

## ⚡ Super Quick (Skip Shopify)

If you want to run WITHOUT Shopify:

```bash
npm install
./scripts/setup-env.sh
# Add ONLY Clerk keys to .env.local
npm run dev
```

**Time:** 3 minutes!

---

## 📋 What You Get

### Running Services:
- ✅ Frontend: http://localhost:3000
- ✅ Dashboard: http://localhost:3000/dashboard
- ✅ Pet Management: http://localhost:3000/dashboard/pets
- ✅ Pet Licensing: http://localhost:3001 (if started)

### Working Features:
- ✅ Authentication (Clerk)
- ✅ Pet Profiles
- ✅ Design Builder (with/without Shopify)
- ✅ Dashboard
- ✅ tRPC APIs

---

## 🐛 Troubleshooting

### Issue: "Missing environment variable"
**Solution:** Check the specific .env.local file and add the variable

### Issue: "Database connection failed"
**Solution:** Start Postgres:
```bash
docker-compose up postgres
```

### Issue: "Redis connection failed"
**Solution:** Start Redis:
```bash
docker-compose up redis
```

---

## 📚 Next Steps

1. **Add more Clerk/Shopify configs** - See `/docs/guides/environment-setup.md`
2. **Setup database** - See `/docs/guides/database-setup.md`
3. **Explore architecture** - See `/docs/architecture/`
4. **Create new services** - See `/docs/guides/CREATE_NEW_MICROFRONTEND.md`

---

**You're up and running!** 🎉
