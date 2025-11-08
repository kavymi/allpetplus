import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { z } from 'zod';
import crypto from 'crypto';
import { ShopifyError, ValidationError } from '../utils/error-handler';
import { DatabaseClient } from '../config/database.config';
import { Queue } from 'bullmq';

// Type augmentation
declare module 'fastify' {
  interface FastifyInstance {
    db: DatabaseClient;
    queues: Record<string, Queue>;
  }
}

const webhookBodySchema = z.object({
  id: z.number(),
  email: z.string().email(),
  created_at: z.string(),
  updated_at: z.string(),
  name: z.string(),
  order_number: z.number(),
  financial_status: z.string(),
  fulfillment_status: z.string().nullable(),
  line_items: z.array(
    z.object({
      id: z.number(),
      title: z.string(),
      quantity: z.number(),
      price: z.string(),
      properties: z.array(
        z.object({
          name: z.string(),
          value: z.string(),
        })
      ).optional(),
    })
  ),
});

function verifyShopifyWebhook(body: string, signature: string, secret: string): boolean {
  const hmac = crypto.createHmac('sha256', secret);
  hmac.update(body, 'utf8');
  const hash = hmac.digest('base64');
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(signature));
}

export default async function webhookRoutes(fastify: FastifyInstance) {
  fastify.addContentTypeParser('application/json', { parseAs: 'string' }, (req, body, done) => {
    done(null, body);
  });

  fastify.post('/webhooks/shopify/orders/create', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const signature = request.headers['x-shopify-hmac-sha256'] as string;
      const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

      if (!secret) {
        throw new ValidationError('SHOPIFY_WEBHOOK_SECRET not configured');
      }

      if (!signature) {
        throw new ValidationError('Missing webhook signature');
      }

      const body = request.body as string;
      if (!verifyShopifyWebhook(body, signature, secret)) {
        throw new ValidationError('Invalid webhook signature');
      }

      const orderData = webhookBodySchema.parse(JSON.parse(body));
      
      // Store order metadata for tracking
      await fastify.db.orderMeta.upsert({
        where: { shopifyOrderId: String(orderData.id) },
        update: {
          status: 'CONFIRMED',
          updatedAt: new Date(),
        },
        create: {
          shopifyOrderId: String(orderData.id),
          shopifyOrderNumber: String(orderData.order_number),
          email: orderData.email,
          emailHash: crypto.createHash('sha256').update(orderData.email).digest('hex'),
          maskedId: `HH-${String(orderData.order_number).slice(-4)}`,
          status: 'CONFIRMED',
          statusHistory: [
            {
              status: 'confirmed',
              timestamp: orderData.created_at,
              description: 'Order confirmed and payment processed',
              isComplete: true,
            },
          ],
        },
      });

      // Queue notification job
      await fastify.queues['trigger-email'].add('order-confirmation', {
        orderId: orderData.id,
        email: orderData.email,
        orderNumber: orderData.order_number,
      });

      request.log.info({ orderId: orderData.id }, 'Order webhook processed');
      return reply.status(200).send({ received: true });
    } catch (error) {
      request.log.error(error, 'Order webhook processing failed');
      return reply.status(500).send({ error: 'Webhook processing failed' });
    }
  });

  fastify.post('/webhooks/shopify/orders/fulfilled', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const signature = request.headers['x-shopify-hmac-sha256'] as string;
      const secret = process.env.SHOPIFY_WEBHOOK_SECRET;

      if (!secret || !signature) {
        return reply.status(401).send({ error: 'Missing webhook credentials' });
      }

      const body = request.body as string;
      if (!verifyShopifyWebhook(body, signature, secret)) {
        return reply.status(401).send({ error: 'Invalid signature' });
      }

      const fulfillmentData = JSON.parse(body);
      const orderId = String(fulfillmentData.order_id);

        // Update order status to shipped
        const orderMeta = await fastify.db.orderMeta.findUnique({
          where: { shopifyOrderId: orderId },
        });

        if (orderMeta) {
          const currentTimeline = orderMeta.statusHistory || [];
          const updatedTimeline = [
            ...currentTimeline,
            {
              status: 'shipped',
              timestamp: fulfillmentData.created_at,
              description: `Package shipped via ${fulfillmentData.tracking_company || 'carrier'}`,
              isComplete: true,
            },
          ];

          await fastify.db.orderMeta.update({
            where: { shopifyOrderId: orderId },
            data: {
              status: 'SHIPPED',
              statusHistory: updatedTimeline,
              shippingInfo: {
                carrier: fulfillmentData.tracking_company,
                trackingNumber: fulfillmentData.tracking_number,
                trackingUrl: fulfillmentData.tracking_url,
              },
              updatedAt: new Date(),
            },
          });

        // Queue shipping notification
        await fastify.queues['trigger-email'].add('order-shipped', {
          orderId,
          email: orderMeta.email,
          trackingNumber: fulfillmentData.tracking_number,
        });
      }

      request.log.info({ orderId }, 'Fulfillment webhook processed');
      return reply.status(200).send({ received: true });
    } catch (error) {
      request.log.error(error, 'Fulfillment webhook processing failed');
      return reply.status(500).send({ error: 'Webhook processing failed' });
    }
  });
}
