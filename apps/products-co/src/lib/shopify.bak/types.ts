export interface ShopifyMoneyRange {
  min: number;
  max: number;
  currencyCode: string;
}

export interface CatalogProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  priceRange: ShopifyMoneyRange;
  featuredImage: {
    src: string;
    alt: string;
  };
  sizes: string[];
  tags: string[];
  materials: string[];
  isNewArrival?: boolean;
  bestFor?: string[];
}

export interface CatalogFilters {
  sizes: string[];
  tags: string[];
  materials: string[];
  bestFor: string[];
}

export interface ProductSizeGuideEntry {
  size: string;
  neck: string;
  chest: string;
  note: string;
}

export interface ProductPreset {
  handle: string;
  title: string;
  description: string;
  emoji: string;
  selection?: Record<string, string>;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface ProductDetail extends CatalogProduct {
  images: ProductImage[];
  badges: string[];
  sizeGuide: ProductSizeGuideEntry[];
  presets: ProductPreset[];
  care: string;
}

export interface CartLineItem {
  id: string;
  title: string;
  handle: string;
  quantity: number;
  price: ShopifyMoneyRange;
  previewImage: ProductImage;
  selections: Record<string, string>;
  addons?: string[];
}

export interface CartSummary {
  subtotal: number;
  discounts: number;
  shipping: number;
  tax: number;
  total: number;
  currencyCode: string;
}

export interface Cart {
  id: string;
  lines: CartLineItem[];
  summary: CartSummary;
  estimatedFulfillment: string;
  checkoutUrl?: string;
  notes?: string;
}

export type CartLine = CartLineItem;

export type ShopifyCartEdge = {
  node: {
    id: string;
    quantity: number;
    merchandise: {
      product: {
        handle: string;
        title: string;
        featuredImage?: { url: string; altText: string | null };
      };
      price: { amount: string; currencyCode: string };
    };
    attributes: Array<{ key: string; value: string }>;
  };
};

export interface OrderStatusTimeline {
  status: 'confirmed' | 'in_production' | 'quality_check' | 'shipped' | 'delivered';
  timestamp: string;
  description: string;
  isComplete: boolean;
}

export interface OrderShipment {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery: string;
}

export interface OrderStatus {
  id: string;
  orderNumber: string;
  email: string;
  createdAt: string;
  timeline: OrderStatusTimeline[];
  shipment?: OrderShipment;
  items: Array<{
    title: string;
    quantity: number;
    selections: Record<string, string>;
    previewImage: ProductImage;
  }>;
  summary: CartSummary;
}