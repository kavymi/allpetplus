/**
 * Licensure & Identification CO - TypeScript Types
 * Division 2 of 12
 */

import type { Address, EmergencyContact } from './types';

// ============================================================================
// Pet Registry
// ============================================================================

export interface PetRegistry {
  id: string;
  petId: string;
  registryNumber: string; // e.g., "PET-2025-001234"
  blockchainTxHash?: string;
  
  // Identification
  microchipNumber?: string;
  tattooId?: string;
  dnaProfileId?: string;
  
  // Status
  status: 'active' | 'lost' | 'found' | 'deceased' | 'transferred';
  statusUpdatedAt: Date;
  
  // Membership
  membershipTier: 'free' | 'basic' | 'plus' | 'premium' | 'family';
  membershipExpiresAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Municipal Licensing
// ============================================================================

export interface MunicipalLicense {
  id: string;
  petId: string;
  licenseNumber: string;
  
  // Jurisdiction
  jurisdiction: {
    type: 'city' | 'county' | 'state';
    name: string;
    code: string;
  };
  
  // Dates
  issuedDate: Date;
  expiresDate: Date;
  renewalReminders: Date[];
  
  // Status
  status: 'active' | 'expired' | 'pending' | 'revoked';
  
  // Payment
  fee: number;
  paid: boolean;
  paidAt?: Date;
  transactionId?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Certifications
// ============================================================================

export enum CertificationType {
  SERVICE_DOG = 'service-dog',
  ESA = 'emotional-support-animal',
  THERAPY_DOG = 'therapy-dog',
  GOOD_CITIZEN = 'good-citizen',
  TRAINING_SPECIALTY = 'training-specialty',
  HEALTH_CLEARANCE = 'health-clearance',
  COMPETITION_TITLE = 'competition-title',
}

export interface Certification {
  id: string;
  petId: string;
  type: CertificationType;
  name: string;
  description?: string;
  
  // Issuing Body
  issuedBy: string;
  issuingOrganization?: string;
  certificationNumber?: string;
  
  // Dates
  issuedDate: Date;
  expiresDate?: Date;
  renewalRequired: boolean;
  
  // Documents
  documentUrls: string[];
  badgeUrl?: string;
  
  // Verification
  verified: boolean;
  verifiedBy?: string;
  verifiedAt?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Health Records (Blockchain-backed)
// ============================================================================

export interface HealthRecord {
  id: string;
  petId: string;
  recordType: 'vaccination' | 'surgery' | 'medication' | 'lab-result' | 'diagnosis' | 'treatment' | 'exam';
  
  // Record Details
  title: string;
  description?: string;
  date: Date;
  
  // Provider
  veterinarianId?: string;
  clinicName?: string;
  clinicAddress?: Address;
  
  // Medical Details
  medications?: Array<{
    name: string;
    dosage: string;
    frequency: string;
    startDate: Date;
    endDate?: Date;
  }>;
  
  allergies?: string[];
  conditions?: string[];
  
  // Documents
  documentUrls: string[];
  
  // Blockchain
  blockchainTxHash?: string;
  immutable: boolean;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface Vaccination {
  id: string;
  petId: string;
  vaccineName: string;
  vaccineType: 'core' | 'non-core' | 'lifestyle';
  
  // Administration
  administeredDate: Date;
  nextDueDate?: Date;
  administeredBy: string;
  clinicName?: string;
  
  // Details
  manufacturer?: string;
  lotNumber?: string;
  expirationDate?: Date;
  
  // Documentation
  certificateUrl?: string;
  blockchainTxHash?: string;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Lost & Found
// ============================================================================

export interface LostPetReport {
  id: string;
  petId: string;
  reportedBy: string;
  
  // Incident Details
  lostDate: Date;
  lastSeenLocation: {
    address?: Address;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    description: string;
  };
  
  // Description at Time of Loss
  physicalDescription: string;
  wearing?: string[];
  behaviorNotes?: string;
  
  // Status
  status: 'lost' | 'sighting-reported' | 'found' | 'closed';
  statusUpdatedAt: Date;
  
  // Alerts
  alertRadius: number; // in miles
  alertsSent: number;
  sightingsReported: number;
  
  // Resolution
  foundDate?: Date;
  foundBy?: string;
  foundLocation?: Address;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface FoundPetReport {
  id: string;
  reportedBy: string;
  
  // Found Details
  foundDate: Date;
  foundLocation: {
    address?: Address;
    coordinates: {
      latitude: number;
      longitude: number;
    };
    description: string;
  };
  
  // Pet Description
  species: string;
  breed?: string;
  color: string[];
  size: 'small' | 'medium' | 'large';
  sex?: 'male' | 'female';
  
  // Identification
  hasCollar: boolean;
  collarDescription?: string;
  hasMicrochip?: boolean;
  microchipNumber?: string;
  photoUrls: string[];
  
  // Custody
  currentLocation: 'with-finder' | 'shelter' | 'vet' | 'other';
  shelterName?: string;
  contactInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  
  // Matching
  matchedPetId?: string;
  matchedReportId?: string;
  matchConfidence?: number;
  
  // Status
  status: 'open' | 'matched' | 'claimed' | 'closed';
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Emergency Services
// ============================================================================

export interface EmergencyContact extends EmergencyContact {
  veterinarianClinic?: {
    name: string;
    phone: string;
    address: Address;
    isOpen24Hours: boolean;
  };
  
  alternateCaregiver?: {
    name: string;
    phone: string;
    relationship: string;
    hasKeys: boolean;
  };
}

export interface EmergencyHotlineLog {
  id: string;
  petId?: string;
  ownerId?: string;
  callerPhone: string;
  
  // Call Details
  callType: 'heat-stress' | 'poison' | 'injury' | 'lost-pet' | 'general' | 'other';
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  
  // Incident
  incidentDescription: string;
  symptoms?: string[];
  locationOfIncident?: string;
  
  // Response
  adviceGiven: string;
  vetReferralGiven: boolean;
  emergencyDispatch: boolean;
  
  // Follow-up
  followUpRequired: boolean;
  followUpCompleted: boolean;
  outcome?: string;
  
  // Staff
  handledBy: string;
  callDuration: number; // in seconds
  
  createdAt: Date;
}

// ============================================================================
// Digital ID Cards
// ============================================================================

export interface DigitalIDCard {
  id: string;
  petId: string;
  cardType: 'digital' | 'physical' | 'apple-wallet' | 'google-wallet';
  
  // Card Details
  qrCode: string;
  nfcData?: string;
  
  // Design
  template: string;
  customization?: {
    backgroundColor: string;
    textColor: string;
    photoUrl: string;
  };
  
  // Status
  status: 'active' | 'inactive' | 'expired' | 'replaced';
  
  // Distribution
  issuedDate: Date;
  expiresDate?: Date;
  lastScanned?: Date;
  scanCount: number;
  
  createdAt: Date;
  updatedAt: Date;
}

// ============================================================================
// Membership Benefits
// ============================================================================

export interface MembershipBenefits {
  tier: 'free' | 'basic' | 'plus' | 'premium' | 'family';
  
  features: {
    nationalRegistry: boolean;
    physicalIDCard: boolean;
    blockchainRecords: boolean;
    emergencyHotline: boolean;
    lostPetAlerts: 'local' | 'regional' | 'national' | 'global';
    airportReliefAccess: boolean;
    travelAssistance: boolean;
    conciergeServices: boolean;
    
    // Discounts
    discounts: {
      grooming: number; // percentage
      food: number;
      products: number;
      training: number;
      allServices: number;
    };
  };
  
  limits: {
    petsIncluded: number;
    certifications: number;
    emergencyCoverage?: number; // dollar amount
  };
}

// ============================================================================
// Analytics & Reporting
// ============================================================================

export interface RegistryAnalytics {
  totalRegistrations: number;
  activeRegistrations: number;
  registrationsBySpecies: Record<string, number>;
  registrationsByState: Record<string, number>;
  membershipDistribution: Record<string, number>;
  
  lostPets: {
    reported: number;
    recovered: number;
    recoveryRate: number;
    averageRecoveryTime: number; // in hours
  };
  
  certifications: {
    issued: number;
    byType: Record<CertificationType, number>;
    expiringWithin30Days: number;
  };
  
  period: {
    start: Date;
    end: Date;
  };
}

