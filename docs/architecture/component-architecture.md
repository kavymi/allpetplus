# Component Architecture Guide

## Overview

This document outlines the component architecture for the All Pet Plus frontend, including component hierarchy, data flow patterns, and best practices for building reusable UI components.

## Component Organization

### Directory Structure

```
apps/web/src/
├── app/                    # Next.js App Router pages
├── components/            
│   ├── ui/                # Base UI components (atoms)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── skeleton.tsx
│   ├── builder/           # Builder-specific components
│   │   ├── builder-shell.tsx
│   │   ├── preview-pane.tsx
│   │   ├── options-pane.tsx
│   │   └── step-navigation.tsx
│   ├── commerce/          # E-commerce components
│   │   ├── product-card.tsx
│   │   ├── price-display.tsx
│   │   └── add-to-cart.tsx
│   └── landing/           # Marketing page components
│       ├── hero-section.tsx
│       ├── feature-grid.tsx
│       └── testimonials.tsx
├── hooks/                 # Custom React hooks
├── lib/                   # Utilities and helpers
└── workers/              # Web Workers

```

## Component Hierarchy

### 1. Base UI Components (Atoms)

These are the foundational building blocks that follow the design system.

#### Button Component
```tsx
// components/ui/button.tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  fullWidth?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, fullWidth, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center font-medium transition-all duration-[var(--transition-base)]',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          {
            // Variants
            'bg-[var(--color-primary)] text-[var(--color-primary-foreground)] hover:bg-[var(--color-primary)]/90': variant === 'primary',
            'bg-[var(--color-secondary)] text-[var(--color-secondary-foreground)] hover:bg-[var(--color-secondary)]/90': variant === 'secondary',
            'bg-transparent hover:bg-[var(--color-surface-muted)]': variant === 'ghost',
            'bg-red-500 text-white hover:bg-red-600': variant === 'danger',
            // Sizes
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
            // States
            'w-full': fullWidth,
            'cursor-wait': loading,
          },
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <LoadingSpinner size={size} />
          </span>
        )}
        <span className={cn({ 'opacity-0': loading })}>{children}</span>
      </button>
    );
  }
);

Button.displayName = 'Button';
```

#### Card Component
```tsx
// components/ui/card.tsx
interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  interactive?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({ children, className, elevated = false, interactive = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'surface-card',
        {
          'shadow-[var(--shadow-elevated)]': elevated,
          'transition-transform hover:scale-[1.02] cursor-pointer': interactive,
          'p-0': padding === 'none',
          'p-4': padding === 'sm',
          'p-6': padding === 'md',
          'p-8': padding === 'lg',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
```

### 2. Builder Components (Molecules)

Complex components that compose multiple atoms and implement builder-specific logic.

#### Preview Pane
```tsx
// components/builder/preview-pane.tsx
'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { useBuilder } from './use-builder';
import { generatePreview } from '@/lib/preview-generator';
import type { BuilderSelection } from '@/lib/types';

interface PreviewPaneProps {
  selection: BuilderSelection;
  className?: string;
}

export function PreviewPane({ selection, className }: PreviewPaneProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>('');

  useEffect(() => {
    const generatePreviewImage = async () => {
      if (!canvasRef.current) return;
      
      setIsGenerating(true);
      try {
        const url = await generatePreview(selection, canvasRef.current);
        setPreviewUrl(url);
      } catch (error) {
        console.error('Preview generation failed:', error);
      } finally {
        setIsGenerating(false);
      }
    };

    // Debounce preview generation
    const timer = setTimeout(generatePreviewImage, 300);
    return () => clearTimeout(timer);
  }, [selection]);

  return (
    <Card className={cn('relative overflow-hidden', className)} padding="none">
      <div className="aspect-square relative bg-[var(--color-surface-muted)]">
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full hidden"
          width={800}
          height={800}
        />
        
        <AnimatePresence mode="wait">
          {isGenerating ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="text-center">
                <LoadingSpinner size="lg" />
                <p className="mt-2 text-sm text-[var(--color-muted)]">
                  Updating preview...
                </p>
              </div>
            </motion.div>
          ) : (
            <motion.img
              key={previewUrl}
              src={previewUrl}
              alt="Harness preview"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 w-full h-full object-contain"
            />
          )}
        </AnimatePresence>
        
        {/* Interaction hints */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between pointer-events-none">
          <Badge variant="secondary">
            {selection.size} Size
          </Badge>
          <Badge variant="secondary">
            360° View
          </Badge>
        </div>
      </div>
    </Card>
  );
}
```

#### Options Pane
```tsx
// components/builder/options-pane.tsx
interface OptionsPaneProps {
  step: BuilderStep;
  selection: BuilderSelection;
  updateSelection: (updates: Partial<BuilderSelection>) => void;
}

export function OptionsPane({ step, selection, updateSelection }: OptionsPaneProps) {
  const handleOptionSelect = (optionKey: string, value: any) => {
    updateSelection({ [optionKey]: value });
    
    // Track analytics
    trackEvent('builder_option_selected', {
      step: step.id,
      option: optionKey,
      value,
    });
  };

  return (
    <Card>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
          <p className="text-sm text-[var(--color-muted)]">{step.description}</p>
        </div>

        <div className="space-y-4">
          {step.options.map((option) => (
            <OptionGroup
              key={option.id}
              option={option}
              value={selection[option.id]}
              onChange={(value) => handleOptionSelect(option.id, value)}
              constraints={getConstraints(selection, option.id)}
            />
          ))}
        </div>

        {step.helpText && (
          <Alert variant="info">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>{step.helpText}</AlertDescription>
          </Alert>
        )}
      </div>
    </Card>
  );
}
```

### 3. Page Components (Organisms)

Full-featured components that represent entire sections or pages.

#### Builder Shell
```tsx
// components/builder/builder-shell.tsx
'use client';

import { useEffect, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BuilderStepNavigation } from './step-navigation';
import { BuilderPreviewPane } from './preview-pane';
import { BuilderOptionsPane } from './options-pane';
import { BuilderSummaryPane } from './summary-pane';
import { useBuilder } from './use-builder';
import { encodeSelection } from '@/lib/builder-utils';

export function BuilderShell({ configId, searchParams }: BuilderShellProps) {
  const router = useRouter();
  const currentParams = useSearchParams();
  
  const {
    currentStep,
    steps,
    selection,
    updateSelection,
    undo,
    redo,
    canUndo,
    canRedo,
    isHydrated,
  } = useBuilder({ configId, searchParams });

  // Sync URL with selection state
  useEffect(() => {
    if (!isHydrated) return;
    
    const encoded = encodeSelection(selection);
    const current = currentParams?.toString() ?? '';
    
    if (encoded !== current) {
      const next = encoded ? `?${encoded}` : '';
      router.replace(`/builder/${configId}${next}`, { scroll: false });
    }
  }, [configId, currentParams, isHydrated, router, selection]);

  if (!isHydrated) {
    return <BuilderSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      {/* Mobile-first responsive layout */}
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-24 pt-10 lg:flex-row lg:gap-8 lg:px-8">
        {/* Left Column: Steps & Options */}
        <div className="flex w-full flex-col gap-6 lg:max-w-[360px]">
          <BuilderStepNavigation
            steps={steps}
            currentStep={currentStep}
            onUndo={undo}
            onRedo={redo}
            canUndo={canUndo}
            canRedo={canRedo}
          />
          
          <BuilderOptionsPane
            step={steps[currentStep]}
            selection={selection}
            updateSelection={updateSelection}
          />
        </div>

        {/* Right Column: Preview & Summary */}
        <div className="flex w-full flex-col gap-6">
          <BuilderPreviewPane selection={selection} />
          
          {/* Desktop summary */}
          <div className="hidden lg:block">
            <BuilderSummaryPane selection={selection} />
          </div>
        </div>
      </div>

      {/* Mobile sticky summary */}
      <div className="sticky bottom-0 z-30 border-t border-[var(--color-border-strong)] bg-white/95 px-4 py-4 backdrop-blur sm:px-6 lg:hidden">
        <BuilderSummaryPane selection={selection} compact />
      </div>
    </div>
  );
}
```

## State Management Patterns

### 1. Zustand Store for Builder State

```typescript
// stores/builder-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

interface BuilderState {
  // State
  currentStep: number;
  selection: BuilderSelection;
  history: BuilderSelection[];
  historyIndex: number;
  
  // Actions
  updateSelection: (updates: Partial<BuilderSelection>) => void;
  nextStep: () => void;
  previousStep: () => void;
  undo: () => void;
  redo: () => void;
  reset: () => void;
}

export const useBuilderStore = create<BuilderState>()(
  persist(
    immer((set, get) => ({
      currentStep: 0,
      selection: getDefaultSelection(),
      history: [getDefaultSelection()],
      historyIndex: 0,

      updateSelection: (updates) => {
        set((state) => {
          // Update selection
          Object.assign(state.selection, updates);
          
          // Add to history
          const newHistory = state.history.slice(0, state.historyIndex + 1);
          newHistory.push({ ...state.selection });
          state.history = newHistory;
          state.historyIndex = newHistory.length - 1;
        });
      },

      nextStep: () => {
        set((state) => {
          if (state.currentStep < TOTAL_STEPS - 1) {
            state.currentStep += 1;
          }
        });
      },

      previousStep: () => {
        set((state) => {
          if (state.currentStep > 0) {
            state.currentStep -= 1;
          }
        });
      },

      undo: () => {
        set((state) => {
          if (state.historyIndex > 0) {
            state.historyIndex -= 1;
            state.selection = { ...state.history[state.historyIndex] };
          }
        });
      },

      redo: () => {
        set((state) => {
          if (state.historyIndex < state.history.length - 1) {
            state.historyIndex += 1;
            state.selection = { ...state.history[state.historyIndex] };
          }
        });
      },

      reset: () => {
        set(() => ({
          currentStep: 0,
          selection: getDefaultSelection(),
          history: [getDefaultSelection()],
          historyIndex: 0,
        }));
      },
    })),
    {
      name: 'harness-builder',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        selection: state.selection,
        currentStep: state.currentStep,
      }),
    }
  )
);
```

### 2. React Query for Server State

```typescript
// hooks/use-saved-designs.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';

export function useSavedDesigns() {
  return useQuery({
    queryKey: ['saved-designs'],
    queryFn: () => api.designs.list(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useSaveDesign() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (design: CreateDesignInput) => api.designs.create(design),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['saved-designs'] });
      toast.success('Design saved successfully!');
    },
    onError: (error) => {
      toast.error('Failed to save design. Please try again.');
      console.error('Save design error:', error);
    },
  });
}
```

## Component Patterns

### 1. Compound Components

```tsx
// components/ui/tabs.tsx
interface TabsContextValue {
  activeTab: string;
  setActiveTab: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

export function Tabs({ children, defaultValue }: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);
  
  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className="w-full">{children}</div>
    </TabsContext.Provider>
  );
}

export function TabsList({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex border-b border-[var(--color-border)]">
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children }: TabsTriggerProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsTrigger must be used within Tabs');
  
  const { activeTab, setActiveTab } = context;
  const isActive = activeTab === value;
  
  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        'px-4 py-2 font-medium transition-colors',
        isActive ? 'border-b-2 border-[var(--color-primary)]' : 'text-[var(--color-muted)]'
      )}
    >
      {children}
    </button>
  );
}

export function TabsContent({ value, children }: TabsContentProps) {
  const context = useContext(TabsContext);
  if (!context) throw new Error('TabsContent must be used within Tabs');
  
  if (context.activeTab !== value) return null;
  
  return <div className="py-4">{children}</div>;
}
```

### 2. Render Props Pattern

```tsx
// components/ui/intersection-observer.tsx
interface IntersectionObserverProps {
  children: (props: { isIntersecting: boolean; ref: RefObject<HTMLDivElement> }) => React.ReactNode;
  threshold?: number;
  rootMargin?: string;
}

export function IntersectionObserver({ 
  children, 
  threshold = 0.1, 
  rootMargin = '0px' 
}: IntersectionObserverProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setIsIntersecting(entry.isIntersecting),
      { threshold, rootMargin }
    );

    if (ref.current) observer.observe(ref.current);

    return () => {
      if (ref.current) observer.unobserve(ref.current);
    };
  }, [threshold, rootMargin]);

  return <>{children({ isIntersecting, ref })}</>;
}

// Usage
<IntersectionObserver>
  {({ isIntersecting, ref }) => (
    <div ref={ref} className={cn('transition-opacity', isIntersecting ? 'opacity-100' : 'opacity-0')}>
      Content appears on scroll
    </div>
  )}
</IntersectionObserver>
```

### 3. Higher-Order Components

```tsx
// components/hoc/with-auth.tsx
export function withAuth<P extends object>(
  Component: ComponentType<P>,
  options?: { redirectTo?: string }
) {
  return function WithAuthComponent(props: P) {
    const { isLoaded, isSignedIn } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (isLoaded && !isSignedIn) {
        router.push(options?.redirectTo ?? '/sign-in');
      }
    }, [isLoaded, isSignedIn, router]);

    if (!isLoaded) return <LoadingScreen />;
    if (!isSignedIn) return null;

    return <Component {...props} />;
  };
}

// Usage
const ProtectedPage = withAuth(AccountPage, { redirectTo: '/login' });
```

## Performance Optimization

### 1. Memoization

```tsx
// components/expensive-list.tsx
const ExpensiveListItem = memo(({ item, onSelect }: ListItemProps) => {
  // Expensive render logic
  return (
    <div onClick={() => onSelect(item.id)}>
      {/* Complex UI */}
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison
  return prevProps.item.id === nextProps.item.id && 
         prevProps.item.updatedAt === nextProps.item.updatedAt;
});
```

### 2. Code Splitting

```tsx
// Lazy load heavy components
const HeavyChart = dynamic(() => import('@/components/analytics/chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false, // Disable SSR for client-only components
});

// Route-based splitting happens automatically with App Router
```

### 3. Virtualization

```tsx
// components/virtual-list.tsx
import { useVirtualizer } from '@tanstack/react-virtual';

export function VirtualList({ items }: { items: any[] }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 100,
    overscan: 5,
  });

  return (
    <div ref={parentRef} className="h-[400px] overflow-auto">
      <div
        style={{
          height: `${virtualizer.getTotalSize()}px`,
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <div
            key={virtualItem.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: `${virtualItem.size}px`,
              transform: `translateY(${virtualItem.start}px)`,
            }}
          >
            <ListItem item={items[virtualItem.index]} />
          </div>
        ))}
      </div>
    </div>
  );
}
```

## Testing Components

### 1. Unit Testing

```tsx
// components/__tests__/button.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '../ui/button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('calls onClick handler', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    
    fireEvent.click(screen.getByText('Click'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    render(<Button loading>Submit</Button>);
    expect(screen.getByText('Submit')).toHaveClass('opacity-0');
  });
});
```

### 2. Integration Testing

```tsx
// components/__tests__/builder-shell.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BuilderShell } from '../builder/builder-shell';

describe('BuilderShell', () => {
  it('navigates through steps', async () => {
    const user = userEvent.setup();
    render(<BuilderShell configId="test" searchParams={{}} />);

    // Start at step 1
    expect(screen.getByText('Step 1: Choose Size')).toBeInTheDocument();

    // Select size and continue
    await user.click(screen.getByText('Medium'));
    await user.click(screen.getByText('Next'));

    // Should be at step 2
    await waitFor(() => {
      expect(screen.getByText('Step 2: Select Color')).toBeInTheDocument();
    });
  });
});
```

## Accessibility Patterns

### 1. Keyboard Navigation

```tsx
// components/ui/menu.tsx
export function Menu({ items }: MenuProps) {
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setFocusedIndex((prev) => Math.min(prev + 1, items.length - 1));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setFocusedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (focusedIndex >= 0) {
          items[focusedIndex].onSelect();
        }
        break;
    }
  };

  return (
    <div role="menu" onKeyDown={handleKeyDown}>
      {items.map((item, index) => (
        <MenuItem
          key={item.id}
          item={item}
          isFocused={index === focusedIndex}
          onFocus={() => setFocusedIndex(index)}
        />
      ))}
    </div>
  );
}
```

### 2. Screen Reader Support

```tsx
// components/ui/progress.tsx
export function Progress({ value, max = 100 }: ProgressProps) {
  const percentage = (value / max) * 100;

  return (
    <div
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-label={`${percentage.toFixed(0)}% complete`}
      className="relative h-4 w-full overflow-hidden rounded-full bg-[var(--color-surface-muted)]"
    >
      <div
        className="h-full bg-[var(--color-primary)] transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}
```

## Best Practices

1. **Component Naming**: Use PascalCase and descriptive names
2. **Props Interface**: Always define TypeScript interfaces for props
3. **Default Props**: Use default parameters instead of defaultProps
4. **Composition**: Prefer composition over inheritance
5. **Side Effects**: Keep components pure, use hooks for side effects
6. **Error Boundaries**: Wrap feature sections in error boundaries
7. **Loading States**: Always show loading feedback
8. **Empty States**: Design meaningful empty states
9. **Responsive Design**: Mobile-first approach
10. **Performance**: Measure and optimize render performance
