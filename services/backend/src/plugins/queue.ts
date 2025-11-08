import fp from 'fastify-plugin';
import { Queue, QueueEvents, Worker } from 'bullmq';
import { CacheClient } from '../config/database.config';

declare module 'fastify' {
  interface FastifyInstance {
    queues: Record<string, Queue>;
  }
}

type JobDefinition = {
  name: string;
  processor: string;
  concurrency?: number;
};

const queues: JobDefinition[] = [
  { name: 'webhook-replay', processor: __dirname + '/../workers/webhook-replay.ts', concurrency: 2 },
  { name: 'preview-render', processor: __dirname + '/../workers/preview-render.ts', concurrency: 4 },
  { name: 'trigger-email', processor: __dirname + '/../workers/trigger-email.ts', concurrency: 2 },
];

export const queuePlugin = fp(async (server) => {
  const cache = await CacheClient.getInstance();
  
  // BullMQ connection options (uses ioredis format)
  const connectionOptions = {
    host: process.env.REDIS_URL?.includes('://') 
      ? new URL(process.env.REDIS_URL).hostname 
      : 'localhost',
    port: process.env.REDIS_URL?.includes('://') 
      ? parseInt(new URL(process.env.REDIS_URL).port || '6379')
      : 6379,
  };

  const queueMap: Record<string, Queue> = {};

  for (const job of queues) {
    const queue = new Queue(job.name, {
      connection: connectionOptions,
      defaultJobOptions: {
        attempts: 3,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: true,
        removeOnFail: 50,
      },
    });

    const worker = new Worker(job.name, job.processor, {
      connection: connectionOptions,
      concurrency: job.concurrency ?? 1,
    });

    const events = new QueueEvents(job.name, { connection: connectionOptions });

    worker.on('completed', (job) => server.log.info({ jobId: job.id }, `${job.name} completed`));
    worker.on('failed', (job, err) => server.log.error({ jobId: job?.id, err }, `${job?.name} failed`));
    events.on('stalled', (event) => server.log.warn({ event }, 'Job stalled')); 

    queueMap[job.name] = queue;
  }

  server.decorate('queues', queueMap);

  server.addHook('onClose', async () => {
    await Promise.all(
      Object.values(queueMap).map(async (queue) => {
        await queue.close();
      }),
    );
  });
});


