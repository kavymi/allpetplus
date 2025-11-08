import Fastify from 'fastify';
import designRoutes from '../designs';

// Mock Clerk auth
jest.mock('@clerk/fastify', () => ({
  clerkPlugin: jest.fn(),
  getAuth: jest.fn(() => ({ userId: 'user_123', sessionId: 'sess_456' })),
}));

describe('Design Routes', () => {
  let app: any;
  const mockUserId = 'user_123';
  const mockUserProfileId = 'profile_uuid';

  beforeEach(async () => {
    app = Fastify({ logger: false });
    
    // Mock database
    app.decorate('db', {
      userProfile: {
        findUnique: jest.fn().mockResolvedValue({
          id: mockUserProfileId,
          clerkId: mockUserId,
          email: 'test@example.com',
        }),
        create: jest.fn().mockResolvedValue({
          id: mockUserProfileId,
          clerkId: mockUserId,
          email: 'test@example.com',
        }),
      },
      savedDesign: {
        create: jest.fn(),
        findMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
      },
    });

    // Mock authenticate decorator
    app.decorate('authenticate', async (request: any) => {
      request.userId = mockUserId;
      request.userEmail = 'test@example.com';
    });

    await app.register(designRoutes);
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/designs', () => {
    it('should create a new design', async () => {
      const mockDesign = {
        id: 'design_123',
        name: 'My Custom Harness',
        configJson: { size: 'M', colorway: 'ocean' },
        priceBreakdown: { base: 88, personalization: 0 },
        status: 'DRAFT',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      app.db.savedDesign.create.mockResolvedValue(mockDesign);

      const response = await app.inject({
        method: 'POST',
        url: '/api/designs',
        headers: {
          'content-type': 'application/json',
        },
        payload: {
          name: 'My Custom Harness',
          configJson: { size: 'M', colorway: 'ocean' },
          priceBreakdown: { base: 88, personalization: 0 },
        },
      });

      expect(response.statusCode).toBe(201);
      const body = JSON.parse(response.payload);
      
      expect(body.id).toBe('design_123');
      expect(body.name).toBe('My Custom Harness');
      expect(body.status).toBe('DRAFT');
      expect(app.db.savedDesign.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          userId: mockUserProfileId,
          name: 'My Custom Harness',
          status: 'DRAFT',
        }),
        select: expect.any(Object),
      });
    });

    it('should reject invalid payload', async () => {
      const response = await app.inject({
        method: 'POST',
        url: '/api/designs',
        headers: {
          'content-type': 'application/json',
        },
        payload: {
          name: 'Test',
          // Missing required configJson
        },
      });

      expect(response.statusCode).toBe(400);
      expect(JSON.parse(response.payload)).toMatchObject({
        error: 'Validation failed',
      });
    });
  });

  describe('GET /api/designs', () => {
    it('should return user designs with pagination', async () => {
      const mockDesigns = [
        {
          id: 'design_1',
          name: 'Design 1',
          configJson: {},
          priceBreakdown: {},
          status: 'ACTIVE',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 'design_2',
          name: 'Design 2',
          configJson: {},
          priceBreakdown: {},
          status: 'DRAFT',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];

      app.db.savedDesign.findMany.mockResolvedValue(mockDesigns);

      const response = await app.inject({
        method: 'GET',
        url: '/api/designs',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      
      expect(body.designs).toHaveLength(2);
      expect(body.pageInfo).toBeDefined();
      expect(body.pageInfo.hasNextPage).toBe(false);
    });

    it('should filter by status', async () => {
      app.db.savedDesign.findMany.mockResolvedValue([]);

      const response = await app.inject({
        method: 'GET',
        url: '/api/designs?status=ACTIVE',
      });

      expect(response.statusCode).toBe(200);
      expect(app.db.savedDesign.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'ACTIVE',
          }),
        })
      );
    });
  });

  describe('GET /api/designs/:id', () => {
    it('should return single design', async () => {
      const mockDesign = {
        id: 'design_123',
        name: 'My Design',
        configJson: { size: 'L' },
        priceBreakdown: {},
        status: 'ACTIVE',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      app.db.savedDesign.findFirst.mockResolvedValue(mockDesign);

      const response = await app.inject({
        method: 'GET',
        url: '/api/designs/design_123',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.id).toBe('design_123');
    });

    it('should return 404 for non-existent design', async () => {
      app.db.savedDesign.findFirst.mockResolvedValue(null);

      const response = await app.inject({
        method: 'GET',
        url: '/api/designs/nonexistent',
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('PATCH /api/designs/:id', () => {
    it('should update design', async () => {
      app.db.savedDesign.findFirst.mockResolvedValue({
        id: 'design_123',
        userId: mockUserProfileId,
      });

      app.db.savedDesign.update.mockResolvedValue({
        id: 'design_123',
        name: 'Updated Name',
        configJson: { size: 'XL' },
        status: 'ACTIVE',
        updatedAt: new Date(),
      });

      const response = await app.inject({
        method: 'PATCH',
        url: '/api/designs/design_123',
        headers: {
          'content-type': 'application/json',
        },
        payload: {
          name: 'Updated Name',
          status: 'ACTIVE',
        },
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.name).toBe('Updated Name');
    });

    it('should return 404 for non-owned design', async () => {
      app.db.savedDesign.findFirst.mockResolvedValue(null);

      const response = await app.inject({
        method: 'PATCH',
        url: '/api/designs/design_123',
        headers: {
          'content-type': 'application/json',
        },
        payload: {
          name: 'Updated Name',
        },
      });

      expect(response.statusCode).toBe(404);
    });
  });

  describe('DELETE /api/designs/:id', () => {
    it('should soft delete design', async () => {
      app.db.savedDesign.findFirst.mockResolvedValue({
        id: 'design_123',
        userId: mockUserProfileId,
      });

      app.db.savedDesign.update.mockResolvedValue({});

      const response = await app.inject({
        method: 'DELETE',
        url: '/api/designs/design_123',
      });

      expect(response.statusCode).toBe(204);
      expect(app.db.savedDesign.update).toHaveBeenCalledWith({
        where: { id: 'design_123' },
        data: { deletedAt: expect.any(Date) },
      });
    });
  });

  describe('GET /api/designs/shared/:token', () => {
    it('should return shared design and increment view count', async () => {
      const mockDesign = {
        id: 'design_123',
        name: 'Shared Design',
        configJson: { size: 'M' },
        previewUrl: 'https://example.com/preview.png',
        isTemplate: false,
        createdAt: new Date(),
      };

      app.db.savedDesign.findFirst.mockResolvedValue(mockDesign);
      app.db.savedDesign.update.mockResolvedValue({});

      const response = await app.inject({
        method: 'GET',
        url: '/api/designs/shared/abc123token',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body.id).toBe('design_123');
      
      // Verify view count increment
      expect(app.db.savedDesign.update).toHaveBeenCalledWith({
        where: { id: 'design_123' },
        data: { viewCount: { increment: 1 } },
      });
    });

    it('should return 404 for invalid token', async () => {
      app.db.savedDesign.findFirst.mockResolvedValue(null);

      const response = await app.inject({
        method: 'GET',
        url: '/api/designs/shared/invalidtoken',
      });

      expect(response.statusCode).toBe(404);
    });
  });
});
