/**
 * AI Plus Tech CO Types
 * Division 8 of 12
 */

export interface DNATestKit {
  id: string;
  kitNumber: string;
  type: 'breed-id' | 'health-wellness' | 'ultimate';
  petId?: string;
  ownerId: string;
  
  status: 'ordered' | 'shipped' | 'sample-received' | 'processing' | 'completed';
  orderedAt: Date;
  shippedAt?: Date;
  receivedAt?: Date;
  completedAt?: Date;
  
  results?: DNATestResults;
}

export interface DNATestResults {
  breeds: Array<{
    breed: string;
    percentage: number;
  }>;
  
  healthScreenings: Array<{
    condition: string;
    status: 'clear' | 'carrier' | 'at-risk';
    description: string;
  }>;
  
  traits: {
    coatColor: string;
    coatType: string;
    size: string;
    temperament: string[];
  };
  
  ancestry: {
    region: string;
    lineage: string[];
  };
  
  reportUrl: string;
}

export interface HealthPredictionModel {
  id: string;
  modelType: 'disease-risk' | 'behavior' | 'nutrition' | 'lifespan';
  petId: string;
  
  predictions: Array<{
    condition: string;
    riskScore: number; // 0-100
    confidence: number; // 0-1
    factors: string[];
    recommendations: string[];
  }>;
  
  accuracy: number;
  generatedAt: Date;
  nextUpdate: Date;
}

export interface WearableIntegration {
  id: string;
  petId: string;
  deviceType: 'fitbark' | 'whistle' | 'fi-collar' | 'petpace';
  deviceId: string;
  
  latestMetrics: {
    steps: number;
    activeMinutes: number;
    caloriesBurned: number;
    sleepHours: number;
    heartRate?: number;
    location?: { lat: number; lng: number };
    timestamp: Date;
  };
  
  status: 'connected' | 'disconnected';
  lastSyncedAt: Date;
}

export interface APIConsumer {
  id: string;
  companyName: string;
  apiKey: string;
  endpoints: string[];
  requestsPerMonth: number;
  pricingTier: string;
  status: 'active' | 'suspended';
}

