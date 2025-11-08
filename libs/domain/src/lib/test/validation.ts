/**
 * Utest Domain Validation Schemas
 * Zod schemas for type-safe validation
 */

import { z } from 'zod';

export const createUtestSchema = z.object({
  name: z.string().min(1).max(255),
  // Add your validations here
});

export const updateUtestSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1).max(255).optional(),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).optional(),
  // Add your validations here
});

export const testIdSchema = z.object({
  id: z.string().uuid(),
});

// Export inferred types (only CreateInput and UpdateInput to avoid duplicates)
export type CreateUtestInput = z.infer<typeof createUtestSchema>;
export type UpdateUtestInput = z.infer<typeof updateUtestSchema>;
