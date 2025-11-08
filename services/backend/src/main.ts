import closeWithGrace from 'close-with-grace';
import Fastify, { FastifyInstance } from 'fastify';
import helmet from '@fastify/helmet';
import cors from '@fastify/cors';
import rateLimit from '@fastify/rate-limit';

import { checkDatabaseHealth, DatabaseClient, CacheClient } from './config/database.config';
import { config, validateBackendConfig } from './config';
import { dbPlugin } from './plugins/db';
import { cachePlugin } from './plugins/redis';
import { queuePlugin } from './plugins/queue';
import { authPlugin } from './plugins/auth';
import { setupErrorHandler } from './utils/error-handler';
import { setupMonitoring } from './utils/monitoring';
import { SecurityUtils } from './utils/security';

declare module 'fastify' {
  interface FastifyInstance {
    db: DatabaseClient;
    cache: CacheClient;
  }
}

const buildServer = async (): Promise<FastifyInstance> => {
  const server = Fastify({
    logger: {
      level: config.logging.level,
      transport:
        config.app.env === 'production'
          ? undefined
          : {
              target: 'pino-pretty',
              options: {
                translateTime: 'SYS:standard',
                ignore: 'pid,hostname',
              },
            },
    },
  });

  await server.register(dbPlugin);
  await server.register(cachePlugin);
  await server.register(queuePlugin);
  await server.register(authPlugin);

  // Setup error handling and monitoring
  setupErrorHandler(server);
  setupMonitoring(server);

  await server.register(helmet, { global: true });

  await server.register(cors, {
    origin: config.security.cors.origins,
    credentials: true,
  });

  // Register rate limiting BEFORE routes
  await server.register(rateLimit, {
    max: config.security.rateLimit.max,
    timeWindow: config.security.rateLimit.windowMs,
    allowList: (req) => {
      const ip = req.headers['x-forwarded-for'] as string | undefined;
      return ip?.includes('127.0.0.1') ?? false;
    },
  });

  // Register route modules
  await server.register(import('./routes/webhooks'), { prefix: '' });
  await server.register(import('./routes/orders'), { prefix: '' });
  await server.register(import('./routes/designs'), { prefix: '' });

  server.addHook('onClose', async (instance) => {
    instance.log.info('Shutting down connections');
    await instance.cache.disconnect();
    await instance.db.$disconnect();
  });

  server.get('/healthz', async () => ({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: Date.now(),
    services: await checkDatabaseHealth(),
  }));

  server.get('/', async () => ({ message: 'Backend API is running' }));

  return server;
};

const start = async () => {
  // Validate configuration before starting
  validateBackendConfig();
  
  // Initialize security utilities
  SecurityUtils.initialize();
  
  const { port, host } = config.app;
  const server = await buildServer();
  
  server.log.info(`Starting ${config.app.name} in ${config.app.env} mode...`);

  const closeFn = closeWithGrace({ delay: 500 }, async ({ err }) => {
    if (err) {
      server.log.error(err);
    }
    await server.close();
  });

  server.addHook('onClose', () => {
    closeFn.uninstall();
  });

  try {
    await server.listen({ port, host });
    server.log.info(`Server listening on ${host}:${port}`);
  } catch (error) {
    server.log.error(error);
    process.exit(1);
  }
};

void start();
