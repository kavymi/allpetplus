/**
 * Acquisition CO - Medical & Wellness Services Types  
 * Division 1 of 12
 */

export interface MedicalSubscription {
  id: string;
  userId: string; // Human owner
  plan: 'basic' | 'plus' | 'premium' | 'family';
  monthlyPrice: number;
  services: string[];
  status: 'active' | 'paused' | 'cancelled';
  nextBillingDate: Date;
}

export interface TelemedicineConsultation {
  id: string;
  userId: string;
  providerId: string;
  scheduledAt: Date;
  duration: number; // minutes
  consultationType: 'primary-care' | 'mental-health' | 'specialty';
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
}

export interface BehavioralHealthSession {
  id: string;
  userId: string;
  therapistId: string;
  sessionType: 'individual' | 'group' | 'family';
  focusAreas: string[];
  date: Date;
  duration: number;
}

export interface MSOEntity {
  id: string;
  name: string;
  state: string;
  entityType: 'MSO-LLC' | 'PLLC';
  licenseNumbers: string[];
  services: string[];
}

