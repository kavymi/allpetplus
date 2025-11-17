/**
 * Products CO Types
 * Division 4 of 12
 */

export interface Product {
  id: string;
  sku: string;
  name: string;
  category: 'leash' | 'collar' | 'harness' | 'apparel' | 'accessory' | 'toy';
  basePrice: number;
  customizable: boolean;
  inStock: boolean;
  images: string[];
}

export interface CustomDesign {
  id: string;
  productId: string;
  userId: string;
  petId?: string;
  
  customization: {
    colors: string[];
    materials: string[];
    measurements?: Record<string, number>;
    text?: string;
    patterns?: string[];
  };
  
  previewUrl: string;
  status: 'draft' | 'saved' | 'ordered';
  price: number;
}

export interface ProductOrder {
  id: string;
  orderNumber: string;
  userId: string;
  items: Array<{
    productId: string;
    customDesignId?: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: any;
  trackingNumber?: string;
}

export interface SubscriptionBox {
  id: string;
  name: string;
  tier: 'essential' | 'deluxe';
  monthlyPrice: number;
  items: string[];
  petSize: 'small' | 'medium' | 'large';
}

