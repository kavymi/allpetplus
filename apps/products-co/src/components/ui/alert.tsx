

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  animated?: boolean;
}

const alertVariants = {
  default:
    'bg-[var(--color-surface-muted)] border-[var(--color-border)] text-[var(--color-foreground)]',
  success:
    'bg-[var(--color-success-soft)] border-[var(--color-success)]/20 text-[var(--color-success)]',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  danger: 'bg-red-50 border-red-200 text-red-800',
  info: 'bg-[var(--color-primary-soft)] border-[var(--color-primary)]/20 text-[var(--color-primary)]',
};

export const Alert = forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = 'default', animated = true, children, ...props }, ref) => {
    const AlertComponent = animated ? motion.div : 'div';
    const motionProps = animated
      ? {
          initial: { opacity: 0, y: -10 },
          animate: { opacity: 1, y: 0 },
          exit: { opacity: 0, y: -10 },
          transition: { duration: 0.2, ease: 'easeOut' },
        }
      : {};

    return (
      // @ts-expect-error - Dynamic component type causes prop conflicts between motion.div and div
      <AlertComponent
        {...(animated ? {} : { ref })}
        role="alert"
        className={cn(
          'relative w-full rounded-2xl border px-4 py-3 text-sm font-medium',
          alertVariants[variant],
          className,
        )}
        {...motionProps}
        {...props}
      >
        {children}
      </AlertComponent>
    );
  },
);

Alert.displayName = 'Alert';

export const AlertTitle = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));

AlertTitle.displayName = 'AlertTitle';

export const AlertDescription = forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('text-sm opacity-90', className)} {...props} />
));

AlertDescription.displayName = 'AlertDescription';
