/**
 * Builder Service - Business Logic Layer
 * Handles design CRUD operations with business rules
 * 
 * ⚠️ DEPRECATED: This module has been migrated to builder-service
 * New location: services/builder-service/src/services/builder.service.ts
 * 
 * This file is kept for backwards compatibility during the migration period.
 */

import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { 
  BuilderConfig, 
  calculatePrice, 
  CreateDesignInput,
  UpdateDesignInput 
} from '@pet/domain';

export class BuilderService {
  constructor(private db: PrismaClient) {}

  /**
   * List user's designs with pagination
   */
  async listDesigns(userId: string, options: {
    status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
    limit?: number;
    cursor?: string;
  }) {
    const { status, limit = 20, cursor } = options;

    const userProfile = await this.db.userProfile.findUnique({
      where: { clerkId: userId },
    });

    if (!userProfile) {
      return { designs: [], pageInfo: { hasNextPage: false, endCursor: null } };
    }

    const designs = await this.db.savedDesign.findMany({
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
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
    });

    const hasNextPage = designs.length > limit;
    const items = designs.slice(0, limit);

    return {
      designs: items,
      pageInfo: {
        hasNextPage,
        endCursor: items[items.length - 1]?.id || null,
      },
    };
  }

  /**
   * Get design by ID
   */
  async getDesignById(userId: string, designId: string) {
    const userProfile = await this.db.userProfile.findUnique({
      where: { clerkId: userId },
    });

    if (!userProfile) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Design not found',
      });
    }

    const design = await this.db.savedDesign.findFirst({
      where: {
        id: designId,
        userId: userProfile.id,
        deletedAt: null,
      },
    });

    if (!design) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Design not found',
      });
    }

    return design;
  }

  /**
   * Create new design with price calculation
   */
  async createDesign(userId: string, userEmail: string | undefined, input: CreateDesignInput) {
    // Get or create user profile
    let userProfile = await this.db.userProfile.findUnique({
      where: { clerkId: userId },
    });

    if (!userProfile) {
      userProfile = await this.db.userProfile.create({
        data: {
          clerkId: userId,
          email: userEmail,
          emailHash: userEmail
            ? require('crypto').createHash('sha256').update(userEmail).digest('hex')
            : null,
        },
      });
    }

    // Calculate price using domain logic
    const priceBreakdown = input.priceBreakdown || calculatePrice(input.configJson);

    const design = await this.db.savedDesign.create({
      data: {
        userId: userProfile.id,
        name: input.name,
        configJson: input.configJson as any,
        priceBreakdown: priceBreakdown as any,
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

    return design;
  }

  /**
   * Update existing design
   */
  async updateDesign(userId: string, input: UpdateDesignInput) {
    const userProfile = await this.db.userProfile.findUnique({
      where: { clerkId: userId },
    });

    if (!userProfile) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Design not found',
      });
    }

    // Verify ownership
    const existing = await this.db.savedDesign.findFirst({
      where: {
        id: input.id,
        userId: userProfile.id,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Design not found',
      });
    }

    // Recalculate price if config changed
    const priceBreakdown = input.configJson 
      ? calculatePrice(input.configJson)
      : undefined;

    const { id, ...updateData } = input;
    const updated = await this.db.savedDesign.update({
      where: { id },
      data: {
        ...updateData,
        ...(priceBreakdown && { priceBreakdown: priceBreakdown as any }),
        configJson: updateData.configJson as any,
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

    return updated;
  }

  /**
   * Delete design (soft delete)
   */
  async deleteDesign(userId: string, designId: string) {
    const userProfile = await this.db.userProfile.findUnique({
      where: { clerkId: userId },
    });

    if (!userProfile) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Design not found',
      });
    }

    // Verify ownership
    const existing = await this.db.savedDesign.findFirst({
      where: {
        id: designId,
        userId: userProfile.id,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Design not found',
      });
    }

    await this.db.savedDesign.update({
      where: { id: designId },
      data: { deletedAt: new Date() },
    });

    return { success: true };
  }
}

