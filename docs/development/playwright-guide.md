# Playwright E2E Testing Guide

**Last Updated:** October 8, 2025  
**Status:** ✅ Complete

## Overview

All Pet Plus uses Playwright for end-to-end testing with AI-powered features including CodeGen, trace debugging, and visual regression testing.

**Why Playwright?**
- ✅ AI-powered test generation via CodeGen
- ✅ Auto-waiting and smart selectors (no flaky tests)
- ✅ Native TypeScript support
- ✅ Multi-browser testing (Chrome, Firefox, Safari)
- ✅ Mobile viewport testing
- ✅ Visual debugging with traces

---

## Quick Start

### 1. Install Dependencies

```bash
# From project root
cd apps/web

# Install Playwright and browsers
npm install
npm run playwright:install
```

### 2. Run Tests

```bash
# Run all E2E tests
npm run test:e2e

# Run with UI mode (interactive)
npm run test:e2e:ui

# Run with browser visible (headed mode)
npm run test:e2e:headed

# Debug a specific test
npm run test:e2e:debug

# View test report
npm run test:e2e:report
```

### 3. Using NX Commands

```bash
# From project root
nx e2e web                    # Run all tests
nx e2e web --configuration=ui # Run with UI
nx run-many --target=e2e      # Run all E2E tests in workspace
```

---

## AI-Powered Test Generation (CodeGen)

### Generate Tests Automatically

Playwright CodeGen records your interactions and generates TypeScript tests:

```bash
# Start CodeGen
npm run test:e2e:codegen

# Or with NX
nx e2e:codegen web
```

**What CodeGen Does:**
1. Opens a browser with inspector
2. Records your clicks, typing, navigation
3. Generates TypeScript test code in real-time
4. Uses smart selectors (role, text, label)

**Example Workflow:**
1. Run `npm run test:e2e:codegen`
2. Navigate to `/builder` in the opened browser
3. Click options, fill forms, interact normally
4. Copy generated code to `e2e/builder-flow.spec.ts`
5. Run test: `npm run test:e2e`

---

## Writing Tests

### Test Structure

```typescript
import { test, expect } from '@playwright/test';

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    // Setup: Navigate to page
    await page.goto('/builder');
  });

  test('should do something', async ({ page }) => {
    // Arrange: Set up test conditions
    const button = page.getByRole('button', { name: /click me/i });

    // Act: Perform action
    await button.click();

    // Assert: Verify result
    await expect(page).toHaveURL(/\/success/);
  });
});
```

### Smart Selectors (AI-Friendly)

Playwright auto-heals selectors when UI changes:

```typescript
// ✅ GOOD: Role-based selectors (most resilient)
page.getByRole('button', { name: /submit/i })
page.getByRole('heading', { name: /welcome/i })
page.getByRole('link', { name: /catalog/i })

// ✅ GOOD: Text-based selectors
page.getByText('Add to cart')
page.getByLabel('Email address')
page.getByPlaceholder('Search...')

// ✅ GOOD: Test IDs (when needed)
page.locator('[data-testid="builder-preview"]')

// ❌ BAD: Fragile CSS selectors
page.locator('.btn-primary.px-4.py-2') // Breaks when classes change
page.locator('div > div > button') // Breaks when DOM structure changes
```

### Auto-Waiting (No Manual Waits Needed)

Playwright automatically waits for elements to be ready:

```typescript
// ✅ CORRECT: No manual waits needed
await page.getByRole('button', { name: /submit/i }).click();
await expect(page.getByText('Success!')).toBeVisible();

// ❌ WRONG: Manual waits (usually unnecessary)
await page.waitForTimeout(1000); // Don't do this
```

---

## Test Examples

### Builder Flow Test

```typescript
test('should complete custom harness configuration', async ({ page }) => {
  await page.goto('/builder');

  // Select size
  await page.getByRole('button', { name: /medium/i }).click();

  // Select colorway
  await page.getByRole('button', { name: /ocean blue/i }).click();

  // Add to cart
  await page.getByRole('button', { name: /add to cart/i }).click();

  // Verify redirect
  await expect(page).toHaveURL(/\/cart/);
});
```

### API Mocking

```typescript
test('should handle API errors gracefully', async ({ page }) => {
  // Mock API failure
  await page.route('**/api/designs', (route) => {
    route.fulfill({
      status: 500,
      body: JSON.stringify({ error: 'Server error' }),
    });
  });

  await page.goto('/builder');

  // Verify error state
  await expect(page.getByText(/something went wrong/i)).toBeVisible();
});
```

### Visual Regression Testing

```typescript
test('should match design system', async ({ page }) => {
  await page.goto('/builder');

  // Take screenshot and compare
  await expect(page).toHaveScreenshot('builder-initial.png');

  // Select option
  await page.getByRole('button', { name: /medium/i }).click();

  // Verify visual change
  await expect(page).toHaveScreenshot('builder-with-selection.png');
});
```

### Accessibility Testing

```typescript
test('should be keyboard navigable', async ({ page }) => {
  await page.goto('/builder');

  // Tab through elements
  await page.keyboard.press('Tab');

  // Verify focus is visible
  const focused = page.locator(':focus');
  await expect(focused).toBeVisible();
});
```

---

## Helper Utilities

Import from `e2e/helpers/test-helpers.ts`:

```typescript
import { 
  waitForPageLoad, 
  isInViewport, 
  mockApiResponse,
  addItemToCart,
  clearCart 
} from './helpers/test-helpers';

test('should use helpers', async ({ page }) => {
  await addItemToCart(page); // Helper adds item
  await page.goto('/cart');
  await clearCart(page); // Helper clears cart
});
```

---

## Configuration

### Browser Configuration

Edit `playwright.config.ts`:

```typescript
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  { name: 'mobile-chrome', use: { ...devices['Pixel 5'] } },
  { name: 'mobile-safari', use: { ...devices['iPhone 14 Pro'] } },
]
```

### Run Specific Browsers

```bash
# Run on Chrome only
npx playwright test --project=chromium

# Run on mobile Safari only
npx playwright test --project=mobile-safari
```

---

## Debugging Tests

### Interactive Debugging

```bash
# Debug mode (pauses at each action)
npm run test:e2e:debug

# Debug specific test file
npx playwright test e2e/builder-flow.spec.ts --debug
```

### Trace Viewer (AI-Powered Debugging)

When tests fail, Playwright captures a trace:

```bash
# View trace from failed test
npm run test:e2e:report

# Or manually
npx playwright show-trace trace.zip
```

**Trace includes:**
- Timeline of all actions
- Network requests
- Console logs
- Screenshots at each step
- DOM snapshots

### Visual Debugging

```bash
# Run tests with browser visible
npm run test:e2e:headed

# Run with UI mode (best for debugging)
npm run test:e2e:ui
```

---

## CI/CD Integration

### GitHub Actions Example

```yaml
# .github/workflows/e2e.yml
name: E2E Tests

on: [push, pull_request]

jobs:
  e2e:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '24'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: nx e2e web
      
      - name: Upload test results
        if: failure()
        uses: actions/upload-artifact@v3
        with:
          name: playwright-report
          path: apps/web/playwright-report/
```

---

## Best Practices

### ✅ DO:

1. **Use CodeGen to bootstrap tests**
   ```bash
   npm run test:e2e:codegen
   ```

2. **Use role-based selectors**
   ```typescript
   page.getByRole('button', { name: /submit/i })
   ```

3. **Let Playwright auto-wait**
   ```typescript
   await button.click(); // No manual waits needed
   ```

4. **Test critical user journeys**
   - Builder flow
   - Checkout flow
   - Order tracking

5. **Run on multiple browsers**
   - Desktop: Chrome, Firefox, Safari
   - Mobile: iOS Safari, Android Chrome

6. **Use test helpers for common operations**
   ```typescript
   import { addItemToCart } from './helpers/test-helpers';
   ```

### ❌ DON'T:

1. **Don't use fragile CSS selectors**
   ```typescript
   page.locator('.btn.px-4') // BAD
   ```

2. **Don't add manual waits**
   ```typescript
   await page.waitForTimeout(1000); // BAD
   ```

3. **Don't test implementation details**
   - Test user behavior, not internal state

4. **Don't skip error scenarios**
   - Test loading states, errors, edge cases

5. **Don't forget accessibility**
   - Test keyboard navigation, screen reader support

---

## Troubleshooting

### Tests are flaky

**Solution:** Use better selectors
```typescript
// Instead of:
page.locator('.button')

// Use:
page.getByRole('button', { name: /submit/i })
```

### Tests timeout

**Solution:** Check network or increase timeout
```typescript
test('slow operation', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds

  await page.goto('/builder');
});
```

### Can't find element

**Solution:** Verify selector in UI mode
```bash
npm run test:e2e:ui
```

### Tests pass locally but fail in CI

**Solution:** Check viewport/browser differences
```typescript
test('responsive test', async ({ page, viewport }) => {
  console.log('Viewport:', viewport);
  // Adjust test based on viewport
});
```

---

## Advanced Features

### Parallel Execution

```bash
# Run tests in parallel (default)
npx playwright test --workers=4

# Run sequentially
npx playwright test --workers=1
```

### Test Isolation

Each test gets a fresh browser context (cookies, storage cleared):

```typescript
test('test 1', async ({ page }) => {
  await page.goto('/');
  // Fresh context
});

test('test 2', async ({ page }) => {
  await page.goto('/');
  // Fresh context (test 1 state cleared)
});
```

### Custom Fixtures

```typescript
// e2e/fixtures/auth.ts
import { test as base } from '@playwright/test';

export const test = base.extend<{ authenticatedPage: Page }>({
  authenticatedPage: async ({ page }, use) => {
    // Set up authenticated state
    await page.goto('/');
    await page.evaluate(() => {
      localStorage.setItem('auth-token', 'mock-token');
    });
    await use(page);
  },
});

// Use in tests
test('authenticated test', async ({ authenticatedPage }) => {
  await authenticatedPage.goto('/builder');
  // Already authenticated
});
```

---

## Resources

- **Playwright Docs:** https://playwright.dev
- **Best Practices:** https://playwright.dev/docs/best-practices
- **Selectors Guide:** https://playwright.dev/docs/selectors
- **Trace Viewer:** https://playwright.dev/docs/trace-viewer

---

## Related Documentation

- [Testing Guide](/docs/development/testing-guide.md) - Unit testing with Jest
- [Code Patterns](/docs/development/code-patterns.md) - Component patterns
- [Performance Guide](/docs/development/performance-guide.md) - Performance testing


