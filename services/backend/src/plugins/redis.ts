import fp from 'fastify-plugin';
import { CacheClient } from '../config/database.config';

declare module 'fastify' {
  interface FastifyInstance {
    cache: CacheClient;
  }
}

export const cachePlugin = fp(async (server) => {
  const cache = await CacheClient.getInstance();

  server.decorate('cache', cache);

  server.addHook('onClose', async () => {
    await cache.disconnect();
  });
});


