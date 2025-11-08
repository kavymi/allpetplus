import fp from 'fastify-plugin';
import { DatabaseClient } from '../config/database.config';

declare module 'fastify' {
  interface FastifyInstance {
    db: DatabaseClient;
  }
}

export const dbPlugin = fp(async (server) => {
  const db = DatabaseClient.getInstance();

  server.decorate('db', db);

  server.addHook('onClose', async () => {
    await db.$disconnect();
  });
});


