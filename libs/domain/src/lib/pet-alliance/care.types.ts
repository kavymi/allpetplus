/**
 * Care Services CO Types
 * Division 10 of 12
 */

export interface DayCareBooking {
  id: string;
  petId: string;
  ownerId: string;
  facilityId: string;
  
  date: Date;
  checkInTime: Date;
  checkOutTime?: Date;
  
  serviceType: 'half-day' | 'full-day' | 'extended';
  addOns: string[];
  
  price: number;
  status: 'booked' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
  
  dailyReport?: {
    meals: string[];
    pottyBreaks: number;
    playTime: number;
    behavior: string;
    incidents?: string[];
    photos: string[];
  };
}

export interface BoardingReservation {
  id: string;
  petId: string;
  ownerId: string;
  facilityId: string;
  
  checkInDate: Date;
  checkOutDate: Date;
  nights: number;
  
  accommodationType: 'standard' | 'deluxe' | 'luxury';
  addOns: string[];
  
  totalPrice: number;
  depositPaid: number;
  balanceRemaining: number;
  
  status: 'reserved' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled';
  
  specialNeeds?: {
    medications: string[];
    dietaryRestrictions: string[];
    behavioralNotes: string[];
  };
}

export interface PetTransport {
  id: string;
  petId: string;
  ownerId: string;
  driverId?: string;
  
  type: 'taxi' | 'airport' | 'long-distance';
  
  pickupLocation: any;
  dropoffLocation: any;
  pickupTime: Date;
  dropoffTime?: Date;
  
  distance: number; // miles
  price: number;
  
  status: 'scheduled' | 'en-route' | 'completed' | 'cancelled';
  
  trackingEnabled: boolean;
  currentLocation?: { lat: number; lng: number };
}

export interface DogWalkingService {
  id: string;
  petId: string;
  ownerId: string;
  walkerId: string;
  
  date: Date;
  duration: number; // minutes
  routeType: 'individual' | 'group';
  
  pickupLocation: any;
  route?: Array<{ lat: number; lng: number; timestamp: Date }>;
  
  price: number;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  
  photos?: string[];
  notes?: string;
}

export interface CareFacility {
  id: string;
  name: string;
  type: 'daycare' | 'boarding' | 'combined';
  address: any;
  capacity: {
    daycare: number;
    boarding: number;
  };
  amenities: string[];
  staff: number;
  rating: number;
  webcamEnabled: boolean;
}

