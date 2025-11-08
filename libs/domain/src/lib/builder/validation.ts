/**
 * Builder Domain Validation Schemas
 * Shared Zod schemas for type-safe validation
 */

import { z } from 'zod';

export const harnessSizeSchema = z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']);

export const designStatusSchema = z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']);

export const colorOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  hex: z.string().regex(/^#[0-9A-F]{6}$/i),
  category: z.enum(['primary', 'secondary', 'neutral']),
});

export const hardwareOptionSchema = z.object({
  id: z.string(),
  name: z.string(),
  finish: z.enum(['silver', 'gold', 'black', 'rose-gold', 'gunmetal']),
  priceModifier: z.number().min(0),
});

export const personalizationOptionSchema = z.object({
  text: z.string().max(20).optional(),
  font: z.string().optional(),
  position: z.enum(['chest', 'back', 'side']).optional(),
  color: z.string().optional(),
});

export const builderConfigSchema = z.object({
  size: harnessSizeSchema,
  color: colorOptionSchema,
  hardware: hardwareOptionSchema,
  personalization: personalizationOptionSchema.optional(),
});

export const priceBreakdownSchema = z.object({
  basePrice: z.number().min(0),
  colorModifier: z.number(),
  hardwareModifier: z.number(),
  personalizationCost: z.number().min(0),
  subtotal: z.number().min(0),
  tax: z.number().min(0),
  total: z.number().min(0),
});

export const createDesignSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  configJson: builderConfigSchema,
  priceBreakdown: priceBreakdownSchema.optional(),
});

export const updateDesignSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  configJson: builderConfigSchema.optional(),
  priceBreakdown: priceBreakdownSchema.optional(),
  status: designStatusSchema.optional(),
});

// Export inferred types (CreateDesignInput and UpdateDesignInput only, as BuilderConfig and PriceBreakdown are in types.ts)
export type CreateDesignInput = z.infer<typeof createDesignSchema>;
export type UpdateDesignInput = z.infer<typeof updateDesignSchema>;

