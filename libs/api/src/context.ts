import { PrismaClient } from '@prisma/client';
import { inferAsyncReturnType } from '@trpc/server';
import { FetchCreateContextFnOptions } from '@trpc/server/adapters/fetch';

// Initialize Prisma client (singleton pattern for development)
const globalForPrisma = global as unknown as { prisma: PrismaClient };
export const db = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db;

/**
 * Creates context for tRPC procedures
 * Extracts user information from Clerk headers
 */
export async function createContext({ req }: FetchCreateContextFnOptions) {
  // Extract Clerk user ID from headers (set by Clerk middleware in API route)
  const userId = req.headers.get('x-clerk-user-id') || undefined;
  const userEmail = req.headers.get('x-clerk-user-email') || undefined;

  return {
    db,
    userId,
    userEmail,
    req,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;

