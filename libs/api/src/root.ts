import { router } from './trpc';
import { testRouter } from './routers/test';
import { designsRouter } from './routers/designs';
import { petsRouter } from './routers/pets';

/**
 * Main tRPC router
 * Add new routers here as you migrate endpoints
 */
export const appRouter = router({
  test: testRouter,
  designs: designsRouter,
  pets: petsRouter,
  // Add more routers here:
  // orders: ordersRouter,
  // users: usersRouter,
});

export type AppRouter = typeof appRouter;

