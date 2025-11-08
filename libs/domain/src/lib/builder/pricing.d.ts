/**
 * Builder Domain - Pricing Logic
 * Calculates harness pricing with modifiers
 */
import { BuilderConfig, PriceBreakdown } from './types';
/**
 * Calculate total price for a harness design
 */
export declare function calculatePrice(config: BuilderConfig): PriceBreakdown;
/**
 * Format price for display
 */
export declare function formatPrice(cents: number): string;
/**
 * Convert price to Shopify format (cents)
 */
export declare function toShopifyPrice(dollars: number): number;
//# sourceMappingURL=pricing.d.ts.map