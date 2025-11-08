/**
 * Design Routes - DEPRECATED
 * 
 * ⚠️ These routes have been migrated to builder-service
 * Location: services/builder-service/src/routes/designs.ts
 * 
 * This file is kept for backwards compatibility during the migration period.
 * Once all clients are pointing to the builder-service, these routes can be removed.
 * 
 * Migration Status:
 * - ✅ Routes migrated to builder-service
 * - ⏳ Waiting for tRPC integration
 * - ⏳ Waiting for traffic routing update
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { DatabaseClient } from '../config/database.config';

// Type augmentation for this route file
declare module 'fastify' {
  interface FastifyInstance {
    db: DatabaseClient;
    authenticate: (request: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
  
  interface FastifyRequest {
    userId?: string;
    sessionId?: string;
    userEmail?: string;
  }
}

const createDesignSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  configJson: z.record(z.unknown()),
  priceBreakdown: z.record(z.unknown()).optional(),
});

const updateDesignSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  configJson: z.record(z.unknown()).optional(),
  priceBreakdown: z.record(z.unknown()).optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
});

export default async function designRoutes(fastify: FastifyInstance) {
  // Create a new design (authenticated)
  fastify.post(
    '/api/designs',
    {
      onRequest: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const body = createDesignSchema.parse(request.body);

        if (!request.userId) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        // Get or create user profile
        let userProfile = await fastify.db.userProfile.findUnique({
          where: { clerkId: request.userId },
        });

        if (!userProfile) {
          userProfile = await fastify.db.userProfile.create({
            data: {
              clerkId: request.userId,
              email: request.userEmail,
              emailHash: request.userEmail 
                ? require('crypto').createHash('sha256').update(request.userEmail).digest('hex')
                : null,
            },
          });
        }

        const design = await fastify.db.savedDesign.create({
          data: {
            userId: userProfile.id,
            name: body.name,
            configJson: body.configJson,
            priceBreakdown: body.priceBreakdown,
            status: 'DRAFT',
          },
          select: {
            id: true,
            name: true,
            configJson: true,
            priceBreakdown: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        return reply.status(201).send(design);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            error: 'Validation failed',
            details: error.errors,
          });
        }

        request.log.error(error, 'Failed to create design');
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Get user's designs (authenticated)
  fastify.get(
    '/api/designs',
    {
      onRequest: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        if (!request.userId) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const userProfile = await fastify.db.userProfile.findUnique({
          where: { clerkId: request.userId },
        });

        if (!userProfile) {
          return reply.send({ designs: [] });
        }

        const { status, limit = 20, cursor } = request.query as {
          status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
          limit?: number;
          cursor?: string;
        };

        const designs = await fastify.db.savedDesign.findMany({
          where: {
            userId: userProfile.id,
            status: status || undefined,
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            configJson: true,
            priceBreakdown: true,
            previewUrl: true,
            thumbnailUrl: true,
            status: true,
            createdAt: true,
            updatedAt: true,
          },
          orderBy: { createdAt: 'desc' },
          take: Number(limit) + 1,
          ...(cursor && {
            cursor: { id: cursor },
            skip: 1,
          }),
        });

        const hasMore = designs.length > Number(limit);
        const items = designs.slice(0, Number(limit));

        return reply.send({
          designs: items,
          pageInfo: {
            hasNextPage: hasMore,
            endCursor: items[items.length - 1]?.id || null,
          },
        });
      } catch (error) {
        request.log.error(error, 'Failed to fetch designs');
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Get single design (authenticated)
  fastify.get(
    '/api/designs/:id',
    {
      onRequest: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };

        if (!request.userId) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const userProfile = await fastify.db.userProfile.findUnique({
          where: { clerkId: request.userId },
        });

        if (!userProfile) {
          return reply.status(404).send({ error: 'Design not found' });
        }

        const design = await fastify.db.savedDesign.findFirst({
          where: {
            id,
            userId: userProfile.id,
            deletedAt: null,
          },
          select: {
            id: true,
            name: true,
            configJson: true,
            priceBreakdown: true,
            previewUrl: true,
            thumbnailUrl: true,
            shareToken: true,
            status: true,
            isTemplate: true,
            viewCount: true,
            createdAt: true,
            updatedAt: true,
          },
        });

        if (!design) {
          return reply.status(404).send({ error: 'Design not found' });
        }

        return reply.send(design);
      } catch (error) {
        request.log.error(error, 'Failed to fetch design');
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Update design (authenticated)
  fastify.patch(
    '/api/designs/:id',
    {
      onRequest: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };
        const body = updateDesignSchema.parse(request.body);

        if (!request.userId) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const userProfile = await fastify.db.userProfile.findUnique({
          where: { clerkId: request.userId },
        });

        if (!userProfile) {
          return reply.status(404).send({ error: 'Design not found' });
        }

        // Verify ownership
        const existing = await fastify.db.savedDesign.findFirst({
          where: {
            id,
            userId: userProfile.id,
            deletedAt: null,
          },
        });

        if (!existing) {
          return reply.status(404).send({ error: 'Design not found' });
        }

        const updated = await fastify.db.savedDesign.update({
          where: { id },
          data: {
            ...(body.name && { name: body.name }),
            ...(body.configJson && { configJson: body.configJson }),
            ...(body.priceBreakdown && { priceBreakdown: body.priceBreakdown }),
            ...(body.status && { status: body.status }),
          },
          select: {
            id: true,
            name: true,
            configJson: true,
            priceBreakdown: true,
            status: true,
            updatedAt: true,
          },
        });

        return reply.send(updated);
      } catch (error) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            error: 'Validation failed',
            details: error.errors,
          });
        }

        request.log.error(error, 'Failed to update design');
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Delete design (soft delete) (authenticated)
  fastify.delete(
    '/api/designs/:id',
    {
      onRequest: fastify.authenticate,
    },
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        const { id } = request.params as { id: string };

        if (!request.userId) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const userProfile = await fastify.db.userProfile.findUnique({
          where: { clerkId: request.userId },
        });

        if (!userProfile) {
          return reply.status(404).send({ error: 'Design not found' });
        }

        // Verify ownership
        const existing = await fastify.db.savedDesign.findFirst({
          where: {
            id,
            userId: userProfile.id,
            deletedAt: null,
          },
        });

        if (!existing) {
          return reply.status(404).send({ error: 'Design not found' });
        }

        await fastify.db.savedDesign.update({
          where: { id },
          data: { deletedAt: new Date() },
        });

        return reply.status(204).send();
      } catch (error) {
        request.log.error(error, 'Failed to delete design');
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Public: Get shared design by token (no auth required)
  fastify.get('/api/designs/shared/:token', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { token } = request.params as { token: string };

      const design = await fastify.db.savedDesign.findFirst({
        where: {
          shareToken: token,
          status: 'ACTIVE',
          deletedAt: null,
        },
        select: {
          id: true,
          name: true,
          configJson: true,
          previewUrl: true,
          thumbnailUrl: true,
          isTemplate: true,
          createdAt: true,
        },
      });

      if (!design) {
        return reply.status(404).send({ error: 'Design not found' });
      }

      // Increment view count
      await fastify.db.savedDesign.update({
        where: { id: design.id },
        data: { viewCount: { increment: 1 } },
      });

      return reply.send(design);
    } catch (error) {
      request.log.error(error, 'Failed to fetch shared design');
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
