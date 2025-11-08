import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import crypto from 'crypto';
import { DatabaseClient } from '../config/database.config';

// Type augmentation
declare module 'fastify' {
  interface FastifyInstance {
    db: DatabaseClient;
  }
}

const orderLookupSchema = z.object({
  orderNumber: z.string().min(1),
  email: z.string().email(),
});

export default async function orderRoutes(fastify: FastifyInstance) {
  fastify.get('/api/orders/:orderNumber', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const { orderNumber } = request.params as { orderNumber: string };
      const { email } = request.query as { email: string };

      const validated = orderLookupSchema.parse({ orderNumber, email });

      const emailHash = crypto.createHash('sha256').update(validated.email).digest('hex');
      
      const orderMeta = await fastify.db.orderMeta.findFirst({
        where: {
          shopifyOrderNumber: validated.orderNumber,
          emailHash,
        },
      });

      if (!orderMeta) {
        return reply.status(404).send({ error: 'Order not found' });
      }

      const timeline = orderMeta.statusHistory || [];
      const shipment = orderMeta.shippingInfo ? orderMeta.shippingInfo : null;

      const orderStatus = {
        id: orderMeta.shopifyOrderId,
        orderNumber: orderMeta.shopifyOrderNumber,
        email: validated.email, // Use validated email, not stored encrypted version
        createdAt: orderMeta.createdAt.toISOString(),
        timeline,
        shipment,
        summary: {
          subtotal: 88, // TODO: store actual order totals
          discounts: 0,
          shipping: 0,
          tax: 6.5,
          total: 94.5,
          currencyCode: 'USD',
        },
        items: [
          {
            title: 'Custom Harness',
            quantity: 1,
            selections: {}, // TODO: parse from line item properties
            previewImage: {
              src: '/placeholder.svg',
              alt: 'Custom harness',
            },
          },
        ],
      };

      return reply.send(orderStatus);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return reply.status(400).send({ error: 'Invalid request parameters' });
      }
      
      request.log.error(error, 'Order lookup failed');
      return reply.status(500).send({ error: 'Internal server error' });
    }
  });
}
