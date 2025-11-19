

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from './button';
import { Alert, AlertDescription } from './alert';

export interface ErrorStateProps {
  title?: string;
  message: string;
  variant?: 'default' | 'minimal' | 'inline';
  onRetry?: () => void;
  onGoBack?: () => void;
  className?: string;
}

export function ErrorState({
  title = 'Something went wrong',
  message,
  variant = 'default',
  onRetry,
  onGoBack,
  className,
}: ErrorStateProps) {
  if (variant === 'inline') {
    return (
      <Alert variant="danger" className={className}>
        <AlertDescription>{message}</AlertDescription>
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

// Preset error states for common scenarios
export function NetworkErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      title="Connection problem"
      message="We're having trouble connecting to our servers. Please check your internet connection and try again."
      onRetry={onRetry}
    />
  );
}

export function NotFoundErrorState({ onGoHome }: { onGoHome: () => void }) {
  return (
    <ErrorState
      title="Page not found"
      message="The page you're looking for doesn't exist or has been moved."
      onGoBack={onGoHome}
    />
  );
}

export function BuilderErrorState({
  onRetry,
  onReset,
}: {
  onRetry: () => void;
  onReset: () => void;
}) {
  return (
    <ErrorState
      title="Builder error"
      message="Something went wrong while loading your harness design. You can try again or start over with a fresh design."
      onRetry={onRetry}
      onGoBack={onReset}
    />
  );
}

export function CartErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <ErrorState
      title="Cart unavailable"
      message="We're having trouble loading your cart. This might be a temporary issue with our payment system."
      onRetry={onRetry}
      variant="minimal"
    />
  );
}
