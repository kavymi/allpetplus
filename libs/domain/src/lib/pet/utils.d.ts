/**
 * Pet Domain Utilities
 * Business logic for pet-related operations
 */
import { PetSize, PetMeasurements } from './types';
/**
 * Calculate pet age from birth date
 */
export declare function calculatePetAge(birthDate: Date): {
    years: number;
    months: number;
};
/**
 * Recommend harness size based on pet measurements
 */
export declare function recommendHarnessSize(measurements: PetMeasurements): PetSize;
/**
 * Validate measurements are reasonable
 */
export declare function validateMeasurements(measurements: PetMeasurements): string[];
/**
 * Format pet age for display
 */
export declare function formatPetAge(years: number, months: number): string;
/**
 * Get breed suggestions based on type
 */
export declare function getCommonBreeds(type: string): string[];
//# sourceMappingURL=utils.d.ts.map