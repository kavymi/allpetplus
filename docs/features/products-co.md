# Products CO - Comprehensive Guide

**Last Updated:** November 21, 2025  
**Status:** Phase 1 Complete - Foundation Ready  
**Division:** 4 of 12 in Pet Solutions Alliance

> 🛍️ **E-commerce platform for custom pet gear and lifestyle products**

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Business Overview](#business-overview)
3. [Technical Implementation](#technical-implementation)
4. [Product Categories](#product-categories)
5. [Custom Builder System](#custom-builder-system)
6. [Architecture](#architecture)
7. [Integration Guide](#integration-guide)
8. [Development Roadmap](#development-roadmap)

---

## Executive Summary

The Products CO operates a comprehensive e-commerce platform specializing in customizable, high-quality pet gear and lifestyle products. Implemented as a micro-frontend within the Pet Solutions Alliance ecosystem.

**Mission:** "Every pet is unique. Their gear should be too."

### Key Features
- ✅ Multi-product custom builder (harness, collar, leash, bandana, clothing)
- ✅ Ready-made product catalog
- ✅ Subscription boxes (Essential & Deluxe)
- ✅ Shopping cart with Shopify integration
- ✅ 3D preview system
- ✅ Order management dashboard

### Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Micro-Frontend App | ✅ Complete | Port 3002, full Next.js 15 setup |
| Domain Layer | ✅ Complete | Types, validation, utilities |
| tRPC API | ✅ Complete | All CRUD operations |
| Custom Builder | ✅ Complete | Multi-product support |
| 3D Preview | ✅ Complete | Harness, collar, leash models |
| Shopping Cart | ✅ Complete | Full cart management |
| Subscription System | 🔄 In Progress | Basic structure ready |
| Payment Integration | 🔄 In Progress | Shopify checkout |

---

## Business Overview

### Legal Entity
- **Legal Name:** AP Plus Products, Inc.
- **Division:** 4 of 12
- **Business Model:** Direct-to-consumer e-commerce + customization tools

### Revenue Streams

1. **Custom Products** (60% revenue)
   - Harnesses: $89.99-169.99
   - Collars: $39.99-79.99
   - Leashes: $39.99-129.99
   - Bandanas: $19.99-39.99
   - Clothing: $49.99-149.99

2. **Ready-Made Products** (25% revenue)
   - Standard harnesses: $69.99
   - Basic collars: $24.99
   - Standard leashes: $29.99
   - Apparel: $39.99

3. **Subscription Boxes** (15% revenue)
   - Essential Box: $39.99/month
   - Deluxe Box: $79.99/month

---

## Technical Implementation

### Micro-Frontend Structure

```
apps/products-co/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout with navigation
│   │   ├── page.tsx            # Landing page
│   │   ├── dashboard/          # Embedded dashboard
│   │   ├── builder/            # Custom builder
│   │   ├── catalog/            # Product catalog
│   │   ├── cart/               # Shopping cart
│   │   └── subscriptions/      # Subscription boxes
│   │
│   ├── components/
│   │   ├── builder/            # Builder components
│   │   │   ├── 3d/             # 3D models
│   │   │   ├── builder-shell.tsx
│   │   │   ├── options-pane.tsx
│   │   │   ├── preview-pane.tsx
│   │   │   └── use-builder.ts
│   │   ├── catalog/            # Product browsing
│   │   ├── cart/               # Cart UI
│   │   └── ui/                 # Shared components
│   │
│   └── lib/
│       └── shopify/            # Shopify integration
│
├── package.json
└── project.json                # NX configuration
```

### Domain Layer

**Location:** `libs/domain/src/lib/products-co/`

**Files:**
- `types.ts` - Comprehensive TypeScript types
- `validation.ts` - Zod validation schemas
- `utils.ts` - Business logic utilities

**Key Types:**

```typescript
// Product Types
export interface Product {
  id: string;
  type: ProductType;
  name: string;
  description: string;
  basePrice: number;
  images: string[];
  variants?: ProductVariant[];
  customizable: boolean;
  stock?: number;
  shopifyId?: string;
}

export type ProductType = 'harness' | 'collar' | 'leash' | 'bandana' | 'clothing';

// Custom Design
export interface CustomDesign {
  id: string;
  userId: string;
  productType: ProductType;
  name: string | null;
  config: ProductConfig;
  previewUrl: string | null;
  price: number;
  status: 'DRAFT' | 'ACTIVE' | 'ARCHIVED';
  createdAt: Date;
  updatedAt: Date;
}

// Builder Configuration
export interface ProductConfig {
  productType: ProductType;
  
  // Common options
  size?: string;
  color?: string;
  material?: string;
  hardware?: string;
  
  // Product-specific
  length?: number;        // leash
  width?: number;         // leash, collar
  style?: string;         // bandana, clothing
  pattern?: string;
  
  // Personalization
  customText?: string;
  textColor?: string;
  textFont?: string;
  embroidery?: boolean;
  
  // Add-ons
  reflective?: boolean;
  padded?: boolean;
}

// Subscription Box
export interface SubscriptionBox {
  id: string;
  userId: string;
  tier: 'ESSENTIAL' | 'DELUXE';
  frequency: 'MONTHLY' | 'QUARTERLY';
  price: number;
  nextDelivery: Date;
  preferences: SubscriptionPreferences;
  status: 'ACTIVE' | 'PAUSED' | 'CANCELLED';
}

// Shopping Cart
export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  updatedAt: Date;
}
```

### tRPC API

**Location:** `libs/api/src/routers/products-co.ts`

**Available Procedures:**

```typescript
// Products
products.list()              // List all products
products.getById(id)         // Get product details
products.getBySlug(slug)     // Get by URL slug

// Custom Designs
designs.list()               // User's saved designs
designs.save(config)         // Save new design
designs.update(id, config)   // Update existing
designs.delete(id)           // Delete design

// Orders
orders.list()                // User's orders
orders.getById(id)           // Order details
orders.create(cartId)        // Create from cart

// Subscriptions
subscriptions.list()         // User's subscriptions
subscriptions.create(tier)   // New subscription
subscriptions.update(id)     // Update preferences
subscriptions.cancel(id)     // Cancel subscription

// Cart
cart.get()                   // Get current cart
cart.add(item)               // Add item
cart.update(itemId, qty)     // Update quantity
cart.remove(itemId)          // Remove item
cart.clear()                 // Empty cart
```

**Usage Example:**

```typescript
// Frontend Component
'use client';
import { trpc } from '@pet/api';

export function ProductCatalog() {
  const { data: products, isLoading } = trpc.productsco.products.list.useQuery({
    type: 'harness',
    limit: 20,
  });
  
  if (isLoading) return <LoadingState />;
  
  return (
    <div className="grid grid-cols-3 gap-4">
      {products?.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

---

## Product Categories

### 1. Custom Harnesses

**Base Prices:** $89.99-169.99

**Customization Options:**
- **Size:** XS, S, M, L, XL, XXL
- **Base Color:** 20+ colors
- **Accent Colors:** Mix and match
- **Hardware:** Brass, nickel, rose gold, black
- **Style:** Y-front, H-back, step-in
- **Padding:** Standard, extra padded
- **Reflective:** Optional reflective strips
- **Custom Text:** Name/phone embroidery

**Configuration Example:**
```typescript
const harnessConfig: ProductConfig = {
  productType: 'harness',
  size: 'M',
  color: 'navy-blue',
  accentColor: 'gold',
  hardware: 'brass',
  style: 'Y-front',
  padded: true,
  reflective: true,
  customText: 'MAX',
  textColor: 'gold',
  embroidery: true,
};
```

### 2. Custom Collars

**Base Prices:** $39.99-79.99

**Customization Options:**
- **Size:** Width (1/2", 3/4", 1", 1.5"), Length (adjustable)
- **Material:** Nylon, leather, biothane, rope
- **Color:** 20+ colors
- **Hardware:** Brass, nickel, rose gold
- **Buckle Type:** Side release, traditional
- **Custom Text:** Embroidered name
- **Add-ons:** ID tag, bells

### 3. Custom Leashes

**Base Prices:** $39.99-129.99

**Customization Options:**
- **Length:** 4ft, 6ft, 8ft, or custom
- **Width:** 1/2", 3/4", 1", 1.5"
- **Material:** Nylon, leather, rope, biothane
- **Color:** Match or contrast harness
- **Handle:** Standard, padded, traffic handle
- **Hardware:** Match harness hardware
- **Reflective:** Optional

### 4. Bandanas & Accessories

**Base Prices:** $19.99-39.99

**Customization Options:**
- **Style:** Over-collar, tie-on, snap-on
- **Size:** S, M, L, XL
- **Pattern:** Solid, plaid, floral, seasonal
- **Color:** Full color palette
- **Reversible:** Dual patterns
- **Custom Print:** Names, phrases

### 5. Pet Apparel

**Base Prices:** $49.99-149.99

**Products:**
- Rain coats
- Winter coats
- Sweaters
- Cooling vests
- Life jackets
- Boots

---

## Custom Builder System

### Multi-Product Support

The builder now supports multiple product types with shared components:

```typescript
// Unified builder state
interface BuilderState {
  productType: ProductType;
  config: ProductConfig;
  preview: {
    mode: '2D' | '3D';
    rotation: number;
    zoom: number;
  };
  step: number;
  history: ProductConfig[];
}

// Product-aware configuration
const getAvailableOptions = (productType: ProductType) => {
  switch (productType) {
    case 'harness':
      return ['size', 'color', 'hardware', 'style', 'padding'];
    case 'collar':
      return ['size', 'material', 'color', 'hardware', 'buckle'];
    case 'leash':
      return ['length', 'width', 'material', 'color', 'handle'];
    case 'bandana':
      return ['style', 'size', 'pattern', 'color'];
    case 'clothing':
      return ['type', 'size', 'color', 'waterproof'];
  }
};
```

### 3D Preview System

**Location:** `apps/products-co/src/components/builder/3d/`

**Models:**
- `harness-model.tsx` - Complete harness with straps
- `collar-model.tsx` - Adjustable collar
- `leash-model.tsx` - Full-length leash with handle
- `bandana-model.tsx` - Triangular bandana
- `clothing-model.tsx` - Apparel models

**Technology:**
- Three.js + React Three Fiber
- Dynamic material updates
- Real-time color changes
- Camera controls
- Export to PNG/GLB

**Example:**
```typescript
import { Canvas } from '@react-three/fiber';
import { HarnessModel } from '@/components/builder/3d/harness-model';

export function Preview3D({ config }: { config: ProductConfig }) {
  return (
    <Canvas camera={{ position: [0, 0, 5] }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} />
      <HarnessModel
        size={config.size}
        color={config.color}
        hardware={config.hardware}
      />
    </Canvas>
  );
}
```

### Builder Flow

```
1. Product Selection
   ↓
2. Size Selection
   ↓
3. Color Customization
   ↓
4. Hardware & Materials
   ↓
5. Personalization
   ↓
6. Add-ons & Extras
   ↓
7. Review & Save
   ↓
8. Add to Cart
```

---

## Architecture

### Integration with Main Dashboard

**Standalone Access:**
```
https://products.harnesshero.com
```

**Embedded Access:**
```
https://harnesshero.com/dashboard/products
```

**Implementation:**
```typescript
// apps/web/src/app/(dashboard)/products/page.tsx
export default function ProductsTab() {
  return (
    <iframe 
      src="http://localhost:3002/dashboard"
      className="w-full h-screen border-0"
      title="Products Dashboard"
      allow="clipboard-read; clipboard-write"
    />
  );
}
```

### Communication Flow

```
User Action
    ↓
Products CO Component
    ↓
tRPC Client
    ↓
tRPC Router (libs/api/src/routers/products-co.ts)
    ↓
Backend Service
    ↓
Prisma → PostgreSQL
    ↓
Response back through chain
```

### Data Storage

**Database Tables:**
```sql
-- Products (from Shopify sync)
CREATE TABLE products (
  id UUID PRIMARY KEY,
  shopify_id VARCHAR(255),
  type VARCHAR(50),
  name VARCHAR(255),
  base_price DECIMAL(10,2),
  data JSONB
);

-- Custom Designs
CREATE TABLE custom_designs (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  product_type VARCHAR(50),
  name VARCHAR(255),
  config JSONB,
  preview_url TEXT,
  price DECIMAL(10,2),
  status VARCHAR(20),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);

-- Subscription Boxes
CREATE TABLE subscription_boxes (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  tier VARCHAR(20),
  frequency VARCHAR(20),
  price DECIMAL(10,2),
  next_delivery DATE,
  preferences JSONB,
  status VARCHAR(20)
);

-- Orders
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  shopify_order_id VARCHAR(255),
  items JSONB,
  total DECIMAL(10,2),
  status VARCHAR(50),
  created_at TIMESTAMP
);
```

---

## Integration Guide

### Adding Products CO to Your Dashboard

**Step 1: Install dependencies**
```bash
cd apps/web
npm install
```

**Step 2: Add dashboard tab**
```typescript
// apps/web/src/app/(dashboard)/products/page.tsx
export default function ProductsTab() {
  return (
    <div className="h-full">
      <iframe 
        src={process.env.NEXT_PUBLIC_PRODUCTS_CO_URL || 'http://localhost:3002/dashboard'}
        className="w-full h-full border-0"
        title="Products Management"
      />
    </div>
  );
}
```

**Step 3: Update navigation**
```typescript
// apps/web/src/components/dashboard/nav.tsx
const tabs = [
  { href: '/dashboard/pets', label: 'Pets', icon: '🐾' },
  { href: '/dashboard/products', label: 'Products', icon: '🛍️' },
  { href: '/dashboard/orders', label: 'Orders', icon: '📦' },
];
```

### API Integration

```typescript
// Use tRPC in any component
import { trpc } from '@pet/api';

// In your component
const { data: products } = trpc.productsco.products.list.useQuery();
const createDesign = trpc.productsco.designs.save.useMutation();

await createDesign.mutateAsync({
  productType: 'harness',
  config: { size: 'M', color: 'blue' },
});
```

---

## Development Roadmap

### Phase 1: Foundation (✅ Complete)
- [x] Micro-frontend infrastructure
- [x] Domain layer with types
- [x] tRPC API layer
- [x] Multi-product builder
- [x] 3D preview system
- [x] Shopping cart

### Phase 2: Core Features (🔄 In Progress)
- [ ] Complete Shopify integration
- [ ] Payment processing (Stripe)
- [ ] Order fulfillment workflow
- [ ] Email notifications
- [ ] Subscription management
- [ ] Inventory tracking

### Phase 3: Advanced Features (📋 Planned)
- [ ] AI size recommendations
- [ ] Bulk ordering for businesses
- [ ] Gift cards
- [ ] Referral program
- [ ] Product reviews
- [ ] Wishlist

### Phase 4: Optimization (📋 Planned)
- [ ] Performance optimization
- [ ] SEO improvements
- [ ] Mobile app
- [ ] International shipping
- [ ] Multi-currency support

---

## Related Documentation

### Technical Docs
- [Master Architecture](/docs/ARCHITECTURE.md) - System overview
- [Micro-Frontend Guide](/docs/guides/create-new-microfrontend.md) - Pattern details
- [tRPC Usage](/docs/guides/trpc-usage-examples.md) - API examples

### Development
- [Code Patterns](/docs/development/code-patterns.md) - Best practices
- [Testing Guide](/docs/development/testing-guide.md) - Testing strategies

### Business Context
- [Pet Solutions Alliance Master Plan](/docs/features/pet-solutions-alliance-master.md)

---

## Migration Notes

### Migrated From Harness Hero

Products CO consolidates functionality previously in `apps/web/builder`:
- ✅ Builder components moved and enhanced
- ✅ Domain logic extracted to `libs/domain`
- ✅ API centralized in `libs/api`
- ✅ Extended to support multiple product types
- ✅ Added subscription box system

### Breaking Changes
None - backward compatible with existing saved designs.

---

**Last Updated:** November 21, 2025  
**Status:** Phase 1 Complete  
**Next Review:** December 2025  
**Owner:** Products CO Team

