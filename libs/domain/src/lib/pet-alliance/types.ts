/**
 * Pet Solutions Alliance - Core Types
 * 
 * Shared types across all 12 divisions of the Pet Solutions Alliance Corporation
 */

// ============================================================================
// Core Entity Types
// ============================================================================

export interface PetProfile {
  id: string;
  name: string;
  species: 'dog' | 'cat' | 'bird' | 'rabbit' | 'other';
  breed: string[];
  mixBreed?: boolean;
  sex: 'male' | 'female' | 'neutered' | 'spayed';
  birthDate: Date;
  approximateAge?: boolean;
  
  // Physical Characteristics
  weight: number; // in pounds
  height?: number; // in inches
  color: string[];
  markings?: string;
  photos: string[]; // URLs
  
  // Identification
  microchipNumber?: string;
  tattooId?: string;
  registryNumber?: string; // From Licensure CO
  blockchainId?: string; // Blockchain registry ID
  
  // Owner Information
  ownerId: string;
  householdId?: string;
  emergencyContacts: EmergencyContact[];
  
  // Division-Specific IDs
  licenseId?: string; // Licensure CO
  insurancePolicyId?: string; // Healthcare CO
  dnaProfileId?: string; // AI Plus Tech CO
  
  // Status
  status: 'active' | 'lost' | 'found' | 'deceased' | 'transferred';
  statusUpdatedAt: Date;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface OwnerProfile {
  id: string;
  clerkId: string;
  email: string;
  phone: string;
  name: {
    first: string;
    last: string;
    middle?: string;
  };
  address: Address;
  
  // Alliance Membership
  membershipLevel: 'free' | 'basic' | 'plus' | 'premium' | 'family';
  membershipStartDate: Date;
  membershipExpiresAt?: Date;
  
  // Household
  householdId?: string;
  householdRole?: 'primary' | 'secondary' | 'caregiver';
  
  // Preferences
  communicationPreferences: {
    email: boolean;
    sms: boolean;
    push: boolean;
    newsletter: boolean;
  };
  
  // Privacy
  dataSharing: DivisionDataSharing;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export interface Address {
  street1: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface DivisionDataSharing {
  licensure: boolean;
  healthcare: boolean;
  training: boolean;
  food: boolean;
  aiTech: boolean;
  grooming: boolean;
  careServices: boolean;
  products: boolean;
  content: boolean;
  foundation: boolean;
  realEstate: boolean;
}

// ============================================================================
// Alliance-Wide Enums
// ============================================================================

export enum Division {
  ACQUISITION = 'acquisition',
  LICENSURE = 'licensure',
  CONTENT_MEDIA = 'content-media',
  PRODUCTS = 'products',
  HEALTHCARE = 'healthcare',
  TRAINING = 'training',
  FOOD = 'food',
  AI_TECH = 'ai-tech',
  GROOMING = 'grooming',
  CARE_SERVICES = 'care-services',
  FOUNDATION = 'foundation',
  REAL_ESTATE = 'real-estate',
}

export enum MembershipTier {
  FREE = 'free',
  BASIC = 'basic',
  PLUS = 'plus',
  PREMIUM = 'premium',
  FAMILY = 'family',
}

export enum PetStatus {
  ACTIVE = 'active',
  LOST = 'lost',
  FOUND = 'found',
  DECEASED = 'deceased',
  TRANSFERRED = 'transferred',
}

// ============================================================================
// Common Utility Types
// ============================================================================

export interface PaginationParams {
  page: number;
  limit: number;
  cursor?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    hasMore: boolean;
    nextCursor?: string;
  };
}

export interface SearchParams {
  query: string;
  filters?: Record<string, unknown>;
  sort?: {
    field: string;
    direction: 'asc' | 'desc';
  };
  pagination: PaginationParams;
}

export interface DateRange {
  start: Date;
  end: Date;
}

export interface PriceRange {
  min: number;
  max: number;
  currency: string;
}

export interface Coordinates {
  latitude: number;
  longitude: number;
}

// ============================================================================
// Service Booking Types (Used across multiple divisions)
// ============================================================================

export interface ServiceBooking {
  id: string;
  divisionId: Division;
  serviceType: string;
  petId: string;
  ownerId: string;
  
  // Schedule
  startDate: Date;
  endDate?: Date;
  duration?: number; // in minutes
  
  // Location
  locationId?: string;
  locationName?: string;
  address?: Address;
  
  // Status
  status: 'pending' | 'confirmed' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
  
  // Payment
  priceBreakdown: PriceBreakdown;
  paymentStatus: 'pending' | 'paid' | 'refunded' | 'failed';
  paymentMethod?: string;
  
  // Notes
  specialInstructions?: string;
  internalNotes?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy?: string;
}

export interface PriceBreakdown {
  basePrice: number;
  addOns: Array<{
    name: string;
    price: number;
  }>;
  discounts: Array<{
    name: string;
    amount: number;
    type: 'percentage' | 'fixed';
  }>;
  taxes: Array<{
    name: string;
    amount: number;
    rate: number;
  }>;
  total: number;
  currency: string;
}

// ============================================================================
// Subscription Types (Used across multiple divisions)
// ============================================================================

export interface Subscription {
  id: string;
  divisionId: Division;
  subscriptionType: string;
  ownerId: string;
  petId?: string;
  
  // Plan
  planName: string;
  planTier: string;
  billingCycle: 'monthly' | 'quarterly' | 'annual';
  price: number;
  currency: string;
  
  // Status
  status: 'active' | 'paused' | 'cancelled' | 'expired';
  startDate: Date;
  nextBillingDate?: Date;
  cancelledAt?: Date;
  
  // Benefits
  includedServices: string[];
  usageLimit?: Record<string, number>;
  usageTracking?: Record<string, number>;
  
  // Payment
  paymentMethodId: string;
  stripeSubscriptionId?: string;
  
  // Metadata
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Event/Activity Types (Cross-division tracking)
// ============================================================================

export interface ActivityEvent {
  id: string;
  type: string;
  divisionId: Division;
  entityType: 'pet' | 'owner' | 'booking' | 'order' | 'subscription';
  entityId: string;
  
  // Event Details
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  
  // Timestamp
  occurredAt: Date;
  
  // Actor
  actorId?: string;
  actorType?: 'user' | 'system' | 'staff';
}

// ============================================================================
// Integration Types
// ============================================================================

export interface CrossDivisionReference {
  divisionId: Division;
  entityType: string;
  entityId: string;
  relationshipType: string;
  metadata?: Record<string, unknown>;
}

export interface DataSyncEvent {
  id: string;
  sourceDivision: Division;
  targetDivision: Division;
  entityType: string;
  entityId: string;
  operation: 'create' | 'update' | 'delete';
  payload: Record<string, unknown>;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  error?: string;
  createdAt: Date;
  processedAt?: Date;
}

// ============================================================================
// Export all division types
// ============================================================================

export * from './acquisition.types';
export * from './licensure.types';
export * from './media.types';
export * from './products.types';
export * from './healthcare.types';
export * from './training.types';
export * from './food.types';
export * from './tech.types';
export * from './grooming.types';
export * from './care.types';
export * from './foundation.types';
export * from './real-estate.types';

