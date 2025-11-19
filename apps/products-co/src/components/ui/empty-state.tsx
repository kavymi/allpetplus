

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  variant?: 'default' | 'minimal' | 'illustrated';
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  secondaryAction,
  className,
  variant = 'default',
}: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn(
        'flex flex-col items-center justify-center text-center',
        variant === 'default' && 'py-12 px-6',
        variant === 'minimal' && 'py-8 px-4',
        variant === 'illustrated' && 'py-16 px-6',
        className,
      )}
    >
      {icon && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className={cn(
            'mb-4 flex items-center justify-center rounded-full',
            variant === 'illustrated'
              ? 'h-20 w-20 bg-[var(--color-surface-muted)]'
              : 'h-12 w-12 bg-[var(--color-surface-muted)]',
          )}
        >
          {icon}
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-2 max-w-md"
      >
        <h3
          className={cn(
            'font-semibold text-[var(--color-foreground)]',
            variant === 'illustrated' ? 'text-xl' : 'text-lg',
          )}
        >
          {title}
        </h3>
        {description && (
          <p className="text-sm text-[var(--color-muted)] leading-relaxed">{description}</p>
        )}
      </motion.div>

      {(action || secondaryAction) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          {action && (
            <Button onClick={action.onClick} size="md">
              {action.label}
            </Button>
          )}
          {secondaryAction && (
            <Button variant="outline" onClick={secondaryAction.onClick} size="md">
              {secondaryAction.label}
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

// Preset empty states for common scenarios
export function EmptyCartState({ onStartShopping }: { onStartShopping: () => void }) {
  return (
    <EmptyState
      variant="illustrated"
      icon={
        <svg
          className="h-8 w-8 text-[var(--color-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
      }
      title="Your cart is empty"
      description="Start building your perfect harness or browse our curated templates to get started."
      action={{
        label: 'Start building',
        onClick: onStartShopping,
      }}
      secondaryAction={{
        label: 'Browse templates',
        onClick: () => (window.location.href = '/catalog'),
      }}
    />
  );
}

export function EmptySearchState({
  query,
  onClearSearch,
}: {
  query: string;
  onClearSearch: () => void;
}) {
  return (
    <EmptyState
      icon={
        <svg
          className="h-6 w-6 text-[var(--color-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      title={`No results for "${query}"`}
      description="Try adjusting your search terms or browse our full catalog of harness styles."
      action={{
        label: 'Clear search',
        onClick: onClearSearch,
      }}
      secondaryAction={{
        label: 'Browse all',
        onClick: () => (window.location.href = '/catalog'),
      }}
    />
  );
}

export function EmptySavedDesignsState({ onStartBuilding }: { onStartBuilding: () => void }) {
  return (
    <EmptyState
      variant="illustrated"
      icon={
        <svg
          className="h-8 w-8 text-[var(--color-muted)]"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
          />
        </svg>
      }
      title="No saved designs yet"
      description="Create and save your favorite harness combinations to easily reorder or share with friends."
      action={{
        label: 'Start designing',
        onClick: onStartBuilding,
      }}
    />
  );
}
