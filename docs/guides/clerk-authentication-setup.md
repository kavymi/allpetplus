# Clerk Authentication Setup Guide

## Overview

All Pet Plus uses [Clerk](https://clerk.com) for authentication. This guide walks you through setting up Clerk for local development and production.

## Quick Start

### 1. Get Clerk API Keys

1. Go to [dashboard.clerk.com](https://dashboard.clerk.com)
2. Create a new application or select existing one
3. Navigate to **API Keys** in the sidebar
4. Copy your **Publishable Key** (starts with `pk_test_...` or `pk_live_...`)

### 2. Configure Environment Variables

Create or update `apps/web/.env`:

```bash
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
```

**Important:** Use `VITE_` prefix (not `NEXT_PUBLIC_`) since this is a Vite app.

### 3. Restart Development Server

```bash
# Stop the current server (Ctrl+C)
cd /Users/kavyrattana/Coding/allpetplus
npx nx dev web
```

### 4. Test Authentication

Visit:
- Sign In: [http://localhost:3000/sign-in](http://localhost:3000/sign-in)
- Sign Up: [http://localhost:3000/sign-up](http://localhost:3000/sign-up)

## What Was Fixed

The authentication flow wasn't working due to several issues:

### ✅ Issues Resolved

1. **Missing Clerk Package** - Installed `@clerk/clerk-react`
2. **Wrong Environment Variables** - Updated from `NEXT_PUBLIC_*` to `VITE_*`
3. **Invalid Middleware** - Removed Next.js middleware file (not compatible with Vite)
4. **Missing Routes** - Created dedicated `/sign-in` and `/sign-up` pages

### Changes Made

```diff
+ Installed: @clerk/clerk-react
+ Created: apps/web/app/routes/sign-in.tsx
+ Created: apps/web/app/routes/sign-up.tsx
+ Updated: apps/web/env.template (VITE_ prefix)
+ Updated: apps/web/src/lib/clerk-components.tsx (improved SignInButton)
- Removed: apps/web/src/middleware.ts (Next.js only, not for Vite)
```

## Architecture

### ClerkProvider Setup

The app wraps all components with `ClerkProvider` in the root:

```typescript
// apps/web/app/routes/__root.tsx
import { ClerkProvider } from '../lib/clerk-provider';

function RootProviders({ children }) {
  return (
    <ClerkProvider>
      {/* Other providers */}
    </ClerkProvider>
  );
}
```

### Graceful Degradation

The app works without Clerk configured (for development):

```typescript
// If VITE_CLERK_PUBLISHABLE_KEY is not set:
// - Sign-in pages show setup instructions
// - SignInButton links to /sign-in route
// - SignedOut components always render
// - SignedIn components never render
```

## Authentication Routes

### Sign In Page

**URL:** `/sign-in`

Features:
- Clerk's pre-built SignIn component
- Redirects to `/dashboard` after sign-in
- Shows setup instructions if Clerk not configured
- Custom appearance matching design system

### Sign Up Page

**URL:** `/sign-up`

Features:
- Clerk's pre-built SignUp component
- Redirects to `/dashboard` after sign-up
- Shows setup instructions if Clerk not configured
- Custom appearance matching design system

## Using Auth Components

### SignedIn / SignedOut

```tsx
import { SignedIn, SignedOut } from '@/lib/clerk-components';

export function Component() {
  return (
    <>
      <SignedOut>
        <p>Please sign in to continue</p>
      </SignedOut>
      
      <SignedIn>
        <p>Welcome back!</p>
      </SignedIn>
    </>
  );
}
```

### SignInButton

```tsx
import { SignInButton } from '@/lib/clerk-components';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <SignInButton mode="modal" fallbackRedirectUrl="/dashboard">
      <Button>Sign In</Button>
    </SignInButton>
  );
}
```

### UserButton

```tsx
import { UserButton } from '@/lib/clerk-components';

export function Header() {
  return (
    <div>
      <UserButton />
    </div>
  );
}
```

### useAuth Hook

```tsx
import { useSafeAuth } from '@/lib/clerk-components';

export function Component() {
  const { isSignedIn, userId, isLoaded } = useSafeAuth();
  
  if (!isLoaded) return <LoadingState />;
  
  if (!isSignedIn) {
    return <SignInPrompt />;
  }
  
  return <AuthenticatedContent userId={userId} />;
}
```

## Customization

### Appearance Customization

Clerk components are styled to match the All Pet Plus design system:

```typescript
appearance={{
  variables: {
    colorPrimary: '#3BAFDA',
    colorBackground: 'rgba(255,255,255,0.92)',
    colorText: '#1B2333',
  },
  elements: {
    formButtonPrimary: 'rounded-full font-semibold tracking-wide',
    card: 'rounded-[28px] border shadow-[var(--shadow-soft)]',
  },
}}
```

### Redirect URLs

Configure where users go after authentication:

```typescript
<SignIn 
  afterSignInUrl="/dashboard"
  afterSignUpUrl="/dashboard"
/>
```

## Production Deployment

### Environment Variables

Set in Vercel/hosting platform:

```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_live_your_production_key
```

### Allowed Origins

In Clerk Dashboard:
1. Go to **Settings** → **Domains**
2. Add your production domain (e.g., `https://allpetplus.com`)
3. Add redirect URLs:
   - `https://allpetplus.com/sign-in`
   - `https://allpetplus.com/sign-up`
   - `https://allpetplus.com/dashboard`

## Backend Integration

### tRPC Context

User authentication is available in tRPC context:

```typescript
// libs/api/src/context.ts
export async function createContext({ req }: CreateContextOptions) {
  // Extract Clerk user from request
  const userId = req.auth?.userId;
  
  return {
    db: prisma,
    userId,
  };
}
```

### Protected Procedures

```typescript
// libs/api/src/routers/designs.ts
export const designsRouter = router({
  list: protectedProcedure
    .query(async ({ ctx }) => {
      // ctx.userId is guaranteed to exist
      return ctx.db.savedDesign.findMany({
        where: { userId: ctx.userId },
      });
    }),
});
```

## Troubleshooting

### Issue: "SignIn can only be used within ClerkProvider"

**Solution:** Ensure `ClerkProvider` wraps your app in `__root.tsx`

### Issue: Sign-in page shows setup instructions

**Solution:** 
1. Check `.env` file exists: `apps/web/.env`
2. Verify variable name: `VITE_CLERK_PUBLISHABLE_KEY` (not `NEXT_PUBLIC_`)
3. Restart dev server after adding env var

### Issue: Sign-in button doesn't work

**Solution:**
1. Check browser console for errors
2. Verify Clerk package installed: `npm list @clerk/clerk-react`
3. Check environment variable is loaded: `console.log(import.meta.env.VITE_CLERK_PUBLISHABLE_KEY)`

### Issue: "Invalid publishable key"

**Solution:**
1. Verify key starts with `pk_test_` or `pk_live_`
2. Check for spaces or quotes in `.env` file
3. Get fresh key from Clerk dashboard

## Development Without Clerk

The app gracefully handles missing Clerk configuration:

- **Sign-in pages** show setup instructions with direct link to Clerk dashboard
- **SignInButton** links to `/sign-in` route (still functional)
- **Protected features** show "Sign in required" message
- **No crashes** - all auth components have fallbacks

This allows:
- ✅ New developers to start without Clerk setup
- ✅ Design/frontend work without authentication
- ✅ Clear setup instructions when needed

## Testing

### Manual Testing

1. Visit `/sign-in` and create test account
2. Check redirect to `/dashboard`
3. Verify UserButton shows in header
4. Sign out and verify redirect
5. Test `/sign-up` flow

### E2E Testing

```typescript
// apps/web/e2e/auth.spec.ts
import { test, expect } from '@playwright/test';

test('sign in flow', async ({ page }) => {
  await page.goto('/sign-in');
  await page.fill('[name="identifier"]', 'test@example.com');
  await page.fill('[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await expect(page).toHaveURL('/dashboard');
});
```

## Additional Resources

- [Clerk Documentation](https://clerk.com/docs)
- [Clerk React SDK](https://clerk.com/docs/references/react/overview)
- [TanStack Router + Clerk](https://clerk.com/docs/references/tanstack-router)
- [Environment Setup Guide](./environment-setup.md)

## Support

If you encounter issues:

1. Check this guide's troubleshooting section
2. Review [Clerk documentation](https://clerk.com/docs)
3. Check browser console for specific errors
4. Verify all environment variables are set correctly





