# shadcn/ui Migration Summary

**Date:** November 9, 2025  
**Current Status:** 🔴 **CRITICAL - Migration Required**

## 🚨 Key Finding

**Only 1 of 25 components (4%) is using shadcn/ui.**

The rest of the codebase is using custom-built components that duplicate shadcn functionality.

## Current Situation

```
┌─────────────────────────────────────────────────┐
│  UI Component Status                            │
├─────────────────────────────────────────────────┤
│  ✅ Using shadcn:        1 component  (  4%)    │
│  ❌ Using custom:       24 components ( 96%)    │
│  📦 Duplicate files:     5 components           │
│  🔨 Files to migrate:  24+ files                │
└─────────────────────────────────────────────────┘
```

## Component Breakdown

### 🔴 CRITICAL: Button (18 components affected)

```
Custom Button (button.tsx) is used in:
├─ landing/landing-header.tsx
├─ builder/saved-designs-shell.tsx
├─ catalog/catalog-shell.tsx
├─ landing/builder-hero.tsx
├─ ui/global-header.tsx
├─ onboarding/onboarding-spotlight.tsx
├─ builder/summary-pane.tsx
├─ comparison/comparison-bar.tsx
├─ tracking/order-lookup-form.tsx
├─ cart/cart-upsell.tsx
├─ cart/cart-shell.tsx
├─ examples/trpc-designs-list.tsx
├─ pet/add-pet-form.tsx
├─ pet/pet-profile-card.tsx
├─ social/comparison-share.tsx
├─ social/share-menu.tsx
├─ recommendations/smart-upsell.tsx
└─ landing/confetti-button.tsx

shadcn Button (button-shadcn.tsx) is used in:
└─ examples/shadcn-showcase.tsx ✅
```

### 🟡 HIGH: Card (6 components affected)

```
Custom Card (card.tsx) is used in:
├─ catalog/catalog-shell.tsx
├─ tracking/order-lookup-form.tsx
├─ cart/cart-shell.tsx
├─ examples/trpc-designs-list.tsx
├─ pet/add-pet-form.tsx
└─ pet/pet-profile-card.tsx

shadcn Card (card-shadcn.tsx) is used in:
└─ examples/shadcn-showcase.tsx ✅
```

### 🟢 Other Duplicates

- **Select**: `select.tsx` vs `select-shadcn.tsx`
- **Tabs**: `tabs.tsx` vs `tabs-shadcn.tsx`
- **Tooltip**: `tooltip.tsx` vs `tooltip-shadcn.tsx`

## Why This Matters

### ❌ Problems with Current Approach

1. **Duplicate Code** - Maintaining two versions of the same component
2. **Inconsistent UX** - Different behaviors across the app
3. **No Accessibility** - Custom components missing WCAG AA features
4. **Technical Debt** - Custom solutions when standard exists
5. **Bundle Size** - Shipping both custom + shadcn code

### ✅ Benefits of Migration

1. **Single Source of Truth** - One Button, one Card, one Select
2. **Better Accessibility** - Radix UI primitives built-in
3. **Community Support** - Well-tested, documented components
4. **Consistent Design** - All components use same system
5. **Easier Maintenance** - Follow shadcn updates

## Migration Priority

```
Priority  | Component | Files | Est. Time | Impact
----------|-----------|-------|-----------|--------
🔴 CRITICAL | Button    | 18    | 4-6 hrs   | High
🔴 HIGH     | Card      | 6     | 2-3 hrs   | High
🟡 MEDIUM   | Select    | TBD   | 1 hr      | Medium
🟡 MEDIUM   | Tabs      | TBD   | 1 hr      | Medium
🟡 MEDIUM   | Tooltip   | TBD   | 30 min    | Low
----------|-----------|-------|-----------|--------
TOTAL     |           | 24+   | 10-16 hrs |
```

## Quick Comparison

### Custom Button vs shadcn Button

| Feature | Custom | shadcn | Migration |
|---------|--------|--------|-----------|
| **Variants** | primary, secondary, ghost, outline, danger | default, destructive, outline, secondary, ghost, link | ✅ Easy mapping |
| **Sizes** | sm, md, lg | default, sm, lg, icon | ✅ Easy mapping |
| **Loading** | ✅ Built-in | ❌ Need to add | ⚠️ Extend component |
| **FullWidth** | ✅ Built-in | ❌ Use className | ✅ Simple fix |
| **Animations** | ✅ Framer Motion | ❌ None | ⚠️ Optional |
| **Accessibility** | ⚠️ Basic | ✅ WCAG AA | ✅ Improvement |
| **TypeScript** | ✅ Typed | ✅ Fully typed | ✅ No issues |

### Custom Card vs shadcn Card

| Feature | Custom | shadcn | Migration |
|---------|--------|--------|-----------|
| **Variants** | default, elevated, outlined, ghost | Simple div | ✅ Use className |
| **Padding** | none, sm, md, lg | Fixed | ✅ Use className |
| **Interactive** | ✅ Built-in | ❌ Manual | ✅ Add className |
| **Animations** | ✅ Framer Motion | ❌ None | ⚠️ Optional |
| **Structure** | Single component | Header/Content/Footer | ⚠️ Refactor needed |
| **Accessibility** | ⚠️ Basic | ✅ Semantic HTML | ✅ Improvement |

## Recommended Action Plan

### Immediate (This Week)

```bash
# 1. Extend shadcn Button to support custom features
✅ Add loading prop
✅ Add fullWidth prop  
✅ Map old variant names

# 2. Update default exports
✅ Update ui/index.ts to export shadcn Button

# 3. Migrate high-traffic components first
✅ Landing page (builder-hero, landing-header)
✅ Global header
✅ Builder (saved-designs, summary-pane)
✅ Catalog

# Total: ~6-8 hours
```

### Short-term (Next Week)

```bash
# 1. Complete Button migration
✅ Migrate remaining 10-14 components
✅ Remove old button.tsx
✅ Test all pages

# 2. Start Card migration
✅ Update ui/index.ts
✅ Migrate 6 components
✅ Remove old card.tsx

# Total: ~4-6 hours
```

### Medium-term (Next 2 Weeks)

```bash
# 1. Migrate other duplicates
✅ Select, Tabs, Tooltip

# 2. Add missing shadcn components
✅ Alert, Badge, Input
✅ Progress, Skeleton, Breadcrumb

# Total: ~4-6 hours
```

## Files Created

1. **Migration Analysis** - `/docs/development/shadcn-migration-analysis.md`
   - Complete component inventory
   - API comparison
   - Risk assessment
   - Detailed migration strategy

2. **Migration Tracker** - `/docs/development/shadcn-migration-tracker.md`
   - Task checklist
   - Progress tracking
   - Testing checklist
   - Timeline

3. **This Summary** - `/docs/development/SHADCN_MIGRATION_SUMMARY.md`
   - Quick overview
   - Key findings
   - Action items

## Next Steps

### Option A: Start Migration Now

**Pros:**
- Fix duplicate code issue immediately
- Improve accessibility now
- Clean up technical debt

**Cons:**
- Requires 10-16 hours of focused work
- Risk of visual regressions
- Need thorough testing

### Option B: Gradual Migration

**Pros:**
- Less risk per change
- Can test thoroughly between phases
- Team can adapt slowly

**Cons:**
- Longer timeline (2-3 weeks)
- Duplicates persist during migration
- More merge conflicts

### Option C: Keep Both (Not Recommended)

**Pros:**
- No migration needed
- No risk of breaking changes

**Cons:**
- ❌ Permanent technical debt
- ❌ Duplicate code maintenance
- ❌ Inconsistent UX
- ❌ Poor accessibility
- ❌ Larger bundle size

## Recommendation

**Start with Button Migration (Phase 1)** - Focus on the highest impact component first.

1. **Extend shadcn Button** - Add missing features (1 hour)
2. **Migrate landing + header** - Most visible components (2 hours)
3. **Migrate remaining** - All other Button usage (3-4 hours)
4. **Test thoroughly** - All pages (1 hour)

**Total: ~6-8 hours for massive improvement**

---

**Questions?** See detailed analysis in:
- `/docs/development/shadcn-migration-analysis.md`
- `/docs/development/shadcn-migration-tracker.md`

