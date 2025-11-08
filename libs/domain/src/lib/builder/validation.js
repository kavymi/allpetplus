"use strict";
/**
 * Builder Domain Validation Schemas
 * Shared Zod schemas for type-safe validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateDesignSchema = exports.createDesignSchema = exports.priceBreakdownSchema = exports.builderConfigSchema = exports.personalizationOptionSchema = exports.hardwareOptionSchema = exports.colorOptionSchema = exports.designStatusSchema = exports.harnessSizeSchema = void 0;
const zod_1 = require("zod");
exports.harnessSizeSchema = zod_1.z.enum(['XS', 'S', 'M', 'L', 'XL', 'XXL']);
exports.designStatusSchema = zod_1.z.enum(['DRAFT', 'ACTIVE', 'ARCHIVED']);
exports.colorOptionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    hex: zod_1.z.string().regex(/^#[0-9A-F]{6}$/i),
    category: zod_1.z.enum(['primary', 'secondary', 'neutral']),
});
exports.hardwareOptionSchema = zod_1.z.object({
    id: zod_1.z.string(),
    name: zod_1.z.string(),
    finish: zod_1.z.enum(['silver', 'gold', 'black', 'rose-gold', 'gunmetal']),
    priceModifier: zod_1.z.number().min(0),
});
exports.personalizationOptionSchema = zod_1.z.object({
    text: zod_1.z.string().max(20).optional(),
    font: zod_1.z.string().optional(),
    position: zod_1.z.enum(['chest', 'back', 'side']).optional(),
    color: zod_1.z.string().optional(),
});
exports.builderConfigSchema = zod_1.z.object({
    size: exports.harnessSizeSchema,
    color: exports.colorOptionSchema,
    hardware: exports.hardwareOptionSchema,
    personalization: exports.personalizationOptionSchema.optional(),
});
exports.priceBreakdownSchema = zod_1.z.object({
    basePrice: zod_1.z.number().min(0),
    colorModifier: zod_1.z.number(),
    hardwareModifier: zod_1.z.number(),
    personalizationCost: zod_1.z.number().min(0),
    subtotal: zod_1.z.number().min(0),
    tax: zod_1.z.number().min(0),
    total: zod_1.z.number().min(0),
});
exports.createDesignSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255).optional(),
    configJson: exports.builderConfigSchema,
    priceBreakdown: exports.priceBreakdownSchema.optional(),
});
exports.updateDesignSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(255).optional(),
    configJson: exports.builderConfigSchema.optional(),
    priceBreakdown: exports.priceBreakdownSchema.optional(),
    status: exports.designStatusSchema.optional(),
});
//# sourceMappingURL=validation.js.map