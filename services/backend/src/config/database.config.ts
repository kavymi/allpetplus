import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import { Pool } from 'pg';

// Database configuration with connection pooling and monitoring
export interface DatabaseConfig {
  primary: {
    url: string;
    maxConnections: number;
    idleTimeout: number;
    connectionTimeout: number;
  };
  replica?: {
    url: string;
    maxConnections: number;
  };
  redis: {
    url: string;
    maxRetriesPerRequest: number;
    enableReadyCheck: boolean;
    retryStrategy: (times: number) => number | null;
  };
}

// Environment-based configuration
export const getDatabaseConfig = (): DatabaseConfig => {
  const env = process.env.NODE_ENV || 'development';
  
  return {
    primary: {
      url: process.env.DATABASE_URL || '',
      maxConnections: env === 'production' ? 50 : 10,
      idleTimeout: 30000, // 30 seconds
      connectionTimeout: 5000, // 5 seconds
    },
    replica: process.env.DATABASE_REPLICA_URL ? {
      url: process.env.DATABASE_REPLICA_URL,
      maxConnections: env === 'production' ? 30 : 5,
    } : undefined,
    redis: {
      url: process.env.REDIS_URL || 'redis://localhost:6379',
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy: (times: number) => {
        if (times > 3) return null;
        return Math.min(times * 1000, 3000);
      },
    },
  };
};

// Extended Prisma Client with logging and metrics
export class DatabaseClient extends PrismaClient {
  private static instance: DatabaseClient;
  private metricsCollector: MetricsCollector;

  private constructor() {
    const config = getDatabaseConfig();
    
    super({
      log: [
        { level: 'query', emit: 'event' },
        { level: 'error', emit: 'event' },
        { level: 'warn', emit: 'event' },
      ],
      errorFormat: 'pretty',
      datasources: {
        db: {
          url: config.primary.url,
        },
      },
    });

    this.metricsCollector = new MetricsCollector();
    this.setupEventListeners();
  }

  static getInstance(): DatabaseClient {
    if (!DatabaseClient.instance) {
      DatabaseClient.instance = new DatabaseClient();
    }
    return DatabaseClient.instance;
  }

  private setupEventListeners() {
    // Query performance monitoring
    this.$on('query' as any, (e: any) => {
      this.metricsCollector.recordQuery({
        query: e.query,
        duration: e.duration,
        timestamp: new Date(),
      });
    });

    // Error tracking
    this.$on('error' as any, (e: any) => {
      console.error('Database error:', e);
      this.metricsCollector.recordError(e);
    });
  }

  // Read replica routing for read-only queries
  get reader() {
    if (process.env.DATABASE_REPLICA_URL) {
      return new PrismaClient({
        datasources: {
          db: {
            url: process.env.DATABASE_REPLICA_URL,
          },
        },
      });
    }
    return this;
  }
}

// Redis client with automatic reconnection and monitoring
export class CacheClient {
  private static instance: CacheClient;
  private client: ReturnType<typeof createClient>;
  private isConnected: boolean = false;

  private constructor(config: DatabaseConfig['redis']) {
    this.client = createClient({
      url: config.url,
      socket: {
        reconnectStrategy: config.retryStrategy,
      },
    });

    this.setupEventHandlers();
  }

  static async getInstance(): Promise<CacheClient> {
    if (!CacheClient.instance) {
      const config = getDatabaseConfig();
      CacheClient.instance = new CacheClient(config.redis);
      await CacheClient.instance.connect();
    }
    return CacheClient.instance;
  }

  private setupEventHandlers() {
    this.client.on('error', (err) => {
      console.error('Redis error:', err);
      this.isConnected = false;
    });

    this.client.on('connect', () => {
      console.log('Redis connected');
      this.isConnected = true;
    });

    this.client.on('ready', () => {
      console.log('Redis ready');
      this.isConnected = true;
    });
  }

  async connect() {
    if (!this.isConnected) {
      await this.client.connect();
    }
  }

  async disconnect() {
    if (this.isConnected) {
      await this.client.disconnect();
      this.isConnected = false;
    }
  }

  // Cache-aside pattern helper
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = 300 // 5 minutes default
  ): Promise<T> {
    try {
      const cached = await this.client.get(key);
      if (cached) {
        return JSON.parse(cached);
      }
    } catch (error) {
      console.warn(`Cache get error for key ${key}:`, error);
    }

    const value = await fetcher();
    
    try {
      await this.client.setEx(key, ttl, JSON.stringify(value));
    } catch (error) {
      console.warn(`Cache set error for key ${key}:`, error);
    }

    return value;
  }

  // Batch operations for performance
  async mget<T>(keys: string[]): Promise<(T | null)[]> {
    const values = await this.client.mGet(keys);
    return values.map(v => v ? JSON.parse(v) : null);
  }

  async mset(items: Array<{ key: string; value: any; ttl?: number }>) {
    const pipeline = this.client.multi();
    
    for (const item of items) {
      if (item.ttl) {
        pipeline.setEx(item.key, item.ttl, JSON.stringify(item.value));
      } else {
        pipeline.set(item.key, JSON.stringify(item.value));
      }
    }
    
    await pipeline.exec();
  }

  // Cache invalidation with tags
  async invalidateByTags(tags: string[]) {
    for (const tag of tags) {
      const keys = await this.client.keys(`*:${tag}:*`);
      if (keys.length > 0) {
        await this.client.del(keys);
      }
    }
  }

  get redisClient() {
    return this.client;
  }
}

// Metrics collection for monitoring
class MetricsCollector {
  private queryMetrics: Map<string, { count: number; totalDuration: number }> = new Map();
  private errorCount: number = 0;

  recordQuery(data: { query: string; duration: number; timestamp: Date }) {
    const key = this.normalizeQuery(data.query);
    const current = this.queryMetrics.get(key) || { count: 0, totalDuration: 0 };
    
    this.queryMetrics.set(key, {
      count: current.count + 1,
      totalDuration: current.totalDuration + data.duration,
    });

    // Log slow queries
    if (data.duration > 1000) {
      console.warn(`Slow query detected (${data.duration}ms):`, data.query);
    }
  }

  recordError(error: any) {
    this.errorCount++;
    // Send to monitoring service
  }

  private normalizeQuery(query: string): string {
    // Remove specific values to group similar queries
    return query.replace(/\$\d+/g, '?').replace(/\s+/g, ' ').trim();
  }

  getMetrics() {
    const metrics = Array.from(this.queryMetrics.entries()).map(([query, data]) => ({
      query,
      count: data.count,
      avgDuration: data.totalDuration / data.count,
    }));

    return {
      queries: metrics.sort((a, b) => b.avgDuration - a.avgDuration),
      errorCount: this.errorCount,
    };
  }
}

// Connection health check
export async function checkDatabaseHealth(): Promise<{
  postgres: boolean;
  redis: boolean;
  replica?: boolean;
}> {
  const results = {
    postgres: false,
    redis: false,
    replica: undefined as boolean | undefined,
  };

  try {
    const db = DatabaseClient.getInstance();
    await db.$queryRaw`SELECT 1`;
    results.postgres = true;
  } catch (error) {
    console.error('PostgreSQL health check failed:', error);
  }

  try {
    const cache = await CacheClient.getInstance();
    await cache.redisClient.ping();
    results.redis = true;
  } catch (error) {
    console.error('Redis health check failed:', error);
  }

  if (process.env.DATABASE_REPLICA_URL) {
    try {
      const db = DatabaseClient.getInstance();
      await db.reader.$queryRaw`SELECT 1`;
      results.replica = true;
    } catch (error) {
      console.error('Replica health check failed:', error);
      results.replica = false;
    }
  }

  return results;
}
