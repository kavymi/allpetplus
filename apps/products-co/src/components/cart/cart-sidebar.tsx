'use client';

import { useCartStore, useCartTotal } from '@/lib/cart-store';
import Link from 'next/link';

export function CartSidebar() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore();
  const total = useCartTotal();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40"
        onClick={closeCart}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-[var(--color-surface)] shadow-2xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[var(--color-border)]">
          <h2 className="text-2xl font-bold text-[var(--color-foreground)]">
            Shopping Cart ({items.length})
          </h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
            aria-label="Close cart"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🛒</div>
              <p className="text-[var(--color-foreground-secondary)] mb-6">
                Your cart is empty
              </p>
              <Link
                href="/catalog"
                onClick={closeCart}
                className="inline-block px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity font-semibold"
              >
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)]"
                >
                  {/* Image Placeholder */}
                  <div className="w-20 h-20 rounded-lg bg-[var(--color-surface)] flex items-center justify-center flex-shrink-0">
                    <span className="text-3xl">🐕</span>
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-[var(--color-foreground)] mb-1 truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-[var(--color-foreground-secondary)] mb-2">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors flex items-center justify-center"
                        aria-label="Decrease quantity"
                      >
                        −
                      </button>
                      <span className="w-8 text-center font-medium text-[var(--color-foreground)]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] transition-colors flex items-center justify-center"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="ml-auto text-sm text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-[var(--color-border)] p-6 space-y-4">
            {/* Total */}
            <div className="flex items-center justify-between text-lg font-bold">
              <span className="text-[var(--color-foreground)]">Total:</span>
              <span className="text-[var(--color-primary)]">${total.toFixed(2)}</span>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              <Link
                href="/checkout"
                onClick={closeCart}
                className="block w-full px-6 py-3 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity text-center font-semibold"
              >
                Proceed to Checkout
              </Link>
              <button
                onClick={closeCart}
                className="block w-full px-6 py-3 border border-[var(--color-border)] rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors text-center font-medium text-[var(--color-foreground)]"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

