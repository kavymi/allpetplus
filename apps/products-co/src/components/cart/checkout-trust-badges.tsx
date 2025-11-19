

import { motion } from 'framer-motion';

const trustBadges = [
  {
    icon: '🔒',
    title: 'Secure Checkout',
    description: '256-bit SSL encryption',
  },
  {
    icon: '📦',
    title: 'Free Shipping',
    description: 'On orders over $75',
  },
  {
    icon: '↩️',
    title: 'Easy Returns',
    description: '30-day money back',
  },
  {
    icon: '⭐',
    title: '5-Star Rated',
    description: '10,000+ happy pups',
  },
];

export function CheckoutTrustBadges() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {trustBadges.map((badge, index) => (
        <motion.div
          key={badge.title}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex flex-col items-center gap-2 rounded-2xl border border-[var(--color-border)] bg-[var(--color-background)] p-3 text-center"
        >
          <span className="text-2xl" aria-hidden="true">
            {badge.icon}
          </span>
          <div>
            <p className="text-xs font-semibold text-[var(--color-foreground)]">{badge.title}</p>
            <p className="text-[10px] text-[var(--color-muted)]">{badge.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
