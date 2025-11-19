'use client';

import Link from 'next/link';
import { useState } from 'react';

const CATEGORIES = [
  { id: 'all', label: 'All Products', icon: '🛍️' },
  { id: 'harnesses', label: 'Harnesses', icon: '🦴' },
  { id: 'collars', label: 'Collars', icon: '⭕' },
  { id: 'leashes', label: 'Leashes', icon: '🔗' },
  { id: 'clothing', label: 'Clothing', icon: '👕' },
  { id: 'accessories', label: 'Accessories', icon: '✨' },
];

// Mock products - will be replaced with Shopify data
const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Ocean Adventure Harness',
    category: 'harnesses',
    price: 49.99,
    image: '/placeholder-harness.jpg',
    description: 'Durable and comfortable',
  },
  {
    id: '2',
    name: 'Sunset Collar',
    category: 'collars',
    price: 29.99,
    image: '/placeholder-collar.jpg',
    description: 'Vibrant and adjustable',
  },
  {
    id: '3',
    name: 'Forest Trail Leash',
    category: 'leashes',
    price: 34.99,
    image: '/placeholder-leash.jpg',
    description: '6ft premium leash',
  },
];

export default function CatalogPage(): React.ReactElement {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredProducts =
    selectedCategory === 'all'
      ? MOCK_PRODUCTS
      : MOCK_PRODUCTS.filter((p) => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-[var(--color-foreground)]">
            Shop Premium Pet Gear
          </h1>
          <p className="text-xl text-[var(--color-foreground-secondary)]">
            Browse our collection of high-quality, ready-made products
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-6 py-3 rounded-xl font-medium transition-all
                ${
                  selectedCategory === category.id
                    ? 'bg-[var(--color-primary)] text-white shadow-lg scale-105'
                    : 'bg-[var(--color-surface)] text-[var(--color-foreground)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
                }
              `}
            >
              <span className="mr-2">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/catalog/${product.id}`}
              className="group rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] overflow-hidden hover:border-[var(--color-primary)] hover:shadow-xl transition-all"
            >
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-[var(--color-primary)]/10 to-[var(--color-primary)]/5 flex items-center justify-center">
                <span className="text-8xl opacity-30">🐕</span>
              </div>

              {/* Product Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2 text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-[var(--color-foreground-secondary)] mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold text-[var(--color-primary)]">
                    ${product.price}
                  </span>
                  <button className="px-4 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-lg hover:bg-[var(--color-primary)] hover:text-white transition-all font-medium">
                    Add to Cart
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-xl text-[var(--color-foreground-secondary)]">
              No products found in this category
            </p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 text-center">
          <div className="inline-block p-8 rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)]">
            <h3 className="text-2xl font-bold mb-4 text-[var(--color-foreground)]">
              Want Something Unique?
            </h3>
            <p className="text-[var(--color-foreground-secondary)] mb-6">
              Design your own custom gear with our 3D builder
            </p>
            <Link
              href="/builder"
              className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
            >
              Start Custom Builder
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

