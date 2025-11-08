# Utest Service

test

## Development

```bash
# Start dev server
npx nx serve test

# Or with npm
cd services/test
npm run dev
```

## URLs

- **Service**: http://localhost:4005
- **Health Check**: http://localhost:4005/healthz

## Environment Setup

1. Copy `.env.template` to `.env`
2. Fill in required environment variables
3. Run `npm install` from project root

## Architecture

- **Framework**: Fastify 4
- **Language**: TypeScript 5.7
- **Database**: Prisma + PostgreSQL
- **Port**: 4005

## API Endpoints

- `GET /healthz` - Health check
- TODO: Document your endpoints here

## Integration

### tRPC Integration

Add to `libs/api/src/routers/test.ts`:

```typescript
import { router, protectedProcedure } from '../trpc';

export const testRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    const response = await fetch('http://localhost:4005/api/items');
    return response.json();
  }),
});
```

Then update `libs/api/src/root.ts` to include the router.
