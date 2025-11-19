

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  variant?: 'default' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  showLabel?: boolean;
}

const progressVariants = {
  default: 'bg-[var(--color-primary)]',
  success: 'bg-[var(--color-success)]',
  warning: 'bg-yellow-500',
  danger: 'bg-red-500',
};

const sizeVariants = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

export const Progress = forwardRef<HTMLDivElement, ProgressProps>(
  (
    {
      className,
      value,
      max = 100,
      variant = 'default',
      size = 'md',
      animated = true,
      showLabel = false,
      ...props
    },
    ref,
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
    const ProgressBar = animated ? motion.div : 'div';

    return (
      <div className={cn('w-full space-y-2', className)} {...props}>
        {showLabel && (
          <div className="flex justify-between text-sm">
            <span className="text-[var(--color-foreground)]">Progress</span>
            <span className="text-[var(--color-muted)]">{Math.round(percentage)}%</span>
          </div>
        )}
        <div
          ref={ref}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          aria-label={`${Math.round(percentage)}% complete`}
          className={cn(
            'relative w-full overflow-hidden rounded-full bg-[var(--color-surface-muted)]',
            sizeVariants[size],
          )}
        >
          <ProgressBar
            className={cn('h-full transition-all duration-300 ease-out', progressVariants[variant])}
            style={{ width: `${percentage}%` }}
            {...(animated && {
              initial: { width: 0 },
              animate: { width: `${percentage}%` },
              transition: { duration: 0.5, ease: 'easeOut' },
            })}
          />
        </div>
      </div>
    );
  },
);

Progress.displayName = 'Progress';

// Builder-specific progress component
export function BuilderProgress({
  currentStep,
  totalSteps,
  className,
}: {
  currentStep: number;
  totalSteps: number;
  className?: string;
}) {
  const progress = ((currentStep + 1) / totalSteps) * 100;

  return (
    <Progress
      value={progress}
      variant="default"
      size="sm"
      showLabel
      className={className}
      aria-label={`Step ${currentStep + 1} of ${totalSteps}`}
    />
  );
}
