/**
 * Pet Food CO Types
 * Division 7 of 12
 */

export interface MealPlan {
  id: string;
  petId: string;
  planType: 'fresh' | 'dry' | 'raw' | 'freeze-dried';
  recipeName: string;
  portionSize: number; // grams
  frequency: 'daily' | 'weekly' | 'bi-weekly';
  price: number;
  
  nutritionalProfile: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber: number;
  };
  
  customizations: {
    allergyFriendly: string[];
    healthConditions: string[];
    preferences: string[];
  };
}

export interface FoodSubscription {
  id: string;
  petId: string;
  mealPlanId: string;
  deliveryFrequency: 'weekly' | 'bi-weekly' | 'monthly';
  nextDeliveryDate: Date;
  status: 'active' | 'paused' | 'cancelled';
  monthlyPrice: number;
}

export interface SupplementPlan {
  id: string;
  petId: string;
  supplements: Array<{
    name: string;
    dosage: string;
    frequency: string;
    reason: string;
  }>;
  monthlyPrice: number;
  autoRefill: boolean;
}

export interface HealthScorecard {
  id: string;
  petId: string;
  overallScore: number; // 1-100
  dimensions: {
    jointHealth: number;
    digestiveHealth: number;
    skinCoat: number;
    heartHealth: number;
    immuneSystem: number;
    dentalHealth: number;
    cognitiveFunction: number;
    weightManagement: number;
  };
  recommendations: string[];
  generatedAt: Date;
  nextAssessment: Date;
}

