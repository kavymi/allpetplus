# Micro-Frontend Integration Patterns

**Last Updated:** October 23, 2025  
**Difficulty:** Intermediate  
**Time to Read:** 15 minutes

---

## Overview

This guide covers how to integrate micro-frontends into the All Pet Plus dashboard, including communication patterns, state management, and authentication flow.

---

## Table of Contents

1. [Integration Methods](#integration-methods)
2. [Communication Patterns](#communication-patterns)
3. [Authentication & Authorization](#authentication--authorization)
4. [State Management](#state-management)
5. [Error Handling](#error-handling)
6. [Styling Coordination](#styling-coordination)
7. [Performance Considerations](#performance-considerations)

---

## Integration Methods

### Method 1: Iframe Integration (Current)

**Used for:** `apps/pet-licensing/`

**Dashboard Integration:**
```typescript
// apps/web/src/app/(dashboard)/licensing/page.tsx
export default function LicensingPage() {
  return (
    <div className="space-y-6">
      <h1>Pet Licensing</h1>
      
      <iframe
        src="http://localhost:3001/dashboard"
        className="w-full h-[800px] border-0"
        title="Pet Licensing Dashboard"
        sandbox="allow-same-origin allow-scripts allow-forms"
      />
    </div>
  );
}
```

**Pros:**
- ✅ Complete isolation (no style conflicts)
- ✅ Independent deployment
- ✅ Different tech stacks possible
- ✅ Simple to implement

**Cons:**
- ⚠️ Less seamless UX (visible boundaries)
- ⚠️ Communication via postMessage
- ⚠️ Multiple auth contexts

---

### Method 2: Module Federation (Future)

**Status:** Not yet implemented

**Concept:**
```typescript
// apps/web/next.config.ts
module.exports = {
  experimental: {
    moduleFederation: {
      remotes: {
        licensing: 'licensing@http://localhost:3001/remoteEntry.js',
      },
    },
  },
};

// Usage in dashboard
import { LicensingDashboard } from 'licensing/Dashboard';

export default function LicensingPage() {
  return <LicensingDashboard />;
}
```

**Pros:**
- ✅ Seamless UX (feels like one app)
- ✅ Shared dependencies
- ✅ Direct component import
- ✅ Shared context possible

**Cons:**
- ⚠️ More complex setup
- ⚠️ Version coordination needed
- ⚠️ Build-time coupling

---

## Communication Patterns

### Pattern 1: PostMessage (Iframe)

**Parent → Child (Dashboard → Micro-Frontend):**
```typescript
// apps/web/src/app/(dashboard)/licensing/page.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function LicensingPage() {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    // Send data to micro-frontend
    const sendMessage = () => {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: 'UPDATE_USER',
          payload: { userId: 'user_123', name: 'John' },
        },
        'http://localhost:3001'
      );
    };

    sendMessage();
  }, []);

  return (
    <iframe
      ref={iframeRef}
      src="http://localhost:3001/dashboard"
      className="w-full h-[800px]"
    />
  );
}
```

**Child Receiving (Micro-Frontend):**
```typescript
// apps/pet-licensing/src/app/dashboard/page.tsx
'use client';

import { useEffect, useState } from 'react';

export default function MicroFrontendDashboard() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Verify origin
      if (event.origin !== 'http://localhost:3000') return;

      if (event.data.type === 'UPDATE_USER') {
        setUserData(event.data.payload);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  return <div>User: {userData?.name}</div>;
}
```

---

### Pattern 2: Shared State (Module Federation)

**Using React Context:**
```typescript
// Shared context provider
export const UserContext = createContext();

// Parent provides
<UserContext.Provider value={{ user, updateUser }}>
  <MicroFrontend />
</UserContext.Provider>

// Child consumes
const { user } = useContext(UserContext);
```

---

### Pattern 3: URL Parameters

**Pass data via URL:**
```typescript
// Dashboard passes userId via URL
<iframe
  src={`http://localhost:3001/dashboard?userId=${userId}&theme=dark`}
/>

// Micro-frontend reads from URL
const searchParams = useSearchParams();
const userId = searchParams.get('userId');
```

**Pros:**
- ✅ Simple
- ✅ Shareable URLs
- ✅ Stateless

**Cons:**
- ⚠️ Limited data size
- ⚠️ URL can get messy
- ⚠️ Sensitive data visible

---

## Authentication & Authorization

### Current Pattern: Separate Auth Contexts

**Problem:** Iframe creates separate browsing context

**Solution 1: Shared Cookie Domain**
```typescript
// Both apps on same domain
// Main: harnesshero.com
// Micro-frontend: licensing.harnesshero.com

// Clerk uses domain-wide cookies
// Auth automatically shared!
```

**Solution 2: Token Passing via PostMessage**
```typescript
// Dashboard passes auth token
parent.postMessage({
  type: 'AUTH_TOKEN',
  token: await getToken(),
}, 'http://localhost:3001');

// Micro-frontend stores and uses
localStorage.setItem('authToken', token);
```

**Solution 3: Backend Session Validation**
```typescript
// Micro-frontend validates with backend
const session = await fetch('/api/session', {
  credentials: 'include', // Send cookies
});
```

---

### Recommended: Backend Session Validation

**Flow:**
```
1. User logs in via Clerk (main app)
2. Session cookie set (domain-wide)
3. Micro-frontend makes request to backend
4. Backend validates session cookie
5. Returns user data
6. Micro-frontend authenticated!
```

**Implementation:**
```typescript
// apps/pet-licensing/src/app/dashboard/page.tsx
const { data: user } = trpc.user.me.useQuery();

if (!user) {
  return <div>Please log in</div>;
}

return <div>Welcome, {user.name}!</div>;
```

---

## State Management

### Strategy 1: Independent State (Current)

**Each micro-frontend manages its own state:**
```typescript
// apps/pet-licensing has its own Zustand store
const useLicensingStore = create((set) => ({
  licenses: [],
  addLicense: (license) => set((state) => ({
    licenses: [...state.licenses, license],
  })),
}));
```

**Pros:**
- ✅ Complete independence
- ✅ No conflicts
- ✅ Simple to reason about

**Cons:**
- ⚠️ Can't share state easily
- ⚠️ Duplicate data possible

---

### Strategy 2: Backend as Source of Truth

**Fetch data from backend when needed:**
```typescript
// Both dashboard and micro-frontend fetch from same API
const { data: pets } = trpc.pets.list.useQuery();
```

**Pros:**
- ✅ Always in sync
- ✅ No state coordination needed
- ✅ Backend controls access

**Cons:**
- ⚠️ More API calls
- ⚠️ Need good caching strategy

---

### Strategy 3: Shared Context (Module Federation Only)

**Not applicable with iframe integration**

---

## Error Handling

### Error Boundary in Dashboard

**Wrap micro-frontend with error boundary:**
```typescript
// apps/web/src/components/micro-frontend-wrapper.tsx
'use client';

import { ErrorBoundary } from 'react-error-boundary';

export function MicroFrontendWrapper({ src, title }: Props) {
  return (
    <ErrorBoundary
      fallback={<MicroFrontendError />}
      onError={(error) => {
        console.error('Micro-frontend error:', error);
        // Log to monitoring service
      }}
    >
      <iframe
        src={src}
        title={title}
        className="w-full h-[800px]"
        onError={() => {
          // Handle iframe load error
        }}
      />
    </ErrorBoundary>
  );
}

function MicroFrontendError() {
  return (
    <div className="p-8 text-center">
      <h2>Something went wrong</h2>
      <p>Unable to load this section. Please refresh the page.</p>
      <button onClick={() => window.location.reload()}>
        Refresh
      </button>
    </div>
  );
}
```

---

### Error Communication from Micro-Frontend

**Report errors to parent:**
```typescript
// apps/pet-licensing (micro-frontend)
try {
  await riskyOperation();
} catch (error) {
  // Notify parent
  window.parent.postMessage({
    type: 'ERROR',
    error: {
      message: error.message,
      code: 'OPERATION_FAILED',
    },
  }, '*');
}
```

**Parent handles:**
```typescript
// Dashboard listens for errors
window.addEventListener('message', (event) => {
  if (event.data.type === 'ERROR') {
    toast.error(event.data.error.message);
    // Log to monitoring
  }
});
```

---

## Styling Coordination

### Challenge: Consistent Look and Feel

**Problem:** Micro-frontend might have different styles

**Solution 1: Shared Design System**
```typescript
// Both use same Tailwind config
// Import from shared library
import { colors, spacing } from '@pet/design-tokens';
```

**Solution 2: CSS Variables**
```css
/* Main app sets CSS variables */
:root {
  --color-primary: #3b82f6;
  --color-surface: #ffffff;
}

/* Micro-frontend uses same variables */
.button {
  background: var(--color-primary);
}
```

**Solution 3: Pass Theme via URL**
```typescript
<iframe
  src={`http://localhost:3001/dashboard?theme=${currentTheme}`}
/>
```

---

### Current Implementation

**Both apps use same Tailwind CSS v4 variables:**
```css
/* Defined in globals.css (both apps) */
--color-primary: ...;
--color-surface: ...;
--color-foreground: ...;
```

---

## Performance Considerations

### Lazy Loading Micro-Frontends

**Load iframe only when needed:**
```typescript
'use client';

import { useState } from 'react';

export function LazyMicroFrontend({ src }: Props) {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div>
      {!isLoaded && <LoadingState />}
      <iframe
        src={src}
        onLoad={() => setIsLoaded(true)}
        style={{ display: isLoaded ? 'block' : 'none' }}
      />
    </div>
  );
}
```

---

### Preloading

**Preload micro-frontend on hover:**
```typescript
export function DashboardNav() {
  const [preload, setPreload] = useState<string | null>(null);

  return (
    <nav>
      <Link
        href="/licensing"
        onMouseEnter={() => setPreload('http://localhost:3001')}
      >
        Licensing
      </Link>
      
      {preload && (
        <link rel="prefetch" href={preload} />
      )}
    </nav>
  );
}
```

---

### Resource Hints

**Add to micro-frontend pages:**
```html
<head>
  <link rel="preconnect" href="http://localhost:4000" />
  <link rel="dns-prefetch" href="http://localhost:4000" />
</head>
```

---

## Best Practices

### ✅ DO

1. **Validate messages**
   ```typescript
   if (event.origin !== expectedOrigin) return;
   ```

2. **Handle loading states**
   ```typescript
   const [isLoading, setIsLoading] = useState(true);
   ```

3. **Implement error boundaries**
   ```typescript
   <ErrorBoundary fallback={<Error />}>
   ```

4. **Use semantic versioning**
   ```json
   { "version": "1.2.3" }
   ```

5. **Monitor performance**
   ```typescript
   performance.mark('micro-frontend-loaded');
   ```

---

### ❌ DON'T

1. **Don't trust all messages**
   ```typescript
   // Bad: No origin check
   window.addEventListener('message', (e) => {
     doSomething(e.data);
   });
   ```

2. **Don't share sensitive data via URL**
   ```typescript
   // Bad: Password in URL
   <iframe src="...?password=secret" />
   ```

3. **Don't couple implementations**
   ```typescript
   // Bad: Direct dependency
   import { something } from 'other-micro-frontend';
   ```

4. **Don't ignore errors**
   ```typescript
   // Bad: Silent failure
   iframe.onerror = () => {};
   ```

---

## Examples

### Complete Integration Example

**Dashboard Tab:**
```typescript
// apps/web/src/app/(dashboard)/licensing/page.tsx
'use client';

import { MicroFrontendWrapper } from '@/components/micro-frontend-wrapper';

export default function LicensingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">Pet Licensing</h1>
        <p className="text-muted-foreground">
          Manage your pet licenses and applications
        </p>
      </div>

      <MicroFrontendWrapper
        src="http://localhost:3001/dashboard"
        title="Pet Licensing Dashboard"
        minHeight="800px"
      />
    </div>
  );
}
```

**Reusable Wrapper:**
```typescript
// apps/web/src/components/micro-frontend-wrapper.tsx
'use client';

import { useState, useRef, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface Props {
  src: string;
  title: string;
  minHeight?: string;
}

export function MicroFrontendWrapper({ src, title, minHeight = '600px' }: Props) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin
      const allowedOrigins = [
        'http://localhost:3001',
        'https://pet-licensing.harnesshero.com',
      ];
      
      if (!allowedOrigins.includes(event.origin)) return;

      // Handle different message types
      switch (event.data.type) {
        case 'READY':
          setIsLoading(false);
          break;
        case 'ERROR':
          setHasError(true);
          console.error('Micro-frontend error:', event.data.error);
          break;
        case 'NAVIGATE':
          // Handle navigation request
          window.location.href = event.data.url;
          break;
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  if (hasError) {
    return (
      <div className="p-8 text-center border border-destructive rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Unable to Load</h3>
        <p className="text-muted-foreground mb-4">
          This feature is temporarily unavailable.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
        >
          Refresh Page
        </button>
      </div>
    );
  }

  return (
    <div className="relative" style={{ minHeight }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-surface">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="text-muted-foreground">Loading {title}...</p>
          </div>
        </div>
      )}
      
      <iframe
        ref={iframeRef}
        src={src}
        title={title}
        className="w-full border-0 rounded-lg"
        style={{
          minHeight,
          display: isLoading ? 'none' : 'block',
        }}
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups"
        onError={() => setHasError(true)}
      />
    </div>
  );
}
```

**Micro-Frontend Dashboard:**
```typescript
// apps/pet-licensing/src/app/dashboard/page.tsx
'use client';

import { useEffect } from 'react';

export default function LicensingDashboard() {
  useEffect(() => {
    // Notify parent that we're ready
    window.parent.postMessage({ type: 'READY' }, '*');
  }, []);

  return (
    <div className="p-6">
      <h2>Your Licenses</h2>
      {/* Dashboard content */}
    </div>
  );
}
```

---

## Troubleshooting

### Issue: Iframe not loading

**Symptoms:** Blank iframe or console errors

**Solutions:**
1. Check CORS headers
2. Verify URL is correct
3. Check CSP (Content Security Policy)
4. Ensure micro-frontend is running

---

### Issue: postMessage not working

**Symptoms:** Messages not received

**Solutions:**
1. Verify origin strings match exactly
2. Check event listener is set up
3. Ensure iframe has loaded
4. Check browser console for errors

---

### Issue: Authentication not working

**Symptoms:** User not authenticated in micro-frontend

**Solutions:**
1. Check cookie domain settings
2. Verify credentials: 'include' in fetch
3. Ensure backend validates session
4. Check CORS credentials allowed

---

## Related Documentation

- [Create New Micro-Frontend](./create-new-microfrontend.md)
- [Micro-Frontend Architecture](/docs/architecture/microfrontend-architecture.md)
- [Authentication Setup](/docs/guides/environment-setup.md)

---

**Questions or issues?** Check the troubleshooting guide or create a discussion.

**Last Updated:** October 23, 2025

