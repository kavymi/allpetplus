import { Prisma, PrismaClient } from '@prisma/client';
import { DatabaseClient } from '../config/database.config';

// Query optimization utilities for common patterns

export class QueryOptimizer {
  private db: DatabaseClient;

  constructor() {
    this.db = DatabaseClient.getInstance();
  }

  // Batch loading to prevent N+1 queries
  async batchLoad<T, K extends keyof T>(
    ids: T[K][],
    loader: (ids: T[K][]) => Promise<T[]>,
    keyField: K
  ): Promise<Map<T[K], T>> {
    const uniqueIds = [...new Set(ids)];
    const items = await loader(uniqueIds);
    
    return new Map(
      items.map(item => [item[keyField], item])
    );
  }

  // Cursor-based pagination for large datasets
  async paginate<T>(
    model: any,
    {
      cursor,
      take = 20,
      where = {},
      orderBy = { createdAt: 'desc' },
      include = {},
    }: {
      cursor?: string;
      take?: number;
      where?: any;
      orderBy?: any;
      include?: any;
    }
  ) {
    const items = await model.findMany({
      take: take + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      where,
      orderBy,
      include,
    });

    const hasMore = items.length > take;
    const edges = items.slice(0, take);

    return {
      edges,
      pageInfo: {
        hasNextPage: hasMore,
        endCursor: edges[edges.length - 1]?.id || null,
      },
    };
  }

  // Optimized count query for large tables
  async estimateCount(table: string): Promise<number> {
    // Validate table name to prevent SQL injection
    if (!/^[a-z_][a-z0-9_]*$/.test(table)) {
      throw new Error('Invalid table name');
    }

    const result = await this.db.$queryRaw<[{ estimate: bigint }]>`
      SELECT reltuples::BIGINT AS estimate
      FROM pg_class
      WHERE relname = ${table}
    `;

    return Number(result[0]?.estimate || 0);
  }

  // Use Prisma's built-in count for exact counts with where clauses
  async exactCount(model: any, where: any = {}): Promise<number> {
    return model.count({ where });
  }

  // Bulk operations with conflict handling
  // NOTE: For production use, implement with Prisma's native batch operations
  // or use createMany with skipDuplicates option
  async bulkUpsert<T>(
    model: any,
    data: T[],
    uniqueFields: string[],
    updateFields: string[]
  ) {
    if (data.length === 0) return;

    // Use Prisma's transaction for bulk upserts
    await this.db.$transaction(
      data.map((item) =>
        model.upsert({
          where: this.buildWhereFromUniqueFields(item, uniqueFields),
          update: this.buildUpdateFromFields(item, updateFields),
          create: item,
        })
      )
    );
  }

  private buildWhereFromUniqueFields(item: any, fields: string[]): any {
    const where: any = {};
    for (const field of fields) {
      if (item[field] !== undefined) {
        where[field] = item[field];
      }
    }
    return where;
  }

  private buildUpdateFromFields(item: any, fields: string[]): any {
    const update: any = {};
    for (const field of fields) {
      if (item[field] !== undefined) {
        update[field] = item[field];
      }
    }
    return update;
  }

  // Query plan analysis
  // NOTE: For production use, pass the query directly to $queryRawUnsafe
  // This method is primarily for development/debugging
  async analyzeQuery(query: string): Promise<any> {
    const result = await this.db.$queryRawUnsafe(
      `EXPLAIN (ANALYZE, BUFFERS, FORMAT JSON) ${query}`
    );
    return result;
  }

  // Index usage statistics
  async getIndexUsage(tableName: string): Promise<any[]> {
    return this.db.$queryRaw`
      SELECT
        schemaname,
        tablename,
        indexname,
        idx_scan,
        idx_tup_read,
        idx_tup_fetch,
        pg_size_pretty(pg_relation_size(indexrelid)) AS index_size
      FROM pg_stat_user_indexes
      WHERE tablename = ${tableName}
      ORDER BY idx_scan DESC
    `;
  }

  // Missing index suggestions
  async suggestIndexes(minSeqScans: number = 100): Promise<any[]> {
    return this.db.$queryRaw`
      SELECT
        schemaname,
        tablename,
        attname,
        seq_scan,
        seq_tup_read,
        idx_scan,
        idx_tup_fetch
      FROM pg_stat_user_tables
      JOIN pg_attribute ON (tablename::regclass = attrelid)
      WHERE seq_scan > ${minSeqScans}
        AND schemaname = 'public'
        AND attnum > 0
        AND NOT attisdropped
      ORDER BY seq_scan DESC
    `;
  }
}

// Query caching decorator
export function cached(ttl: number = 300) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const cache = await (await import('../config/database.config')).CacheClient.getInstance();
      const cacheKey = `${target.constructor.name}:${propertyKey}:${JSON.stringify(args)}`;

      return cache.getOrSet(
        cacheKey,
        () => originalMethod.apply(this, args),
        ttl
      );
    };

    return descriptor;
  };
}

// Transaction helper with retry logic
export async function withTransaction<T>(
  fn: (tx: any) => Promise<T>,
  maxRetries: number = 3
): Promise<T> {
  const db = DatabaseClient.getInstance();
  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await db.$transaction(fn, {
        maxWait: 5000,
        timeout: 10000,
      });
    } catch (error: any) {
      lastError = error;
      
      // Only retry on specific errors
      if (
        error.code === 'P2034' || // Transaction conflict
        error.code === 'P2024' || // Timed out
        error.message?.includes('deadlock')
      ) {
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 100));
        continue;
      }
      
      throw error;
    }
  }

  throw lastError;
}

// Performance monitoring middleware
export function trackQueryPerformance() {
  return async (params: any, next: (params: any) => Promise<any>) => {
    const start = Date.now();
    const result = await next(params);
    const duration = Date.now() - start;

    if (duration > 1000) {
      console.warn(`Slow query detected (${duration}ms):`, {
        model: params.model,
        action: params.action,
        duration,
      });
    }

    return result;
  };
}
