// Application-wide constants
export const APP_NAME = 'Pet';

export const API_ENDPOINTS = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  PETS: '/api/pets',
} as const;

export const QUERY_KEYS = {
  USER: 'user',
  PETS: 'pets',
  PET_DETAIL: 'pet-detail',
} as const;

export const CACHE_TTL = {
  SHORT: 60 * 1000, // 1 minute
  MEDIUM: 5 * 60 * 1000, // 5 minutes
  LONG: 60 * 60 * 1000, // 1 hour
} as const;
