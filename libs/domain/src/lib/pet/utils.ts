/**
 * Pet Domain Utilities
 * Business logic for pet-related operations
 */

import { PetSize, PetMeasurements } from './types';

/**
 * Calculate pet age from birth date
 */
export function calculatePetAge(birthDate: Date): { years: number; months: number } {
  const now = new Date();
  const diffMs = now.getTime() - birthDate.getTime();
  const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30.44));
  
  const years = Math.floor(diffMonths / 12);
  const months = diffMonths % 12;
  
  return { years, months };
}

/**
 * Recommend harness size based on pet measurements
 */
export function recommendHarnessSize(measurements: PetMeasurements): PetSize {
  const { chestGirth, weight } = measurements;
  
  // Primary: Use chest girth
  if (chestGirth) {
    if (chestGirth < 12) return 'TINY';
    if (chestGirth < 16) return 'SMALL';
    if (chestGirth < 22) return 'MEDIUM';
    if (chestGirth < 28) return 'LARGE';
    return 'EXTRA_LARGE';
  }
  
  // Fallback: Use weight
  if (weight) {
    if (weight < 10) return 'TINY';
    if (weight < 25) return 'SMALL';
    if (weight < 50) return 'MEDIUM';
    if (weight < 80) return 'LARGE';
    return 'EXTRA_LARGE';
  }
  
  // Default
  return 'MEDIUM';
}

/**
 * Validate measurements are reasonable
 */
export function validateMeasurements(measurements: PetMeasurements): string[] {
  const errors: string[] = [];
  
  if (measurements.neckCircumference && measurements.neckCircumference > 30) {
    errors.push('Neck circumference seems unusually large');
  }
  
  if (measurements.chestGirth && measurements.chestGirth > 50) {
    errors.push('Chest girth seems unusually large');
  }
  
  if (measurements.weight && measurements.weight > 200) {
    errors.push('Weight seems unusually high');
  }
  
  if (measurements.neckCircumference && measurements.chestGirth) {
    if (measurements.neckCircumference > measurements.chestGirth) {
      errors.push('Neck circumference should not exceed chest girth');
    }
  }
  
  return errors;
}

/**
 * Format pet age for display
 */
export function formatPetAge(years: number, months: number): string {
  if (years === 0) {
    return `${months} month${months !== 1 ? 's' : ''} old`;
  }
  
  if (months === 0) {
    return `${years} year${years !== 1 ? 's' : ''} old`;
  }
  
  return `${years}y ${months}m old`;
}

/**
 * Get breed suggestions based on type
 */
export function getCommonBreeds(type: string): string[] {
  const breeds: Record<string, string[]> = {
    DOG: [
      'Labrador Retriever',
      'German Shepherd',
      'Golden Retriever',
      'French Bulldog',
      'Bulldog',
      'Poodle',
      'Beagle',
      'Rottweiler',
      'German Shorthaired Pointer',
      'Yorkshire Terrier',
      'Mixed Breed',
    ],
    CAT: [
      'Domestic Shorthair',
      'Domestic Longhair',
      'Siamese',
      'Persian',
      'Maine Coon',
      'Ragdoll',
      'Bengal',
      'Mixed Breed',
    ],
    BIRD: ['Parrot', 'Parakeet', 'Cockatiel', 'Finch', 'Canary'],
    RABBIT: ['Holland Lop', 'Netherland Dwarf', 'Lionhead', 'Rex', 'Mixed'],
    OTHER: [],
  };
  
  return breeds[type] || [];
}

