# Backend Quick Start Guide 🚀

## Setup (5 minutes)

```bash
# 1. Install
cd services/backend
npm install

# 2. Environment
cp env.template .env
# Edit .env with your values

# 3. Database
docker-compose up -d postgres redis
npm run db:migrate
npm run db:seed

# 4. Start
npm run dev
```

Server runs at: `http://localhost:3001`

---

## Common Commands

```bash
# Development
npm run dev                    # Start dev server
npm run db:studio              # Open Prisma Studio
npm test                       # Run tests
npm run test:watch             # Watch mode

# Database
npm run db:migrate             # Run migrations
npm run db:migrate:prod        # Production migrations
npm run db:reset               # Reset database

# Build & Deploy
npm run build                  # Build for production
npm start                      # Start production server
fly deploy --app <app-name>    # Deploy to Fly.io
```

---

## API Endpoints Quick Reference

### Public
```
GET  /healthz                           # Health check
GET  /healthz/detailed                  # Detailed health
GET  /metrics                           # Metrics
GET  /api/orders/:orderNumber?email=    # Order lookup
GET  /api/designs/shared/:token         # Shared design
```

### Protected (Auth Required)
```
POST   /api/designs                     # Create design
GET    /api/designs                     # List designs
GET    /api/designs/:id                 # Get design
PATCH  /api/designs/:id                 # Update design
DELETE /api/designs/:id                 # Delete design
```

### Webhooks
```
POST /webhooks/shopify/orders/create    # Order webhook
POST /webhooks/shopify/orders/fulfilled # Fulfillment webhook
```

---

## Authentication

```typescript
// In routes
fastify.get('/protected', {
  onRequest: fastify.authenticate,  // ✅ Required auth
}, async (request, reply) => {
  const userId = request.userId;
  const email = request.userEmail;
  // ...
});

// Optional auth
fastify.get('/public', {
  onRequest: fastify.optionalAuth,  // ⚠️ Optional
}, async (request, reply) => {
  if (request.userId) {
    // User is logged in
  }
});
```

---

## Database Queries

```typescript
// Basic query
const designs = await fastify.db.savedDesign.findMany({
  where: { userId },
  orderBy: { createdAt: 'desc' },
});

// With pagination
const optimizer = new QueryOptimizer();
const result = await optimizer.paginate(
  fastify.db.savedDesign,
  { cursor, take: 20, where: { userId } }
);

// Use read replica for heavy reads
const analytics = await fastify.db.reader.analyticsEvent.findMany({
  where: { sessionId },
});

// Transaction
await fastify.db.$transaction(async (tx) => {
  const user = await tx.userProfile.create({ ... });
  const design = await tx.savedDesign.create({ ... });
  return { user, design };
});
```

---

## Caching

```typescript
// Cache-aside pattern
const data = await fastify.cache.getOrSet(
  'cache:key',
  async () => {
    // Fetch from database
    return await fastify.db.savedDesign.findMany();
  },
  3600  // TTL in seconds
);

// Manual cache
await fastify.cache.redisClient.set('key', 'value', 'EX', 300);
const value = await fastify.cache.redisClient.get('key');

// Batch operations
await fastify.cache.mset([
  { key: 'key1', value: 'val1', ttl: 300 },
  { key: 'key2', value: 'val2', ttl: 600 },
]);

// Invalidate by tags
await fastify.cache.invalidateByTags(['designs', 'user:123']);
```

---

## Background Jobs

```typescript
// Queue a job
await fastify.queues['preview-render'].add('render', {
  designId: 'design_123',
  configJson: { ... },
});

await fastify.queues['trigger-email'].add('order-confirmation', {
  email: 'customer@example.com',
  orderNumber: 1001,
  orderId: 123,
});

// Job options
await fastify.queues['webhook-replay'].add('replay', data, {
  delay: 5000,           // Wait 5 seconds
  attempts: 5,           # Try 5 times
  backoff: {
    type: 'exponential',
    delay: 2000,
  },
});
```

---

## Security Utils

```typescript
import { SecurityUtils } from './utils/security';

// Encrypt/Decrypt
const encrypted = SecurityUtils.encrypt('sensitive@email.com');
const decrypted = SecurityUtils.decrypt(encrypted);

// Hash for lookups
const emailHash = SecurityUtils.hashEmail('user@example.com');

// Generate tokens
const shareToken = SecurityUtils.generateToken(32);

// Sanitize input
const safe = SecurityUtils.sanitizeInput(userInput);

// Validate UUID
if (SecurityUtils.isValidUUID(id)) {
  // Valid UUID
}
```

---

## Testing

```typescript
// Route test template
import Fastify from 'fastify';
import myRoute from '../my-route';

describe('My Route', () => {
  let app: any;

  beforeEach(async () => {
    app = Fastify({ logger: false });
    
    // Mock dependencies
    app.decorate('db', {
      model: { findMany: jest.fn() },
    });
    app.decorate('authenticate', async (req: any) => {
      req.userId = 'test_user';
    });

    await app.register(myRoute);
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  it('should work', async () => {
    const response = await app.inject({
      method: 'GET',
      url: '/test',
    });

    expect(response.statusCode).toBe(200);
  });
});
```

---

## Environment Variables

**Required**:
```bash
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=<32-char>
REFRESH_TOKEN_SECRET=<32-char>
SESSION_SECRET=<32-char>
ENCRYPTION_KEY=<exactly-32-chars>
CLERK_SECRET_KEY=sk_...
CORS_ORIGIN=https://harnesshe.ro
```

**Generate secrets**:
```bash
openssl rand -base64 32                    # JWT secrets
openssl rand -base64 32 | cut -c1-32       # Encryption key
```

---

## Debugging

```typescript
// Log levels
fastify.log.trace('Very detailed');
fastify.log.debug('Debug info');
fastify.log.info('Informational');
fastify.log.warn('Warning');
fastify.log.error('Error occurred');

// With context
fastify.log.info({ userId, designId }, 'Design created');

// Request context
request.log.info({ params: request.params }, 'Request received');
```

---

## Common Issues

### Database connection errors
```bash
# Check if running
docker ps | grep postgres

# Check logs
docker logs pet-postgres

# Reset database
npm run db:reset
```

### Redis connection errors
```bash
# Check if running
docker ps | grep redis

# Test connection
redis-cli ping
```

### TypeScript errors
```bash
# Regenerate Prisma client
npm run db:generate

# Clear and rebuild
rm -rf dist node_modules
npm install
npm run build
```

---

## Performance Tips

1. **Use indexes**: Check `prisma/schema.prisma` for indexed fields
2. **Use select**: Only fetch needed fields
   ```typescript
   findMany({ select: { id: true, name: true } })
   ```
3. **Cache expensive queries**: Use `cache.getOrSet`
4. **Batch operations**: Use `$transaction` or bulk methods
5. **Use read replicas**: For analytics and reports

---

## Production Checklist

- [ ] Environment variables set
- [ ] Secrets rotated
- [ ] Database migrations run
- [ ] Database backups configured
- [ ] Monitoring set up (Sentry)
- [ ] Rate limiting tested
- [ ] Load testing completed
- [ ] SSL/HTTPS enforced
- [ ] CORS configured correctly
- [ ] Logs aggregation set up

---

## Useful Links

- **API Docs**: `docs/backend-api-reference.md`
- **Deployment**: `docs/backend-deployment.md`
- **Prisma Studio**: `http://localhost:5555`
- **Health Check**: `http://localhost:3001/healthz`
- **Detailed Health**: `http://localhost:3001/healthz/detailed`

---

## Getting Help

1. Check `docs/backend-deployment.md` troubleshooting section
2. Check `docs/troubleshooting-faq.md`
3. Search Slack #engineering channel
4. Contact: backend-team@harnesshe.ro

---

**Happy coding! 🎉**
