/**
 * Pet Service - Business Logic Layer
 * Handles pet profile CRUD operations
 */

import { PrismaClient } from '@prisma/client';
import { TRPCError } from '@trpc/server';
import { 
  CreatePetInput,
  UpdatePetInput,
  calculatePetAge,
  recommendHarnessSize,
  validateMeasurements,
} from '@pet/domain';

export class PetService {
  constructor(private db: PrismaClient) {}

  /**
   * List user's pets
   */
  async listPets(userId: string) {
    const userProfile = await this.db.userProfile.findUnique({
      where: { clerkId: userId },
    });

    if (!userProfile) {
      return [];
    }

    const pets = await this.db.petProfile.findMany({
      where: {
        userId: userProfile.id,
        deletedAt: null,
      },
      orderBy: [
        { isPrimary: 'desc' },
        { createdAt: 'desc' },
      ],
    });

    return pets;
  }

  /**
   * Get pet by ID
   */
  async getPetById(userId: string, petId: string) {
    const userProfile = await this.db.userProfile.findUnique({
      where: { clerkId: userId },
    });

    if (!userProfile) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Pet not found',
      });
    }

    const pet = await this.db.petProfile.findFirst({
      where: {
        id: petId,
        userId: userProfile.id,
        deletedAt: null,
      },
    });

    if (!pet) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Pet not found',
      });
    }

    return pet;
  }

  /**
   * Create new pet profile
   */
  async createPet(userId: string, userEmail: string | undefined, input: CreatePetInput) {
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

    // Validate measurements if provided
    if (input.measurements) {
      const measurementErrors = validateMeasurements(input.measurements);
      if (measurementErrors.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invalid measurements: ${measurementErrors.join(', ')}`,
        });
      }
    }

    // Calculate age from birthDate if provided
    let calculatedAge = { years: input.ageYears, months: input.ageMonths };
    if (input.birthDate) {
      calculatedAge = calculatePetAge(new Date(input.birthDate));
    }

    // Get recommended harness size
    const recommendedSize = input.measurements 
      ? recommendHarnessSize(input.measurements)
      : input.size;

    // If this is the user's first pet or marked as primary, make it primary
    const existingPets = await this.db.petProfile.count({
      where: { userId: userProfile.id, deletedAt: null },
    });

    const isPrimary = input.isPrimary ?? (existingPets === 0);

    // If setting as primary, unset other pets
    if (isPrimary) {
      await this.db.petProfile.updateMany({
        where: {
          userId: userProfile.id,
          deletedAt: null,
        },
        data: {
          isPrimary: false,
        },
      });
    }

    const pet = await this.db.petProfile.create({
      data: {
        userId: userProfile.id,
        name: input.name,
        type: input.type,
        breed: input.breed,
        breedMix: input.breedMix || [],
        gender: input.gender,
        birthDate: input.birthDate ? new Date(input.birthDate) : null,
        ageYears: calculatedAge.years,
        ageMonths: calculatedAge.months,
        size: input.size,
        color: input.color,
        markings: input.markings,
        measurements: input.measurements as any,
        health: input.health as any,
        behavior: input.behavior as any,
        photoUrl: input.photoUrl,
        microchipId: input.microchipId,
        isPrimary,
        isActive: true,
        metadata: {
          recommendedHarnessSize: recommendedSize,
        } as any,
      },
    });

    return pet;
  }

  /**
   * Update pet profile
   */
  async updatePet(userId: string, input: UpdatePetInput) {
    const userProfile = await this.db.userProfile.findUnique({
      where: { clerkId: userId },
    });

    if (!userProfile) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Pet not found',
      });
    }

    // Verify ownership
    const existing = await this.db.petProfile.findFirst({
      where: {
        id: input.id,
        userId: userProfile.id,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Pet not found',
      });
    }

    // Validate measurements if provided
    if (input.measurements) {
      const measurementErrors = validateMeasurements(input.measurements);
      if (measurementErrors.length > 0) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: `Invalid measurements: ${measurementErrors.join(', ')}`,
        });
      }
    }

    // Calculate age if birthDate changed
    let ageUpdate = {};
    if (input.birthDate) {
      const age = calculatePetAge(new Date(input.birthDate));
      ageUpdate = { ageYears: age.years, ageMonths: age.months };
    }

    // Handle primary pet change
    if (input.isPrimary === true) {
      await this.db.petProfile.updateMany({
        where: {
          userId: userProfile.id,
          deletedAt: null,
          id: { not: input.id },
        },
        data: {
          isPrimary: false,
        },
      });
    }

    const { id, ...updateData } = input;
    const updated = await this.db.petProfile.update({
      where: { id },
      data: {
        ...updateData,
        ...ageUpdate,
        measurements: updateData.measurements as any,
        health: updateData.health as any,
        behavior: updateData.behavior as any,
        birthDate: updateData.birthDate ? new Date(updateData.birthDate) : undefined,
      },
    });

    return updated;
  }

  /**
   * Delete pet (soft delete)
   */
  async deletePet(userId: string, petId: string) {
    const userProfile = await this.db.userProfile.findUnique({
      where: { clerkId: userId },
    });

    if (!userProfile) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Pet not found',
      });
    }

    // Verify ownership
    const existing = await this.db.petProfile.findFirst({
      where: {
        id: petId,
        userId: userProfile.id,
        deletedAt: null,
      },
    });

    if (!existing) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Pet not found',
      });
    }

    await this.db.petProfile.update({
      where: { id: petId },
      data: { deletedAt: new Date(), isActive: false },
    });

    // If this was the primary pet, make another pet primary
    if (existing.isPrimary) {
      const nextPet = await this.db.petProfile.findFirst({
        where: {
          userId: userProfile.id,
          deletedAt: null,
          id: { not: petId },
        },
        orderBy: { createdAt: 'asc' },
      });

      if (nextPet) {
        await this.db.petProfile.update({
          where: { id: nextPet.id },
          data: { isPrimary: true },
        });
      }
    }

    return { success: true };
  }

  /**
   * Set pet as primary
   */
  async setPrimaryPet(userId: string, petId: string) {
    const userProfile = await this.db.userProfile.findUnique({
      where: { clerkId: userId },
    });

    if (!userProfile) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Pet not found',
      });
    }

    // Verify ownership
    const pet = await this.db.petProfile.findFirst({
      where: {
        id: petId,
        userId: userProfile.id,
        deletedAt: null,
      },
    });

    if (!pet) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'Pet not found',
      });
    }

    // Transaction: Unset other primaries, set this one
    await this.db.$transaction([
      this.db.petProfile.updateMany({
        where: {
          userId: userProfile.id,
          deletedAt: null,
        },
        data: {
          isPrimary: false,
        },
      }),
      this.db.petProfile.update({
        where: { id: petId },
        data: { isPrimary: true },
      }),
    ]);

    return { success: true };
  }
}

