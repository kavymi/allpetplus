# tRPC Usage Examples

**Practical examples of using tRPC in your All Pet Plus app**

---

## Basic Query

```typescript
'use client';
import { trpc } from '@/lib/trpc';

export function MyComponent() {
  // ✅ Simple query with full type safety
  const { data, isLoading, error } = trpc.designs.list.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data?.designs.map((design) => (
        <div key={design.id}>{design.name}</div>
      ))}
    </div>
  );
}
```

---

## Query with Parameters

```typescript
// ✅ Query with input parameters
const { data } = trpc.designs.list.useQuery({
  status: 'ACTIVE',      // ✅ Type-checked!
  limit: 10,             // ✅ Autocomplete works!
  cursor: 'design_123',  // ✅ Validated!
});
```

---

## Mutations (Create/Update/Delete)

```typescript
export function CreateDesignButton() {
  // ✅ Mutation with callbacks
  const createDesign = trpc.designs.create.useMutation({
    onSuccess: (data) => {
      console.log('Created:', data.id);
      // Redirect, show toast, etc.
    },
    onError: (error) => {
      console.error('Failed:', error.message);
      // Show error message
    },
  });

  const handleCreate = async () => {
    await createDesign.mutateAsync({
      name: 'My Design',
      configJson: { size: 'M', color: 'blue' },
    });
  };

  return (
    <button 
      onClick={handleCreate}
      disabled={createDesign.isPending}
    >
      {createDesign.isPending ? 'Creating...' : 'Create'}
    </button>
  );
}
```

---

## Optimistic Updates

```typescript
export function DesignsList() {
  const utils = trpc.useUtils();
  
  const deleteDesign = trpc.designs.delete.useMutation({
    // Optimistically update the UI before server responds
    onMutate: async ({ id }) => {
      // Cancel outgoing refetches
      await utils.designs.list.cancel();

      // Snapshot previous value
      const prev = utils.designs.list.getData();

      // Optimistically update
      utils.designs.list.setData(undefined, (old) => {
        if (!old) return old;
        return {
          ...old,
          designs: old.designs.filter((d) => d.id !== id),
        };
      });

      return { prev };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.prev) {
        utils.designs.list.setData(undefined, context.prev);
      }
    },
    onSettled: () => {
      // Refetch to ensure consistency
      utils.designs.list.invalidate();
    },
  });

  return <div>{/* ... */}</div>;
}
```

---

## Conditional Queries

```typescript
export function DesignDetail({ id }: { id: string | null }) {
  // ✅ Only fetch if ID is provided
  const { data } = trpc.designs.byId.useQuery(
    { id: id! },
    { enabled: !!id }  // Only run query if id exists
  );

  if (!id) return <div>Select a design</div>;

  return <div>{data?.name}</div>;
}
```

---

## Dependent Queries

```typescript
export function UserDashboard() {
  // First query
  const { data: user } = trpc.user.profile.useQuery();

  // Second query depends on first
  const { data: designs } = trpc.designs.list.useQuery(
    { userId: user?.id! },
    { enabled: !!user?.id }  // Wait for user ID
  );

  return <div>{/* ... */}</div>;
}
```

---

## Infinite Queries (Pagination)

```typescript
export function InfiniteDesigns() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = trpc.designs.list.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.pageInfo.endCursor,
    }
  );

  return (
    <div>
      {data?.pages.map((page) =>
        page.designs.map((design) => (
          <div key={design.id}>{design.name}</div>
        ))
      )}
      
      {hasNextPage && (
        <button 
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          {isFetchingNextPage ? 'Loading...' : 'Load More'}
        </button>
      )}
    </div>
  );
}
```

---

## Error Handling

```typescript
export function DesignsWithErrorHandling() {
  const { data, error, isError } = trpc.designs.list.useQuery();

  if (isError) {
    // Different error types
    if (error.data?.code === 'UNAUTHORIZED') {
      return <div>Please log in</div>;
    }
    
    if (error.data?.code === 'NOT_FOUND') {
      return <div>Designs not found</div>;
    }

    // Generic error
    return <div>Error: {error.message}</div>;
  }

  return <div>{/* Success UI */}</div>;
}
```

---

## Server Components (Read-Only)

```typescript
// app/designs/page.tsx (Server Component)
import { createTRPCContext } from '@pet/api/context';
import { appRouter } from '@pet/api';

export default async function DesignsPage() {
  // Create context for server-side
  const ctx = await createTRPCContext({
    req: new Request('http://localhost:3000'),
  });

  // Call tRPC procedure directly (no hooks)
  const caller = appRouter.createCaller(ctx);
  const designs = await caller.designs.list({ limit: 10 });

  return (
    <div>
      {designs.designs.map((design) => (
        <div key={design.id}>{design.name}</div>
      ))}
    </div>
  );
}
```

---

## With Form Libraries

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const designSchema = z.object({
  name: z.string().min(1).max(255),
  configJson: z.record(z.unknown()),
});

export function DesignForm() {
  const createDesign = trpc.designs.create.useMutation();
  
  const form = useForm({
    resolver: zodResolver(designSchema),
  });

  const onSubmit = async (values: z.infer<typeof designSchema>) => {
    await createDesign.mutateAsync(values);
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <input {...form.register('name')} />
      <button 
        type="submit"
        disabled={createDesign.isPending}
      >
        {createDesign.isPending ? 'Saving...' : 'Save'}
      </button>
    </form>
  );
}
```

---

## Prefetching

```typescript
'use client';
import { trpc } from '@/lib/trpc';
import { useRouter } from 'next/navigation';

export function DesignsList() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const handleMouseEnter = (id: string) => {
    // Prefetch design details on hover
    utils.designs.byId.prefetch({ id });
  };

  const handleClick = (id: string) => {
    // Navigate (data already cached!)
    router.push(`/designs/${id}`);
  };

  return (
    <div>
      {designs.map((design) => (
        <div
          key={design.id}
          onMouseEnter={() => handleMouseEnter(design.id)}
          onClick={() => handleClick(design.id)}
        >
          {design.name}
        </div>
      ))}
    </div>
  );
}
```

---

## React Query DevTools

```typescript
// app/providers.tsx
'use client';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  // ... existing setup

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
        {process.env.NODE_ENV === 'development' && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </QueryClientProvider>
    </trpc.Provider>
  );
}
```

---

## Best Practices

### ✅ DO:
```typescript
// Use specific queries
const { data } = trpc.designs.byId.useQuery({ id });

// Handle loading and error states
if (isLoading) return <LoadingState />;
if (error) return <ErrorState />;

// Use optimistic updates for better UX
onMutate: async () => { /* update UI immediately */ }

// Invalidate queries after mutations
onSuccess: () => utils.designs.list.invalidate()
```

### ❌ DON'T:
```typescript
// Don't ignore loading states
const { data } = trpc.designs.list.useQuery();
return <div>{data.designs.map(...)}</div>; // ❌ data might be undefined!

// Don't use queries in loops
designs.map((d) => {
  const { data } = trpc.designs.byId.useQuery({ id: d.id }); // ❌ Bad!
});

// Don't forget to handle errors
const { data } = trpc.designs.list.useQuery();
// ❌ What if it fails?
```

---

## Testing

```typescript
// __tests__/designs.test.tsx
import { renderHook, waitFor } from '@testing-library/react';
import { createTRPCMsw } from 'msw-trpc';
import { setupServer } from 'msw/node';
import { trpc } from '@/lib/trpc';

const trpcMsw = createTRPCMsw<AppRouter>();

const server = setupServer(
  trpcMsw.designs.list.query(() => {
    return {
      designs: [{ id: '1', name: 'Test Design' }],
      pageInfo: { hasNextPage: false, endCursor: null },
    };
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('fetches designs', async () => {
  const { result } = renderHook(() => trpc.designs.list.useQuery());

  await waitFor(() => expect(result.current.isSuccess).toBe(true));
  expect(result.current.data?.designs).toHaveLength(1);
});
```

---

## More Examples

See also:
- Test page: `/apps/web/src/app/test-trpc/page.tsx`
- Example component: `/apps/web/src/components/examples/trpc-designs-list.tsx`
- tRPC docs: https://trpc.io/docs/client/react/useQuery

