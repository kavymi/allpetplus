# Testing Guide

## Overview

All Pet Plus uses a comprehensive testing strategy:
- **Jest** for unit/integration tests
- **Playwright** for E2E tests with AI-powered features

**Coverage Thresholds:**
- Branches: 70%
- Functions: 70%
- Lines: 70%
- Statements: 70%

---

## Testing Stack

### Unit & Integration Tests (Jest)
- Component testing with React Testing Library
- Hook testing
- API route testing
- Utility function testing

### E2E Tests (Playwright) ✨ NEW!
- AI-powered test generation (CodeGen)
- Multi-browser testing (Chrome, Firefox, Safari, Mobile)
- Visual regression testing
- Accessibility testing

**See:** [Playwright Guide](/docs/development/playwright-guide.md) for complete E2E testing documentation.

---

## Running Tests

### Frontend
```bash
cd apps/web

# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

### Backend
```bash
cd services/backend

# Run all tests
npm test

# Watch mode
npm run test:watch

# With coverage
npm run test:coverage
```

---

## Writing Component Tests

### Basic Component Test
```tsx
import { render, screen } from '@testing-library/react';
import { BuilderOptionsPane } from '../options-pane';

describe('BuilderOptionsPane', () => {
  const mockStep = {
    id: 'size',
    label: 'Choose size',
    description: 'Select your harness size',
    options: [
      { id: 's', label: 'Small', description: 'Neck 12-15"' },
      { id: 'm', label: 'Medium', description: 'Neck 15-18"' },
    ],
  };

  it('should render options', () => {
    render(
      <BuilderOptionsPane
        step={mockStep}
        selection={{}}
        updateSelection={jest.fn()}
      />
    );

    expect(screen.getByText('Choose size')).toBeInTheDocument();
    expect(screen.getByText('Small')).toBeInTheDocument();
    expect(screen.getByText('Medium')).toBeInTheDocument();
  });

  it('should call updateSelection on option click', () => {
    const mockUpdate = jest.fn();
    
    render(
      <BuilderOptionsPane
        step={mockStep}
        selection={{}}
        updateSelection={mockUpdate}
      />
    );

    fireEvent.click(screen.getByText('Small'));
    expect(mockUpdate).toHaveBeenCalledWith({ size: 's' });
  });
});
```

---

## Testing Hooks

```tsx
import { renderHook, act } from '@testing-library/react';
import { useBuilder } from '../use-builder';

describe('useBuilder', () => {
  it('should initialize with defaults', () => {
    const { result } = renderHook(() => useBuilder({
      configId: 'test',
      searchParams: {},
    }));

    expect(result.current.steps).toHaveLength(6);
    expect(result.current.currentStep).toBe(0);
  });

  it('should update selection', () => {
    const { result } = renderHook(() => useBuilder({
      configId: 'test',
      searchParams: {},
    }));

    act(() => {
      result.current.updateSelection({ size: 'l' });
    });

    // Verify state updated
  });
});
```

---

## Testing API Routes

### Backend Route Tests
```tsx
import Fastify from 'fastify';
import { orderRoutes } from '../routes/orders';

describe('Order Routes', () => {
  let app;

  beforeEach(async () => {
    app = Fastify({ logger: false });
    
    // Mock dependencies
    app.decorate('db', {
      orderMeta: {
        findFirst: jest.fn(),
      },
    });

    await app.register(orderRoutes);
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should return order status', async () => {
    app.db.orderMeta.findFirst.mockResolvedValue({
      shopifyOrderId: '123',
      shopifyOrderNumber: 'HH-001',
      email: 'test@example.com',
      statusHistory: [],
        createdAt: new Date(),
    });

      const response = await app.inject({
        method: 'GET',
      url: '/api/orders/HH-001?email=test@example.com',
      });

      expect(response.statusCode).toBe(200);
    const body = JSON.parse(response.payload);
    expect(body.orderNumber).toBe('HH-001');
  });
});
```

---

## Integration Tests

### Shopify Integration
```tsx
import { getCatalogProducts } from '../queries';
import { shopifyFetch } from '../client';

jest.mock('../client');

describe('Shopify Queries', () => {
  it('should fetch products from Shopify', async () => {
    const mockResponse = {
      products: {
        edges: [
          {
            node: {
              id: 'gid://shopify/Product/1',
              handle: 'test',
              title: 'Test Product',
              // ... more fields
            },
          },
        ],
      },
    };

    (shopifyFetch as jest.Mock).mockResolvedValue(mockResponse);

    const products = await getCatalogProducts();
    
    expect(products).toHaveLength(1);
    expect(products[0].handle).toBe('test');
  });

  it('should fallback to mock on error', async () => {
    (shopifyFetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const products = await getCatalogProducts();
    
    // Should return mock data
    expect(products).toBeDefined();
  });
});
```

---

## Test Utilities

### Mock Data Factories
```tsx
export function createMockProduct(overrides = {}) {
  return {
    id: 'gid://shopify/Product/1',
    handle: 'test-harness',
    title: 'Test Harness',
    description: 'A test harness',
    priceRange: { min: 58, max: 88, currencyCode: 'USD' },
    featuredImage: { src: '/test.jpg', alt: 'Test' },
    sizes: ['S', 'M', 'L'],
    tags: [],
    materials: [],
    ...overrides,
  };
}
```

### Test Helpers
```tsx
export function waitForLoadingToFinish() {
  return waitFor(() => {
    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
}

export function expectToBeAccessible(component) {
  return expect(component).toHaveNoViolations();
}
```

---

## Snapshot Testing

```tsx
import { render } from '@testing-library/react';
import { ProductCard } from '../product-card';

it('should match snapshot', () => {
    const { container } = render(
    <ProductCard product={mockProduct} />
  );
  
  expect(container).toMatchSnapshot();
});
```

---

## E2E Tests (Playwright) ✅

### Quick Start

```bash
cd apps/web

# Install dependencies (first time)
npm run playwright:install

# Generate tests with AI
npm run test:e2e:codegen

# Run tests
npm run test:e2e

# Run with interactive UI
npm run test:e2e:ui
```

### Example E2E Test

```typescript
import { test, expect } from '@playwright/test';

test('complete builder flow', async ({ page }) => {
  await page.goto('/builder');
  
  // Select size (smart selector)
  await page.getByRole('button', { name: /medium/i }).click();
  
  // Select colorway
  await page.getByRole('button', { name: /ocean blue/i }).click();
  
  // Add to cart
  await page.getByRole('button', { name: /add to cart/i }).click();
  
  // Verify navigation
  await expect(page).toHaveURL(/\/cart/);
  await expect(page.getByText(/galaxy glide harness/i)).toBeVisible();
});
```

**Complete Documentation:** [Playwright Guide](/docs/development/playwright-guide.md)

---

## Continuous Testing

Tests run automatically on:
- Every pull request
- Pushes to main/develop branches
- Pre-deployment checks

**CI Pipeline:**
1. Lint & type check
2. Unit tests (frontend + backend)
3. Integration tests
4. Build verification
5. Lighthouse CI (performance)
6. Deploy to staging
7. Smoke tests
8. Manual approval for production