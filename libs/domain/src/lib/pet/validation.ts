/**
 * Pet Domain Validation Schemas
 * Zod schemas for type-safe validation
 */

import { z } from 'zod';

export const petTypeSchema = z.enum(['DOG', 'CAT', 'BIRD', 'RABBIT', 'OTHER']);

export const petGenderSchema = z.enum(['MALE', 'FEMALE', 'UNKNOWN']);

export const petSizeSchema = z.enum(['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE']);

export const activityLevelSchema = z.enum(['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH']);

export const petMeasurementsSchema = z.object({
  neckCircumference: z.number().positive().optional(),
  chestGirth: z.number().positive().optional(),
  length: z.number().positive().optional(),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
}).optional();

export const petHealthInfoSchema = z.object({
  hasAllergies: z.boolean().optional(),
  allergies: z.array(z.string()).optional(),
  hasSpecialNeeds: z.boolean().optional(),
  specialNeeds: z.string().optional(),
  isServiceAnimal: z.boolean().optional(),
  medications: z.array(z.string()).optional(),
}).optional();

export const petBehaviorSchema = z.object({
  activityLevel: activityLevelSchema,
  isPullerOnLeash: z.boolean().optional(),
  isGoodWithOtherDogs: z.boolean().optional(),
  isGoodWithCats: z.boolean().optional(),
  isGoodWithChildren: z.boolean().optional(),
  temperament: z.array(z.string()).optional(),
}).optional();

export const createPetSchema = z.object({
  name: z.string().min(1).max(100),
  type: petTypeSchema,
  breed: z.string().max(100).optional(),
  breedMix: z.array(z.string()).optional(),
  gender: petGenderSchema,
  birthDate: z.string().datetime().optional(),
  ageYears: z.number().int().min(0).max(30).optional(),
  ageMonths: z.number().int().min(0).max(11).optional(),
  size: petSizeSchema,
  color: z.string().max(50).optional(),
  markings: z.string().max(255).optional(),
  measurements: petMeasurementsSchema,
  health: petHealthInfoSchema,
  behavior: petBehaviorSchema,
  photoUrl: z.string().url().optional(),
  microchipId: z.string().max(50).optional(),
  isPrimary: z.boolean().optional(),
});

export const updatePetSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  breed: z.string().max(100).optional(),
  breedMix: z.array(z.string()).optional(),
  gender: petGenderSchema.optional(),
  birthDate: z.string().datetime().optional(),
  ageYears: z.number().int().min(0).max(30).optional(),
  ageMonths: z.number().int().min(0).max(11).optional(),
  size: petSizeSchema.optional(),
  color: z.string().max(50).optional(),
  markings: z.string().max(255).optional(),
  measurements: petMeasurementsSchema,
  health: petHealthInfoSchema,
  behavior: petBehaviorSchema,
  photoUrl: z.string().url().optional(),
  microchipId: z.string().max(50).optional(),
  isPrimary: z.boolean().optional(),
});

export const petIdSchema = z.object({
  id: z.string().uuid(),
});

// Note: CreatePetInput and UpdatePetInput types are defined in types.ts
// to avoid duplicate exports when using export * from both files

