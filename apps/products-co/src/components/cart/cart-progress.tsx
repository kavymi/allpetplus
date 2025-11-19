

import { motion } from 'framer-motion';

interface CartProgressProps {
  subtotal: number;
}

const FREE_SHIPPING_THRESHOLD = 75;

export function CartProgress({ subtotal }: CartProgressProps) {
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);
  const hasReachedThreshold = subtotal >= FREE_SHIPPING_THRESHOLD;

  return (
    <div className="space-y-3 rounded-2xl border border-[var(--color-border)] bg-gradient-to-r from-[var(--color-primary-soft)] to-[var(--color-success-soft)] p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚚</span>
          <div>
            {hasReachedThreshold ? (
              <p className="text-sm font-semibold text-[var(--color-success)]">
                You&apos;ve unlocked free shipping!
              </p>
            ) : (
              <p className="text-sm font-semibold text-[var(--color-foreground)]">
                ${remaining.toFixed(2)} away from free shipping
              </p>
            )}
            <p className="text-xs text-[var(--color-muted)]">
              {hasReachedThreshold ? 'Enjoy free delivery' : `Spend $${remaining.toFixed(2)} more`}
            </p>
          </div>
        </div>
        {hasReachedThreshold && (
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            <svg
              className="h-8 w-8 text-[var(--color-success)]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </motion.div>
        )}
      </div>

      <div className="relative h-2 overflow-hidden rounded-full bg-white/80">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-success)]"
        />
      </div>
    </div>
  );
}
