# tRPC API Reference

**Last Updated:** October 23, 2025  
**Version:** 1.0.0  
**Base URL:** `/api/trpc`

---

## Overview

This document provides comprehensive reference for all tRPC procedures in Harness Hero. All procedures are **type-safe** and provide **automatic TypeScript inference**.

**Quick Links:**
- [Designs Router](#designs-router) - Design management
- [Pets Router](#pets-router) - Pet profile management

---

## Getting Started

### Client Setup

```typescript
// apps/web/src/lib/trpc.ts
import { createTRPCReact } from '@trpc/react-query';
import type { AppRouter } from '@pet/api';

export const trpc = createTRPCReact<AppRouter>();
```

### Making Requests

```typescript
'use client';
import { trpc } from '@/lib/trpc';

export function MyComponent() {
  // Query (GET)
  const { data, isLoading, error } = trpc.designs.list.useQuery({
    limit: 20,
  });

  // Mutation (POST/PUT/DELETE)
  const createDesign = trpc.designs.create.useMutation({
    onSuccess: (data) => console.log('Created:', data),
  });

  return <div>...</div>;
}
```

---

## Authentication

All `protectedProcedure` endpoints require authentication via Clerk.

### Request Headers

```http
Cookie: __session=<clerk_session_token>
```

### Error Response (401)

```json
{
  "error": {
    "code": "UNAUTHORIZED",
    "message": "You must be logged in to access this resource"
  }
}
```

---

## Designs Router

**Path:** `trpc.designs.*`  
**Authentication:** Required (all procedures)

### Overview

Manages harness designs created by users. Includes CRUD operations with pagination and soft-delete support.

---

### `designs.list`

List user's saved designs with optional filtering and pagination.

**Type:** Query  
**Auth:** Required

#### Input Schema

```typescript
{
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  limit?: number;    // Min: 1, Max: 100, Default: 20
  cursor?: string;   // For pagination
}
```

#### Response Schema

```typescript
{
  designs: Array<{
    id: string;
    name: string | null;
    configJson: Record<string, unknown>;
    priceBreakdown: Record<string, unknown> | null;
    previewUrl: string | null;
    thumbnailUrl: string | null;
    status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
    createdAt: Date;
    updatedAt: Date;
  }>;
  pageInfo: {
    hasNextPage: boolean;
    endCursor: string | null;
  };
}
```

#### Usage Example

```typescript
// Basic usage
const { data } = trpc.designs.list.useQuery();

// With filtering
const { data } = trpc.designs.list.useQuery({
  status: 'ACTIVE',
  limit: 50,
});

// With pagination
const { data, fetchNextPage } = trpc.designs.list.useInfiniteQuery(
  { limit: 20 },
  {
    getNextPageParam: (lastPage) => lastPage.pageInfo.endCursor,
  }
);
```

#### Error Responses

No specific errors - returns empty array if user has no designs.

---

### `designs.byId`

Get a single design by ID. Only returns designs owned by the authenticated user.

**Type:** Query  
**Auth:** Required

#### Input Schema

```typescript
{
  id: string;  // Design ID
}
```

#### Response Schema

```typescript
{
  id: string;
  name: string | null;
  configJson: Record<string, unknown>;
  priceBreakdown: Record<string, unknown> | null;
  previewUrl: string | null;
  thumbnailUrl: string | null;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  userId: string;
}
```

#### Usage Example

```typescript
const { data, isLoading } = trpc.designs.byId.useQuery({
  id: 'design_abc123',
});

if (isLoading) return <LoadingState />;
if (!data) return <NotFound />;

return <DesignDetails design={data} />;
```

#### Error Responses

**404 NOT_FOUND**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Design not found"
  }
}
```

Occurs when:
- Design doesn't exist
- Design belongs to another user
- Design is deleted

---

### `designs.create`

Create a new design for the authenticated user.

**Type:** Mutation  
**Auth:** Required

#### Input Schema

```typescript
{
  name?: string;                  // Min: 1, Max: 255
  configJson: Record<string, unknown>;  // Required
  priceBreakdown?: Record<string, unknown>;
}
```

#### Response Schema

```typescript
{
  id: string;
  name: string | null;
  configJson: Record<string, unknown>;
  priceBreakdown: Record<string, unknown> | null;
  status: 'DRAFT';  // Always DRAFT on creation
  createdAt: Date;
  updatedAt: Date;
}
```

#### Usage Example

```typescript
const createDesign = trpc.designs.create.useMutation({
  onSuccess: (data) => {
    console.log('Design created:', data.id);
    router.push(`/builder/${data.id}`);
  },
  onError: (error) => {
    toast.error(error.message);
  },
});

// Create design
await createDesign.mutateAsync({
  name: 'My Harness Design',
  configJson: {
    size: 'M',
    color: 'blue',
    hardware: 'gold',
  },
  priceBreakdown: {
    base: 49.99,
    hardware: 15.00,
    total: 64.99,
  },
});
```

#### Notes

- Auto-creates user profile if doesn't exist
- Initial status is always 'DRAFT'
- Returns only essential fields for performance

---

### `designs.update`

Update an existing design. Only the owner can update.

**Type:** Mutation  
**Auth:** Required

#### Input Schema

```typescript
{
  id: string;                     // Required
  name?: string;                  // Min: 1, Max: 255
  configJson?: Record<string, unknown>;
  priceBreakdown?: Record<string, unknown>;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
}
```

#### Response Schema

```typescript
{
  id: string;
  name: string | null;
  configJson: Record<string, unknown>;
  priceBreakdown: Record<string, unknown> | null;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  updatedAt: Date;
}
```

#### Usage Example

```typescript
const updateDesign = trpc.designs.update.useMutation({
  onSuccess: () => {
    toast.success('Design updated');
    // Invalidate cache
    trpcUtils.designs.byId.invalidate({ id });
  },
});

// Update name only
await updateDesign.mutateAsync({
  id: 'design_abc123',
  name: 'Updated Name',
});

// Update status
await updateDesign.mutateAsync({
  id: 'design_abc123',
  status: 'ACTIVE',
});
```

#### Error Responses

**404 NOT_FOUND**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Design not found"
  }
}
```

---

### `designs.delete`

Soft-delete a design (sets `deletedAt` timestamp).

**Type:** Mutation  
**Auth:** Required

#### Input Schema

```typescript
{
  id: string;  // Design ID
}
```

#### Response Schema

```typescript
{
  success: true;
}
```

#### Usage Example

```typescript
const deleteDesign = trpc.designs.delete.useMutation({
  onSuccess: () => {
    toast.success('Design deleted');
    // Refresh list
    trpcUtils.designs.list.invalidate();
  },
  onError: (error) => {
    toast.error('Failed to delete design');
  },
});

// Delete design
await deleteDesign.mutateAsync({ id: 'design_abc123' });
```

#### Error Responses

**404 NOT_FOUND**
```json
{
  "error": {
    "code": "NOT_FOUND",
    "message": "Design not found"
  }
}
```

#### Notes

- This is a **soft delete** - design is not removed from database
- Design will not appear in future `list` queries
- Can be recovered by admin if needed

---

## Pets Router

**Path:** `trpc.pets.*`  
**Authentication:** Required (all procedures)

### Overview

Manages pet profiles for users. Supports multiple pets per user with one designated as primary.

---

### `pets.list`

List all pets for the authenticated user.

**Type:** Query  
**Auth:** Required

#### Input Schema

```typescript
// No input parameters
```

#### Response Schema

```typescript
Array<{
  id: string;
  name: string;
  species: 'DOG' | 'CAT' | 'OTHER';
  breed: string | null;
  birthdate: Date | null;
  weight: number | null;        // In pounds
  isPrimary: boolean;
  photoUrl: string | null;
  microchipId: string | null;
  healthInfo: Record<string, unknown> | null;
  behaviorNotes: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}>
```

#### Usage Example

```typescript
const { data: pets, isLoading } = trpc.pets.list.useQuery();

if (isLoading) return <LoadingState />;
if (!pets?.length) return <EmptyState message="No pets yet" />;

return (
  <div>
    {pets.map(pet => (
      <PetCard key={pet.id} pet={pet} />
    ))}
  </div>
);
```

---

### `pets.byId`

Get a single pet by ID. Only returns pets owned by the authenticated user.

**Type:** Query  
**Auth:** Required

#### Input Schema

```typescript
{
  id: string;  // Pet ID (UUID)
}
```

#### Response Schema

```typescript
{
  id: string;
  name: string;
  species: 'DOG' | 'CAT' | 'OTHER';
  breed: string | null;
  birthdate: Date | null;
  weight: number | null;
  isPrimary: boolean;
  photoUrl: string | null;
  microchipId: string | null;
  healthInfo: Record<string, unknown> | null;
  behaviorNotes: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
}
```

#### Usage Example

```typescript
const { data: pet } = trpc.pets.byId.useQuery({
  id: 'pet_abc123',
});

return <PetProfile pet={pet} />;
```

#### Error Responses

**404 NOT_FOUND** - Pet doesn't exist or belongs to another user

---

### `pets.create`

Create a new pet profile.

**Type:** Mutation  
**Auth:** Required

#### Input Schema

```typescript
{
  name: string;                   // Required, 1-100 chars
  species: 'DOG' | 'CAT' | 'OTHER';  // Required
  breed?: string;                 // Max 100 chars
  birthdate?: Date;
  weight?: number;                // Positive number, in pounds
  photoUrl?: string;              // Valid URL
  microchipId?: string;           // Max 50 chars
  healthInfo?: Record<string, unknown>;
  behaviorNotes?: Record<string, unknown>;
}
```

#### Response Schema

```typescript
{
  id: string;
  name: string;
  species: 'DOG' | 'CAT' | 'OTHER';
  breed: string | null;
  birthdate: Date | null;
  weight: number | null;
  isPrimary: boolean;
  photoUrl: string | null;
  microchipId: string | null;
  createdAt: Date;
  updatedAt: Date;
}
```

#### Usage Example

```typescript
const createPet = trpc.pets.create.useMutation({
  onSuccess: (data) => {
    toast.success(`${data.name} added!`);
    router.push('/dashboard/pets');
  },
});

await createPet.mutateAsync({
  name: 'Max',
  species: 'DOG',
  breed: 'Golden Retriever',
  birthdate: new Date('2020-05-15'),
  weight: 65,
  healthInfo: {
    vaccinations: ['Rabies', 'Distemper'],
    allergies: ['Chicken'],
  },
});
```

#### Notes

- First pet is automatically set as primary
- Creates user profile if doesn't exist

---

### `pets.update`

Update an existing pet profile.

**Type:** Mutation  
**Auth:** Required

#### Input Schema

```typescript
{
  id: string;                     // Required
  name?: string;
  species?: 'DOG' | 'CAT' | 'OTHER';
  breed?: string;
  birthdate?: Date;
  weight?: number;
  photoUrl?: string;
  microchipId?: string;
  healthInfo?: Record<string, unknown>;
  behaviorNotes?: Record<string, unknown>;
}
```

#### Response Schema

```typescript
{
  id: string;
  name: string;
  // ... all pet fields
  updatedAt: Date;
}
```

#### Usage Example

```typescript
const updatePet = trpc.pets.update.useMutation({
  onSuccess: () => {
    toast.success('Pet updated');
    trpcUtils.pets.byId.invalidate({ id });
  },
});

// Update weight
await updatePet.mutateAsync({
  id: 'pet_abc123',
  weight: 70,
});
```

---

### `pets.delete`

Soft-delete a pet profile.

**Type:** Mutation  
**Auth:** Required

#### Input Schema

```typescript
{
  id: string;  // Pet ID
}
```

#### Response Schema

```typescript
{
  success: true;
}
```

#### Usage Example

```typescript
const deletePet = trpc.pets.delete.useMutation({
  onSuccess: () => {
    toast.success('Pet removed');
    trpcUtils.pets.list.invalidate();
  },
});

await deletePet.mutateAsync({ id: 'pet_abc123' });
```

#### Notes

- Soft delete - can be recovered
- If deleted pet was primary, another pet becomes primary

---

### `pets.setPrimary`

Set a pet as the user's primary pet.

**Type:** Mutation  
**Auth:** Required

#### Input Schema

```typescript
{
  id: string;  // Pet ID
}
```

#### Response Schema

```typescript
{
  success: true;
}
```

#### Usage Example

```typescript
const setPrimary = trpc.pets.setPrimary.useMutation({
  onSuccess: () => {
    toast.success('Primary pet updated');
    trpcUtils.pets.list.invalidate();
  },
});

await setPrimary.mutateAsync({ id: 'pet_abc123' });
```

#### Notes

- Only one pet can be primary
- Previous primary pet is automatically unset

---

## Error Handling

### Error Types

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `UNAUTHORIZED` | 401 | Not authenticated |
| `FORBIDDEN` | 403 | Authenticated but no permission |
| `NOT_FOUND` | 404 | Resource doesn't exist |
| `BAD_REQUEST` | 400 | Invalid input |
| `INTERNAL_SERVER_ERROR` | 500 | Server error |

### Error Response Format

```typescript
{
  error: {
    code: string;
    message: string;
    data?: {
      path: string;
      zodError?: ZodError;  // For validation errors
    };
  }
}
```

### Handling Errors

```typescript
const { data, error } = trpc.designs.byId.useQuery({ id });

if (error) {
  switch (error.data?.code) {
    case 'UNAUTHORIZED':
      router.push('/sign-in');
      break;
    case 'NOT_FOUND':
      return <NotFound />;
    case 'BAD_REQUEST':
      toast.error('Invalid input');
      break;
    default:
      toast.error('Something went wrong');
  }
}
```

---

## Best Practices

### 1. Use React Query Features

```typescript
// Prefetching
await trpcUtils.designs.byId.prefetch({ id });

// Optimistic updates
const updateDesign = trpc.designs.update.useMutation({
  onMutate: async (newData) => {
    // Cancel outgoing fetches
    await trpcUtils.designs.byId.cancel({ id: newData.id });
    
    // Snapshot previous value
    const previous = trpcUtils.designs.byId.getData({ id: newData.id });
    
    // Optimistically update
    trpcUtils.designs.byId.setData({ id: newData.id }, newData);
    
    return { previous };
  },
  onError: (err, newData, context) => {
    // Rollback on error
    trpcUtils.designs.byId.setData(
      { id: newData.id },
      context.previous
    );
  },
});
```

### 2. Cache Invalidation

```typescript
// Invalidate specific query
trpcUtils.designs.byId.invalidate({ id });

// Invalidate all designs queries
trpcUtils.designs.invalidate();

// Invalidate multiple
Promise.all([
  trpcUtils.designs.list.invalidate(),
  trpcUtils.pets.list.invalidate(),
]);
```

### 3. Error Boundaries

```typescript
<ErrorBoundary
  fallback={<ErrorState />}
  onError={(error) => logError(error)}
>
  <MyComponent />
</ErrorBoundary>
```

---

## Rate Limiting

**Limits:**
- 100 requests per minute per user
- 1000 requests per hour per user

**Response on limit exceeded:**
```json
{
  "error": {
    "code": "TOO_MANY_REQUESTS",
    "message": "Rate limit exceeded",
    "retryAfter": 60
  }
}
```

---

## Versioning

**Current Version:** 1.0.0

**Breaking Changes:**
- Will be announced 30 days in advance
- Deprecated endpoints will work for 90 days
- Version included in response headers

---

## Related Documentation

- [tRPC Usage Examples](/docs/guides/trpc-usage-examples.md)
- [Backend API Reference](/docs/api/backend-api-reference.md)
- [Frontend API Reference](/docs/api/api-reference.md)

---

## Support

**Issues:** GitHub Issues  
**Questions:** Team Chat  
**Security:** security@harnesshero.com

---

**Last Updated:** October 23, 2025  
**Maintained By:** API Team

