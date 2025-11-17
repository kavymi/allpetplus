/**
 * Real Estate CO Types
 * Division 12 of 12
 */

export interface Property {
  id: string;
  propertyNumber: string;
  
  propertyType: 'pet-care-center' | 'training-academy' | 'grooming-salon' | 'wellness-center' | 'ranch' | 'manufacturing' | 'warehouse' | 'retail';
  
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    coordinates: { lat: number; lng: number };
  };
  
  size: {
    squareFeet: number;
    acres?: number;
  };
  
  ownership: 'owned' | 'leased';
  
  financial: {
    purchasePrice?: number;
    purchaseDate?: Date;
    currentValue?: number;
    lastAppraisalDate?: Date;
    
    leaseAmount?: number;
    leaseTerms?: string;
    leaseExpiration?: Date;
  };
  
  tenant?: {
    division: string;
    monthlyRent: number;
    leaseStartDate: Date;
    leaseEndDate: Date;
  };
  
  status: 'operational' | 'under-construction' | 'vacant' | 'for-sale';
  
  amenities: string[];
  capacity?: number;
  
  createdAt: Date;
  updatedAt: Date;
}

export interface PropertyDevelopment {
  id: string;
  propertyId?: string; // null if greenfield
  
  projectName: string;
  projectType: 'acquisition' | 'new-construction' | 'renovation';
  
  targetPropertyType: string;
  
  phase: 'planning' | 'acquisition' | 'permitting' | 'construction' | 'fit-out' | 'completed';
  
  timeline: {
    startDate: Date;
    estimatedCompletion: Date;
    actualCompletion?: Date;
  };
  
  budget: {
    totalBudget: number;
    spent: number;
    remaining: number;
  };
  
  team: {
    projectManager: string;
    architect?: string;
    contractor?: string;
  };
  
  milestones: Array<{
    name: string;
    targetDate: Date;
    completed: boolean;
    completedDate?: Date;
  }>;
  
  status: 'active' | 'on-hold' | 'completed' | 'cancelled';
}

export interface FacilityManagement {
  id: string;
  propertyId: string;
  
  maintenanceSchedule: Array<{
    taskType: string;
    frequency: string;
    lastCompleted: Date;
    nextDue: Date;
    vendor?: string;
  }>;
  
  utilities: {
    electric: { provider: string; monthlyCost: number };
    water: { provider: string; monthlyCost: number };
    gas?: { provider: string; monthlyCost: number };
  };
  
  insurance: {
    provider: string;
    policyNumber: string;
    coverage: number;
    expirationDate: Date;
    annualPremium: number;
  };
  
  propertyTaxes: {
    annualAmount: number;
    lastPaymentDate: Date;
    nextDueDate: Date;
  };
  
  incidents: Array<{
    date: Date;
    type: string;
    description: string;
    resolved: boolean;
    cost?: number;
  }>;
}

export interface FranchiseLocation {
  id: string;
  franchiseeName: string;
  propertyId?: string;
  
  franchiseType: 'daycare' | 'boarding' | 'grooming' | 'training';
  
  fees: {
    initialFee: number;
    initialFeePaid: boolean;
    royaltyRate: number; // percentage
    marketingFee: number; // percentage
  };
  
  contract: {
    signedDate: Date;
    termYears: number;
    expirationDate: Date;
    renewalOptions: number;
  };
  
  performance: {
    monthlyRevenue: number;
    yearToDateRevenue: number;
    royaltiesPaid: number;
  };
  
  status: 'active' | 'pending' | 'terminated';
}

export interface RealEstatePortfolio {
  totalProperties: number;
  totalSquareFeet: number;
  totalValue: number;
  
  breakdown: {
    owned: number;
    leased: number;
    
    byType: Record<string, number>;
    byState: Record<string, number>;
  };
  
  financial: {
    monthlyRentIncome: number;
    annualAppreciation: number;
    occupancyRate: number;
    avgRentPerSqFt: number;
  };
  
  development: {
    activeDevelopments: number;
    upcomingProjects: number;
    totalInvestment: number;
  };
}

