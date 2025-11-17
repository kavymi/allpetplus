/**
 * Healthcare CO - Pet Insurance & Wellness Types
 * Division 5 of 12
 */

export enum InsurancePlan {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export interface InsurancePolicy {
  id: string;
  policyNumber: string;
  petId: string;
  ownerId: string;
  
  plan: InsurancePlan;
  coverage: {
    accidentCoverage: boolean;
    illnessCoverage: boolean;
    hereditaryConditions: boolean;
    alternativeTherapies: boolean;
    dentalCoverage: boolean;
    prescriptionDrugs: boolean;
  };
  
  limits: {
    annualLimit: number; // 0 = unlimited
    deductible: number;
    reimbursementRate: number; // percentage
  };
  
  premium: {
    monthlyAmount: number;
    billingCycle: 'monthly' | 'quarterly' | 'annual';
    nextPaymentDate: Date;
  };
  
  status: 'active' | 'pending' | 'lapsed' | 'cancelled';
  effectiveDate: Date;
  expirationDate?: Date;
  
  claims: {
    totalClaims: number;
    totalPaid: number;
    yearToDateClaims: number;
  };
  
  createdAt: Date;
  updatedAt: Date;
}

export interface InsuranceClaim {
  id: string;
  claimNumber: string;
  policyId: string;
  petId: string;
  
  incidentDate: Date;
  claimDate: Date;
  claimType: 'accident' | 'illness' | 'wellness' | 'dental' | 'prescription';
  
  diagnosis: string;
  treatmentDescription: string;
  veterinarianId?: string;
  clinicName: string;
  
  amounts: {
    totalBilled: number;
    coveredAmount: number;
    deductibleApplied: number;
    reimbursementAmount: number;
  };
  
  documents: {
    invoice: string; // URL
    medicalRecords?: string[];
    prescriptions?: string[];
  };
  
  status: 'pending' | 'under-review' | 'approved' | 'denied' | 'paid';
  statusHistory: Array<{
    status: string;
    timestamp: Date;
    note?: string;
  }>;
  
  denialReason?: string;
  paymentDate?: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface WellnessPlan {
  id: string;
  petId: string;
  ownerId: string;
  tier: 'essentials' | 'plus' | 'premium';
  
  includedServices: Array<{
    service: string;
    quantity: number;
    used: number;
    expires?: Date;
  }>;
  
  monthlyPrice: number;
  status: 'active' | 'paused' | 'cancelled';
  nextBillingDate: Date;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface VetNetworkProvider {
  id: string;
  clinicName: string;
  vetNames: string[];
  
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
  };
  
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  
  capabilities: {
    directPay: boolean;
    emergencyServices: boolean;
    specialties: string[];
    hours: string;
  };
  
  ratings: {
    average: number;
    count: number;
  };
  
  networkStatus: 'active' | 'inactive' | 'pending';
}

