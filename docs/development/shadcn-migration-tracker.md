# shadcn/ui Migration Tracker

**Started:** November 9, 2025  
**Status:** 🔴 Not Started  
**Progress:** 1/25 components (4%)

## Quick Stats

| Metric | Count | Percentage |
|--------|-------|------------|
| **Total Components** | 25 | 100% |
| **Using shadcn** | 1 | 4% |
| **Using Custom** | 24 | 96% |
| **Duplicates to Remove** | 5 | - |
| **Files to Migrate** | 24+ | - |

## Phase 1: Button Migration 🔴 NOT STARTED

**Priority:** CRITICAL  
**Estimated Time:** 4-6 hours  
**Status:** 🔴 Not Started

### Components to Migrate (18)

| # | Component | File | Lines | Status |
|---|-----------|------|-------|--------|
| 1 | Landing Header | `landing/landing-header.tsx` | ~2 uses | ⬜ Not Started |
| 2 | Saved Designs | `builder/saved-designs-shell.tsx` | ~2 uses | ⬜ Not Started |
| 3 | Catalog | `catalog/catalog-shell.tsx` | ~2 uses | ⬜ Not Started |
| 4 | Builder Hero | `landing/builder-hero.tsx` | ~2 uses | ⬜ Not Started |
| 5 | Global Header | `ui/global-header.tsx` | ~2 uses | ⬜ Not Started |
| 6 | Onboarding | `onboarding/onboarding-spotlight.tsx` | ~1 use | ⬜ Not Started |
| 7 | Summary Pane | `builder/summary-pane.tsx` | ~1 use | ⬜ Not Started |
| 8 | Comparison Bar | `comparison/comparison-bar.tsx` | ~1 use | ⬜ Not Started |
| 9 | Order Lookup | `tracking/order-lookup-form.tsx` | ~1 use | ⬜ Not Started |
| 10 | Cart Upsell | `cart/cart-upsell.tsx` | ~1 use | ⬜ Not Started |
| 11 | Cart Shell | `cart/cart-shell.tsx` | ~1 use | ⬜ Not Started |
| 12 | tRPC Example | `examples/trpc-designs-list.tsx` | ~1 use | ⬜ Not Started |
| 13 | Add Pet Form | `pet/add-pet-form.tsx` | ~1 use | ⬜ Not Started |
| 14 | Pet Profile | `pet/pet-profile-card.tsx` | ~1 use | ⬜ Not Started |
| 15 | Comparison Share | `social/comparison-share.tsx` | ~1 use | ⬜ Not Started |
| 16 | Share Menu | `social/share-menu.tsx` | ~1 use | ⬜ Not Started |
| 17 | Smart Upsell | `recommendations/smart-upsell.tsx` | ~1 use | ⬜ Not Started |
| 18 | Confetti Button | `landing/confetti-button.tsx` | ~1 use | ⬜ Not Started |

### Tasks

- [ ] **Task 1.1:** Extend shadcn Button with `loading` prop
- [ ] **Task 1.2:** Add `fullWidth` support via className helper
- [ ] **Task 1.3:** Update `ui/index.ts` to export shadcn Button
- [ ] **Task 1.4:** Migrate all 18 components (see table above)
- [ ] **Task 1.5:** Test all migrated components
- [ ] **Task 1.6:** Remove old `button.tsx`
- [ ] **Task 1.7:** Update documentation

## Phase 2: Card Migration 🔴 NOT STARTED

**Priority:** HIGH  
**Estimated Time:** 2-3 hours  
**Status:** 🔴 Not Started

### Components to Migrate (6)

| # | Component | File | Status |
|---|-----------|------|--------|
| 1 | Catalog | `catalog/catalog-shell.tsx` | ⬜ Not Started |
| 2 | Order Lookup | `tracking/order-lookup-form.tsx` | ⬜ Not Started |
| 3 | Cart Shell | `cart/cart-shell.tsx` | ⬜ Not Started |
| 4 | tRPC Example | `examples/trpc-designs-list.tsx` | ⬜ Not Started |
| 5 | Add Pet Form | `pet/add-pet-form.tsx` | ⬜ Not Started |
| 6 | Pet Profile | `pet/pet-profile-card.tsx` | ⬜ Not Started |

### Tasks

- [ ] **Task 2.1:** Update `ui/index.ts` to export shadcn Card
- [ ] **Task 2.2:** Migrate all 6 components
- [ ] **Task 2.3:** Refactor to use CardHeader/CardContent/CardFooter
- [ ] **Task 2.4:** Test all migrated components
- [ ] **Task 2.5:** Remove old `card.tsx`

## Phase 3: Select Migration 🔴 NOT STARTED

**Priority:** MEDIUM  
**Estimated Time:** 1 hour  
**Status:** 🔴 Not Started

### Tasks

- [ ] **Task 3.1:** Identify all Select usages
- [ ] **Task 3.2:** Update `ui/index.ts` to export shadcn Select
- [ ] **Task 3.3:** Migrate all components
- [ ] **Task 3.4:** Remove old `select.tsx`

## Phase 4: Tabs Migration 🔴 NOT STARTED

**Priority:** MEDIUM  
**Estimated Time:** 1 hour  
**Status:** 🔴 Not Started

### Tasks

- [ ] **Task 4.1:** Identify all Tabs usages
- [ ] **Task 4.2:** Update `ui/index.ts` to export shadcn Tabs
- [ ] **Task 4.3:** Migrate all components
- [ ] **Task 4.4:** Remove old `tabs.tsx`

## Phase 5: Tooltip Migration 🔴 NOT STARTED

**Priority:** MEDIUM  
**Estimated Time:** 30 minutes  
**Status:** 🔴 Not Started

### Tasks

- [ ] **Task 5.1:** Identify all Tooltip usages
- [ ] **Task 5.2:** Update `ui/index.ts` to export shadcn Tooltip
- [ ] **Task 5.3:** Migrate all components
- [ ] **Task 5.4:** Remove old `tooltip.tsx`

## Phase 6: Add Missing shadcn Components 🔴 NOT STARTED

**Priority:** LOW  
**Estimated Time:** 2-4 hours  
**Status:** 🔴 Not Started

### Components to Add

- [ ] Alert (replace custom alert.tsx)
- [ ] Badge (replace custom badge.tsx)
- [ ] Input (replace custom input.tsx)
- [ ] Progress (replace custom progress.tsx)
- [ ] Skeleton (replace custom skeleton.tsx)
- [ ] Breadcrumb (replace custom breadcrumb.tsx)
- [ ] Label
- [ ] Checkbox
- [ ] Radio Group
- [ ] Switch
- [ ] Textarea
- [ ] Popover

## Testing Checklist

### Per Component

- [ ] Visual appearance matches design
- [ ] Hover states work correctly
- [ ] Click interactions work
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Accessibility (screen reader tested)
- [ ] Responsive on mobile
- [ ] Dark theme looks correct

### Critical Pages

- [ ] **Landing Page** - Hero, header, CTA buttons
- [ ] **Builder** - All builder UI
- [ ] **Catalog** - Product cards, filters
- [ ] **Cart** - Cart items, checkout button
- [ ] **Dashboard** - Navigation, cards

## Known Issues

### Current Blockers

- None

### Migration Challenges

- **Framer Motion Animations**: Custom components use framer-motion, shadcn doesn't
- **Loading States**: Custom Button has loading prop, shadcn doesn't
- **API Differences**: Variant names differ between custom and shadcn

### Solutions

- Extend shadcn components to add missing features
- Create compatibility layer for prop mapping
- Document any breaking changes

## Rollback Plan

If migration causes issues:

1. Keep old components as `button-legacy.tsx`, `card-legacy.tsx`
2. Revert index.ts exports
3. Update imports back to legacy components
4. File issues for investigation

## Documentation Updates

- [ ] Update `/docs/development/code-patterns.md`
- [ ] Update `/docs/development/shadcn-ui-integration.md`
- [ ] Update `/docs/development/shadcn-quick-reference.md`
- [ ] Add migration guide for future reference
- [ ] Update component showcase

## Timeline

| Phase | Start Date | End Date | Status |
|-------|-----------|----------|--------|
| Phase 1: Button | TBD | TBD | ⬜ Not Started |
| Phase 2: Card | TBD | TBD | ⬜ Not Started |
| Phase 3: Select | TBD | TBD | ⬜ Not Started |
| Phase 4: Tabs | TBD | TBD | ⬜ Not Started |
| Phase 5: Tooltip | TBD | TBD | ⬜ Not Started |
| Phase 6: New Components | TBD | TBD | ⬜ Not Started |

## Progress Metrics

```
Button:    ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  0/18 (0%)
Card:      ⬜⬜⬜⬜⬜⬜  0/6 (0%)
Select:    ⬜  0/? (0%)
Tabs:      ⬜  0/? (0%)
Tooltip:   ⬜  0/? (0%)

Overall:   ⬜⬜⬜⬜⬜⬜⬜⬜⬜⬜  4% Complete
```

---

**Last Updated:** November 9, 2025  
**Updated By:** AI Assistant

