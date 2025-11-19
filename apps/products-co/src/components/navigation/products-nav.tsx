'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartCount, useCartStore } from '@/lib/cart-store';

export function ProductsNav() {
  const pathname = usePathname();
  const cartCount = useCartCount();
  const toggleCart = useCartStore((state) => state.toggleCart);

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '/catalog', label: 'Shop' },
    { href: '/builder', label: 'Custom Builder' },
    { href: '/subscriptions', label: 'Subscriptions' },
  ];

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname?.startsWith(href);
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-surface)]/80 backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-8">
            <a
              href="http://localhost:3000"
              className="text-xl font-bold text-[var(--color-primary)] hover:opacity-80 transition-opacity"
            >
              All Pet Plus
            </a>
            <span className="text-sm text-[var(--color-foreground-secondary)]">Products</span>
          </div>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    isActive(item.href)
                      ? 'text-[var(--color-primary)]'
                      : 'text-[var(--color-foreground-secondary)] hover:text-[var(--color-foreground)]'
                  }
                `}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart Icon */}
            <button
              onClick={toggleCart}
              className="relative p-2 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors"
              aria-label="Shopping cart"
            >
              <svg
                className="w-6 h-6 text-[var(--color-foreground)]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {/* Cart badge */}
              {cartCount > 0 && (
                <span className="absolute top-0 right-0 bg-[var(--color-primary)] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Dashboard Link */}
            <a
              href="http://localhost:3000/dashboard"
              className="hidden md:block px-4 py-2 text-sm font-medium text-[var(--color-foreground)] hover:text-[var(--color-primary)] transition-colors"
            >
              Dashboard
            </a>

            {/* CTA Button */}
            <Link
              href="/builder"
              className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-opacity text-sm font-medium"
            >
              Create Custom
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

