/**
 * Pet Domain Validation Schemas
 * Zod schemas for type-safe validation
 */
import { z } from 'zod';
export declare const petTypeSchema: z.ZodEnum<{
    DOG: "DOG";
    CAT: "CAT";
    BIRD: "BIRD";
    RABBIT: "RABBIT";
    OTHER: "OTHER";
}>;
export declare const petGenderSchema: z.ZodEnum<{
    MALE: "MALE";
    FEMALE: "FEMALE";
    UNKNOWN: "UNKNOWN";
}>;
export declare const petSizeSchema: z.ZodEnum<{
    TINY: "TINY";
    SMALL: "SMALL";
    MEDIUM: "MEDIUM";
    LARGE: "LARGE";
    EXTRA_LARGE: "EXTRA_LARGE";
}>;
export declare const activityLevelSchema: z.ZodEnum<{
    LOW: "LOW";
    MODERATE: "MODERATE";
    HIGH: "HIGH";
    VERY_HIGH: "VERY_HIGH";
}>;
export declare const petMeasurementsSchema: z.ZodOptional<z.ZodObject<{
    neckCircumference: z.ZodOptional<z.ZodNumber>;
    chestGirth: z.ZodOptional<z.ZodNumber>;
    length: z.ZodOptional<z.ZodNumber>;
    weight: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
}, z.core.$strip>>;
export declare const petHealthInfoSchema: z.ZodOptional<z.ZodObject<{
    hasAllergies: z.ZodOptional<z.ZodBoolean>;
    allergies: z.ZodOptional<z.ZodArray<z.ZodString>>;
    hasSpecialNeeds: z.ZodOptional<z.ZodBoolean>;
    specialNeeds: z.ZodOptional<z.ZodString>;
    isServiceAnimal: z.ZodOptional<z.ZodBoolean>;
    medications: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>>;
export declare const petBehaviorSchema: z.ZodOptional<z.ZodObject<{
    activityLevel: z.ZodEnum<{
        LOW: "LOW";
        MODERATE: "MODERATE";
        HIGH: "HIGH";
        VERY_HIGH: "VERY_HIGH";
    }>;
    isPullerOnLeash: z.ZodOptional<z.ZodBoolean>;
    isGoodWithOtherDogs: z.ZodOptional<z.ZodBoolean>;
    isGoodWithCats: z.ZodOptional<z.ZodBoolean>;
    isGoodWithChildren: z.ZodOptional<z.ZodBoolean>;
    temperament: z.ZodOptional<z.ZodArray<z.ZodString>>;
}, z.core.$strip>>;
export declare const createPetSchema: z.ZodObject<{
    name: z.ZodString;
    type: z.ZodEnum<{
        DOG: "DOG";
        CAT: "CAT";
        BIRD: "BIRD";
        RABBIT: "RABBIT";
        OTHER: "OTHER";
    }>;
    breed: z.ZodOptional<z.ZodString>;
    breedMix: z.ZodOptional<z.ZodArray<z.ZodString>>;
    gender: z.ZodEnum<{
        MALE: "MALE";
        FEMALE: "FEMALE";
        UNKNOWN: "UNKNOWN";
    }>;
    birthDate: z.ZodOptional<z.ZodString>;
    ageYears: z.ZodOptional<z.ZodNumber>;
    ageMonths: z.ZodOptional<z.ZodNumber>;
    size: z.ZodEnum<{
        TINY: "TINY";
        SMALL: "SMALL";
        MEDIUM: "MEDIUM";
        LARGE: "LARGE";
        EXTRA_LARGE: "EXTRA_LARGE";
    }>;
    color: z.ZodOptional<z.ZodString>;
    markings: z.ZodOptional<z.ZodString>;
    measurements: z.ZodOptional<z.ZodObject<{
        neckCircumference: z.ZodOptional<z.ZodNumber>;
        chestGirth: z.ZodOptional<z.ZodNumber>;
        length: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    health: z.ZodOptional<z.ZodObject<{
        hasAllergies: z.ZodOptional<z.ZodBoolean>;
        allergies: z.ZodOptional<z.ZodArray<z.ZodString>>;
        hasSpecialNeeds: z.ZodOptional<z.ZodBoolean>;
        specialNeeds: z.ZodOptional<z.ZodString>;
        isServiceAnimal: z.ZodOptional<z.ZodBoolean>;
        medications: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    behavior: z.ZodOptional<z.ZodObject<{
        activityLevel: z.ZodEnum<{
            LOW: "LOW";
            MODERATE: "MODERATE";
            HIGH: "HIGH";
            VERY_HIGH: "VERY_HIGH";
        }>;
        isPullerOnLeash: z.ZodOptional<z.ZodBoolean>;
        isGoodWithOtherDogs: z.ZodOptional<z.ZodBoolean>;
        isGoodWithCats: z.ZodOptional<z.ZodBoolean>;
        isGoodWithChildren: z.ZodOptional<z.ZodBoolean>;
        temperament: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    photoUrl: z.ZodOptional<z.ZodString>;
    microchipId: z.ZodOptional<z.ZodString>;
    isPrimary: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updatePetSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    breed: z.ZodOptional<z.ZodString>;
    breedMix: z.ZodOptional<z.ZodArray<z.ZodString>>;
    gender: z.ZodOptional<z.ZodEnum<{
        MALE: "MALE";
        FEMALE: "FEMALE";
        UNKNOWN: "UNKNOWN";
    }>>;
    birthDate: z.ZodOptional<z.ZodString>;
    ageYears: z.ZodOptional<z.ZodNumber>;
    ageMonths: z.ZodOptional<z.ZodNumber>;
    size: z.ZodOptional<z.ZodEnum<{
        TINY: "TINY";
        SMALL: "SMALL";
        MEDIUM: "MEDIUM";
        LARGE: "LARGE";
        EXTRA_LARGE: "EXTRA_LARGE";
    }>>;
    color: z.ZodOptional<z.ZodString>;
    markings: z.ZodOptional<z.ZodString>;
    measurements: z.ZodOptional<z.ZodObject<{
        neckCircumference: z.ZodOptional<z.ZodNumber>;
        chestGirth: z.ZodOptional<z.ZodNumber>;
        length: z.ZodOptional<z.ZodNumber>;
        weight: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
    }, z.core.$strip>>;
    health: z.ZodOptional<z.ZodObject<{
        hasAllergies: z.ZodOptional<z.ZodBoolean>;
        allergies: z.ZodOptional<z.ZodArray<z.ZodString>>;
        hasSpecialNeeds: z.ZodOptional<z.ZodBoolean>;
        specialNeeds: z.ZodOptional<z.ZodString>;
        isServiceAnimal: z.ZodOptional<z.ZodBoolean>;
        medications: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    behavior: z.ZodOptional<z.ZodObject<{
        activityLevel: z.ZodEnum<{
            LOW: "LOW";
            MODERATE: "MODERATE";
            HIGH: "HIGH";
            VERY_HIGH: "VERY_HIGH";
        }>;
        isPullerOnLeash: z.ZodOptional<z.ZodBoolean>;
        isGoodWithOtherDogs: z.ZodOptional<z.ZodBoolean>;
        isGoodWithCats: z.ZodOptional<z.ZodBoolean>;
        isGoodWithChildren: z.ZodOptional<z.ZodBoolean>;
        temperament: z.ZodOptional<z.ZodArray<z.ZodString>>;
    }, z.core.$strip>>;
    photoUrl: z.ZodOptional<z.ZodString>;
    microchipId: z.ZodOptional<z.ZodString>;
    isPrimary: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const petIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
//# sourceMappingURL=validation.d.ts.map