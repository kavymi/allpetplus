"use strict";
/**
 * Builder Domain - Pricing Logic
 * Calculates harness pricing with modifiers
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePrice = calculatePrice;
exports.formatPrice = formatPrice;
exports.toShopifyPrice = toShopifyPrice;
const BASE_PRICES = {
    XS: 39.99,
    S: 44.99,
    M: 49.99,
    L: 54.99,
    XL: 59.99,
    XXL: 64.99,
};
const TAX_RATE = 0.0875; // 8.75% sales tax (configurable)
/**
 * Calculate total price for a harness design
 */
function calculatePrice(config) {
    const basePrice = BASE_PRICES[config.size] || 49.99;
    // Color modifier (premium colors cost more)
    const colorModifier = config.color.category === 'primary' ? 5.00 : 0;
    // Hardware modifier (from config)
    const hardwareModifier = config.hardware.priceModifier;
    // Personalization cost
    const personalizationCost = config.personalization?.text ? 12.00 : 0;
    // Calculate subtotal
    const subtotal = basePrice + colorModifier + hardwareModifier + personalizationCost;
    // Calculate tax
    const tax = subtotal * TAX_RATE;
    // Calculate total
    const total = subtotal + tax;
    return {
        basePrice,
        colorModifier,
        hardwareModifier,
        personalizationCost,
        subtotal: Number(subtotal.toFixed(2)),
        tax: Number(tax.toFixed(2)),
        total: Number(total.toFixed(2)),
    };
}
/**
 * Format price for display
 */
function formatPrice(cents) {
    return `$${(cents / 100).toFixed(2)}`;
}
/**
 * Convert price to Shopify format (cents)
 */
function toShopifyPrice(dollars) {
    return Math.round(dollars * 100);
}
//# sourceMappingURL=pricing.js.map