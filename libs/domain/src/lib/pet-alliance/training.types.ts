/**
 * Training CO Types
 * Division 6 of 12
 */

export interface TrainingProgram {
  id: string;
  name: string;
  type: 'puppy' | 'basic' | 'advanced' | 'behavioral' | 'service' | 'therapy' | 'sport';
  duration: number; // weeks
  sessions: number;
  price: number;
  deliveryMethod: 'group' | 'private' | 'board-train' | 'virtual';
}

export interface TrainingEnrollment {
  id: string;
  programId: string;
  petId: string;
  ownerId: string;
  trainerId: string;
  startDate: Date;
  endDate?: Date;
  progress: number; // percentage
  status: 'enrolled' | 'in-progress' | 'completed' | 'cancelled';
  sessions: Array<{
    date: Date;
    completed: boolean;
    notes?: string;
  }>;
}

export interface CertifiedTrainer {
  id: string;
  name: string;
  certificationLevel: 'associate' | 'certified' | 'master';
  specialties: string[];
  yearsExperience: number;
  rating: number;
  location: string;
  availability: boolean;
}

export interface TrainingCertification {
  id: string;
  petId: string;
  certificationType: string;
  issuedDate: Date;
  expiresDate?: Date;
  issuedBy: string;
  certificateUrl: string;
}

