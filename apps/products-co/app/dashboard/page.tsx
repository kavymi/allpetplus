'use client';

import Link from 'next/link';

export default function ProductsDashboard(): React.ReactElement {
  return (
    <div className="min-h-screen bg-[var(--color-background)] p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-[var(--color-foreground)]">My Products</h1>
        <p className="text-[var(--color-foreground-secondary)] mb-8">
          Manage your custom designs, orders, and subscriptions
        </p>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <div className="text-4xl mb-2">🎨</div>
            <div className="text-2xl font-bold text-[var(--color-foreground)]">0</div>
            <div className="text-sm text-[var(--color-foreground-secondary)]">Saved Designs</div>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <div className="text-4xl mb-2">📦</div>
            <div className="text-2xl font-bold text-[var(--color-foreground)]">0</div>
            <div className="text-sm text-[var(--color-foreground-secondary)]">Orders</div>
          </div>

          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <div className="text-4xl mb-2">📅</div>
            <div className="text-2xl font-bold text-[var(--color-foreground)]">No</div>
            <div className="text-sm text-[var(--color-foreground-secondary)]">Active Subscription</div>
          </div>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Custom Designs */}
          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <h2 className="text-xl font-bold mb-4 text-[var(--color-foreground)]">Custom Designs</h2>
            <p className="text-sm text-[var(--color-foreground-secondary)] mb-4">
              Create and manage your custom pet gear designs
            </p>
            <div className="space-y-3">
              <Link
                href="http://localhost:3001/builder"
                className="block w-full px-4 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity text-center font-medium"
              >
                Start New Design
              </Link>
              <div className="text-sm text-[var(--color-foreground-secondary)] text-center">
                No saved designs yet
              </div>
            </div>
          </div>

          {/* Orders */}
          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <h2 className="text-xl font-bold mb-4 text-[var(--color-foreground)]">Recent Orders</h2>
            <p className="text-sm text-[var(--color-foreground-secondary)] mb-4">
              Track your orders and view history
            </p>
            <div className="text-sm text-[var(--color-foreground-secondary)] text-center py-8">
              No orders yet
            </div>
          </div>

          {/* Subscription */}
          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <h2 className="text-xl font-bold mb-4 text-[var(--color-foreground)]">Subscription Box</h2>
            <p className="text-sm text-[var(--color-foreground-secondary)] mb-4">
              Get monthly treats and gear delivered
            </p>
            <Link
              href="http://localhost:3001/subscriptions"
              className="block w-full px-4 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors text-center font-medium text-[var(--color-foreground)]"
            >
              Browse Subscription Boxes
            </Link>
          </div>

          {/* Catalog */}
          <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
            <h2 className="text-xl font-bold mb-4 text-[var(--color-foreground)]">Ready-Made Products</h2>
            <p className="text-sm text-[var(--color-foreground-secondary)] mb-4">
              Browse our collection of ready-made pet gear
            </p>
            <Link
              href="http://localhost:3001/catalog"
              className="block w-full px-4 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors text-center font-medium text-[var(--color-foreground)]"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
