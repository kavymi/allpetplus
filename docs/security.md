# Security Guidelines

**Last Updated:** October 23, 2025  
**Status:** Production Ready  
**Owner:** Security Team

---

## Overview

Comprehensive security best practices and implementation guidelines for All Pet Plus. This document covers authentication, authorization, data protection, API security, and incident response.

**Security Philosophy:**
- **Defense in Depth** - Multiple layers of security
- **Least Privilege** - Minimum necessary permissions
- **Fail Secure** - Default to deny, explicit allow
- **Zero Trust** - Verify everything, trust nothing

---

## Table of Contents

1. [Authentication & Authorization](#authentication--authorization)
2. [API Security](#api-security)
3. [Database Security](#database-security)
4. [Secrets Management](#secrets-management)
5. [Frontend Security](#frontend-security)
6. [Infrastructure Security](#infrastructure-security)
7. [Dependency Security](#dependency-security)
8. [Monitoring & Logging](#monitoring--logging)
9. [Incident Response](#incident-response)
10. [Security Checklist](#security-checklist)

---

## Authentication & Authorization

### Clerk Integration

**Implementation:** `apps/web/src/middleware.ts`

```typescript
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

// Protected routes require authentication
const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/builder(.*)',
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
```

---

### Backend JWT Validation

**Implementation:** `services/backend/src/plugins/auth.ts`

```typescript
import { clerkPlugin } from '@clerk/fastify';
import { FastifyInstance } from 'fastify';

export async function authPlugin(fastify: FastifyInstance) {
  // Register Clerk plugin
  await fastify.register(clerkPlugin, {
    publishableKey: process.env.CLERK_PUBLISHABLE_KEY!,
    secretKey: process.env.CLERK_SECRET_KEY!,
  });

  // Verification decorator
  fastify.decorate('verifyAuth', async function(request, reply) {
    try {
      const { userId } = request.auth;
      
      if (!userId) {
        return reply.code(401).send({ error: 'Unauthorized' });
      }
      
      // Verify user exists in our database
      const user = await fastify.db.userProfile.findUnique({
        where: { clerkUserId: userId },
      });
      
      if (!user) {
        return reply.code(403).send({ error: 'Forbidden' });
      }
      
      // Attach user to request
      request.user = user;
    } catch (error) {
      fastify.log.error(error);
      return reply.code(401).send({ error: 'Invalid token' });
    }
  });
}
```

---

### tRPC Context Authentication

**Implementation:** `libs/api/src/context.ts`

```typescript
import { getAuth } from '@clerk/nextjs/server';
import { type CreateNextContextOptions } from '@trpc/server/adapters/next';
import { prisma } from './db';

export async function createContext(opts: CreateNextContextOptions) {
  const { userId } = getAuth(opts.req);
  
  return {
    db: prisma,
    userId: userId ?? null,
    req: opts.req,
    res: opts.res,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
```

**Protected Procedures:** `libs/api/src/trpc.ts`

```typescript
import { TRPCError } from '@trpc/server';
import { t } from './trpc';

// Middleware to check authentication
const isAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'You must be logged in to access this resource',
    });
  }
  
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId, // Now guaranteed to be string
    },
  });
});

// Export protected procedure
export const protectedProcedure = t.procedure.use(isAuthed);
```

---

### Role-Based Access Control (RBAC)

**User Roles:**
```typescript
// libs/domain/src/lib/user/types.ts
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPPORT = 'SUPPORT',
}

export interface UserProfile {
  id: string;
  clerkUserId: string;
  role: UserRole;
  permissions: string[];
}
```

**Permission Checking:**
```typescript
// libs/api/src/middleware/permissions.ts
import { TRPCError } from '@trpc/server';

export const requirePermission = (permission: string) => {
  return t.middleware(async ({ ctx, next }) => {
    if (!ctx.userId) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }
    
    const user = await ctx.db.userProfile.findUnique({
      where: { clerkUserId: ctx.userId },
    });
    
    if (!user?.permissions.includes(permission)) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: `Missing required permission: ${permission}`,
      });
    }
    
    return next({ ctx: { ...ctx, user } });
  });
};

// Usage
export const deleteDesignProcedure = protectedProcedure
  .use(requirePermission('design:delete'))
  .mutation(async ({ ctx, input }) => {
    // Only users with design:delete permission can execute
  });
```

---

## API Security

### Rate Limiting

**Implementation:** `services/backend/src/plugins/rate-limit.ts`

```typescript
import rateLimit from '@fastify/rate-limit';
import { FastifyInstance } from 'fastify';

export async function rateLimitPlugin(fastify: FastifyInstance) {
  await fastify.register(rateLimit, {
    global: true,
    max: 100, // requests
    timeWindow: '1 minute',
    cache: 10000,
    allowList: ['127.0.0.1'], // Whitelist localhost
    redis: fastify.redis, // Use Redis for distributed rate limiting
    skipOnError: true,
    errorResponseBuilder: (request, context) => ({
      error: 'Too Many Requests',
      message: 'Rate limit exceeded. Please try again later.',
      retryAfter: context.after,
    }),
  });
}
```

**Route-Specific Limits:**
```typescript
// Stricter limit for authentication endpoints
fastify.post('/api/auth/login', {
  config: {
    rateLimit: {
      max: 5,
      timeWindow: '15 minutes',
    },
  },
}, async (request, reply) => {
  // Login logic
});

// Generous limit for read operations
fastify.get('/api/products', {
  config: {
    rateLimit: {
      max: 1000,
      timeWindow: '1 minute',
    },
  },
}, async (request, reply) => {
  // Product list logic
});
```

---

### Input Validation (Zod)

**Always validate input:** `libs/api/src/routers/designs.ts`

```typescript
import { z } from 'zod';
import { builderConfigSchema } from '@pet/domain/builder';

export const designsRouter = router({
  create: protectedProcedure
    .input(z.object({
      name: z.string()
        .min(1, 'Name is required')
        .max(255, 'Name too long')
        .regex(/^[a-zA-Z0-9\s-]+$/, 'Invalid characters'),
      configJson: builderConfigSchema,
      petId: z.string().uuid().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      // Input is validated and type-safe!
      return ctx.db.savedDesign.create({
        data: {
          userId: ctx.userId,
          name: input.name,
          configJson: input.configJson,
          petId: input.petId,
        },
      });
    }),
});
```

**Sanitization:**
```typescript
import DOMPurify from 'isomorphic-dompurify';

// Sanitize HTML input
const sanitizedHtml = DOMPurify.sanitize(userInput);

// Escape SQL-like characters (Prisma does this automatically)
// But for raw queries:
const escaped = input.replace(/['";]/g, '');
```

---

### CORS Configuration

**Implementation:** `services/backend/src/main.ts`

```typescript
import cors from '@fastify/cors';

await fastify.register(cors, {
  origin: (origin, callback) => {
    const allowedOrigins = [
      'http://localhost:3000',
      'http://localhost:3001',
      'https://harnesshero.com',
      'https://www.harnesshero.com',
      'https://pet-licensing.harnesshero.com',
    ];
    
    // Allow requests with no origin (mobile apps, curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'), false);
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['X-Total-Count'],
  maxAge: 600, // Cache preflight for 10 minutes
});
```

---

### CSRF Protection

**Implementation:** `apps/web/src/middleware.ts`

```typescript
import { clerkMiddleware } from '@clerk/nextjs/server';

export default clerkMiddleware(async (auth, req) => {
  // CSRF protection via SameSite cookies
  // Clerk handles this automatically
  
  // Additional check for state-changing operations
  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const origin = req.headers.get('origin');
    const host = req.headers.get('host');
    
    // Verify origin matches host (simple CSRF check)
    if (origin && !origin.includes(host)) {
      return new Response('Invalid origin', { status: 403 });
    }
  }
});
```

---

### Content Security Policy (CSP)

**Implementation:** `apps/web/src/middleware.ts`

```typescript
export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  
  // Set CSP header
  response.headers.set(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-eval' 'unsafe-inline' https://clerk.com",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data:",
      "connect-src 'self' https://api.clerk.com https://*.clerk.accounts.dev",
      "frame-src 'self' https://challenges.cloudflare.com",
      "frame-ancestors 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join('; ')
  );
  
  // Additional security headers
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  
  return response;
}
```

---

## Database Security

### Prisma Connection Security

**Configuration:** `services/backend/prisma/schema.prisma`

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
  
  // Use connection pooling
  // Example DATABASE_URL:
  // postgresql://user:password@host:5432/database?sslmode=require&connection_limit=10
}
```

**Connection String Best Practices:**
```bash
# Production (SSL required)
DATABASE_URL="postgresql://user:password@db.example.com:5432/prod_db?sslmode=require&connection_limit=20"

# Development (local)
DATABASE_URL="postgresql://user:password@localhost:5432/dev_db?connection_limit=5"
```

---

### Query Security (SQL Injection Prevention)

**✅ Safe (Prisma):**
```typescript
// Prisma prevents SQL injection automatically
const users = await prisma.user.findMany({
  where: {
    email: userInput, // Safe! Prisma escapes this
  },
});
```

**❌ Unsafe (Raw SQL without parameters):**
```typescript
// DON'T DO THIS!
const users = await prisma.$queryRawUnsafe(
  `SELECT * FROM users WHERE email = '${userInput}'`
);
```

**✅ Safe (Raw SQL with parameters):**
```typescript
// If you must use raw SQL, use parameters
const users = await prisma.$queryRaw`
  SELECT * FROM users 
  WHERE email = ${userInput}
`;
```

---

### Row-Level Security (RLS)

**Database-level security:**
```sql
-- services/backend/prisma/migrations/XXX_add_rls.sql

-- Enable RLS on sensitive tables
ALTER TABLE saved_design ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own designs
CREATE POLICY design_isolation ON saved_design
  FOR ALL
  USING (user_id = current_setting('app.current_user_id')::uuid);
```

**Application-level (simpler):**
```typescript
// Always filter by userId
const designs = await prisma.savedDesign.findMany({
  where: {
    userId: ctx.userId, // Ensure user can only access their data
  },
});

// NEVER allow userId to come from input
// ❌ BAD:
const designs = await prisma.savedDesign.findMany({
  where: {
    userId: input.userId, // User could access others' data!
  },
});
```

---

### Database Backups

**Automated backups:**
```bash
# Production backup script
#!/bin/bash

# Backup to S3
pg_dump $DATABASE_URL | gzip | aws s3 cp - s3://backups/db-$(date +%Y%m%d-%H%M%S).sql.gz

# Rotate old backups (keep 30 days)
aws s3 ls s3://backups/ | awk '{print $4}' | head -n -30 | xargs -I {} aws s3 rm s3://backups/{}
```

**Restore process:**
```bash
# Download latest backup
aws s3 cp s3://backups/latest.sql.gz - | gunzip | psql $DATABASE_URL
```

---

## Secrets Management

### Environment Variables

**Never commit `.env` files!**

**.gitignore:**
```gitignore
# Environment files
.env
.env.local
.env.*.local
apps/**/.env
apps/**/.env.local
services/**/.env
```

**Template files:** `env.template`
```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_REPLACE_ME
CLERK_SECRET_KEY=sk_test_REPLACE_ME

# Database (use connection string, not individual values)
DATABASE_URL=postgresql://user:password@localhost:5432/dbname

# DO NOT commit real values!
# Copy this to .env.local and fill in real values
```

---

### Secret Rotation

**Process:**
1. Generate new secret
2. Add both old and new to environment (grace period)
3. Deploy new version
4. Monitor for errors
5. Remove old secret after 24 hours

**Example (API key rotation):**
```typescript
// Support multiple API keys during rotation
const validKeys = [
  process.env.API_KEY_PRIMARY,
  process.env.API_KEY_SECONDARY, // Old key (during rotation)
].filter(Boolean);

function validateApiKey(providedKey: string): boolean {
  return validKeys.includes(providedKey);
}
```

---

### Production Secrets

**Use a secrets manager:**

**AWS Secrets Manager:**
```typescript
import { SecretsManagerClient, GetSecretValueCommand } from '@aws-sdk/client-secrets-manager';

async function getSecret(secretName: string) {
  const client = new SecretsManagerClient({ region: 'us-east-1' });
  const response = await client.send(
    new GetSecretValueCommand({ SecretId: secretName })
  );
  return JSON.parse(response.SecretString);
}

// Use in application
const dbCreds = await getSecret('prod/database');
const DATABASE_URL = dbCreds.connectionString;
```

**Vercel/Fly.io Environment Variables:**
```bash
# Set via CLI
flyctl secrets set DATABASE_URL="postgresql://..."
vercel env add DATABASE_URL production
```

---

## Frontend Security

### XSS Prevention

**React escapes by default:**
```tsx
// ✅ Safe (React escapes HTML)
<div>{userInput}</div>

// ❌ Dangerous (injects HTML)
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ Safe (sanitize first)
import DOMPurify from 'isomorphic-dompurify';
<div dangerouslySetInnerHTML={{ 
  __html: DOMPurify.sanitize(userInput) 
}} />
```

---

### Local Storage Security

**Don't store sensitive data:**
```typescript
// ❌ NEVER store in localStorage
localStorage.setItem('authToken', token); // Accessible to XSS
localStorage.setItem('creditCard', ccNumber); // NEVER!

// ✅ Use HTTP-only cookies (Clerk does this)
// Server sets: Set-Cookie: token=xxx; HttpOnly; Secure; SameSite=Strict

// ✅ OK for non-sensitive data
localStorage.setItem('theme', 'dark');
localStorage.setItem('language', 'en');
```

---

### Dependency Scanning

**NPM Audit:**
```bash
# Check for vulnerabilities
npm audit

# Fix automatically (careful!)
npm audit fix

# Force fix (may break things)
npm audit fix --force
```

**Dependabot (GitHub):**
```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    reviewers:
      - "security-team"
```

---

## Infrastructure Security

### HTTPS Enforcement

**Always use HTTPS in production:**
```typescript
// apps/web/src/middleware.ts
if (process.env.NODE_ENV === 'production' && 
    req.headers.get('x-forwarded-proto') !== 'https') {
  return NextResponse.redirect(
    `https://${req.headers.get('host')}${req.nextUrl.pathname}`,
    301
  );
}
```

---

### Docker Security

**Dockerfile best practices:**
```dockerfile
# Use specific version, not 'latest'
FROM node:24-alpine

# Run as non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Set working directory
WORKDIR /app

# Copy only necessary files
COPY --chown=nextjs:nodejs package*.json ./
RUN npm ci --only=production

COPY --chown=nextjs:nodejs . .

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

CMD ["npm", "start"]
```

---

## Monitoring & Logging

### Security Event Logging

**Implementation:** `services/backend/src/utils/security-logger.ts`

```typescript
import { FastifyInstance } from 'fastify';

export function logSecurityEvent(
  fastify: FastifyInstance,
  event: {
    type: 'AUTH_FAILURE' | 'PERMISSION_DENIED' | 'RATE_LIMIT' | 'SUSPICIOUS_ACTIVITY';
    userId?: string;
    ip: string;
    endpoint: string;
    details?: any;
  }
) {
  fastify.log.warn({
    ...event,
    timestamp: new Date().toISOString(),
    severity: 'SECURITY',
  });
  
  // Send to security monitoring (e.g., Sentry, DataDog)
  if (process.env.NODE_ENV === 'production') {
    // sendToSecurityMonitoring(event);
  }
}
```

---

### Don't Log Sensitive Data

**❌ BAD:**
```typescript
fastify.log.info({
  password: user.password, // NEVER log passwords!
  apiKey: process.env.API_KEY, // NEVER log secrets!
  creditCard: payment.ccNumber, // NEVER log PII!
});
```

**✅ GOOD:**
```typescript
fastify.log.info({
  userId: user.id,
  action: 'login',
  ip: request.ip,
  timestamp: new Date(),
});
```

---

## Incident Response

### Security Incident Process

1. **Detect** - Monitoring alerts on suspicious activity
2. **Contain** - Disable compromised accounts, rotate secrets
3. **Investigate** - Review logs, identify scope
4. **Remediate** - Fix vulnerability, deploy patch
5. **Communicate** - Notify affected users if needed
6. **Post-Mortem** - Document and improve

---

### Breach Notification

**If user data is compromised:**

1. **Assess scope** - What data was accessed?
2. **Legal review** - GDPR/CCPA requirements
3. **Notify users** within 72 hours
4. **Offer remediation** - Password reset, monitoring
5. **Public disclosure** if required by law

---

## Security Checklist

### Development
- [ ] All dependencies up to date (`npm audit`)
- [ ] No secrets in code or commits
- [ ] Input validation on all endpoints
- [ ] Authentication on protected routes
- [ ] Rate limiting configured
- [ ] CORS properly configured
- [ ] CSP headers set
- [ ] HTTPS enforced

### Testing
- [ ] Security tests written
- [ ] Penetration testing conducted
- [ ] Dependency scanning passed
- [ ] No high/critical vulnerabilities

### Deployment
- [ ] Environment variables set
- [ ] Secrets rotated
- [ ] Backups configured
- [ ] Monitoring enabled
- [ ] Logging configured
- [ ] SSL certificates valid

### Ongoing
- [ ] Regular security audits (quarterly)
- [ ] Dependency updates (weekly)
- [ ] Access review (monthly)
- [ ] Backup testing (monthly)
- [ ] Incident response drill (yearly)

---

## Reporting Security Issues

**Found a security issue?**

### DO:
1. Email security@harnesshero.com immediately
2. Include:
   - Detailed description
   - Steps to reproduce
   - Potential impact
   - Your contact info
3. Allow 24 hours for initial response
4. Work with us on coordinated disclosure

### DON'T:
1. Post publicly (GitHub issues, Twitter, etc.)
2. Exploit the vulnerability
3. Access data you don't own
4. Demand payment (we have a bounty program)

---

## Security Bounty Program

**Rewards for responsibly disclosed vulnerabilities:**

| Severity | Reward | Examples |
|----------|--------|----------|
| **Critical** | $1000+ | Remote code execution, SQL injection |
| **High** | $500-$1000 | Authentication bypass, XSS |
| **Medium** | $100-$500 | CSRF, information disclosure |
| **Low** | $50-$100 | Minor issues |

**Contact:** security@harnesshero.com

---

## Related Documentation

- [Environment Setup](/docs/guides/environment-setup.md)
- [API Reference](/docs/api/backend-api-reference.md)
- [Deployment Guide](/docs/ops/deploy.md)
- [Clerk Documentation](https://clerk.com/docs)

---

## Resources

### Tools
- [OWASP ZAP](https://www.zaproxy.org/) - Security testing
- [Snyk](https://snyk.io/) - Dependency scanning
- [npm audit](https://docs.npmjs.com/cli/v8/commands/npm-audit) - Vulnerability checking

### Learning
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Web Security Academy](https://portswigger.net/web-security)
- [Security Headers](https://securityheaders.com/)

---

**Last Updated:** October 23, 2025  
**Next Review:** January 23, 2026  
**Status:** Production Ready
