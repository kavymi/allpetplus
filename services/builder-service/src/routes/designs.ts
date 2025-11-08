import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import { BuilderService } from '../services/builder.service';

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
  const builderService = new BuilderService(fastify.db);

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

        const design = await builderService.createDesign(
          request.userId,
          request.userEmail,
          body
        );

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

        const { status, limit = 20, cursor } = request.query as {
          status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
          limit?: number;
          cursor?: string;
        };

        const result = await builderService.listDesigns(request.userId, {
          status,
          limit: Number(limit),
          cursor,
        });

        return reply.send(result);
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

        const design = await builderService.getDesignById(request.userId, id);
        return reply.send(design);
      } catch (error: any) {
        if (error.code === 'NOT_FOUND') {
          return reply.status(404).send({ error: error.message });
        }
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
        const body = updateDesignSchema.parse({ ...request.body, id });

        if (!request.userId) {
          return reply.status(401).send({ error: 'Unauthorized' });
        }

        const updated = await builderService.updateDesign(request.userId, body);
        return reply.send(updated);
      } catch (error: any) {
        if (error instanceof z.ZodError) {
          return reply.status(400).send({
            error: 'Validation failed',
            details: error.errors,
          });
        }

        if (error.code === 'NOT_FOUND') {
          return reply.status(404).send({ error: error.message });
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

        await builderService.deleteDesign(request.userId, id);
        return reply.status(204).send();
      } catch (error: any) {
        if (error.code === 'NOT_FOUND') {
          return reply.status(404).send({ error: error.message });
        }

        request.log.error(error, 'Failed to delete design');
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Public: Get shared design by token (no auth required)
  fastify.get('/api/designs/shared/:token', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { token } = request.params as { token: string };

      const design = await builderService.getSharedDesign(token);
      return reply.send(design);
    } catch (error: any) {
      if (error.code === 'NOT_FOUND') {
        return reply.status(404).send({ error: 'Design not found' });
      }
      request.log.error(error, 'Failed to fetch shared design');
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}

