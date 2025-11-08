"use strict";
/**
 * Pet Domain Validation Schemas
 * Zod schemas for type-safe validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.petIdSchema = exports.updatePetSchema = exports.createPetSchema = exports.petBehaviorSchema = exports.petHealthInfoSchema = exports.petMeasurementsSchema = exports.activityLevelSchema = exports.petSizeSchema = exports.petGenderSchema = exports.petTypeSchema = void 0;
const zod_1 = require("zod");
exports.petTypeSchema = zod_1.z.enum(['DOG', 'CAT', 'BIRD', 'RABBIT', 'OTHER']);
exports.petGenderSchema = zod_1.z.enum(['MALE', 'FEMALE', 'UNKNOWN']);
exports.petSizeSchema = zod_1.z.enum(['TINY', 'SMALL', 'MEDIUM', 'LARGE', 'EXTRA_LARGE']);
exports.activityLevelSchema = zod_1.z.enum(['LOW', 'MODERATE', 'HIGH', 'VERY_HIGH']);
exports.petMeasurementsSchema = zod_1.z.object({
    neckCircumference: zod_1.z.number().positive().optional(),
    chestGirth: zod_1.z.number().positive().optional(),
    length: zod_1.z.number().positive().optional(),
    weight: zod_1.z.number().positive().optional(),
    height: zod_1.z.number().positive().optional(),
}).optional();
exports.petHealthInfoSchema = zod_1.z.object({
    hasAllergies: zod_1.z.boolean().optional(),
    allergies: zod_1.z.array(zod_1.z.string()).optional(),
    hasSpecialNeeds: zod_1.z.boolean().optional(),
    specialNeeds: zod_1.z.string().optional(),
    isServiceAnimal: zod_1.z.boolean().optional(),
    medications: zod_1.z.array(zod_1.z.string()).optional(),
}).optional();
exports.petBehaviorSchema = zod_1.z.object({
    activityLevel: exports.activityLevelSchema,
    isPullerOnLeash: zod_1.z.boolean().optional(),
    isGoodWithOtherDogs: zod_1.z.boolean().optional(),
    isGoodWithCats: zod_1.z.boolean().optional(),
    isGoodWithChildren: zod_1.z.boolean().optional(),
    temperament: zod_1.z.array(zod_1.z.string()).optional(),
}).optional();
exports.createPetSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100),
    type: exports.petTypeSchema,
    breed: zod_1.z.string().max(100).optional(),
    breedMix: zod_1.z.array(zod_1.z.string()).optional(),
    gender: exports.petGenderSchema,
    birthDate: zod_1.z.string().datetime().optional(),
    ageYears: zod_1.z.number().int().min(0).max(30).optional(),
    ageMonths: zod_1.z.number().int().min(0).max(11).optional(),
    size: exports.petSizeSchema,
    color: zod_1.z.string().max(50).optional(),
    markings: zod_1.z.string().max(255).optional(),
    measurements: exports.petMeasurementsSchema,
    health: exports.petHealthInfoSchema,
    behavior: exports.petBehaviorSchema,
    photoUrl: zod_1.z.string().url().optional(),
    microchipId: zod_1.z.string().max(50).optional(),
    isPrimary: zod_1.z.boolean().optional(),
});
exports.updatePetSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(100).optional(),
    breed: zod_1.z.string().max(100).optional(),
    breedMix: zod_1.z.array(zod_1.z.string()).optional(),
    gender: exports.petGenderSchema.optional(),
    birthDate: zod_1.z.string().datetime().optional(),
    ageYears: zod_1.z.number().int().min(0).max(30).optional(),
    ageMonths: zod_1.z.number().int().min(0).max(11).optional(),
    size: exports.petSizeSchema.optional(),
    color: zod_1.z.string().max(50).optional(),
    markings: zod_1.z.string().max(255).optional(),
    measurements: exports.petMeasurementsSchema,
    health: exports.petHealthInfoSchema,
    behavior: exports.petBehaviorSchema,
    photoUrl: zod_1.z.string().url().optional(),
    microchipId: zod_1.z.string().max(50).optional(),
    isPrimary: zod_1.z.boolean().optional(),
});
exports.petIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
// Note: CreatePetInput and UpdatePetInput types are defined in types.ts
// to avoid duplicate exports when using export * from both files
//# sourceMappingURL=validation.js.map