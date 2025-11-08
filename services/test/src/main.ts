import Fastify from 'fastify';
import cors from '@fastify/cors';

const PORT = parseInt(process.env.PORT || '4005', 10);
const HOST = process.env.HOST || '0.0.0.0';

const buildServer = async () => {
  const server = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || 'info',
    },
  });

  // Register plugins
  await server.register(cors, {
    origin: process.env.CORS_ORIGIN || '*',
  });

  // Health check
  server.get('/healthz', async () => ({
    status: 'healthy',
    service: 'test',
    timestamp: new Date().toISOString(),
  }));

  // TODO: Register your routes here
  // await server.register(yourRoutes, { prefix: '/api' });

  return server;
};

const start = async () => {
  try {
    const server = await buildServer();
    await server.listen({ port: PORT, host: HOST });
    console.log(`🚀 Utest Service running on http://${HOST}:${PORT}`);
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

start();
