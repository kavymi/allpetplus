// Shared TypeScript types and interfaces

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Pet {
  id: string;
  name: string;
  type: PetType;
  breed?: string;
  age: number;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum PetType {
  DOG = 'dog',
  CAT = 'cat',
  BIRD = 'bird',
  FISH = 'fish',
  OTHER = 'other',
}

export interface ApiResponse<T = unknown> {
  data?: T;
  error?: string;
  status: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}
