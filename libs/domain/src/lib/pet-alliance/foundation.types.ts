/**
 * Foundation - Philanthropic Programs Types
 * Division 11 of 12
 */

export interface Grant {
  id: string;
  grantNumber: string;
  recipientOrganization: string;
  
  grantType: 'education' | 'welfare' | 'innovation';
  amount: number;
  
  purpose: string;
  description: string;
  expectedImpact: string;
  
  status: 'pending' | 'approved' | 'active' | 'completed' | 'declined';
  
  applicationDate: Date;
  approvalDate?: Date;
  disbursementDate?: Date;
  completionDate?: Date;
  
  milestones: Array<{
    description: string;
    dueDate: Date;
    completed: boolean;
    completedDate?: Date;
  }>;
  
  reporting: {
    required: boolean;
    frequency: 'monthly' | 'quarterly' | 'annual';
    lastReportDate?: Date;
    nextReportDue?: Date;
  };
}

export interface Donation {
  id: string;
  donorId?: string;
  donorType: 'individual' | 'corporate' | 'anonymous';
  
  amount: number;
  currency: string;
  
  donationType: 'one-time' | 'recurring' | 'memorial' | 'tribute';
  frequency?: 'monthly' | 'quarterly' | 'annual';
  
  designatedFund?: string;
  campaign?: string;
  
  date: Date;
  transactionId: string;
  
  taxDeductible: boolean;
  receiptIssued: boolean;
  receiptUrl?: string;
  
  acknowledged: boolean;
  acknowledgedDate?: Date;
}

export interface VolunteerProfile {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  
  interests: string[];
  skills: string[];
  availability: {
    days: string[];
    hours: number; // per week
  };
  
  backgroundCheckCompleted: boolean;
  backgroundCheckDate?: Date;
  
  trainingCompleted: string[];
  
  hoursLogged: number;
  eventsAttended: number;
  
  status: 'active' | 'inactive' | 'on-hold';
}

export interface AdoptionEvent {
  id: string;
  name: string;
  eventType: 'clear-the-shelters' | 'adoption-drive' | 'meet-greet';
  
  date: Date;
  location: any;
  
  partnerShelters: string[];
  
  goals: {
    adoptionsTarget: number;
    adoptionsAchieved: number;
  };
  
  sponsoredFees: boolean;
  feesAmount: number;
  
  status: 'planned' | 'active' | 'completed' | 'cancelled';
}

export interface WelfareProgram {
  id: string;
  programName: string;
  programType: 'spay-neuter' | 'vaccination' | 'wellness' | 'emergency-care';
  
  eligibilityCriteria: string;
  
  servicesProvided: string[];
  
  funding: {
    budgetAllocated: number;
    budgetSpent: number;
    budgetRemaining: number;
  };
  
  metrics: {
    petsServed: number;
    servicesProvided: number;
    avgCostPerPet: number;
  };
  
  status: 'active' | 'paused' | 'completed';
  
  startDate: Date;
  endDate?: Date;
}

export interface FoundationAnalytics {
  donations: {
    totalRaised: number;
    numberOfDonors: number;
    averageDonation: number;
    recurringDonors: number;
  };
  
  grants: {
    totalAwarded: number;
    numberOfGrants: number;
    activeGrants: number;
  };
  
  impact: {
    petsAdopted: number;
    petsReceivingCare: number;
    peopleEducated: number;
    volunteersActive: number;
  };
  
  period: {
    start: Date;
    end: Date;
  };
}

