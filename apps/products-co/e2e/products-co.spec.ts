import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:3001';

test.describe('Products CO - E2E Tests', () => {
  test.describe('Landing Page', () => {
    test('should load landing page successfully', async ({ page }) => {
      await page.goto(BASE_URL);
      await expect(page.getByRole('heading', { name: /Unique as Your Pet/i })).toBeVisible();
    });

    test('should navigate to custom builder', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.getByRole('link', { name: /Start Custom Builder/i }).click();
      await expect(page).toHaveURL(`${BASE_URL}/builder`);
    });

    test('should navigate to catalog', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.getByRole('link', { name: /Browse Catalog/i }).click();
      await expect(page).toHaveURL(`${BASE_URL}/catalog`);
    });
  });

  test.describe('Product Catalog', () => {
    test('should display catalog page with products', async ({ page }) => {
      await page.goto(`${BASE_URL}/catalog`);
      await expect(page.getByRole('heading', { name: /Shop Premium Pet Gear/i })).toBeVisible();
    });

    test('should filter products by category', async ({ page }) => {
      await page.goto(`${BASE_URL}/catalog`);
      
      // Click collars category
      await page.getByRole('button', { name: /Collars/i }).click();
      
      // Verify filter is applied (visual feedback)
      const collarButton = page.getByRole('button', { name: /Collars/i });
      await expect(collarButton).toHaveClass(/bg-\[var\(--color-primary\)\]/);
    });

    test('should show all products when All Products is selected', async ({ page }) => {
      await page.goto(`${BASE_URL}/catalog`);
      await page.getByRole('button', { name: /All Products/i }).click();
      // Should show all products without filters
    });
  });

  test.describe('Shopping Cart', () => {
    test('should open cart sidebar when cart icon is clicked', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Click cart icon
      await page.getByRole('button', { name: /Shopping cart/i }).click();
      
      // Cart sidebar should be visible
      await expect(page.getByRole('heading', { name: /Shopping Cart/i })).toBeVisible();
    });

    test('should show empty cart state', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.getByRole('button', { name: /Shopping cart/i }).click();
      
      await expect(page.getByText(/Your cart is empty/i)).toBeVisible();
    });

    test('should close cart when backdrop is clicked', async ({ page }) => {
      await page.goto(BASE_URL);
      await page.getByRole('button', { name: /Shopping cart/i }).click();
      
      // Click backdrop (outside cart)
      await page.locator('.fixed.inset-0.bg-black\\/50').click();
      
      // Cart should be closed
      await expect(page.getByRole('heading', { name: /Shopping Cart/i })).not.toBeVisible();
    });
  });

  test.describe('Subscription Boxes', () => {
    test('should display subscription options', async ({ page }) => {
      await page.goto(`${BASE_URL}/subscriptions`);
      
      await expect(page.getByRole('heading', { name: /Monthly Subscription Boxes/i })).toBeVisible();
      await expect(page.getByText(/The Essential Box/i)).toBeVisible();
      await expect(page.getByText(/The Deluxe Box/i)).toBeVisible();
    });

    test('should show pricing for both tiers', async ({ page }) => {
      await page.goto(`${BASE_URL}/subscriptions`);
      
      await expect(page.getByText('$39.99')).toBeVisible();
      await expect(page.getByText('$79.99')).toBeVisible();
    });

    test('should have subscribe buttons for each tier', async ({ page }) => {
      await page.goto(`${BASE_URL}/subscriptions`);
      
      const subscribeButtons = page.getByRole('link', { name: /Subscribe Now/i });
      await expect(subscribeButtons).toHaveCount(2);
    });
  });

  test.describe('Navigation', () => {
    test('should have working navigation links', async ({ page }) => {
      await page.goto(BASE_URL);
      
      // Click Shop link
      await page.getByRole('link', { name: 'Shop' }).click();
      await expect(page).toHaveURL(`${BASE_URL}/catalog`);
      
      // Click Home link
      await page.getByRole('link', { name: 'Home' }).click();
      await expect(page).toHaveURL(BASE_URL + '/');
    });

    test('should link to main app dashboard', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const dashboardLink = page.getByRole('link', { name: 'Dashboard' });
      await expect(dashboardLink).toHaveAttribute('href', 'http://localhost:3000/dashboard');
    });

    test('should link to alliance hub', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const allianceLink = page.getByRole('link', { name: 'All Pet Plus' });
      await expect(allianceLink).toHaveAttribute('href', 'http://localhost:3000');
    });
  });

  test.describe('Builder Flow', () => {
    test('should load builder page', async ({ page }) => {
      await page.goto(`${BASE_URL}/builder`);
      
      // Should show loading state first, then builder
      await expect(page.getByText(/Loading your perfect builder/i)).toBeVisible();
    });

    test('should support product type selection via URL', async ({ page }) => {
      // Test with harness
      await page.goto(`${BASE_URL}/builder?productType=harness`);
      await page.waitForLoadState('networkidle');
      
      // Test with collar
      await page.goto(`${BASE_URL}/builder?productType=collar`);
      await page.waitForLoadState('networkidle');
      
      // Test with leash
      await page.goto(`${BASE_URL}/builder?productType=leash`);
      await page.waitForLoadState('networkidle');
    });
  });

  test.describe('Dashboard Integration', () => {
    test('should load dashboard page', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      await expect(page.getByRole('heading', { name: /My Products/i })).toBeVisible();
    });

    test('should show quick stats cards', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      await expect(page.getByText(/Saved Designs/i)).toBeVisible();
      await expect(page.getByText(/Orders/i)).toBeVisible();
      await expect(page.getByText(/Active Subscription/i)).toBeVisible();
    });

    test('should have links to key features', async ({ page }) => {
      await page.goto(`${BASE_URL}/dashboard`);
      
      await expect(page.getByRole('link', { name: /Start New Design/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Browse Subscription Boxes/i })).toBeVisible();
      await expect(page.getByRole('link', { name: /Browse Catalog/i })).toBeVisible();
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper heading hierarchy', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const h1 = page.locator('h1');
      await expect(h1).toBeVisible();
    });

    test('should have accessible navigation', async ({ page }) => {
      await page.goto(BASE_URL);
      
      const nav = page.locator('nav');
      await expect(nav).toBeVisible();
    });

    test('should have aria labels for interactive elements', async ({ page }) => {
      await page.goto(BASE_URL);
      
      await expect(page.getByRole('button', { name: /Shopping cart/i })).toBeVisible();
    });
  });

  test.describe('Responsive Design', () => {
    test('should display correctly on mobile', async ({ page }) => {
      await page.setViewportSize({ width: 375, height: 667 });
      await page.goto(BASE_URL);
      
      await expect(page.getByRole('heading', { name: /Unique as Your Pet/i })).toBeVisible();
    });

    test('should display correctly on tablet', async ({ page }) => {
      await page.setViewportSize({ width: 768, height: 1024 });
      await page.goto(BASE_URL);
      
      await expect(page.getByRole('heading', { name: /Unique as Your Pet/i })).toBeVisible();
    });

    test('should display correctly on desktop', async ({ page }) => {
      await page.setViewportSize({ width: 1920, height: 1080 });
      await page.goto(BASE_URL);
      
      await expect(page.getByRole('heading', { name: /Unique as Your Pet/i })).toBeVisible();
    });
  });
});

