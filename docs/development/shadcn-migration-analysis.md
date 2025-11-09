# shadcn/ui Migration Analysis

**Date:** November 9, 2025  
**Status:** 🚧 In Progress - Migration Required

## Executive Summary

We have successfully integrated shadcn/ui components, but **only 1 of 25 components** is currently using them. The codebase still relies on custom-built UI components that need to be migrated to shadcn/ui for consistency, accessibility, and maintainability.

## Current State

### ✅ shadcn/ui Components Installed (8)

All properly integrated with dark theme and Radix UI primitives:

| Component | File | Status |
|-----------|------|--------|
| Button | `button-shadcn.tsx` | ✅ Installed |
| Card | `card-shadcn.tsx` | ✅ Installed |
| Dialog | `dialog.tsx` | ✅ Installed |
| Dropdown Menu | `dropdown-menu.tsx` | ✅ Installed |
| Select | `select-shadcn.tsx` | ✅ Installed |
| Tabs | `tabs-shadcn.tsx` | ✅ Installed |
| Tooltip | `tooltip-shadcn.tsx` | ✅ Installed |
| Accordion | `accordion.tsx` | ✅ Installed |

### ❌ Duplicate Custom Components (5)

These exist alongside shadcn versions and need migration:

| Old Component | shadcn Alternative | Components Using Old | Migration Priority |
|---------------|-------------------|---------------------|-------------------|
| `button.tsx` | `button-shadcn.tsx` | **18 components** | 🔴 **CRITICAL** |
| `card.tsx` | `card-shadcn.tsx` | **6 components** | 🔴 **HIGH** |
| `select.tsx` | `select-shadcn.tsx` | **Unknown** | 🟡 **MEDIUM** |
| `tabs.tsx` | `tabs-shadcn.tsx` | **Unknown** | 🟡 **MEDIUM** |
| `tooltip.tsx` | `tooltip-shadcn.tsx` | **Unknown** | 🟡 **MEDIUM** |

### ✅ Custom Components to Keep (13)

These are application-specific and should remain:

| Component | Purpose | Status |
|-----------|---------|--------|
| `ai-hint.tsx` | AI assistance UI | ✅ Keep (app-specific) |
| `alert.tsx` | Alert notifications | ⚠️ Could use shadcn Alert |
| `badge.tsx` | Status badges | ⚠️ Could use shadcn Badge |
| `breadcrumb.tsx` | Navigation | ⚠️ Could use shadcn Breadcrumb |
| `empty-state.tsx` | Empty states | ✅ Keep (app-specific) |
| `error-state.tsx` | Error states | ✅ Keep (app-specific) |
| `global-header.tsx` | App header | ✅ Keep (app-specific) |
| `input.tsx` | Form inputs | ⚠️ Could use shadcn Input |
| `loading-state.tsx` | Loading states | ✅ Keep (app-specific) |
| `modal.tsx` | Modals | 🔴 **Replace with Dialog** |
| `progress.tsx` | Progress bars | ⚠️ Could use shadcn Progress |
| `skeleton.tsx` | Loading skeletons | ⚠️ Could use shadcn Skeleton |
| `text.tsx` | Typography | ✅ Keep (app-specific) |

## Component Usage Analysis

### Button Usage (18 Components)

**All using OLD custom Button:**

```typescript
import { Button } from '@/components/ui/button'; // ❌ Custom version
```

**Files to migrate:**
1. `landing/landing-header.tsx` - 2 uses
2. `builder/saved-designs-shell.tsx` - 2 uses  
3. `catalog/catalog-shell.tsx` - 2 uses
4. `landing/builder-hero.tsx` - 2 uses
5. `ui/global-header.tsx` - 2 uses
6. `onboarding/onboarding-spotlight.tsx` - 1 use
7. `builder/summary-pane.tsx` - 1 use
8. `comparison/comparison-bar.tsx` - 1 use
9. `tracking/order-lookup-form.tsx` - 1 use
10. `cart/cart-upsell.tsx` - 1 use
11. `cart/cart-shell.tsx` - 1 use
12. `examples/trpc-designs-list.tsx` - 1 use
13. `pet/add-pet-form.tsx` - 1 use
14. `pet/pet-profile-card.tsx` - 1 use
15. `social/comparison-share.tsx` - 1 use
16. `social/share-menu.tsx` - 1 use
17. `recommendations/smart-upsell.tsx` - 1 use
18. `landing/confetti-button.tsx` - 1 use

### Card Usage (6 Components)

**All using OLD custom Card:**

```typescript
import { Card } from '@/components/ui/card'; // ❌ Custom version
```

**Files to migrate:**
1. `catalog/catalog-shell.tsx`
2. `tracking/order-lookup-form.tsx`
3. `cart/cart-shell.tsx`
4. `examples/trpc-designs-list.tsx`
5. `pet/add-pet-form.tsx`
6. `pet/pet-profile-card.tsx`

### Only shadcn User (1 Component) ✅

**Correctly using shadcn:**
- `examples/shadcn-showcase.tsx` ✅

## API Comparison

### Button API Differences

#### Custom Button (OLD)
```typescript
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;      // ⭐ Custom feature
  fullWidth?: boolean;    // ⭐ Custom feature
  animated?: boolean;     // ⭐ Custom feature (framer-motion)
  asChild?: boolean;
}
```

#### shadcn Button (NEW)
```typescript
interface ButtonProps {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  asChild?: boolean;
}
```

**Migration Strategy:**
- Map `variant="primary"` → `variant="default"`
- Map `variant="danger"` → `variant="destructive"`  
- Implement `loading` and `fullWidth` as wrapper/className
- Remove framer-motion animations (or extend shadcn Button)

### Card API Differences

#### Custom Card (OLD)
```typescript
interface CardProps {
  variant?: 'default' | 'elevated' | 'outlined' | 'ghost';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;  // ⭐ Custom feature
  animated?: boolean;     // ⭐ Custom feature (framer-motion)
  as?: React.ElementType;
}
```

#### shadcn Card (NEW)
```typescript
// Simple div-based component with subcomponents
Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
```

**Migration Strategy:**
- Use `className` for custom padding/variants
- Remove framer-motion animations
- Use composition with CardHeader/CardContent/CardFooter

## Export Strategy Issue

### Current Problem

`/apps/web/src/components/ui/index.ts` exports OLD components:

```typescript
export { Button } from './button';  // ❌ Custom version
export { Card } from './card';      // ❌ Custom version
export { Select } from './select';  // ❌ Custom version
export { Tabs } from './tabs';      // ❌ Custom version
export { Tooltip } from './tooltip'; // ❌ Custom version
```

This means any code importing from index gets the old components!

### Solution

Update `index.ts` to export shadcn versions by default:

```typescript
// Export shadcn components as primary
export { Button, buttonVariants } from './button-shadcn';
export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from './card-shadcn';
export { 
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './dialog';
// ... etc
```

## Migration Plan

### Phase 1: Critical - Button Migration (Est: 4-6 hours)

**Priority:** 🔴 **CRITICAL** - 18 components affected

1. **Create enhanced shadcn Button** (1 hour)
   - Extend `button-shadcn.tsx` to support `loading` prop
   - Add `fullWidth` support via className
   - Maintain variant mapping

2. **Update index.ts** (5 minutes)
   - Export shadcn Button as default

3. **Migrate components** (3-4 hours)
   - Update all 18 component imports
   - Adjust variant names where needed
   - Test each component

4. **Remove old Button** (5 minutes)
   - Delete `button.tsx` after migration

### Phase 2: High - Card Migration (Est: 2-3 hours)

**Priority:** 🔴 **HIGH** - 6 components affected

1. **Update index.ts** (5 minutes)
   - Export shadcn Card components

2. **Migrate components** (2 hours)
   - Update 6 component imports
   - Refactor to use CardHeader/CardContent/CardFooter
   - Adjust className for styling

3. **Remove old Card** (5 minutes)
   - Delete `card.tsx` after migration

### Phase 3: Medium - Other Duplicates (Est: 2-3 hours)

**Priority:** 🟡 **MEDIUM**

1. **Select Migration** (1 hour)
   - Identify usage
   - Migrate to shadcn Select
   - Remove old component

2. **Tabs Migration** (1 hour)
   - Identify usage
   - Migrate to shadcn Tabs
   - Remove old component

3. **Tooltip Migration** (30 minutes)
   - Identify usage
   - Migrate to shadcn Tooltip
   - Remove old component

### Phase 4: Add Missing shadcn Components (Est: 2-4 hours)

**Priority:** 🟢 **LOW** - Nice to have

Consider adding these shadcn components:

| Component | Use Case | Priority |
|-----------|----------|----------|
| Alert | Replace custom alert.tsx | Medium |
| Badge | Replace custom badge.tsx | Medium |
| Input | Replace custom input.tsx | Medium |
| Progress | Replace custom progress.tsx | Low |
| Skeleton | Replace custom skeleton.tsx | Low |
| Breadcrumb | Replace custom breadcrumb.tsx | Low |
| Label | Form labels | Low |
| Checkbox | Form checkboxes | Low |
| Radio Group | Form radios | Low |
| Switch | Toggle switches | Low |
| Textarea | Form textareas | Low |
| Popover | Replace custom modal.tsx | Low |

## Testing Requirements

### Per Component Migration

- [ ] Visual regression testing
- [ ] Interaction testing (click, hover, focus)
- [ ] Accessibility testing (keyboard nav, screen readers)
- [ ] Responsive design testing
- [ ] Dark theme verification

### Critical Pages to Test

1. **Builder** - Uses Button extensively
2. **Catalog** - Uses Button and Card
3. **Landing** - Uses Button
4. **Dashboard** - Uses various components
5. **Cart** - Uses Button and Card

## Risk Assessment

### High Risk ⚠️

**Button Migration:**
- **Risk:** 18 components could break
- **Mitigation:** Create wrapper that maintains old API
- **Fallback:** Keep old button.tsx temporarily

**Visual Consistency:**
- **Risk:** Design might look different
- **Mitigation:** Carefully map styles with className
- **Fallback:** Extend shadcn components with framer-motion

### Medium Risk ⚠️

**API Changes:**
- **Risk:** Props don't match 1:1
- **Mitigation:** Create compatibility layer
- **Fallback:** Keep old components as legacy

### Low Risk ✅

**Type Safety:**
- **Risk:** TypeScript errors
- **Mitigation:** shadcn is fully typed
- **Fallback:** None needed

## Success Metrics

### Completion Criteria

- [ ] All 18 Button usages migrated to shadcn
- [ ] All 6 Card usages migrated to shadcn
- [ ] All duplicate components removed
- [ ] index.ts exports shadcn by default
- [ ] No visual regressions
- [ ] All tests passing
- [ ] Accessibility maintained/improved

### Performance Metrics

- [ ] Bundle size reduced (no framer-motion duplication)
- [ ] Consistent animation performance
- [ ] No new runtime errors

### Code Quality Metrics

- [ ] Single source of truth for UI components
- [ ] Consistent API across codebase
- [ ] Better accessibility (Radix UI primitives)
- [ ] Easier to maintain (community-supported)

## Timeline

| Phase | Duration | Completion Date |
|-------|----------|----------------|
| Phase 1: Button | 4-6 hours | TBD |
| Phase 2: Card | 2-3 hours | TBD |
| Phase 3: Other Duplicates | 2-3 hours | TBD |
| Phase 4: New Components | 2-4 hours | TBD |
| **Total** | **10-16 hours** | **TBD** |

## Recommendation

### Immediate Action Required

1. ✅ **Start with Button migration** - Highest impact (18 components)
2. ✅ **Extend shadcn Button** to support loading/fullWidth
3. ✅ **Test thoroughly** before removing old components
4. ✅ **Document migration** for team reference

### Best Practice Going Forward

- **Default to shadcn** - Always use shadcn components for new features
- **Custom only when needed** - Only create custom components for unique app needs
- **Extend shadcn** - If shadcn is close but missing features, extend it
- **Document exceptions** - If custom component is needed, document why

---

**Next Steps:** Proceed with Phase 1 (Button Migration)?

