/**
 * Products CO Domain Types
 * Shared across all services and frontend
 */

// Product Types
export type ProductType = 'harness' | 'collar' | 'leash' | 'bandana' | 'clothing' | 'accessory';
export type ProductCategory = 'custom' | 'ready-made' | 'subscription';

// Hardware Options
export type HardwareFinish = 'rose-gold' | 'matte-black' | 'polished-silver' | 'antique-brass' | 'gunmetal';

export interface HardwareOption {
  id: string;
  finish: HardwareFinish;
  priceModifier: number;
}

// Personalization
export interface PersonalizationConfig {
  text?: string;
  font?: string;
  placement?: 'front' | 'side' | 'back';
  color?: string;
}

// Product Configuration
export interface ProductConfig {
  productType: ProductType;
  size: string;
  baseColor: string;
  accentColors?: string[];
  hardware: HardwareOption;
  stitching?: 'standard' | 'reflective' | 'eco';
  personalization?: PersonalizationConfig;
  addons?: string[];
}

// Products
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  productType: ProductType;
  basePrice: number;
  images: string[];
  inStock: boolean;
  shopifyProductId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  id: string;
  productId: string;
  sku: string;
  size: string;
  color: string;
  price: number;
  compareAtPrice?: number;
  inStock: boolean;
  inventory: number;
  shopifyVariantId?: string;
}

// Custom Designs
export interface SavedDesign {
  id: string;
  userId: string;
  name: string;
  productType: ProductType;
  config: ProductConfig;
  previewUrl?: string;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateDesignInput {
  name: string;
  productType: ProductType;
  config: ProductConfig;
}

export interface UpdateDesignInput {
  id: string;
  name?: string;
  config?: ProductConfig;
  status?: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
}

// Subscription Boxes
export type SubscriptionTier = 'essential' | 'deluxe';

export interface SubscriptionBox {
  id: string;
  tier: SubscriptionTier;
  name: string;
  description: string;
  price: number;
  billingInterval: 'monthly' | 'quarterly' | 'yearly';
  items: SubscriptionItem[];
  active: boolean;
}

export interface SubscriptionItem {
  id: string;
  name: string;
  description: string;
  quantity: number;
  category: string;
  imageUrl?: string;
}

export interface UserSubscription {
  id: string;
  userId: string;
  subscriptionBoxId: string;
  tier: SubscriptionTier;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
  preferences: SubscriptionPreferences;
  nextBillingDate: Date;
  shopifySubscriptionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionPreferences {
  petSize: 'small' | 'medium' | 'large';
  toyType: 'plush' | 'rope' | 'puzzle' | 'mixed';
  colorPreference?: string;
  breedSpecific?: boolean;
}

export interface CreateSubscriptionInput {
  subscriptionBoxId: string;
  tier: SubscriptionTier;
  preferences: SubscriptionPreferences;
}

export interface UpdateSubscriptionInput {
  id: string;
  preferences?: SubscriptionPreferences;
  status?: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
}

// Orders
export interface OrderItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  quantity: number;
  price: number;
  customConfig?: ProductConfig;
  imageUrl?: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status: 'PENDING' | 'CONFIRMED' | 'IN_PRODUCTION' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  shippingAddress: Address;
  shopifyOrderId?: string;
  trackingNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Address {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone?: string;
}

// Cart
export interface CartItem {
  id: string;
  productId: string;
  variantId?: string;
  name: string;
  quantity: number;
  price: number;
  imageUrl?: string;
  customConfig?: ProductConfig;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  total: number;
  shopifyCartId?: string;
}

// Pricing
export interface PriceBreakdown {
  basePrice: number;
  colorModifier: number;
  hardwareModifier: number;
  personalizationCost: number;
  subtotal: number;
  tax: number;
  total: number;
}
