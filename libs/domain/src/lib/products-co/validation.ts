/**
 * Products CO Domain Validation Schemas
 * Zod schemas for type-safe validation
 */

import { z } from 'zod';

// Product Types
export const productTypeSchema = z.enum(['harness', 'collar', 'leash', 'bandana', 'clothing', 'accessory']);
export const productCategorySchema = z.enum(['custom', 'ready-made', 'subscription']);
export const hardwareFinishSchema = z.enum(['rose-gold', 'matte-black', 'polished-silver', 'antique-brass', 'gunmetal']);

// Hardware
export const hardwareOptionSchema = z.object({
  id: z.string(),
  finish: hardwareFinishSchema,
  priceModifier: z.number(),
});

// Personalization
export const personalizationConfigSchema = z.object({
  text: z.string().max(50).optional(),
  font: z.string().optional(),
  placement: z.enum(['front', 'side', 'back']).optional(),
  color: z.string().optional(),
});

// Product Config
export const productConfigSchema = z.object({
  productType: productTypeSchema,
  size: z.string(),
  baseColor: z.string(),
  accentColors: z.array(z.string()).optional(),
  hardware: hardwareOptionSchema,
  stitching: z.enum(['standard', 'reflective', 'eco']).optional(),
  personalization: personalizationConfigSchema.optional(),
  addons: z.array(z.string()).optional(),
});

// Products
export const productSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255),
  slug: z.string().min(1),
  description: z.string(),
  category: productCategorySchema,
  productType: productTypeSchema,
  basePrice: z.number().positive(),
  images: z.array(z.string().url()),
  inStock: z.boolean(),
  shopifyProductId: z.string().optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

// Custom Designs
export const createDesignSchema = z.object({
  name: z.string().min(1).max(100),
  productType: productTypeSchema,
  config: productConfigSchema,
});

export const updateDesignSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(100).optional(),
  config: productConfigSchema.optional(),
  status: z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']).optional(),
});

export const designIdSchema = z.object({
  id: z.string().uuid(),
});

// Subscription Boxes
export const subscriptionTierSchema = z.enum(['essential', 'deluxe']);

export const subscriptionPreferencesSchema = z.object({
  petSize: z.enum(['small', 'medium', 'large']),
  toyType: z.enum(['plush', 'rope', 'puzzle', 'mixed']),
  colorPreference: z.string().optional(),
  breedSpecific: z.boolean().optional(),
});

export const createSubscriptionSchema = z.object({
  subscriptionBoxId: z.string().uuid(),
  tier: subscriptionTierSchema,
  preferences: subscriptionPreferencesSchema,
});

export const updateSubscriptionSchema = z.object({
  id: z.string().uuid(),
  preferences: subscriptionPreferencesSchema.optional(),
  status: z.enum(['ACTIVE', 'PAUSED', 'CANCELLED']).optional(),
});

export const subscriptionIdSchema = z.object({
  id: z.string().uuid(),
});

// Orders
export const orderStatusSchema = z.enum(['PENDING', 'CONFIRMED', 'IN_PRODUCTION', 'SHIPPED', 'DELIVERED', 'CANCELLED']);

export const addressSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  address1: z.string().min(1),
  address2: z.string().optional(),
  city: z.string().min(1),
  province: z.string().min(1),
  zip: z.string().min(1),
  country: z.string().min(2).max(2),
  phone: z.string().optional(),
});

export const orderItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  name: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  customConfig: productConfigSchema.optional(),
  imageUrl: z.string().url().optional(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1),
  shippingAddress: addressSchema,
});

export const orderIdSchema = z.object({
  id: z.string().uuid(),
});

export const orderListSchema = z.object({
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
  status: orderStatusSchema.optional(),
});

// Cart
export const cartItemSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  name: z.string(),
  quantity: z.number().int().positive(),
  price: z.number().positive(),
  imageUrl: z.string().url().optional(),
  customConfig: productConfigSchema.optional(),
});

export const addToCartSchema = z.object({
  productId: z.string().uuid(),
  variantId: z.string().uuid().optional(),
  quantity: z.number().int().positive().default(1),
  customConfig: productConfigSchema.optional(),
});

export const updateCartItemSchema = z.object({
  itemId: z.string().uuid(),
  quantity: z.number().int().positive(),
});

export const removeFromCartSchema = z.object({
  itemId: z.string().uuid(),
});

// Product Queries
export const productListSchema = z.object({
  category: productCategorySchema.optional(),
  productType: productTypeSchema.optional(),
  limit: z.number().int().min(1).max(100).default(20),
  offset: z.number().int().min(0).default(0),
});

export const productByIdSchema = z.object({
  id: z.string().uuid(),
});

export const productBySlugSchema = z.object({
  slug: z.string(),
});

// Types are exported from ./types.ts

