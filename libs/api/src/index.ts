/**
 * @pet/api - tRPC API library
 * 
 * Provides end-to-end type-safe API layer
 */

export { appRouter, type AppRouter } from './root';
export { createContext, type Context, db } from './context';
export { router, publicProcedure, protectedProcedure } from './trpc';

