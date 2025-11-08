import fp from 'fastify-plugin';
import { PrismaClient } from '@prisma/client';

declare module 'fastify' {
  interface FastifyInstance {
    db: PrismaClient;
  }
}

export const dbPlugin = fp(async (server) => {
  const db = new PrismaClient({
    log: ['error', 'warn'],
  });

  server.decorate('db', db);

  server.addHook('onClose', async () => {
    await db.$disconnect();
  });
});

