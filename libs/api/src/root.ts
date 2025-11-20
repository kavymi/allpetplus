import { router } from './trpc';
import { productsCoRouter } from './routers/products-co';
import { testRouter } from './routers/test';
import { designsRouter } from './routers/designs';
import { petsRouter } from './routers/pets';

/**
 * Main tRPC router
 * Add new routers here as you migrate endpoints
 */
export const appRouter = router({
  productsCo: productsCoRouter,
  test: testRouter,
  designs: designsRouter,
  pets: petsRouter,
  // Add more routers here:
  // orders: ordersRouter,
  // users: usersRouter,
});

export type AppRouter = typeof appRouter;
