import Fastify from 'fastify';
import crypto from 'crypto';
import webhookRoutes from '../webhooks';

describe('Webhook Routes', () => {
  let app: any;

  beforeEach(async () => {
    app = Fastify({ logger: false });
    
    // Mock database and queues
    app.decorate('db', {
      orderMeta: {
        upsert: jest.fn().mockResolvedValue({}),
        update: jest.fn().mockResolvedValue({}),
        findUnique: jest.fn().mockResolvedValue({
          shopifyOrderId: '123',
          email: 'test@example.com',
          statusHistory: [],
        }),
      },
    });
    
    app.decorate('queues', {
      'trigger-email': {
        add: jest.fn().mockResolvedValue({}),
      },
    });

    await app.register(webhookRoutes);
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /webhooks/shopify/orders/create', () => {
    const validOrderPayload = {
      id: 123456,
      email: 'customer@example.com',
      created_at: '2024-01-01T00:00:00Z',
      updated_at: '2024-01-01T00:00:00Z',
      name: '#1001',
      order_number: 1001,
      financial_status: 'paid',
      fulfillment_status: null,
      line_items: [
        {
          id: 789,
          title: 'Custom Harness',
          quantity: 1,
          price: '88.00',
          properties: [
            { name: 'size', value: 'M' },
            { name: 'colorway', value: 'ocean' },
          ],
        },
      ],
    };

    function createValidSignature(body: string): string {
      const hmac = crypto.createHmac('sha256', 'test-webhook-secret');
      hmac.update(body, 'utf8');
      return hmac.digest('base64');
    }

    it('should process valid order webhook', async () => {
      const body = JSON.stringify(validOrderPayload);
      const signature = createValidSignature(body);

      const response = await app.inject({
        method: 'POST',
        url: '/webhooks/shopify/orders/create',
        headers: {
          'x-shopify-hmac-sha256': signature,
          'content-type': 'application/json',
        },
        payload: body,
      });

      expect(response.statusCode).toBe(200);
      expect(JSON.parse(response.payload)).toEqual({ received: true });
      expect(app.db.orderMeta.upsert).toHaveBeenCalled();
      expect(app.queues['trigger-email'].add).toHaveBeenCalledWith('order-confirmation', {
        orderId: 123456,
        email: 'customer@example.com',
        orderNumber: 1001,
      });
    });

    it('should reject webhook with invalid signature', async () => {
      const body = JSON.stringify(validOrderPayload);

      const response = await app.inject({
        method: 'POST',
        url: '/webhooks/shopify/orders/create',
        headers: {
          'x-shopify-hmac-sha256': 'invalid-signature',
          'content-type': 'application/json',
        },
        payload: body,
      });

      expect(response.statusCode).toBe(401);
      expect(JSON.parse(response.payload)).toMatchObject({
        error: 'Invalid webhook signature',
      });
    });

    it('should reject webhook without signature', async () => {
      const body = JSON.stringify(validOrderPayload);

      const response = await app.inject({
        method: 'POST',
        url: '/webhooks/shopify/orders/create',
        headers: {
          'content-type': 'application/json',
        },
        payload: body,
      });

      expect(response.statusCode).toBe(401);
      expect(JSON.parse(response.payload)).toMatchObject({
        error: 'Missing webhook signature',
      });
    });

    it('should handle malformed JSON', async () => {
      const body = 'invalid json';
      const signature = createValidSignature(body);

      const response = await app.inject({
        method: 'POST',
        url: '/webhooks/shopify/orders/create',
        headers: {
          'x-shopify-hmac-sha256': signature,
          'content-type': 'application/json',
        },
        payload: body,
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
