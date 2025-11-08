# Dependency Audit & Fixes

**Date:** 2025-11-07  
**Status:** Action Required

## 🔴 Critical Issues (Must Fix)

### 1. React/Next.js Version Mismatches

**Problem:** Three different Next.js versions, mixed React versions

**Current State:**
```
next:
  - Root: ~15.2.4
  - apps/web: 15.5.4
  - apps/pet-licensing: 15.0.3

react/react-dom:
  - Root: ^19.0.0  
  - apps/web: 19.1.0
  - apps/pet-licensing: 19.0.0
```

**Fix:** Standardize on latest stable versions
```bash
# Target versions:
next@15.5.4
react@19.0.0
react-dom@19.0.0
```

### 2. Zod Version Mismatch (Breaking)

**Problem:** Major version conflict (v3 vs v4)

**Current State:**
```
zod:
  - apps/web: ^4.1.11 (v4)
  - services/backend: ^3.25.76 (v3)
  - services/builder-service: ^3.25.76 (v3)
  - services/test: ^3.22.4 (v3)
```

**Fix:** Standardize on v3 (v4 API is different)
```bash
# Downgrade apps/web to zod@^3.25.76
```

## 🟡 Medium Priority (Should Fix)

### 3. Clerk Version Mismatch

```
@clerk/nextjs:
  - Root: ^6.33.0
  - apps/web: ^6.14.6  ← Outdated
```

**Fix:** Update apps/web to ^6.33.0

### 4. tRPC Version Mismatch

```
@trpc/server:
  - Root: ^11.6.0
  - services/builder-service: ^11.0.0  ← Outdated
```

**Fix:** Update builder-service to ^11.6.0

### 5. Jest Version Mismatch

```
jest:
  - Root: ^29.7.0
  - apps/web, services/backend: ^30.2.0
```

**Fix:** Standardize on ^30.0.0 (latest)

### 6. TypeScript Minor Versions

```
typescript:
  - Most: ^5.7.2
  - apps/web: ^5  ← Too broad
```

**Fix:** Standardize on ^5.7.2

### 7. Node Types

```
@types/node:
  - Root: 18.16.9  ← Outdated
  - Others: ^20.0.0
```

**Fix:** Update root to ^20.0.0

## 🟢 Low Priority (Nice to Have)

### 8. Fastify CORS

```
@fastify/cors:
  - backend, builder-service: ^8.4.2
  - test: ^9.0.1
```

**Fix:** Update to ^9.0.1

### 9. TSX

```
tsx:
  - backend: ^4.20.6
  - builder-service, test: ^4.7.0
```

**Fix:** Update to ^4.20.6

## 🔧 Fix Commands

### Step 1: Update Root package.json

Update `/package.json`:
```json
{
  "dependencies": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "next": "15.5.4"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "jest": "^30.0.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.7.2"
  },
  "overrides": {
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "next": "15.5.4"
  }
}
```

### Step 2: Update apps/web/package.json

Critical changes:
```json
{
  "dependencies": {
    "next": "15.5.4",
    "react": "19.0.0",
    "react-dom": "19.0.0",
    "zod": "^3.25.76",  // ← Downgrade from v4
    "@clerk/nextjs": "^6.33.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.7.2"
  }
}
```

### Step 3: Update apps/pet-licensing/package.json

```json
{
  "dependencies": {
    "next": "15.5.4",
    "react": "19.0.0",
    "react-dom": "19.0.0"
  }
}
```

### Step 4: Update services/builder-service/package.json

```json
{
  "dependencies": {
    "@trpc/server": "^11.6.0",
    "zod": "^3.25.76",
    "tsx": "^4.20.6"
  }
}
```

### Step 5: Update services/backend/package.json

```json
{
  "dependencies": {
    "tsx": "^4.20.6"
  },
  "devDependencies": {
    "@types/jest": "^30.0.0",
    "@types/node": "^20.0.0",
    "jest": "^30.0.0",
    "ts-node": "^10.9.2"
  }
}
```

### Step 6: Update services/test/package.json

```json
{
  "dependencies": {
    "@fastify/cors": "^9.0.1",
    "zod": "^3.25.76",
    "tsx": "^4.20.6"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.7.2"
  }
}
```

## 🚀 Run After Manual Updates

```bash
# Clean everything
rm -rf node_modules package-lock.json
rm -rf apps/*/node_modules apps/*/package-lock.json
rm -rf services/*/node_modules services/*/package-lock.json
rm -rf libs/*/node_modules libs/*/package-lock.json

# Fresh install
npm install

# Verify no conflicts
npm ls 2>&1 | grep -i "invalid\|extraneous" || echo "✅ Clean!"

# Test dev command
npm run dev
```

## 📊 Impact Analysis

### Breaking Changes:
- **Zod v4 → v3**: May require code changes in apps/web if using v4 features
- Check for any `.safeParse()`, `.parse()` usage differences

### Non-Breaking:
- React 19.1.0 → 19.0.0: Safe (patch downgrade)
- Next.js 15.0.3/15.2.4 → 15.5.4: Safe (minor upgrade)
- Most other updates: Safe (patch/minor bumps)

## ✅ Verification Checklist

After fixes:
- [ ] All packages install without errors
- [ ] No version conflicts in `npm ls`
- [ ] `npm run dev` starts all services
- [ ] No React/Next.js errors
- [ ] Web app loads successfully
- [ ] tRPC calls work
- [ ] Tests pass

## 🔍 Future Prevention

1. **Use workspace protocol** for internal deps:
   ```json
   "dependencies": {
     "@pet/api": "workspace:*",
     "@pet/shared": "workspace:*"
   }
   ```

2. **Add to package.json engines**:
   ```json
   "engines": {
     "node": ">=20.0.0",
     "npm": ">=10.0.0",
     "react": "19.0.0",
     "next": "15.5.4"
   }
   ```

3. **Pre-commit hook**: Run `npm ls` to catch conflicts early

4. **Renovate/Dependabot**: Auto-update dependencies in sync




