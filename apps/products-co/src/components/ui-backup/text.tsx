/**
 * Typography Components
 * Semantic text components with proper font families and styles
 */

import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

// Heading component
interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  variant?: 'display' | 'heading';
  balance?: boolean;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ as: Component = 'h2', variant = 'heading', balance, className, children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          'font-[family-name:var(--font-jakarta)] font-bold tracking-tight',
          balance && 'text-balance',
          variant === 'display' && 'font-extrabold',
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

Heading.displayName = 'Heading';

// Display text (extra large headings)
export const Display = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <h1
        ref={ref}
        className={cn(
          'font-[family-name:var(--font-jakarta)] text-5xl font-extrabold tracking-tight text-balance sm:text-6xl lg:text-7xl',
          className,
        )}
        {...props}
      >
        {children}
      </h1>
    );
  },
);

Display.displayName = 'Display';

// Body text component
interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  size?: 'sm' | 'base' | 'lg';
  weight?: 'light' | 'regular' | 'medium' | 'semibold';
  muted?: boolean;
  pretty?: boolean;
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ size = 'base', weight = 'regular', muted, pretty, className, children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
    };

    const weightClasses = {
      light: 'font-light',
      regular: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
    };

    return (
      <p
        ref={ref}
        className={cn(
          'font-[family-name:var(--font-inter)]',
          sizeClasses[size],
          weightClasses[weight],
          muted && 'text-[var(--color-muted)]',
          pretty && 'text-pretty',
          className,
        )}
        {...props}
      >
        {children}
      </p>
    );
  },
);

Text.displayName = 'Text';

// Label component
interface LabelProps extends HTMLAttributes<HTMLLabelElement> {
  size?: 'sm' | 'base' | 'lg';
  htmlFor?: string;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ size = 'base', className, children, ...props }, ref) => {
    const sizeClasses = {
      sm: 'text-xs',
      base: 'text-sm',
      lg: 'text-base',
    };

    return (
      <label
        ref={ref}
        className={cn(
          'font-[family-name:var(--font-inter)] font-medium text-[var(--color-foreground)]',
          sizeClasses[size],
          className,
        )}
        {...props}
      >
        {children}
      </label>
    );
  },
);

Label.displayName = 'Label';

// Code/Mono text component
export const Code = forwardRef<HTMLElement, HTMLAttributes<HTMLElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <code
        ref={ref}
        className={cn(
          'font-[family-name:var(--font-mono)] rounded bg-[var(--color-surface-muted)] px-1.5 py-0.5 text-sm',
          className,
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
);

Code.displayName = 'Code';

// Gradient text component
export const GradientText = forwardRef<HTMLSpanElement, HTMLAttributes<HTMLSpanElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          'bg-gradient-to-r from-[var(--color-primary)] via-[var(--color-secondary)] to-[var(--color-accent)] bg-clip-text text-transparent',
          className,
        )}
        {...props}
      >
        {children}
      </span>
    );
  },
);

GradientText.displayName = 'GradientText';

