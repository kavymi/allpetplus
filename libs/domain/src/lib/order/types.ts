/**
 * Order Domain Types
 * Shared across all services and frontend
 */

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PRODUCTION'
  | 'QUALITY_CHECK'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'RETURNED'
  | 'CANCELLED';

export interface OrderMeta {
  id: string;
  shopifyOrderId: string;
  shopifyOrderNumber: string;
  email: string;
  emailHash: string;
  maskedId: string;
  status: OrderStatus;
  statusHistory: OrderStatusChange[];
  designConfig: any | null;
  shippingInfo: ShippingInfo | null;
  metadata: Record<string, any> | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderStatusChange {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface ShippingInfo {
  carrier: string;
  trackingNumber: string;
  trackingUrl: string;
  estimatedDelivery?: string;
  actualDelivery?: string;
}

export interface OrderLineItem {
  id: string;
  title: string;
  quantity: number;
  price: number;
  variant?: string;
  customizations?: Record<string, any>;
}

export interface OrderSummary {
  subtotal: number;
  discounts: number;
  shipping: number;
  tax: number;
  total: number;
  currencyCode: string;
}

