

import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'ghost' | 'filled';
  inputSize?: 'sm' | 'md' | 'lg';
  error?: boolean;
  helperText?: string;
  label?: string;
}

const inputVariants = {
  default:
    'border border-[color-mix(in_srgb,var(--color-border)75%,white)] bg-white focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20',
  ghost:
    'border-0 bg-[var(--color-surface-muted)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20',
  filled:
    'border-0 bg-[var(--color-primary-soft)] focus:bg-white focus:ring-2 focus:ring-[var(--color-primary)]/20',
};

const sizeVariants = {
  sm: 'h-8 px-3 text-sm',
  md: 'h-10 px-4 text-sm',
  lg: 'h-12 px-4 text-base',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { className, variant = 'default', inputSize = 'md', error, helperText, label, id, ...props },
    ref,
  ) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-semibold text-[var(--color-foreground)]"
          >
            {label}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={cn(
            'flex w-full rounded-2xl font-medium transition-all duration-[var(--transition-base)]',
            'placeholder:text-[var(--color-muted)] placeholder:font-normal',
            'focus:outline-none focus:ring-offset-0',
            'disabled:cursor-not-allowed disabled:opacity-50',
            inputVariants[variant],
            sizeVariants[inputSize],
            error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
            className,
          )}
          {...props}
        />
        {helperText && (
          <p className={cn('text-xs', error ? 'text-red-500' : 'text-[var(--color-muted)]')}>
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
    variant?: 'default' | 'ghost' | 'filled';
    error?: boolean;
    helperText?: string;
    label?: string;
  }
>(({ className, variant = 'default', error, helperText, label, id, ...props }, ref) => {
  const textareaId = id || `textarea-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="space-y-2">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-sm font-semibold text-[var(--color-foreground)]"
        >
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        ref={ref}
        className={cn(
          'flex min-h-[80px] w-full rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-[var(--transition-base)]',
          'placeholder:text-[var(--color-muted)] placeholder:font-normal',
          'focus:outline-none focus:ring-offset-0 resize-none',
          'disabled:cursor-not-allowed disabled:opacity-50',
          inputVariants[variant],
          error && 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
          className,
        )}
        {...props}
      />
      {helperText && (
        <p className={cn('text-xs', error ? 'text-red-500' : 'text-[var(--color-muted)]')}>
          {helperText}
        </p>
      )}
    </div>
  );
});

Textarea.displayName = 'Textarea';
