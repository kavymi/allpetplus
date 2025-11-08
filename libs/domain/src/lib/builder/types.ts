/**
 * Builder Domain Types
 * Shared across all services and frontend
 */

export type HarnessSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';

export type DesignStatus = 'DRAFT' | 'ACTIVE' | 'ARCHIVED';

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  category: 'primary' | 'secondary' | 'neutral';
}

export interface HardwareOption {
  id: string;
  name: string;
  finish: 'silver' | 'gold' | 'black' | 'rose-gold' | 'gunmetal';
  priceModifier: number;
}

export interface PersonalizationOption {
  text?: string;
  font?: string;
  position?: 'chest' | 'back' | 'side';
  color?: string;
}

export interface BuilderConfig {
  size: HarnessSize;
  color: ColorOption;
  hardware: HardwareOption;
  personalization?: PersonalizationOption;
}

export interface PriceBreakdown {
  basePrice: number;
  colorModifier: number;
  hardwareModifier: number;
  personalizationCost: number;
  subtotal: number;
  tax: number;
  total: number;
}

export interface SavedDesign {
  id: string;
  userId: string;
  name: string | null;
  configJson: BuilderConfig;
  priceBreakdown: PriceBreakdown | null;
  previewUrl: string | null;
  thumbnailUrl: string | null;
  shareToken: string | null;
  status: DesignStatus;
  isTemplate: boolean;
  viewCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface BuilderPreset {
  id: string;
  name: string;
  description: string | null;
  category: string;
  configJson: BuilderConfig;
  previewUrl: string;
  thumbnailUrl: string;
  sortOrder: number;
  isActive: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

