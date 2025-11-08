# Saved Designs Page

## Overview

The `/saved` page displays a user's saved custom harness designs with full CRUD functionality through tRPC API.

## Implementation

### Files Created

1. **`/apps/web/src/app/(builder)/saved/page.tsx`**
   - Next.js page route for `/saved`
   - Server component with metadata
   - Renders `SavedDesignsShell` client component

2. **`/apps/web/src/components/builder/saved-designs-shell.tsx`**
   - Client component using tRPC for data fetching
   - Displays grid of saved design cards
   - Handles authentication state (SignedIn/SignedOut)
   - Full CRUD operations (view, edit, delete)

### Features

#### Authentication Integration
- Uses Clerk's `<SignedIn>` and `<SignedOut>` components
- Shows sign-in prompt for unauthenticated users
- Protects design data with user-specific queries

#### Design Display
- Grid layout (responsive: 1/2/3 columns)
- Design cards show:
  - Thumbnail/preview image
  - Design name (or "Untitled Design")
  - Last updated date
  - Status badge (Draft/Active/Archived)
  - Edit and Delete actions

#### Empty States
- **No designs**: Prompts user to start building
- **Not signed in**: Shows sign-in call-to-action
- Loading and error states with retry capability

#### Actions
- **Edit**: Navigates to `/builder/{designId}` to continue editing
- **Delete**: Soft delete with confirmation dialog
- **Create New**: Button to start new design

### tRPC API Integration

Uses the following tRPC procedures from `libs/api/src/routers/designs.ts`:

```typescript
// List designs
trpc.designs.list.useQuery({
  status: undefined,  // or 'DRAFT' | 'ACTIVE' | 'ARCHIVED'
  limit: 50,
})

// Delete design
trpc.designs.delete.useMutation({
  onSuccess: () => refetch(),
})
```

### UI Components Used

- `LoadingState` - Shows loading spinner with message
- `ErrorState` - Displays error with retry action
- `EmptyState` - Illustrated empty states
- `Button` - Primary and outline variants
- `SignInButton` (Clerk) - Modal sign-in trigger

### Layout

The page uses the builder layout (`(builder)` route group), which includes:
- Header with logo and "Create New Design" button
- Full-width layout with max-w-7xl container
- Consistent styling with other builder pages

## User Flow

1. **User visits `/saved`**
   - If not signed in → Show sign-in prompt
   - If signed in → Load designs via tRPC

2. **User sees their designs**
   - Designs displayed in grid
   - Each card shows preview, name, date, status

3. **User clicks "Edit Design"**
   - Navigates to `/builder/{designId}`
   - Builder loads with saved configuration

4. **User clicks "Delete"**
   - Confirmation dialog appears
   - On confirm → Soft delete via tRPC
   - Design removed from list

5. **User clicks "Create New Design"**
   - Navigates to `/builder/default`
   - Starts fresh design

## Links to Page

The `/saved` page is linked from multiple locations:

- `/apps/web/src/components/landing/landing-header.tsx` - "Saved designs" button
- `/apps/web/src/components/landing/builder-hero.tsx` - "View saved designs" button
- `/apps/web/src/components/catalog/catalog-shell.tsx` - "View saved templates" button
- `/apps/web/src/components/catalog/product-detail-shell.tsx` - Link in product details

## Database Schema

Saved designs are stored in the `SavedDesign` table with:

```prisma
model SavedDesign {
  id             String   @id @default(cuid())
  userId         String
  name           String?
  configJson     Json
  priceBreakdown Json?
  previewUrl     String?
  thumbnailUrl   String?
  status         Status   @default(DRAFT)
  deletedAt      DateTime?
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
  
  user UserProfile @relation(fields: [userId], references: [id])
}
```

## Future Enhancements

1. **Pagination** - Currently loads first 50 designs, could add infinite scroll
2. **Filtering** - Filter by status (Draft/Active/Archived)
3. **Sorting** - Sort by date, name, or status
4. **Search** - Search designs by name
5. **Bulk Actions** - Select multiple designs to delete/archive
6. **Duplicate** - Copy existing design as starting point
7. **Sharing** - Generate shareable links for designs
8. **Tags/Categories** - Organize designs with custom tags

## Related Documentation

- [tRPC API Reference](/docs/guides/trpc-usage-examples.md)
- [Component Architecture](/docs/architecture/component-architecture.md)
- [Clerk Authentication](/docs/guides/environment-setup.md#clerk-setup)



