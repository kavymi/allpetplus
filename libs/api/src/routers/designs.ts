import { z } from 'zod';
import { createHash } from 'crypto';
import { router, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';

export const designsRouter = router({
  /**
   * List user's designs with pagination
   */
  list: protectedProcedure
    .input(
      z.object({
        status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
        limit: z.number().min(1).max(100).default(20),
        cursor: z.string().optional(),
      }).optional()
    )
    .query(async ({ ctx, input = {} }) => {
      const { limit = 20, cursor, status } = input;

      const userProfile = await ctx.db.userProfile.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!userProfile) {
        return { designs: [], pageInfo: { hasNextPage: false, endCursor: null } };
      }

      const designs = await ctx.db.savedDesign.findMany({
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
    }),

  /**
   * Get single design by ID
   */
  byId: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const userProfile = await ctx.db.userProfile.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!userProfile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Design not found',
        });
      }

      const design = await ctx.db.savedDesign.findFirst({
        where: {
          id: input.id,
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
    }),

  /**
   * Create a new design
   */
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1).max(255).optional(),
        configJson: z.record(z.unknown()),
        priceBreakdown: z.record(z.unknown()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get or create user profile
      let userProfile = await ctx.db.userProfile.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!userProfile) {
        userProfile = await ctx.db.userProfile.create({
          data: {
            clerkId: ctx.userId,
            email: ctx.userEmail,
            emailHash: ctx.userEmail
              ? createHash('sha256').update(ctx.userEmail).digest('hex')
              : null,
          },
        });
      }

      const design = await ctx.db.savedDesign.create({
        data: {
          userId: userProfile.id,
          name: input.name,
          configJson: input.configJson,
          priceBreakdown: input.priceBreakdown,
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
    }),

  /**
   * Update existing design
   */
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).max(255).optional(),
        configJson: z.record(z.unknown()).optional(),
        priceBreakdown: z.record(z.unknown()).optional(),
        status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const userProfile = await ctx.db.userProfile.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!userProfile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Design not found',
        });
      }

      // Verify ownership
      const existing = await ctx.db.savedDesign.findFirst({
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

      const { id, ...updateData } = input;
      const updated = await ctx.db.savedDesign.update({
        where: { id },
        data: updateData,
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
    }),

  /**
   * Delete design (soft delete)
   */
  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const userProfile = await ctx.db.userProfile.findUnique({
        where: { clerkId: ctx.userId },
      });

      if (!userProfile) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Design not found',
        });
      }

      // Verify ownership
      const existing = await ctx.db.savedDesign.findFirst({
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

      await ctx.db.savedDesign.update({
        where: { id: input.id },
        data: { deletedAt: new Date() },
      });

      return { success: true };
    }),
});

