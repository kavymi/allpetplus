/**
 * Builder Domain Validation Schemas
 * Shared Zod schemas for type-safe validation
 */
import { z } from 'zod';
export declare const harnessSizeSchema: z.ZodEnum<{
    XS: "XS";
    S: "S";
    M: "M";
    L: "L";
    XL: "XL";
    XXL: "XXL";
}>;
export declare const designStatusSchema: z.ZodEnum<{
    DRAFT: "DRAFT";
    ACTIVE: "ACTIVE";
    ARCHIVED: "ARCHIVED";
}>;
export declare const colorOptionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    hex: z.ZodString;
    category: z.ZodEnum<{
        primary: "primary";
        secondary: "secondary";
        neutral: "neutral";
    }>;
}, z.core.$strip>;
export declare const hardwareOptionSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodString;
    finish: z.ZodEnum<{
        silver: "silver";
        gold: "gold";
        black: "black";
        "rose-gold": "rose-gold";
        gunmetal: "gunmetal";
    }>;
    priceModifier: z.ZodNumber;
}, z.core.$strip>;
export declare const personalizationOptionSchema: z.ZodObject<{
    text: z.ZodOptional<z.ZodString>;
    font: z.ZodOptional<z.ZodString>;
    position: z.ZodOptional<z.ZodEnum<{
        chest: "chest";
        back: "back";
        side: "side";
    }>>;
    color: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const builderConfigSchema: z.ZodObject<{
    size: z.ZodEnum<{
        XS: "XS";
        S: "S";
        M: "M";
        L: "L";
        XL: "XL";
        XXL: "XXL";
    }>;
    color: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        hex: z.ZodString;
        category: z.ZodEnum<{
            primary: "primary";
            secondary: "secondary";
            neutral: "neutral";
        }>;
    }, z.core.$strip>;
    hardware: z.ZodObject<{
        id: z.ZodString;
        name: z.ZodString;
        finish: z.ZodEnum<{
            silver: "silver";
            gold: "gold";
            black: "black";
            "rose-gold": "rose-gold";
            gunmetal: "gunmetal";
        }>;
        priceModifier: z.ZodNumber;
    }, z.core.$strip>;
    personalization: z.ZodOptional<z.ZodObject<{
        text: z.ZodOptional<z.ZodString>;
        font: z.ZodOptional<z.ZodString>;
        position: z.ZodOptional<z.ZodEnum<{
            chest: "chest";
            back: "back";
            side: "side";
        }>>;
        color: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const priceBreakdownSchema: z.ZodObject<{
    basePrice: z.ZodNumber;
    colorModifier: z.ZodNumber;
    hardwareModifier: z.ZodNumber;
    personalizationCost: z.ZodNumber;
    subtotal: z.ZodNumber;
    tax: z.ZodNumber;
    total: z.ZodNumber;
}, z.core.$strip>;
export declare const createDesignSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    configJson: z.ZodObject<{
        size: z.ZodEnum<{
            XS: "XS";
            S: "S";
            M: "M";
            L: "L";
            XL: "XL";
            XXL: "XXL";
        }>;
        color: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            hex: z.ZodString;
            category: z.ZodEnum<{
                primary: "primary";
                secondary: "secondary";
                neutral: "neutral";
            }>;
        }, z.core.$strip>;
        hardware: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            finish: z.ZodEnum<{
                silver: "silver";
                gold: "gold";
                black: "black";
                "rose-gold": "rose-gold";
                gunmetal: "gunmetal";
            }>;
            priceModifier: z.ZodNumber;
        }, z.core.$strip>;
        personalization: z.ZodOptional<z.ZodObject<{
            text: z.ZodOptional<z.ZodString>;
            font: z.ZodOptional<z.ZodString>;
            position: z.ZodOptional<z.ZodEnum<{
                chest: "chest";
                back: "back";
                side: "side";
            }>>;
            color: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>;
    priceBreakdown: z.ZodOptional<z.ZodObject<{
        basePrice: z.ZodNumber;
        colorModifier: z.ZodNumber;
        hardwareModifier: z.ZodNumber;
        personalizationCost: z.ZodNumber;
        subtotal: z.ZodNumber;
        tax: z.ZodNumber;
        total: z.ZodNumber;
    }, z.core.$strip>>;
}, z.core.$strip>;
export declare const updateDesignSchema: z.ZodObject<{
    id: z.ZodString;
    name: z.ZodOptional<z.ZodString>;
    configJson: z.ZodOptional<z.ZodObject<{
        size: z.ZodEnum<{
            XS: "XS";
            S: "S";
            M: "M";
            L: "L";
            XL: "XL";
            XXL: "XXL";
        }>;
        color: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            hex: z.ZodString;
            category: z.ZodEnum<{
                primary: "primary";
                secondary: "secondary";
                neutral: "neutral";
            }>;
        }, z.core.$strip>;
        hardware: z.ZodObject<{
            id: z.ZodString;
            name: z.ZodString;
            finish: z.ZodEnum<{
                silver: "silver";
                gold: "gold";
                black: "black";
                "rose-gold": "rose-gold";
                gunmetal: "gunmetal";
            }>;
            priceModifier: z.ZodNumber;
        }, z.core.$strip>;
        personalization: z.ZodOptional<z.ZodObject<{
            text: z.ZodOptional<z.ZodString>;
            font: z.ZodOptional<z.ZodString>;
            position: z.ZodOptional<z.ZodEnum<{
                chest: "chest";
                back: "back";
                side: "side";
            }>>;
            color: z.ZodOptional<z.ZodString>;
        }, z.core.$strip>>;
    }, z.core.$strip>>;
    priceBreakdown: z.ZodOptional<z.ZodObject<{
        basePrice: z.ZodNumber;
        colorModifier: z.ZodNumber;
        hardwareModifier: z.ZodNumber;
        personalizationCost: z.ZodNumber;
        subtotal: z.ZodNumber;
        tax: z.ZodNumber;
        total: z.ZodNumber;
    }, z.core.$strip>>;
    status: z.ZodOptional<z.ZodEnum<{
        DRAFT: "DRAFT";
        ACTIVE: "ACTIVE";
        ARCHIVED: "ARCHIVED";
    }>>;
}, z.core.$strip>;
export type CreateDesignInput = z.infer<typeof createDesignSchema>;
export type UpdateDesignInput = z.infer<typeof updateDesignSchema>;
//# sourceMappingURL=validation.d.ts.map