# Code Patterns & Examples

## Overview

This document provides common code patterns, examples, and best practices used throughout the All Pet Plus codebase. Use these patterns to maintain consistency and quality.

## TypeScript Patterns

### 1. Type-Safe API Calls

```typescript
// lib/api/client.ts
import { z } from 'zod';

// Define response schema
const UserResponseSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  name: z.string().optional(),
  createdAt: z.string().datetime(),
});

type UserResponse = z.infer<typeof UserResponseSchema>;

// Type-safe API client
export class ApiClient {
  constructor(private baseUrl: string, private auth?: string) {}

  private async request<T>(
    path: string,
    options?: RequestInit,
    schema?: z.ZodSchema<T>
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      ...(this.auth && { Authorization: `Bearer ${this.auth}` }),
      ...options?.headers,
    };

    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new ApiError(response.status, error.message || response.statusText);
    }

    const data = await response.json();
    
    // Validate response if schema provided
    if (schema) {
      return schema.parse(data);
    }
    
    return data as T;
  }

  async getUser(userId: string): Promise<UserResponse> {
    return this.request(`/users/${userId}`, undefined, UserResponseSchema);
  }
}

// Custom error class
export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### 2. Discriminated Unions for State

```typescript
// types/builder.ts
type BuilderState = 
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: BuilderConfig };

// Usage with exhaustive checking
function handleBuilderState(state: BuilderState) {
  switch (state.status) {
    case 'idle':
      return <BuilderInstructions />;
    case 'loading':
      return <BuilderSkeleton />;
    case 'error':
      return <ErrorMessage message={state.error} />;
    case 'success':
      return <BuilderInterface config={state.data} />;
    default:
      // TypeScript ensures this is never reached
      const exhaustive: never = state;
      throw new Error(`Unhandled state: ${exhaustive}`);
  }
}
```

### 3. Type Guards

```typescript
// lib/guards.ts
import { BuilderConfig, SavedDesign } from '@/types';

// Type predicate
export function isValidBuilderConfig(data: unknown): data is BuilderConfig {
  return (
    typeof data === 'object' &&
    data !== null &&
    'size' in data &&
    'colorway' in data &&
    'hardware' in data
  );
}

// Assertion function
export function assertIsError(error: unknown): asserts error is Error {
  if (!(error instanceof Error)) {
    throw new Error('Not an error instance');
  }
}

// Narrowing with branded types
type UserId = string & { __brand: 'UserId' };
type DesignId = string & { __brand: 'DesignId' };

function isUserId(id: string): id is UserId {
  return /^usr_[a-zA-Z0-9]+$/.test(id);
}

// Usage
function getUserDesigns(userId: string): SavedDesign[] {
  if (!isUserId(userId)) {
    throw new Error('Invalid user ID format');
  }
  // TypeScript now knows userId is UserId type
  return fetchUserDesigns(userId);
}
```

## React Patterns

### 1. Custom Hooks with Proper Dependencies

```typescript
// hooks/use-debounced-value.ts
export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]); // Proper dependencies

  return debouncedValue;
}

// Usage
function SearchInput() {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebouncedValue(query, 300);

  const { data, isLoading } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchProducts(debouncedQuery),
    enabled: debouncedQuery.length > 2,
  });

  return (
    <input
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      placeholder="Search products..."
    />
  );
}
```

### 2. Context with Reducer Pattern

```typescript
// contexts/cart-context.tsx
type CartItem = {
  productId: string;
  variantId: string;
  quantity: number;
  customization?: BuilderConfig;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
};

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'TOGGLE_CART' }
  | { type: 'CLEAR_CART' };

const cartReducer = (state: CartState, action: CartAction): CartState => {
  switch (action.type) {
    case 'ADD_ITEM':
      return {
        ...state,
        items: [...state.items, action.payload],
        isOpen: true,
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.variantId !== action.payload),
      };
    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.variantId === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    case 'TOGGLE_CART':
      return { ...state, isOpen: !state.isOpen };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    default:
      return state;
  }
};

const CartContext = createContext<{
  state: CartState;
  dispatch: Dispatch<CartAction>;
} | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    isOpen: false,
  });

  // Persist to localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const items = JSON.parse(savedCart);
      items.forEach((item: CartItem) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
      });
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(state.items));
  }, [state.items]);

  return (
    <CartContext.Provider value={{ state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
```

### 3. Optimistic Updates

```typescript
// hooks/use-optimistic-mutation.ts
export function useOptimisticMutation<TData, TVariables>({
  mutationFn,
  optimisticUpdate,
  rollback,
}: {
  mutationFn: (variables: TVariables) => Promise<TData>;
  optimisticUpdate: (variables: TVariables) => void;
  rollback: (variables: TVariables, error: Error) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const mutate = useCallback(async (variables: TVariables) => {
    setIsLoading(true);
    setError(null);

    // Optimistically update UI
    optimisticUpdate(variables);

    try {
      const result = await mutationFn(variables);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      
      // Rollback on error
      rollback(variables, error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [mutationFn, optimisticUpdate, rollback]);

  return { mutate, isLoading, error };
}

// Usage
function TodoItem({ todo }: { todo: Todo }) {
  const queryClient = useQueryClient();

  const { mutate: toggleTodo } = useOptimisticMutation({
    mutationFn: (completed: boolean) => 
      api.updateTodo(todo.id, { completed }),
    optimisticUpdate: (completed) => {
      queryClient.setQueryData<Todo[]>(['todos'], (old) =>
        old?.map((t) => 
          t.id === todo.id ? { ...t, completed } : t
        ) ?? []
      );
    },
    rollback: () => {
      queryClient.invalidateQueries(['todos']);
    },
  });

  return (
    <input
      type="checkbox"
      checked={todo.completed}
      onChange={(e) => toggleTodo(e.target.checked)}
    />
  );
}
```

## State Management Patterns

### 1. Zustand with Immer and DevTools

```typescript
// stores/builder-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer';

// Enable Map and Set support in Immer
enableMapSet();

interface BuilderStore {
  // State
  selections: Map<string, OptionSelection>;
  constraints: Set<string>;
  currentStep: number;
  
  // Computed values
  get isValid(): boolean;
  get totalPrice(): number;
  
  // Actions
  selectOption: (optionId: string, selection: OptionSelection) => void;
  addConstraint: (constraint: string) => void;
  removeConstraint: (constraint: string) => void;
  reset: () => void;
}

export const useBuilderStore = create<BuilderStore>()(
  devtools(
    immer((set, get) => ({
      selections: new Map(),
      constraints: new Set(),
      currentStep: 0,

      get isValid() {
        const state = get();
        return state.selections.size >= REQUIRED_SELECTIONS.length &&
               state.constraints.size === 0;
      },

      get totalPrice() {
        const state = get();
        let total = BASE_PRICE;
        
        state.selections.forEach((selection) => {
          total += selection.priceModifier ?? 0;
        });
        
        return total;
      },

      selectOption: (optionId, selection) => {
        set((state) => {
          state.selections.set(optionId, selection);
          
          // Update constraints based on selection
          const newConstraints = calculateConstraints(state.selections);
          state.constraints = new Set(newConstraints);
        });
      },

      addConstraint: (constraint) => {
        set((state) => {
          state.constraints.add(constraint);
        });
      },

      removeConstraint: (constraint) => {
        set((state) => {
          state.constraints.delete(constraint);
        });
      },

      reset: () => {
        set((state) => {
          state.selections.clear();
          state.constraints.clear();
          state.currentStep = 0;
        });
      },
    })),
    {
      name: 'builder-store',
    }
  )
);
```

### 2. Server State with React Query

```typescript
// lib/query-client.ts
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
      retry: (failureCount, error) => {
        if (error instanceof ApiError && error.status === 404) {
          return false; // Don't retry 404s
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
      onError: (error) => {
        console.error('Mutation error:', error);
        toast.error('An error occurred. Please try again.');
      },
    },
  },
});

// hooks/use-products.ts
export function useProducts(options?: { category?: string }) {
  return useQuery({
    queryKey: ['products', options],
    queryFn: () => fetchProducts(options),
    select: (data) => {
      // Transform data if needed
      return data.products.map(transformProduct);
    },
  });
}

export function useProductPrefetch() {
  const queryClient = useQueryClient();
  
  return useCallback((productId: string) => {
    queryClient.prefetchQuery({
      queryKey: ['product', productId],
      queryFn: () => fetchProduct(productId),
      staleTime: 10 * 60 * 1000, // 10 minutes
    });
  }, [queryClient]);
}
```

## Backend Patterns

### 1. Fastify Plugin Architecture

```typescript
// plugins/auth.ts
import fp from 'fastify-plugin';
import { FastifyPluginAsync } from 'fastify';
import { verifyToken } from '@clerk/backend';

declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
    sessionId?: string;
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest('userId', null);
  fastify.decorateRequest('sessionId', null);

  fastify.addHook('onRequest', async (request, reply) => {
    // Skip auth for public routes
    if (request.routerPath?.startsWith('/public')) {
      return;
    }

    const token = request.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return; // Continue without auth
    }

    try {
      const payload = await verifyToken(token, {
        secretKey: process.env.CLERK_SECRET_KEY!,
      });
      
      request.userId = payload.sub;
      request.sessionId = payload.sid;
    } catch (error) {
      request.log.warn({ error }, 'Invalid auth token');
      // Don't fail the request, just continue without auth
    }
  });
};

export default fp(authPlugin, {
  name: 'auth',
});

// Usage in routes
fastify.get('/api/user/profile', {
  preHandler: async (request, reply) => {
    if (!request.userId) {
      return reply.code(401).send({ error: 'Unauthorized' });
    }
  },
}, async (request, reply) => {
  const profile = await fastify.db.userProfile.findUnique({
    where: { clerkId: request.userId },
  });
  
  return profile;
});
```

### 2. Error Handling with Schemas

```typescript
// schemas/common.ts
import { z } from 'zod';

export const ErrorResponseSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
  timestamp: z.string().datetime(),
  requestId: z.string(),
});

export const PaginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sort: z.string().optional(),
  order: z.enum(['asc', 'desc']).default('desc'),
});

// routes/designs.ts
import { Type } from '@sinclair/typebox';
import { FastifyPluginAsync } from 'fastify';

const designsRoutes: FastifyPluginAsync = async (fastify) => {
  // List designs with pagination
  fastify.get('/api/designs', {
    schema: {
      querystring: Type.Object({
        page: Type.Optional(Type.Integer({ minimum: 1 })),
        limit: Type.Optional(Type.Integer({ minimum: 1, maximum: 100 })),
        status: Type.Optional(Type.Enum(DesignStatus)),
      }),
      response: {
        200: Type.Object({
          designs: Type.Array(DesignSchema),
          pagination: PaginationResponseSchema,
        }),
        401: ErrorResponseSchema,
      },
    },
  }, async (request, reply) => {
    if (!request.userId) {
      return reply.code(401).send({
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
        timestamp: new Date().toISOString(),
        requestId: request.id,
      });
    }

    const { page = 1, limit = 20, status } = request.query;
    const skip = (page - 1) * limit;

    const [designs, total] = await Promise.all([
      fastify.db.savedDesign.findMany({
        where: {
          userId: request.userId,
          ...(status && { status }),
          deletedAt: null,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      fastify.db.savedDesign.count({
        where: {
          userId: request.userId,
          ...(status && { status }),
          deletedAt: null,
        },
      }),
    ]);

    return {
      designs,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: skip + limit < total,
        hasPrev: page > 1,
      },
    };
  });
};
```

### 3. Database Transactions

```typescript
// services/order-service.ts
export class OrderService {
  constructor(private db: PrismaClient, private queue: Queue) {}

  async createOrder(input: CreateOrderInput): Promise<Order> {
    return await this.db.$transaction(async (tx) => {
      // 1. Create user if doesn't exist
      const user = await tx.userProfile.upsert({
        where: { clerkId: input.userId },
        create: {
          clerkId: input.userId,
          email: input.email,
          emailHash: hashEmail(input.email),
        },
        update: {
          lastActiveAt: new Date(),
        },
      });

      // 2. Create or update saved design
      const design = await tx.savedDesign.create({
        data: {
          userId: user.id,
          name: input.designName,
          configJson: input.config,
          priceBreakdown: calculatePrice(input.config),
          status: 'ACTIVE',
        },
      });

      // 3. Create order record
      const order = await tx.orderMeta.create({
        data: {
          shopifyOrderId: input.shopifyOrderId,
          shopifyOrderNumber: input.orderNumber,
          email: encrypt(input.email),
          emailHash: hashEmail(input.email),
          maskedId: generateMaskedId(),
          status: 'PENDING',
          statusHistory: [
            {
              status: 'PENDING',
              timestamp: new Date().toISOString(),
              note: 'Order received',
            },
          ],
          designConfig: input.config,
        },
      });

      // 4. Queue jobs for async processing
      await this.queue.addBulk([
        {
          name: 'generate-preview',
          data: { designId: design.id },
        },
        {
          name: 'send-order-confirmation',
          data: { orderId: order.id },
          opts: { delay: 5000 }, // 5 second delay
        },
        {
          name: 'sync-to-analytics',
          data: { event: 'order_created', orderId: order.id },
        },
      ]);

      // 5. Create audit log
      await tx.auditLog.create({
        data: {
          tableName: 'order_meta',
          recordId: order.id,
          operation: 'INSERT',
          userId: user.id,
          changedData: order,
        },
      });

      return order;
    }, {
      maxWait: 5000, // 5 seconds
      timeout: 10000, // 10 seconds
      isolationLevel: 'Serializable',
    });
  }
}
```

## Performance Patterns

### 1. Web Workers for Heavy Computation

```typescript
// workers/preview-renderer.worker.ts
import { expose } from 'comlink';

interface RenderJob {
  layers: Layer[];
  canvas: OffscreenCanvas;
}

const previewRenderer = {
  async render({ layers, canvas }: RenderJob): Promise<Blob> {
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Could not get canvas context');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Render layers in order
    for (const layer of layers) {
      const image = await loadImage(layer.url);
      
      ctx.globalAlpha = layer.opacity ?? 1;
      ctx.drawImage(
        image,
        layer.x ?? 0,
        layer.y ?? 0,
        layer.width ?? canvas.width,
        layer.height ?? canvas.height
      );
    }

    // Convert to blob
    return canvas.convertToBlob({
      type: 'image/png',
      quality: 0.95,
    });
  },
};

expose(previewRenderer);

// hooks/use-preview-renderer.ts
import * as Comlink from 'comlink';
import { useEffect, useRef, useState } from 'react';

export function usePreviewRenderer() {
  const workerRef = useRef<Worker>();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const worker = new Worker(
      new URL('../workers/preview-renderer.worker.ts', import.meta.url)
    );
    
    workerRef.current = worker;
    setIsReady(true);

    return () => {
      worker.terminate();
    };
  }, []);

  const render = useCallback(async (layers: Layer[], width = 800, height = 800) => {
    if (!workerRef.current || !isReady) {
      throw new Error('Worker not ready');
    }

    const offscreen = new OffscreenCanvas(width, height);
    const renderer = Comlink.wrap<typeof previewRenderer>(workerRef.current);
    
    const blob = await renderer.render({ layers, canvas: offscreen });
    return URL.createObjectURL(blob);
  }, [isReady]);

  return { render, isReady };
}
```

### 2. Infinite Scroll with Intersection Observer

```typescript
// hooks/use-infinite-scroll.ts
export function useInfiniteScroll<T>({
  queryKey,
  queryFn,
  getNextPageParam,
}: {
  queryKey: QueryKey;
  queryFn: ({ pageParam }: { pageParam: number }) => Promise<{
    items: T[];
    nextPage?: number;
  }>;
  getNextPageParam: (lastPage: any) => number | undefined;
}) {
  const observerRef = useRef<IntersectionObserver>();
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey,
    queryFn,
    getNextPageParam,
    initialPageParam: 1,
  });

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observerRef.current.observe(element);

    return () => {
      observerRef.current?.disconnect();
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return {
    items: data?.pages.flatMap((page) => page.items) ?? [],
    loadMoreRef,
    isLoading: status === 'pending',
    isFetchingNextPage,
    hasNextPage,
  };
}

// Usage
function ProductList() {
  const { items, loadMoreRef, isLoading, isFetchingNextPage } = useInfiniteScroll({
    queryKey: ['products'],
    queryFn: async ({ pageParam }) => {
      const response = await api.getProducts({ page: pageParam });
      return {
        items: response.products,
        nextPage: response.hasNext ? pageParam + 1 : undefined,
      };
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
  });

  if (isLoading) return <ProductGridSkeleton />;

  return (
    <>
      <ProductGrid products={items} />
      <div ref={loadMoreRef} className="h-20">
        {isFetchingNextPage && <LoadingSpinner />}
      </div>
    </>
  );
}
```

## Testing Patterns

### 1. Test Utilities and Mocks

```typescript
// test/utils.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';
import { ReactElement, ReactNode } from 'react';

// Create a test query client
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
      },
    },
  });
}

// Custom render with providers
export function renderWithProviders(
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) {
  const queryClient = createTestQueryClient();

  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

// Mock API responses
export const mockApi = {
  getProducts: jest.fn().mockResolvedValue({
    products: [
      { id: '1', name: 'Test Product', price: 100 },
    ],
  }),
};

// Mock Clerk hooks
jest.mock('@clerk/nextjs', () => ({
  useAuth: () => ({
    isLoaded: true,
    isSignedIn: true,
    userId: 'test-user-id',
  }),
  useUser: () => ({
    isLoaded: true,
    user: {
      id: 'test-user-id',
      emailAddresses: [{ emailAddress: 'test@example.com' }],
    },
  }),
}));
```

### 2. Component Testing

```typescript
// components/__tests__/product-card.test.tsx
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ProductCard } from '../product-card';
import { renderWithProviders } from '@/test/utils';

const mockProduct = {
  id: '1',
  handle: 'test-harness',
  title: 'Test Harness',
  description: 'A test product',
  priceRange: {
    minVariantPrice: {
      amount: '49.99',
      currencyCode: 'USD',
    },
  },
  images: {
    edges: [
      {
        node: {
          url: 'https://example.com/image.jpg',
          altText: 'Test image',
        },
      },
    ],
  },
};

describe('ProductCard', () => {
  it('renders product information', () => {
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Harness')).toBeInTheDocument();
    expect(screen.getByText('$49.99')).toBeInTheDocument();
    expect(screen.getByAltText('Test image')).toBeInTheDocument();
  });

  it('navigates to product page on click', async () => {
    const user = userEvent.setup();
    const push = jest.fn();
    
    // Mock router
    jest.mock('next/navigation', () => ({
      useRouter: () => ({ push }),
    }));

    renderWithProviders(<ProductCard product={mockProduct} />);
    
    await user.click(screen.getByRole('link'));
    
    expect(push).toHaveBeenCalledWith('/product/test-harness');
  });

  it('shows quick add button on hover', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProductCard product={mockProduct} />);
    
    // Quick add button should not be visible initially
    expect(screen.queryByText('Quick Add')).not.toBeInTheDocument();
    
    // Hover over card
    await user.hover(screen.getByRole('article'));
    
    // Quick add button should appear
    await waitFor(() => {
      expect(screen.getByText('Quick Add')).toBeInTheDocument();
    });
  });
});
```

## Security Patterns

### 1. Input Validation and Sanitization

```typescript
// lib/validation.ts
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Custom Zod refinements
const sanitizedString = z.string().transform((val) => DOMPurify.sanitize(val));

const emailSchema = z
  .string()
  .email()
  .toLowerCase()
  .transform((email) => email.trim());

const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
  .transform((phone) => phone.replace(/\D/g, ''));

// Builder configuration schema
export const BuilderConfigSchema = z.object({
  size: z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']),
  colorway: z.object({
    primary: z.string().regex(/^#[0-9A-F]{6}$/i),
    secondary: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
    accent: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
  }),
  hardware: z.enum(['brass', 'silver', 'black', 'rose-gold']),
  personalization: z.object({
    text: sanitizedString.max(20).optional(),
    font: z.enum(['modern', 'classic', 'playful']).optional(),
    placement: z.enum(['front', 'side']).optional(),
  }).optional(),
  addons: z.array(z.enum(['led-light', 'gps-tracker', 'name-tag'])).optional(),
});

// SQL injection prevention with Prisma
export async function safeUserSearch(query: string) {
  // Sanitize input
  const sanitized = query.replace(/[%_]/g, '\\$&'); // Escape SQL wildcards
  
  // Use parameterized query
  return await prisma.$queryRaw`
    SELECT id, name, email
    FROM user_profiles
    WHERE name ILIKE ${`%${sanitized}%`}
    LIMIT 10
  `;
}
```

### 2. Authentication & Authorization

```typescript
// middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyRequestOrigin } from '@/lib/security';

export async function authMiddleware(request: NextRequest) {
  // CSRF protection
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    const originHeader = request.headers.get('Origin');
    const hostHeader = request.headers.get('Host');
    
    if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, hostHeader)) {
      return new NextResponse('Forbidden', { status: 403 });
    }
  }

  // Rate limiting by IP
  const ip = request.ip ?? 'anonymous';
  const { success, limit, reset, remaining } = await rateLimit.check(ip);
  
  if (!success) {
    return new NextResponse('Too Many Requests', {
      status: 429,
      headers: {
        'X-RateLimit-Limit': limit.toString(),
        'X-RateLimit-Remaining': remaining.toString(),
        'X-RateLimit-Reset': new Date(reset).toISOString(),
      },
    });
  }

  return NextResponse.next();
}

// lib/permissions.ts
export const permissions = {
  design: {
    create: (user: User) => true, // Any authenticated user
    read: (user: User, design: SavedDesign) => 
      design.userId === user.id || design.isPublic,
    update: (user: User, design: SavedDesign) => 
      design.userId === user.id,
    delete: (user: User, design: SavedDesign) => 
      design.userId === user.id && !design.hasOrders,
  },
  order: {
    read: (user: User, order: Order) => 
      order.userId === user.id || user.role === 'admin',
    cancel: (user: User, order: Order) => 
      order.userId === user.id && order.status === 'PENDING',
  },
};

// Usage
export async function canUserAccessDesign(userId: string, designId: string) {
  const user = await getUser(userId);
  const design = await getDesign(designId);
  
  if (!user || !design) return false;
  
  return permissions.design.read(user, design);
}
```

## Common Utilities

### 1. Error Handling

```typescript
// lib/errors.ts
export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string) {
    super(`${resource} not found`, 'NOT_FOUND', 404);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Unauthorized') {
    super(message, 'UNAUTHORIZED', 401);
  }
}

// Global error handler
export function handleError(error: unknown): ErrorResponse {
  console.error('Error:', error);

  if (error instanceof AppError) {
    return {
      error: {
        code: error.code,
        message: error.message,
        details: error.details,
      },
    };
  }

  if (error instanceof z.ZodError) {
    return {
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: error.flatten(),
      },
    };
  }

  // Generic error
  return {
    error: {
      code: 'INTERNAL_ERROR',
      message: 'An unexpected error occurred',
    },
  };
}
```

### 2. Utility Functions

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Class name utility
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format currency
export function formatCurrency(
  amount: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(amount / 100); // Assuming amount is in cents
}

// Format date
export function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  }).format(d);
}

// Debounce
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Retry with exponential backoff
export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxAttempts?: number;
    delay?: number;
    maxDelay?: number;
    factor?: number;
  } = {}
): Promise<T> {
  const {
    maxAttempts = 3,
    delay = 1000,
    maxDelay = 30000,
    factor = 2,
  } = options;

  let lastError: Error;
  let currentDelay = delay;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxAttempts) {
        throw lastError;
      }

      await new Promise((resolve) => setTimeout(resolve, currentDelay));
      currentDelay = Math.min(currentDelay * factor, maxDelay);
    }
  }

  throw lastError!;
}
```
