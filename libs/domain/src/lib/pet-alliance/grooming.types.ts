/**
 * Grooming CO Types
 * Division 9 of 12
 */

export interface GroomingAppointment {
  id: string;
  petId: string;
  ownerId: string;
  groomerId: string;
  locationId: string;
  
  serviceType: 'bath-brush' | 'full-groom' | 'breed-specific' | 'de-shedding';
  addOns: string[];
  
  scheduledAt: Date;
  duration: number; // minutes
  status: 'scheduled' | 'in-progress' | 'completed' | 'no-show' | 'cancelled';
  
  price: number;
  notes?: string;
  
  beforePhotos?: string[];
  afterPhotos?: string[];
}

export interface GroomingSubscription {
  id: string;
  petId: string;
  plan: 'basic' | 'premium' | 'platinum';
  servicesPerMonth: number;
  servicesUsed: number;
  monthlyPrice: number;
  status: 'active' | 'paused' | 'cancelled';
  nextBillingDate: Date;
}

export interface CertifiedGroomer {
  id: string;
  name: string;
  certificationLevel: 'certified' | 'master';
  specialties: string[];
  yearsExperience: number;
  rating: number;
  location: string;
  availability: any[];
}

export interface GroomingSalon {
  id: string;
  name: string;
  type: 'flagship' | 'partner' | 'franchise';
  address: any;
  capacity: number;
  services: string[];
  hours: any;
  amenities: string[];
}

export interface GroomingProduct {
  id: string;
  sku: string;
  name: string;
  category: 'shampoo' | 'conditioner' | 'perfume' | 'wipes' | 'tools';
  brand: string;
  price: number;
  inStock: boolean;
  professionalGrade: boolean;
}

