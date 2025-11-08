"use strict";
/**
 * Utest Domain Validation Schemas
 * Zod schemas for type-safe validation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.testIdSchema = exports.updateUtestSchema = exports.createUtestSchema = void 0;
const zod_1 = require("zod");
exports.createUtestSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    // Add your validations here
});
exports.updateUtestSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
    name: zod_1.z.string().min(1).max(255).optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE', 'PENDING']).optional(),
    // Add your validations here
});
exports.testIdSchema = zod_1.z.object({
    id: zod_1.z.string().uuid(),
});
//# sourceMappingURL=validation.js.map