/**
 * Builder Module - HTTP Routes
 * Handles design CRUD endpoints
 */

import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { BuilderService } from './service';
import { createDesignSchema, updateDesignSchema } from '@pet/domain';

export async function builderRoutes(fastify: FastifyInstance) {
  const builderService = new BuilderService(fastify.db);

  // List designs
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

        const { status, limit, cursor } = request.query as {
          status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
          limit?: number;
          cursor?: string;
        };

        const result = await builderService.listDesigns(request.userId, {
          status,
          limit,
          cursor,
        });

        return reply.send(result);
      } catch (error) {
        request.log.error(error, 'Failed to fetch designs');
        return reply.status(500).send({ error: 'Internal server error' });
      }
    }
  );

  // Get single design
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

  // Create design
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
      } catch (error: any) {
        if (error.name === 'ZodError') {
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

  // Update design
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
        if (error.name === 'ZodError') {
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

  // Delete design
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
}

