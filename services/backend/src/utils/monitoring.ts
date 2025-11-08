import { FastifyInstance } from 'fastify';

interface HealthCheck {
  service: string;
  status: 'healthy' | 'unhealthy' | 'degraded';
  responseTime?: number;
  error?: string;
  lastChecked: string;
}

interface SystemMetrics {
  uptime: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpu: {
    usage: number;
  };
  requests: {
    total: number;
    errors: number;
    averageResponseTime: number;
  };
}

class MonitoringService {
  private requestCount = 0;
  private errorCount = 0;
  private responseTimes: number[] = [];
  private maxResponseTimes = 1000; // Keep last 1000 response times

  recordRequest(responseTime: number, isError: boolean = false) {
    this.requestCount++;
    if (isError) this.errorCount++;
    
    this.responseTimes.push(responseTime);
    if (this.responseTimes.length > this.maxResponseTimes) {
      this.responseTimes.shift();
    }
  }

  getMetrics(): SystemMetrics {
    const memUsage = process.memoryUsage();
    const avgResponseTime = this.responseTimes.length > 0 
      ? this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length 
      : 0;

    return {
      uptime: process.uptime(),
      memory: {
        used: memUsage.heapUsed,
        total: memUsage.heapTotal,
        percentage: (memUsage.heapUsed / memUsage.heapTotal) * 100,
      },
      cpu: {
        usage: process.cpuUsage().user / 1000000, // Convert to seconds
      },
      requests: {
        total: this.requestCount,
        errors: this.errorCount,
        averageResponseTime: avgResponseTime,
      },
    };
  }

  async checkHealth(fastify: FastifyInstance): Promise<HealthCheck[]> {
    const checks: HealthCheck[] = [];

    // Database health check
    try {
      const start = Date.now();
      await fastify.db.$queryRaw`SELECT 1`;
      checks.push({
        service: 'database',
        status: 'healthy',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
      });
    } catch (error) {
      checks.push({
        service: 'database',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date().toISOString(),
      });
    }

    // Redis health check
    try {
      const start = Date.now();
      await fastify.cache.redisClient.ping();
      checks.push({
        service: 'redis',
        status: 'healthy',
        responseTime: Date.now() - start,
        lastChecked: new Date().toISOString(),
      });
    } catch (error) {
      checks.push({
        service: 'redis',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date().toISOString(),
      });
    }

    // Queue health check
    try {
      const queueNames = Object.keys(fastify.queues);
      for (const queueName of queueNames) {
        const queue = fastify.queues[queueName];
        const waiting = await queue.getWaiting();
        const active = await queue.getActive();
        const failed = await queue.getFailed();

        const status = failed.length > 10 ? 'degraded' : 'healthy';
        checks.push({
          service: `queue-${queueName}`,
          status,
          lastChecked: new Date().toISOString(),
        });
      }
    } catch (error) {
      checks.push({
        service: 'queues',
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        lastChecked: new Date().toISOString(),
      });
    }

    return checks;
  }
}

export const monitoring = new MonitoringService();

export function setupMonitoring(fastify: FastifyInstance) {
  // Track request metrics
  fastify.addHook('onResponse', async (request, reply) => {
    const isError = reply.statusCode >= 400;
    monitoring.recordRequest(reply.elapsedTime, isError);
  });

  // Enhanced health check endpoint
  fastify.get('/healthz/detailed', async (request, reply) => {
    const healthChecks = await monitoring.checkHealth(fastify);
    const metrics = monitoring.getMetrics();
    
    const overallStatus = healthChecks.every(check => check.status === 'healthy') 
      ? 'healthy' 
      : healthChecks.some(check => check.status === 'unhealthy') 
        ? 'unhealthy' 
        : 'degraded';

    const response = {
      status: overallStatus,
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      checks: healthChecks,
      metrics,
    };

    const statusCode = overallStatus === 'healthy' ? 200 : overallStatus === 'degraded' ? 200 : 503;
    return reply.status(statusCode).send(response);
  });

  // Metrics endpoint
  fastify.get('/metrics', async () => {
    return monitoring.getMetrics();
  });
}
