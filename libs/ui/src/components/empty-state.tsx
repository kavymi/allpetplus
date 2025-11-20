'use client';

import { motion } from 'framer-motion';
import { cn } from '@pet/shared';

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
  ButtonComponent?: React.ComponentType<{
    onClick: () => void;
    variant?: string;
    size?: string;
    children: React.ReactNode;
  }>;
}

export function EmptyState({
  title,
  description,
  icon,
  action,
  secondaryAction,
  className,
  variant = 'default',
  ButtonComponent,
}: EmptyStateProps) {
  // Default button component
  const Button = ButtonComponent || (({ onClick, variant: buttonVariant, size, children }: {
    onClick: () => void;
    variant?: string;
    size?: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        buttonVariant === 'outline'
          ? 'border border-[var(--color-border)] hover:bg-[var(--color-surface-muted)]'
          : 'bg-[var(--color-primary)] text-white hover:opacity-90'
      )}
    >
      {children}
    </button>
  ));

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

