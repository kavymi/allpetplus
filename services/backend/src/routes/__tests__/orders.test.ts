import Fastify from 'fastify';
import crypto from 'crypto';
import orderRoutes from '../orders';

describe('Order Routes', () => {
  let app: any;

  beforeEach(async () => {
    app = Fastify({ logger: false });
    
    // Mock database
    app.decorate('db', {
      orderMeta: {
        findFirst: jest.fn(),
      },
    });

    await app.register(orderRoutes);
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /api/orders/:orderNumber', () => {
    it('should return order details for valid order and email', async () => {
      const email = 'customer@example.com';
      const emailHash = crypto.createHash('sha256').update(email).digest('hex');
      
      const mockOrderMeta = {
        shopifyOrderId: '123456',
        shopifyOrderNumber: '1001',
        emailHash,
        createdAt: new Date('2024-01-01'),
        statusHistory: [
          {
            status: 'confirmed',
            timestamp: '2024-01-01T00:00:00Z',
            description: 'Order confirmed',
            isComplete: true,
          },
        ],
        shippingInfo: {
          carrier: 'USPS',
          trackingNumber: '9400111899223344556677',
          trackingUrl: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223344556677',
        },
      };

      app.db.orderMeta.findFirst.mockResolvedValue(mockOrderMeta);

      const response = await app.inject({
        method: 'GET',
        url: '/api/orders/1001',
        query: { email },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      
      expect(body.orderNumber).toBe('1001');
      expect(body.email).toBe(email);
      expect(body.timeline).toHaveLength(1);
      expect(body.shipment).toEqual(mockOrderMeta.shippingInfo);
      expect(app.db.orderMeta.findFirst).toHaveBeenCalledWith({
        where: {
          shopifyOrderNumber: '1001',
          emailHash,
        },
      });
    });

    it('should return 404 for non-existent order', async () => {
      app.db.orderMeta.findFirst.mockResolvedValue(null);

      const response = await app.inject({
        method: 'GET',
        url: '/api/orders/9999',
        query: { email: 'customer@example.com' },
      });

      expect(response.statusCode).toBe(404);
      expect(JSON.parse(response.payload)).toMatchObject({
        error: 'Order not found',
      });
    });

    it('should return 400 for invalid email', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders/1001',
        query: { email: 'invalid-email' },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.payload)).toMatchObject({
        error: 'Invalid request parameters',
      });
    });

    it('should return 400 for missing email', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/api/orders/1001',
      });

      expect(response.statusCode).toBe(400);
    });
  });
});
