/**
 * Pet Profile tRPC Router
 * Type-safe pet management API
 */

import { router, protectedProcedure } from '../trpc';
import { 
  createPetSchema, 
  updatePetSchema, 
  petIdSchema 
} from '@pet/domain';

// This router can call either:
// - PetService in modular backend (current)
// - Pet microservice (future)
export const petsRouter = router({
  /**
   * List user's pets
   */
  list: protectedProcedure
    .query(async ({ ctx }) => {
      // For now, delegate to backend module
      // Future: Can call pet-service via HTTP
      const { PetService } = await import('@pet/backend/modules/pet/service');
      const service = new PetService(ctx.db);
      return service.listPets(ctx.userId);
    }),

  /**
   * Get pet by ID
   */
  byId: protectedProcedure
    .input(petIdSchema)
    .query(async ({ ctx, input }) => {
      const { PetService } = await import('@pet/backend/modules/pet/service');
      const service = new PetService(ctx.db);
      return service.getPetById(ctx.userId, input.id);
    }),

  /**
   * Create new pet
   */
  create: protectedProcedure
    .input(createPetSchema)
    .mutation(async ({ ctx, input }) => {
      const { PetService } = await import('@pet/backend/modules/pet/service');
      const service = new PetService(ctx.db);
      return service.createPet(ctx.userId, ctx.userEmail, input);
    }),

  /**
   * Update pet
   */
  update: protectedProcedure
    .input(updatePetSchema)
    .mutation(async ({ ctx, input }) => {
      const { PetService } = await import('@pet/backend/modules/pet/service');
      const service = new PetService(ctx.db);
      return service.updatePet(ctx.userId, input);
    }),

  /**
   * Delete pet (soft delete)
   */
  delete: protectedProcedure
    .input(petIdSchema)
    .mutation(async ({ ctx, input }) => {
      const { PetService } = await import('@pet/backend/modules/pet/service');
      const service = new PetService(ctx.db);
      return service.deletePet(ctx.userId, input.id);
    }),

  /**
   * Set as primary pet
   */
  setPrimary: protectedProcedure
    .input(petIdSchema)
    .mutation(async ({ ctx, input }) => {
      const { PetService } = await import('@pet/backend/modules/pet/service');
      const service = new PetService(ctx.db);
      return service.setPrimaryPet(ctx.userId, input.id);
    }),
});

