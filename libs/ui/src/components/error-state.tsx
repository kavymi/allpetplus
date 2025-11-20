'use client';

import { motion } from 'framer-motion';
import { cn } from '@pet/shared';

export interface ErrorStateProps {
  title?: string;
  message: string;
  variant?: 'default' | 'minimal' | 'inline';
  onRetry?: () => void;
  onGoBack?: () => void;
  className?: string;
  ButtonComponent?: React.ComponentType<{
    onClick: () => void;
    variant?: string;
    size?: string;
    className?: string;
    children: React.ReactNode;
  }>;
  AlertComponent?: React.ComponentType<{
    variant?: string;
    className?: string;
    children: React.ReactNode;
  }>;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  variant = 'default',
  onRetry,
  onGoBack,
  className,
  ButtonComponent,
  AlertComponent,
}: ErrorStateProps) {
  // Default button component
  const Button = ButtonComponent || (({ onClick, variant: buttonVariant, size, className: btnClassName, children }: {
    onClick: () => void;
    variant?: string;
    size?: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-colors',
        buttonVariant === 'outline'
          ? 'border border-[var(--color-border)] hover:bg-[var(--color-surface-muted)]'
          : buttonVariant === 'ghost'
          ? 'hover:bg-[var(--color-surface-muted)]'
          : 'bg-[var(--color-primary)] text-white hover:opacity-90',
        btnClassName
      )}
    >
      {children}
    </button>
  ));

  // Default alert component
  const Alert = AlertComponent || (({ variant: alertVariant, className: alertClassName, children }: {
    variant?: string;
    className?: string;
    children: React.ReactNode;
  }) => (
    <div
      className={cn(
        'p-4 rounded-lg border',
        alertVariant === 'danger'
          ? 'bg-red-50 border-red-200 text-red-800'
          : 'bg-[var(--color-surface-muted)] border-[var(--color-border)]',
        alertClassName
      )}
    >
      {children}
    </div>
  ));

  if (variant === 'inline') {
    return (
      <Alert variant="danger" className={className}>
        <div>{message}</div>
        {onRetry && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRetry}
            className="mt-2 h-auto p-0 text-red-700 hover:text-red-800"
          >
            Try again
          </Button>
        )}
      </Alert>
    );
  }

  if (variant === 'minimal') {
    return (
      <div className={cn('flex items-center justify-center p-4', className)}>
        <div className="text-center space-y-2">
          <p className="text-sm text-red-600">{message}</p>
          {onRetry && (
            <Button variant="ghost" size="sm" onClick={onRetry}>
              Try again
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className={cn('flex flex-col items-center justify-center text-center py-12 px-6', className)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="mb-4 flex items-center justify-center h-12 w-12 rounded-full bg-red-100"
      >
        <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-2 max-w-md"
      >
        <h3 className="text-lg font-semibold text-[var(--color-foreground)]">{title}</h3>
        <p className="text-sm text-[var(--color-muted)] leading-relaxed">{message}</p>
      </motion.div>

      {(onRetry || onGoBack) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="mt-6 flex flex-col gap-3 sm:flex-row sm:gap-4"
        >
          {onRetry && (
            <Button onClick={onRetry} size="md">
              Try again
            </Button>
          )}
          {onGoBack && (
            <Button variant="outline" onClick={onGoBack} size="md">
              Go back
            </Button>
          )}
        </motion.div>
      )}
    </motion.div>
  );
}

