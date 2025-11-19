

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface LoadingStateProps {
  message?: string;
  variant?: 'default' | 'minimal' | 'dots' | 'pulse';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingState({
  message = 'Loading...',
  variant = 'default',
  size = 'md',
  className,
}: LoadingStateProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8',
  };

  if (variant === 'dots') {
    return (
      <div className={cn('flex items-center justify-center space-x-1', className)}>
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className={cn(
              'rounded-full bg-[var(--color-primary)]',
              size === 'sm' ? 'h-1.5 w-1.5' : size === 'md' ? 'h-2 w-2' : 'h-2.5 w-2.5',
            )}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
        {message && <span className="ml-3 text-sm text-[var(--color-muted)]">{message}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
        <motion.div
          className={cn('rounded-full bg-[var(--color-primary)]/20', sizeClasses[size])}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
        {message && <p className="text-sm text-[var(--color-muted)]">{message}</p>}
      </div>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-center', className)}>
        <motion.div
          className={cn(
            'border-2 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full',
            sizeClasses[size],
          )}
          animate={{ rotate: 360 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    );
  }

  // Default variant
  return (
    <div className={cn('flex flex-col items-center justify-center space-y-4 py-8', className)}>
      <motion.div
        className={cn(
          'border-2 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full',
          sizeClasses[size],
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <p className="text-sm text-[var(--color-muted)]">{message}</p>
    </div>
  );
}

// Preset loading states for common scenarios
export function BuilderLoadingState() {
  return (
    <div className="mx-auto flex min-h-[70svh] max-w-5xl items-center justify-center p-10">
      <LoadingState message="Rehydrating your perfect harness..." variant="dots" size="md" />
    </div>
  );
}

export function CatalogLoadingState() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="overflow-hidden rounded-[30px] border border-[color-mix(in_srgb,var(--color-border)80%,white)] bg-white/90"
        >
          <div className="aspect-square bg-[var(--color-surface-muted)] animate-pulse" />
          <div className="p-5 space-y-3">
            <div className="h-4 bg-[var(--color-surface-muted)] rounded animate-pulse" />
            <div className="h-3 bg-[var(--color-surface-muted)] rounded w-2/3 animate-pulse" />
            <div className="h-12 bg-[var(--color-surface-muted)] rounded animate-pulse" />
            <div className="flex gap-2">
              <div className="h-6 bg-[var(--color-surface-muted)] rounded-full w-16 animate-pulse" />
              <div className="h-6 bg-[var(--color-surface-muted)] rounded-full w-20 animate-pulse" />
            </div>
            <div className="flex gap-3">
              <div className="h-10 bg-[var(--color-surface-muted)] rounded-full flex-1 animate-pulse" />
              <div className="h-10 bg-[var(--color-surface-muted)] rounded-full flex-1 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function CartLoadingState() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="flex items-center space-x-4 p-4 border border-[var(--color-border)] rounded-2xl"
        >
          <div className="h-16 w-16 bg-[var(--color-surface-muted)] rounded-xl animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-[var(--color-surface-muted)] rounded w-3/4 animate-pulse" />
            <div className="h-3 bg-[var(--color-surface-muted)] rounded w-1/2 animate-pulse" />
          </div>
          <div className="h-4 bg-[var(--color-surface-muted)] rounded w-16 animate-pulse" />
        </div>
      ))}
    </div>
  );
}
