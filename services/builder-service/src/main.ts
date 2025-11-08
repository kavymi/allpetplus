/**
 * Builder Service - Standalone Microservice
 * Handles design CRUD operations independently
 * Port: 4001
 */

import Fastify, { FastifyInstance } from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import closeWithGrace from 'close-with-grace';

import { dbPlugin } from './plugins/db';
import { authPlugin } from './plugins/auth';
import designRoutes from './routes/designs';

const buildServer = async (): Promise<FastifyInstance> => {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
      transport:
        process.env.NODE_ENV === 'production'
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

  // Register plugins
  await server.register(dbPlugin);
  await server.register(authPlugin);

  // Security & CORS
  await server.register(helmet, { global: true });
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  });

  // Rate limiting
  await server.register(rateLimit, {
    max: 100,
    timeWindow: '15 minutes',
    allowList: (req) => {
      const ip = req.headers['x-forwarded-for'] as string | undefined;
      return ip?.includes('127.0.0.1') ?? false;
    },
  });

  // Register routes
  await server.register(designRoutes);

  // Health check
  server.get('/healthz', async () => {
    try {
      await server.db.$queryRaw`SELECT 1`;
      return {
        status: 'healthy',
        service: 'builder-service',
        uptime: process.uptime(),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        service: 'builder-service',
        error: (error as Error).message,
      };
    }
  });

  // Readiness check
  server.get('/ready', async () => {
    return { 
      ready: true,
      service: 'builder-service',
      version: '1.0.0',
    };
  });

  // Root endpoint
  server.get('/', async () => ({
    message: 'Builder Service API',
    version: '1.0.0',
    endpoints: {
      health: '/healthz',
      ready: '/ready',
      designs: '/api/designs',
    },
  }));

  // Cleanup on close
  server.addHook('onClose', async (instance) => {
    instance.log.info('Shutting down connections');
    await instance.db.$disconnect();
  });

  return server;
};

const start = async () => {
  try {
    const port = parseInt(process.env.PORT || '4001', 10);
    const host = process.env.HOST || '0.0.0.0';
    const server = await buildServer();

    server.log.info(`Starting Builder Service in ${process.env.NODE_ENV || 'development'} mode...`);

    const closeFn = closeWithGrace({ delay: 500 }, async ({ err }) => {
      if (err) {
        server.log.error(err);
      }
      await server.close();
    });

    server.addHook('onClose', () => {
      closeFn.uninstall();
    });

    await server.listen({ port, host });
    server.log.info(`🚀 Builder Service running on http://${host}:${port}`);
  } catch (error) {
    console.error('Failed to start builder service:', error);
    process.exit(1);
  }
};

start();

