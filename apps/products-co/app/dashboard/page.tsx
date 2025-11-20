'use client';

import Link from 'next/link';

export default function ProductsDashboard(): React.ReactElement {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-[var(--color-border)] mb-4">
            <span className="text-2xl">🐾</span>
            <span className="text-sm font-semibold text-[var(--color-primary)]">All Pet Plus Products</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--color-foreground)] mb-2">
            My Products
          </h1>
          <p className="text-[var(--color-foreground-secondary)]">
            Manage your custom designs, orders, and subscriptions
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
            <div className="text-3xl mb-3">🎨</div>
            <div className="text-3xl font-bold text-[var(--color-foreground)] mb-1">0</div>
            <div className="text-sm text-[var(--color-foreground-secondary)]">Saved Designs</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
            <div className="text-3xl mb-3">📦</div>
            <div className="text-3xl font-bold text-[var(--color-foreground)] mb-1">0</div>
            <div className="text-sm text-[var(--color-foreground-secondary)]">Orders</div>
          </div>

          <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
            <div className="text-3xl mb-3">📅</div>
            <div className="text-3xl font-bold text-[var(--color-foreground)] mb-1">—</div>
            <div className="text-sm text-[var(--color-foreground-secondary)]">Active Subscription</div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Custom Builder */}
          <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
            <h2 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">Create Custom Gear</h2>
            <p className="text-sm text-[var(--color-foreground-secondary)] mb-4">
              Design your perfect harness, collar, or leash
            </p>
            <Link
              href="http://localhost:3001/builder"
              className="block w-full px-4 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-secondary)] transition-all text-center font-medium"
            >
              Start Designing
            </Link>
            <p className="text-xs text-[var(--color-muted)] mt-3 text-center">
              No saved designs yet
            </p>
          </div>

          {/* Browse Products */}
          <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
            <h2 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">Shop Ready-Made</h2>
            <p className="text-sm text-[var(--color-foreground-secondary)] mb-4">
              Browse our collection of premium pet gear
            </p>
            <Link
              href="http://localhost:3001/catalog"
              className="block w-full px-4 py-3 bg-white border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-all text-center font-medium"
            >
              Browse Catalog
            </Link>
          </div>

          {/* Subscriptions */}
          <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
            <h2 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">Monthly Boxes</h2>
            <p className="text-sm text-[var(--color-foreground-secondary)] mb-4">
              Get treats, toys, and gear delivered every month
            </p>
            <Link
              href="http://localhost:3001/subscriptions"
              className="block w-full px-4 py-3 bg-white border border-[var(--color-border)] rounded-lg hover:border-[var(--color-primary)] hover:bg-[var(--color-surface)] transition-all text-center font-medium"
            >
              View Subscription Options
            </Link>
          </div>

          {/* Orders */}
          <div className="bg-white rounded-xl p-6 border border-[var(--color-border)] shadow-sm">
            <h2 className="text-xl font-bold mb-2 text-[var(--color-foreground)]">Order History</h2>
            <p className="text-sm text-[var(--color-foreground-secondary)] mb-4">
              Track your orders and view past purchases
            </p>
            <div className="text-sm text-[var(--color-muted)] text-center py-4">
              No orders yet
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
