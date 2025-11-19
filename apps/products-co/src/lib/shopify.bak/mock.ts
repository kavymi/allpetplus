import type { CatalogFilters, CatalogProduct, ProductDetail, Cart, OrderStatus } from './types';

export async function getMockCatalogProducts(): Promise<CatalogProduct[]> {
  await new Promise((resolve) => setTimeout(resolve, 200));
  return [
    {
      id: 'gid://shopify/Product/1',
      handle: 'galaxy-glide',
      title: 'Galaxy Glide Harness',
      description: 'High-visibility reflective straps with breathable mesh for night adventures.',
      priceRange: { min: 68, max: 92, currencyCode: 'USD' },
      featuredImage: {
        src: 'https://res.cloudinary.com/demo/image/upload/v1727367621/all-pet-plus/glide.png',
        alt: 'Galaxy Glide harness in reflective blue',
      },
      sizes: ['XS', 'S', 'M', 'L'],
      tags: ['Reflective', 'Night walk', 'Safety'],
      materials: ['Eco mesh', 'Reflective nylon'],
      isNewArrival: true,
      bestFor: ['Night walks', 'Visibility'],
    },
    {
      id: 'gid://shopify/Product/2',
      handle: 'sunset-trail',
      title: 'Sunset Trail Harness',
      description: 'Soft knit interior with durable canvas exterior. Perfect for all-day wear.',
      priceRange: { min: 62, max: 88, currencyCode: 'USD' },
      featuredImage: {
        src: 'https://res.cloudinary.com/demo/image/upload/v1727367621/all-pet-plus/sunset.png',
        alt: 'Sunset Trail harness in coral and sand',
      },
      sizes: ['S', 'M', 'L'],
      tags: ['Adventure ready', 'Durable', 'All-weather'],
      materials: ['Ripstop canvas', 'Microfleece'],
      bestFor: ['Hiking', 'Everyday'],
    },
    {
      id: 'gid://shopify/Product/3',
      handle: 'sprout-eco',
      title: 'Sprout Eco Harness',
      description: 'Organic hemp exterior with recycled lining. Lightweight and breathable.',
      priceRange: { min: 58, max: 84, currencyCode: 'USD' },
      featuredImage: {
        src: 'https://res.cloudinary.com/demo/image/upload/v1727367621/all-pet-plus/sprout.png',
        alt: 'Sprout Eco harness in fern green',
      },
      sizes: ['XS', 'S', 'M'],
      tags: ['Eco friendly', 'Lightweight'],
      materials: ['Organic cotton', 'Recycled lining'],
      bestFor: ['Sensitive skin', 'Warm weather'],
    },
  ];
}

export async function getMockCatalogFilters(): Promise<CatalogFilters> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return {
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    tags: ['Reflective', 'Adventure ready', 'Eco friendly', 'Lightweight', 'Durable'],
    materials: ['Organic cotton', 'Ripstop canvas', 'Microfleece', 'Reflective nylon', 'Recycled lining'],
    bestFor: ['Night walks', 'Visibility', 'Hiking', 'Everyday', 'Sensitive skin', 'Warm weather'],
  };
}

export async function getMockProductDetail(handle: string): Promise<ProductDetail | null> {
  const catalog = await getMockCatalogProducts();
  const base = catalog.find((product) => product.handle === handle);
  if (!base) {
    return null;
  }

  return {
    ...base,
    images: [
      base.featuredImage,
      {
        src: base.featuredImage.src.replace('.png', '-detail.png'),
        alt: `${base.title} detail view`,
      },
      {
        src: base.featuredImage.src.replace('.png', '-dog.png'),
        alt: `${base.title} on dog`,
      },
    ],
    badges: base.isNewArrival ? ['New arrival', 'Limited edition'] : ['Fan favorite'],
    sizeGuide: [
      { size: 'XS', neck: '9-12"', chest: '13-17"', note: 'Ideal for toy breeds up to 12 lbs.' },
      { size: 'S', neck: '12-15"', chest: '17-21"', note: 'Best for small dogs up to 20 lbs.' },
      { size: 'M', neck: '15-18"', chest: '21-27"', note: 'Great for medium pups up to 40 lbs.' },
      { size: 'L', neck: '18-22"', chest: '27-34"', note: 'Built for large dogs up to 70 lbs.' },
    ],
    presets: [
      {
        handle: `${handle}-nightglow`,
        title: 'Night glow',
        description: 'Reflective straps + ember orange accents',
        emoji: '🌙',
        selection: {
          colorway: 'night-sky',
          hardware: 'rose-gold',
          stitching: 'reflective',
        },
      },
      {
        handle: `${handle}-weekend`,
        title: 'Weekend trail',
        description: 'Adventure canvas with moss webbing',
        emoji: '🥾',
        selection: {
          colorway: 'trail-moss',
          hardware: 'matte-black',
          stitching: 'eco',
          addons: 'leash',
        },
      },
      {
        handle: `${handle}-city`,
        title: 'City commute',
        description: 'Matte black hardware & charcoal base',
        emoji: '🚕',
        selection: {
          colorway: 'charcoal-glow',
          hardware: 'matte-black',
          stitching: 'standard',
          personalization: 'embroidery',
        },
      },
    ],
    care: 'Machine wash cold on delicate. Lay flat to dry. Avoid bleach and fabric softeners to preserve reflective fibers.',
  };
}

export async function getMockCart(cartId: string): Promise<Cart> {
  return {
    id: cartId,
    estimatedFulfillment: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    checkoutUrl: 'https://checkout.shopify.com/mock/all-pet-plus',
    lines: [
      {
        id: 'line-1',
        title: 'Galaxy Glide Harness',
        handle: 'galaxy-glide',
        quantity: 1,
        price: { min: 88, max: 88, currencyCode: 'USD' },
        previewImage: {
          src: 'https://res.cloudinary.com/demo/image/upload/v1727367621/all-pet-plus/glide.png',
          alt: 'Galaxy Glide harness in reflective blue',
        },
        selections: {
          size: 'M',
          colorway: 'night-sky',
          hardware: 'rose-gold',
          stitching: 'reflective',
        },
        addons: ['Matching leash'],
      },
    ],
    summary: {
      subtotal: 88,
      discounts: 0,
      shipping: 0,
      tax: 6.5,
      total: 94.5,
      currencyCode: 'USD',
    },
  };
}

export async function getMockOrderStatus(orderId: string, email: string): Promise<OrderStatus | null> {
  await new Promise((resolve) => setTimeout(resolve, 300));
  
  if (orderId !== 'HH-2024-001' || email !== 'test@example.com') {
    return null;
  }

  return {
    id: orderId,
    orderNumber: 'HH-2024-001',
    email,
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    timeline: [
      {
        status: 'confirmed',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Order confirmed and payment processed',
        isComplete: true,
      },
      {
        status: 'in_production',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Harness customization in progress',
        isComplete: true,
      },
      {
        status: 'quality_check',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        description: 'Quality inspection and packaging',
        isComplete: true,
      },
      {
        status: 'shipped',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        description: 'Package shipped via FedEx',
        isComplete: true,
      },
      {
        status: 'delivered',
        timestamp: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        description: 'Estimated delivery',
        isComplete: false,
      },
    ],
    shipment: {
      carrier: 'FedEx',
      trackingNumber: '1234567890123456',
      trackingUrl: 'https://www.fedex.com/fedextrack/?trknbr=1234567890123456',
      estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    items: [
      {
        title: 'Galaxy Glide Harness',
        quantity: 1,
        selections: {
          size: 'M',
          colorway: 'night-sky',
          hardware: 'rose-gold',
          stitching: 'reflective',
          personalization: 'embroidery',
        },
        previewImage: {
          src: 'https://res.cloudinary.com/demo/image/upload/v1727367621/all-pet-plus/glide.png',
          alt: 'Galaxy Glide harness in reflective blue',
        },
      },
    ],
    summary: {
      subtotal: 88,
      discounts: 0,
      shipping: 0,
      tax: 6.5,
      total: 94.5,
      currencyCode: 'USD',
    },
  };
}


