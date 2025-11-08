/**
 * User Domain Types
 * Shared across all services and frontend
 */

export interface UserProfile {
  id: string;
  clerkId: string;
  email: string | null;
  emailHash: string | null;
  preferences: UserPreferences | null;
  createdAt: Date;
  updatedAt: Date;
  lastActiveAt: Date | null;
}

export interface UserPreferences {
  theme?: 'light' | 'dark' | 'auto';
  notifications?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
  marketing?: {
    newsletter?: boolean;
    promotions?: boolean;
  };
  privacy?: {
    analytics?: boolean;
    personalization?: boolean;
  };
}

export interface UserSession {
  id: string;
  userId: string;
  sessionId: string;
  deviceInfo?: {
    userAgent?: string;
    platform?: string;
    browser?: string;
  };
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
  createdAt: Date;
  expiresAt: Date;
}

