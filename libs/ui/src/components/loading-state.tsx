'use client';

import { motion } from 'framer-motion';
import { cn } from '@pet/shared';

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

