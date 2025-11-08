# Troubleshooting & FAQ Guide

## Overview

This guide provides solutions to common issues, frequently asked questions, and debugging techniques for the All Pet Plus codebase.

## Table of Contents

1. [Common Development Issues](#common-development-issues)
2. [Build & Deployment Issues](#build--deployment-issues)
3. [Database Issues](#database-issues)
4. [API & Integration Issues](#api--integration-issues)
5. [Performance Issues](#performance-issues)
6. [Testing Issues](#testing-issues)
7. [Frequently Asked Questions](#frequently-asked-questions)
8. [Debugging Techniques](#debugging-techniques)

## Common Development Issues

### Issue: React Three Fiber "ReactCurrentOwner" Error

**Symptoms:**
```
Cannot read properties of undefined (reading 'ReactCurrentOwner')
Error occurs when importing from @react-three/fiber or @react-three/drei
```

**Solution:**
This is a React 19 compatibility issue caused by duplicate React installations. See [React 19 Compatibility Guide](./troubleshooting/react-19-compatibility.md) for detailed fix.

Quick fix:
```bash
# Clean and reinstall with overrides
rm -rf node_modules package-lock.json apps/*/node_modules
npm install
```

The project now uses NPM overrides to force React 19 across all dependencies.

### Issue: "Module not found" errors after pulling latest code

**Symptoms:**
```
Error: Cannot find module '@pet/shared'
```

**Solution:**
```bash
# Clear all caches and reinstall
npm run clean
npm install
nx reset

# If using VS Code, restart TypeScript server
Cmd/Ctrl + Shift + P → "TypeScript: Restart TS Server"
```

### Issue: TypeScript errors in IDE but build succeeds

**Symptoms:**
- Red squiggles in editor
- `tsc` passes but IDE shows errors

**Solution:**
```bash
# Regenerate TypeScript project references
nx run-many --target=build --projects=libs/* --skip-nx-cache

# Clear TypeScript cache
rm -rf node_modules/.cache/typescript

# Update VS Code settings
{
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### Issue: Hot reload not working in Next.js

**Symptoms:**
- Changes don't reflect in browser
- Need to manually refresh

**Solution:**
```bash
# Check if file watching limit is reached
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Clear Next.js cache
rm -rf apps/web/.next
npm run dev:web

# Check for conflicting ports
lsof -i :3000
kill -9 <PID>
```

### Issue: "Port already in use" errors

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Solution:**
```bash
# Find and kill process using the port
# macOS/Linux
lsof -ti:3000 | xargs kill -9
lsof -ti:3001 | xargs kill -9

# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Use different ports
PORT=3002 nx dev web
PORT=3003 nx serve backend
```

## Build & Deployment Issues

### Issue: Build fails with "out of memory" error

**Symptoms:**
```
FATAL ERROR: Reached heap limit Allocation failed - JavaScript heap out of memory
```

**Solution:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=8192"

# Or add to package.json scripts
{
  "scripts": {
    "build": "NODE_OPTIONS='--max-old-space-size=8192' nx build web"
  }
}

# For CI/CD, add to workflow
env:
  NODE_OPTIONS: "--max-old-space-size=8192"
```

### Issue: Docker build fails

**Symptoms:**
- Docker image build errors
- Missing dependencies in container

**Solution:**
```dockerfile
# Ensure correct build context
docker build -f apps/web/Dockerfile -t all-pet-plus-web .

# Multi-stage build optimization
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

FROM node:20-alpine AS builder
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
CMD ["node", "dist/main.js"]
```

### Issue: Environment variables not loading

**Symptoms:**
- `undefined` values for env vars
- Features not working in production

**Solution:**
```bash
# Check .env file location
ls -la apps/web/.env.local
ls -la services/backend/.env

# Verify Next.js env loading
console.log('Public vars:', {
  APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  API_URL: process.env.NEXT_PUBLIC_API_URL,
});

# For production builds
# Build-time variables must be present during build
NEXT_PUBLIC_APP_URL=https://harnesshero.com npm run build
```

## Database Issues

### Issue: "Connection refused" to PostgreSQL

**Symptoms:**
```
Error: connect ECONNREFUSED 127.0.0.1:5432
```

**Solution:**
```bash
# Check if PostgreSQL is running
docker-compose ps

# Start database services
make db-up

# Verify connection string
echo $DATABASE_URL

# Test connection
docker exec -it pet_postgres_1 psql -U postgres -d harness_hero -c "SELECT 1;"

# Common connection string format
DATABASE_URL="postgresql://postgres:password@localhost:5432/harness_hero?schema=public"
```

### Issue: Prisma migration failures

**Symptoms:**
```
Error: P3009 migrate found failed migrations
```

**Solution:**
```bash
# Check migration status
npx prisma migrate status

# Reset database (CAUTION: destroys data)
npx prisma migrate reset

# Fix failed migration
npx prisma migrate resolve --applied "20240101000000_migration_name"

# Create new migration after schema changes
npx prisma migrate dev --name fix_issue

# For production
npx prisma migrate deploy
```

### Issue: "Too many connections" error

**Symptoms:**
```
Error: remaining connection slots are reserved
```

**Solution:**
```sql
-- Check current connections
SELECT count(*) FROM pg_stat_activity;

-- Kill idle connections
SELECT pg_terminate_backend(pid) 
FROM pg_stat_activity 
WHERE state = 'idle' 
  AND state_change < current_timestamp - interval '5 minutes';
```

```typescript
// Implement connection pooling
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
```

## API & Integration Issues

### Issue: CORS errors in development

**Symptoms:**
```
Access to fetch at 'http://localhost:3001' from origin 'http://localhost:3000' has been blocked by CORS policy
```

**Solution:**
```typescript
// Backend CORS configuration
await server.register(cors, {
  origin: (origin, cb) => {
    const allowedOrigins = process.env.CORS_ORIGIN?.split(',') || [];
    
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) return cb(null, true);
    
    if (allowedOrigins.includes(origin)) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});

// Frontend API configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Issue: Shopify webhook verification fails

**Symptoms:**
```
Error: Invalid webhook signature
```

**Solution:**
```typescript
// Correct webhook verification
import crypto from 'crypto';

export function verifyWebhookSignature(
  rawBody: string,
  signature: string,
  secret: string
): boolean {
  const hash = crypto
    .createHmac('sha256', secret)
    .update(rawBody, 'utf8')
    .digest('base64');
    
  return hash === signature;
}

// Fastify raw body handling
fastify.addContentTypeParser(
  'application/json',
  { parseAs: 'buffer' },
  (req, body, done) => {
    try {
      const json = JSON.parse(body.toString());
      done(null, json);
    } catch (err) {
      done(err as Error, undefined);
    }
  }
);
```

### Issue: Clerk authentication not working

**Symptoms:**
- 401 errors on authenticated routes
- User session not persisting

**Solution:**
```typescript
// Check Clerk environment variables
console.log({
  publishableKey: process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY,
  secretKey: process.env.CLERK_SECRET_KEY?.substring(0, 10) + '...',
});

// Middleware configuration
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtectedRoute = createRouteMatcher([
  '/account(.*)',
  '/api/designs(.*)',
]);

export default clerkMiddleware((auth, req) => {
  if (isProtectedRoute(req)) {
    auth().protect();
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
```

## Performance Issues

### Issue: Slow builder preview rendering

**Symptoms:**
- Laggy preview updates
- High CPU usage

**Solution:**
```typescript
// Implement debouncing
const debouncedUpdate = useMemo(
  () => debounce((selection: BuilderSelection) => {
    updatePreview(selection);
  }, 300),
  []
);

// Use Web Workers for heavy computation
const worker = new Worker(
  new URL('../workers/preview.worker.ts', import.meta.url)
);

// Optimize canvas operations
const canvas = canvasRef.current;
const ctx = canvas.getContext('2d', { alpha: false });
ctx.imageSmoothingEnabled = true;
ctx.imageSmoothingQuality = 'high';

// Cache rendered layers
const layerCache = new Map<string, ImageBitmap>();
```

### Issue: Large bundle size

**Symptoms:**
- Slow initial page load
- Poor Lighthouse scores

**Solution:**
```bash
# Analyze bundle
npm run analyze

# Common optimizations
# 1. Dynamic imports
const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <Skeleton />,
  ssr: false,
});

# 2. Tree shaking imports
// Bad
import _ from 'lodash';
// Good
import debounce from 'lodash/debounce';

# 3. Optimize images
next.config.js:
images: {
  formats: ['image/avif', 'image/webp'],
  minimumCacheTTL: 60,
}
```

### Issue: Memory leaks in development

**Symptoms:**
- Browser tab becomes unresponsive
- Memory usage keeps growing

**Solution:**
```typescript
// Clean up event listeners
useEffect(() => {
  const handleResize = () => {
    // Handle resize
  };
  
  window.addEventListener('resize', handleResize);
  
  return () => {
    window.removeEventListener('resize', handleResize);
  };
}, []);

// Clean up intervals/timeouts
useEffect(() => {
  const timer = setInterval(() => {
    // Periodic task
  }, 1000);
  
  return () => clearInterval(timer);
}, []);

// Unsubscribe from observables
useEffect(() => {
  const subscription = store.subscribe((state) => {
    // Handle state changes
  });
  
  return () => subscription();
}, []);
```

## Testing Issues

### Issue: Tests failing in CI but passing locally

**Symptoms:**
- Inconsistent test results
- Timeout errors in CI

**Solution:**
```typescript
// Increase test timeouts for CI
jest.setTimeout(30000); // 30 seconds

// Use proper async handling
it('should fetch data', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});

// Wait for elements properly
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
}, { timeout: 5000 });

// Mock timers consistently
beforeEach(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  jest.runOnlyPendingTimers();
  jest.useRealTimers();
});
```

### Issue: "Cannot find module" in tests

**Symptoms:**
```
Cannot find module '@/components/Button' from 'Button.test.tsx'
```

**Solution:**
```javascript
// jest.config.js
module.exports = {
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@pet/shared(.*)$': '<rootDir>/../../libs/shared/src$1',
  },
  moduleDirectories: ['node_modules', '<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

## Frequently Asked Questions

### Q: How do I add a new package to the monorepo?

**A:** Use NX generators:
```bash
# Add a new library
nx g @nx/js:lib my-new-lib --directory=libs

# Add a new app
nx g @nx/next:app my-new-app --directory=apps

# Update dependencies
npm install my-package
nx affected:build
```

### Q: How do I debug server-side code in Next.js?

**A:** Use Node.js debugging:
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Next.js Debug",
      "runtimeExecutable": "npm",
      "runtimeArgs": ["run", "dev"],
      "port": 9229,
      "cwd": "${workspaceFolder}/apps/web",
      "console": "integratedTerminal"
    }
  ]
}
```

### Q: How do I test Shopify webhooks locally?

**A:** Use ngrok for local webhook testing:
```bash
# Install ngrok
brew install ngrok

# Start your backend
nx serve backend

# Expose local server
ngrok http 3001

# Configure webhook URL in Shopify
# https://xxxxx.ngrok.io/api/webhooks/shopify
```

### Q: How do I optimize database queries?

**A:** Use Prisma query analysis:
```typescript
// Enable query logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// Use explain to analyze queries
const result = await prisma.$queryRaw`
  EXPLAIN ANALYZE
  SELECT * FROM saved_designs 
  WHERE user_id = ${userId}
  ORDER BY created_at DESC
  LIMIT 10
`;

// Use includes wisely
const userWithDesigns = await prisma.userProfile.findUnique({
  where: { id: userId },
  include: {
    savedDesigns: {
      where: { status: 'ACTIVE' },
      orderBy: { createdAt: 'desc' },
      take: 10,
    },
  },
});
```

### Q: How do I handle feature flags?

**A:** Implement feature flag system:
```typescript
// lib/feature-flags.ts
export const features = {
  newBuilder: process.env.NEXT_PUBLIC_FEATURE_NEW_BUILDER === 'true',
  aiSizing: process.env.NEXT_PUBLIC_FEATURE_AI_SIZING === 'true',
  threeDPreview: process.env.NEXT_PUBLIC_FEATURE_3D_PREVIEW === 'true',
};

// Usage in components
if (features.newBuilder) {
  return <NewBuilderExperience />;
}
return <ClassicBuilder />;
```

### Q: How do I profile React performance?

**A:** Use React DevTools Profiler:
```typescript
// Enable profiling in development
import { Profiler } from 'react';

function onRenderCallback(
  id: string,
  phase: 'mount' | 'update',
  actualDuration: number
) {
  console.log(`${id} (${phase}) took ${actualDuration}ms`);
}

<Profiler id="Builder" onRender={onRenderCallback}>
  <BuilderShell />
</Profiler>

// Use React.memo for expensive components
export const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
}, (prevProps, nextProps) => {
  // Return true if props are equal
  return prevProps.data.id === nextProps.data.id;
});
```

## Debugging Techniques

### 1. Backend Debugging

```typescript
// Enable detailed logging
const server = Fastify({
  logger: {
    level: 'debug',
    prettyPrint: {
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname',
      messageFormat: '{req.method} {req.url} - {msg}',
    },
  },
});

// Request logging
server.addHook('onRequest', async (request) => {
  request.log.info({ 
    body: request.body,
    query: request.query,
    params: request.params,
  }, 'Incoming request');
});

// Use debugger
debugger; // Pause execution when debugging
```

### 2. Frontend Debugging

```typescript
// Console debugging helpers
const debug = process.env.NODE_ENV === 'development' ? console.log : () => {};

debug('Selection updated:', selection);

// React Query debugging
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.error('Query error:', error);
      },
    },
  },
});

// Redux DevTools for Zustand
import { devtools } from 'zustand/middleware';

const useStore = create()(
  devtools(
    (set) => ({
      // Store implementation
    }),
    {
      name: 'builder-store',
    }
  )
);
```

### 3. Network Debugging

```typescript
// Intercept fetch requests
if (process.env.NODE_ENV === 'development') {
  const originalFetch = window.fetch;
  window.fetch = async (...args) => {
    console.log('Fetch:', args);
    const response = await originalFetch(...args);
    console.log('Response:', response);
    return response;
  };
}

// Log all API calls
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config);
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response);
    return response;
  },
  (error) => {
    console.error('API Response Error:', error);
    return Promise.reject(error);
  }
);
```

### 4. Performance Debugging

```typescript
// Measure component render time
console.time('BuilderRender');
const result = render(<Builder />);
console.timeEnd('BuilderRender');

// Track re-renders
function useWhyDidYouUpdate(name: string, props: Record<string, any>) {
  const previousProps = useRef<Record<string, any>>();
  
  useEffect(() => {
    if (previousProps.current) {
      const allKeys = Object.keys({ ...previousProps.current, ...props });
      const changedProps: Record<string, any> = {};
      
      allKeys.forEach((key) => {
        if (previousProps.current![key] !== props[key]) {
          changedProps[key] = {
            from: previousProps.current![key],
            to: props[key],
          };
        }
      });
      
      if (Object.keys(changedProps).length) {
        console.log('[why-did-you-update]', name, changedProps);
      }
    }
    
    previousProps.current = props;
  });
}

// Usage
function MyComponent(props) {
  useWhyDidYouUpdate('MyComponent', props);
  // Component logic
}
```

## Micro-Frontend Issues

### Issue: Iframe not loading micro-frontend

**Symptoms:**
- Blank iframe or loading forever
- Console errors about refused connection

**Solution:**
```bash
# 1. Verify micro-frontend is running
nx dev pet-licensing

# 2. Check the URL in iframe
# apps/web/src/app/(dashboard)/licensing/page.tsx
<iframe src="http://localhost:3001/dashboard" />

# 3. Check CORS if different domain
# Ensure micro-frontend allows iframe embedding

# 4. Check CSP headers
# May need to adjust Content-Security-Policy

# 5. Verify sandbox attributes
sandbox="allow-same-origin allow-scripts allow-forms"
```

---

### Issue: Authentication not working in micro-frontend

**Symptoms:**
- User logged in dashboard but not in micro-frontend
- 401 errors in iframe

**Solution:**
```typescript
// Solution 1: Share cookies via domain
// Both on same domain (harnesshero.com)
// Clerk cookies automatically shared

// Solution 2: Pass auth token via postMessage
// Parent sends token to iframe
window.frames[0].postMessage({
  type: 'AUTH_TOKEN',
  token: await getToken(),
}, 'http://localhost:3001');

// Iframe receives and uses
window.addEventListener('message', (event) => {
  if (event.data.type === 'AUTH_TOKEN') {
    // Use token for API calls
  }
});

// Solution 3: Backend session validation (recommended)
// Both apps call backend with credentials
const session = await fetch('/api/session', {
  credentials: 'include',
});
```

---

### Issue: PostMessage not working between apps

**Symptoms:**
- Messages not received
- No errors in console

**Solution:**
```typescript
// Check origin matches exactly
window.addEventListener('message', (event) => {
  // ❌ This will fail
  if (event.origin !== 'http://localhost:3001/') return;
  
  // ✅ Correct (no trailing slash)
  if (event.origin !== 'http://localhost:3001') return;
  
  // ✅ Or check production origins
  const allowed = [
    'http://localhost:3000',
    'https://harnesshero.com',
    'https://www.harnesshero.com',
  ];
  if (!allowed.includes(event.origin)) return;
  
  // Process message
});

// Ensure iframe has loaded before sending
iframeRef.current?.contentWindow?.postMessage(data, targetOrigin);
```

---

## tRPC Issues

### Issue: "Unexpected token" in tRPC responses

**Symptoms:**
```
TRPCClientError: Unexpected token < in JSON at position 0
```

**Solution:**
```typescript
// This usually means the API returned HTML instead of JSON
// Common causes:

// 1. Wrong API endpoint
// Fix: Check NEXT_PUBLIC_API_URL
console.log(process.env.NEXT_PUBLIC_API_URL);

// 2. Server error (500) returning error page
// Fix: Check server logs for actual error

// 3. CORS preflight failing
// Fix: Check CORS configuration

// 4. Middleware redirecting
// Fix: Ensure /api/trpc/* routes bypass redirects

// Debug with Network tab
// Look at Response preview - if it's HTML, you're hitting wrong endpoint
```

---

### Issue: Type errors after updating tRPC router

**Symptoms:**
```
Type 'unknown' is not assignable to type 'MyType'
```

**Solution:**
```bash
# Restart TypeScript server
# VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server"

# Rebuild API library
nx build api

# Clear NX cache
nx reset

# Restart dev server
npm run dev
```

---

### Issue: tRPC context not available

**Symptoms:**
```
Cannot read properties of undefined (reading 'db')
```

**Solution:**
```typescript
// Ensure tRPC provider wraps your app
// apps/web/src/app/layout.tsx

import { TRPCProvider } from '@/lib/trpc-provider';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <TRPCProvider>{children}</TRPCProvider>
      </body>
    </html>
  );
}

// Check context creation
// libs/api/src/context.ts
export async function createContext(opts: CreateNextContextOptions) {
  const { userId } = getAuth(opts.req);
  
  return {
    db: prisma,  // Ensure this is defined!
    userId,
  };
}
```

---

## Docker Issues

### Issue: Docker containers won't start

**Symptoms:**
```
ERROR: for harness-postgres  Cannot start service postgres
```

**Solution:**
```bash
# 1. Check Docker is running
docker ps

# 2. Check ports not already in use
lsof -i :5432
lsof -i :6379

# 3. Remove old containers and volumes
docker-compose -f docker-compose.dev.yml down -v

# 4. Check disk space
docker system df
docker system prune -a  # Free up space

# 5. Rebuild from scratch
docker-compose -f docker-compose.dev.yml up --build

# 6. Check logs
docker-compose -f docker-compose.dev.yml logs postgres
```

---

### Issue: Volume mount permissions on Linux

**Symptoms:**
```
Permission denied when accessing files
```

**Solution:**
```yaml
# docker-compose.yml
services:
  backend:
    user: "${UID}:${GID}"  # Use current user
    volumes:
      - ./services/backend:/app
```

```bash
# Set environment variables
export UID=$(id -u)
export GID=$(id -g)
docker-compose up
```

---

### Issue: Hot reload not working in Docker

**Symptoms:**
- Code changes not reflected
- Need to rebuild container

**Solution:**
```yaml
# Ensure volumes are mounted correctly
volumes:
  - ./services/backend:/app
  - /app/node_modules  # Exclude node_modules

# Use polling for file watching
command: npm run dev -- --poll

# Or use nodemon
command: nodemon --legacy-watch src/main.ts
```

---

## NX Issues

### Issue: NX cache causing stale builds

**Symptoms:**
- Changes not reflected
- Old code running

**Solution:**
```bash
# Clear NX cache
nx reset

# Skip cache for specific command
nx build web --skip-nx-cache

# Clear all build artifacts
npm run clean

# Disable cache temporarily
NX_SKIP_NX_CACHE=true nx build web
```

---

### Issue: Affected commands not detecting changes

**Symptoms:**
```
nx affected:test
# No projects affected (but you changed code!)
```

**Solution:**
```bash
# Check git status
git status

# Ensure changes are committed/staged
git add .

# Check base branch
nx affected:graph --base=main

# Force test all
nx run-many --target=test --all
```

---

## Environment Variable Issues

### Issue: Env vars undefined in frontend

**Symptoms:**
```typescript
process.env.NEXT_PUBLIC_API_URL === undefined
```

**Solution:**
```bash
# 1. Check file exists
ls -la apps/web/.env.local

# 2. Check variable naming
# Must start with NEXT_PUBLIC_ for client-side
NEXT_PUBLIC_API_URL=http://localhost:4000  ✅
API_URL=http://localhost:4000              ❌ (not accessible in browser)

# 3. Restart dev server after changing .env
# Kill and restart:
npm run dev

# 4. For build-time variables
NEXT_PUBLIC_API_URL=https://api.prod.com npm run build
```

---

### Issue: Backend env vars not loading

**Symptoms:**
```typescript
process.env.DATABASE_URL === undefined
```

**Solution:**
```bash
# 1. Check .env file location
ls -la services/backend/.env

# 2. Use dotenv in development
# services/backend/src/main.ts
import 'dotenv/config';

# 3. Verify in code
console.log('DATABASE_URL:', process.env.DATABASE_URL);

# 4. For Docker
# Ensure env_file in docker-compose.yml
services:
  backend:
    env_file:
      - ./services/backend/.env
```

---

## Getting Help

If you're still experiencing issues:

1. **Check existing issues**: Search GitHub issues for similar problems
2. **Review documentation**: Double-check the docs folder
3. **Ask in Discord**: Join our developer Discord channel
4. **Create an issue**: Provide reproduction steps and environment details
5. **Contact team lead**: For urgent production issues

### Issue Template

When reporting issues, include:
- Environment (OS, Node version, browser)
- Steps to reproduce
- Expected behavior
- Actual behavior
- Error messages/screenshots
- Relevant code snippets
