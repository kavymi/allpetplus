/**
 * Pet Domain Types
 * Shared across all services and frontend
 */

export type PetType = 'DOG' | 'CAT' | 'BIRD' | 'RABBIT' | 'OTHER';

export type PetGender = 'MALE' | 'FEMALE' | 'UNKNOWN';

export type PetSize = 'TINY' | 'SMALL' | 'MEDIUM' | 'LARGE' | 'EXTRA_LARGE';

export type ActivityLevel = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY_HIGH';

export interface PetMeasurements {
  neckCircumference?: number;  // in inches
  chestGirth?: number;         // in inches
  length?: number;             // from neck to tail base
  weight?: number;             // in pounds
  height?: number;             // shoulder height in inches
}

export interface PetHealthInfo {
  hasAllergies?: boolean;
  allergies?: string[];
  hasSpecialNeeds?: boolean;
  specialNeeds?: string;
  isServiceAnimal?: boolean;
  medications?: string[];
}

export interface PetBehavior {
  activityLevel: ActivityLevel;
  isPullerOnLeash?: boolean;
  isGoodWithOtherDogs?: boolean;
  isGoodWithCats?: boolean;
  isGoodWithChildren?: boolean;
  temperament?: string[];
}

export interface PetProfile {
  id: string;
  userId: string;
  name: string;
  type: PetType;
  breed?: string;
  breedMix?: string[];
  gender: PetGender;
  birthDate?: Date;
  ageYears?: number;
  ageMonths?: number;
  size: PetSize;
  
  // Physical characteristics
  color?: string;
  markings?: string;
  measurements?: PetMeasurements;
  
  // Health & behavior
  health?: PetHealthInfo;
  behavior?: PetBehavior;
  
  // Media
  photoUrl?: string;
  photos?: string[];
  
  // Additional info
  microchipId?: string;
  registrationNumber?: string;
  vetInfo?: {
    name?: string;
    phone?: string;
    clinic?: string;
  };
  
  // System fields
  isActive: boolean;
  isPrimary: boolean;  // User's primary pet
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export interface PetPreferences {
  petId: string;
  
  // Harness preferences
  preferredColors?: string[];
  preferredHardware?: string[];
  lastHarnessSize?: string;
  
  // Shopping behavior
  lastPurchaseDate?: Date;
  totalOrders?: number;
  averageOrderValue?: number;
  
  // Recommendations
  recommendedProducts?: string[];
  savedDesigns?: string[];
}

export interface CreatePetInput {
  name: string;
  type: PetType;
  breed?: string;
  breedMix?: string[];
  gender: PetGender;
  birthDate?: string;  // ISO date string
  ageYears?: number;
  ageMonths?: number;
  size: PetSize;
  color?: string;
  markings?: string;
  measurements?: PetMeasurements;
  health?: PetHealthInfo;
  behavior?: PetBehavior;
  photoUrl?: string;
  microchipId?: string;
  isPrimary?: boolean;
}

export interface UpdatePetInput {
  id: string;
  name?: string;
  breed?: string;
  breedMix?: string[];
  gender?: PetGender;
  birthDate?: string;
  ageYears?: number;
  ageMonths?: number;
  size?: PetSize;
  color?: string;
  markings?: string;
  measurements?: PetMeasurements;
  health?: PetHealthInfo;
  behavior?: PetBehavior;
  photoUrl?: string;
  microchipId?: string;
  isPrimary?: boolean;
}

