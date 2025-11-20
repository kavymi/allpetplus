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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-3 text-[var(--color-foreground)]">
            Shop Premium Pet Gear
          </h1>
          <p className="text-lg text-[var(--color-foreground-secondary)]">
            High-quality, ready-made products for your pet
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                px-4 py-2 rounded-lg font-medium transition-all text-sm
                ${
                  selectedCategory === category.id
                    ? 'bg-[var(--color-primary)] text-white shadow-md'
                    : 'bg-white text-[var(--color-foreground)] border border-[var(--color-border)] hover:border-[var(--color-primary)]'
                }
              `}
            >
              <span className="mr-1.5">{category.icon}</span>
              {category.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {filteredProducts.map((product) => (
            <Link
              key={product.id}
              href={`/catalog/${product.id}`}
              className="group rounded-xl border border-[var(--color-border)] bg-white overflow-hidden hover:border-[var(--color-primary)] hover:shadow-lg transition-all"
            >
              {/* Product Image Placeholder */}
              <div className="aspect-square bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                <span className="text-7xl opacity-40">🐕</span>
              </div>

              {/* Product Info */}
              <div className="p-5">
                <h3 className="text-lg font-bold mb-1 text-[var(--color-foreground)] group-hover:text-[var(--color-primary)] transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-[var(--color-foreground-secondary)] mb-4">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xl font-bold text-[var(--color-primary)]">
                    ${product.price}
                  </span>
                  <button className="px-4 py-2 bg-[var(--color-primary)] text-white text-sm rounded-lg hover:bg-[var(--color-secondary)] transition-all font-medium">
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

