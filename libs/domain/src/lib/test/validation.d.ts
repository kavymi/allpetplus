/**
 * Utest Domain Validation Schemas
 * Zod schemas for type-safe validation
 */
import { z } from 'zod';
export declare const createUtestSchema: z.ZodObject<{
    name: z.ZodString;
}, z.core.$strip>;
export declare const updateUtestSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        ACTIVE: "ACTIVE";
        PENDING: "PENDING";
        INACTIVE: "INACTIVE";
    }>>;
}, z.core.$strip>;
export declare const testIdSchema: z.ZodObject<{
    id: z.ZodString;
}, z.core.$strip>;
export type CreateUtestInput = z.infer<typeof createUtestSchema>;
export type UpdateUtestInput = z.infer<typeof updateUtestSchema>;
//# sourceMappingURL=validation.d.ts.map