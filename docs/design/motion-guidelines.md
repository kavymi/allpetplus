# Motion Guidelines

## Overview

Motion in All Pet Plus should feel playful, purposeful, and respectful of user preferences. All animations follow the "Playful Modern" design system with consistent timing, easing, and reduced motion support.

## Core Principles

### 1. Purposeful Motion
- **Feedback**: Confirm user actions (button presses, form submissions)
- **Guidance**: Direct attention to important elements or changes
- **Continuity**: Maintain spatial relationships during transitions
- **Delight**: Add personality without overwhelming functionality

### 2. Performance First
- Prefer `transform` and `opacity` properties for smooth 60fps animations
- Use `will-change` sparingly and remove after animation completes
- Leverage hardware acceleration for complex animations
- Keep animation durations under 500ms for UI feedback

### 3. Accessibility
- Always respect `prefers-reduced-motion` user preference
- Provide static fallbacks for essential information
- Avoid animations that could trigger vestibular disorders
- Ensure animations don't interfere with screen readers

## Motion Tokens

### Duration
```css
:root {
  --transition-base: 200ms;
  --transition-fast: 150ms;
  --transition-slow: 300ms;
  --transition-page: 400ms;
}
```

### Easing Curves
```css
:root {
  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-in: cubic-bezier(0.4, 0, 1, 1);
  --ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-bounce: cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
```

### Spring Physics (for Framer Motion)
```typescript
const springConfig = {
  type: "spring",
  stiffness: 300,
  damping: 30,
  mass: 1
};

const gentleSpring = {
  type: "spring",
  stiffness: 200,
  damping: 25,
  mass: 0.8
};
```

## Component Patterns

### Button Interactions
```tsx
// Hover and tap feedback
<motion.button
  whileHover={{ y: -1, scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  transition={{ duration: 0.15, ease: "easeOut" }}
>
  Click me
</motion.button>
```

### Card Hover Effects
```tsx
// Subtle lift on hover
<motion.div
  whileHover={{ 
    y: -4, 
    boxShadow: "0 20px 40px -12px rgba(0,0,0,0.15)" 
  }}
  transition={{ duration: 0.2, ease: "easeOut" }}
>
  Card content
</motion.div>
```

### Page Transitions
```tsx
// Staggered entrance animations
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ 
    duration: 0.4, 
    ease: "easeOut",
    staggerChildren: 0.1 
  }}
>
  {children}
</motion.div>
```

### Loading States
```tsx
// Pulsing loader
<motion.div
  animate={{ 
    opacity: [0.5, 1, 0.5],
    scale: [1, 1.05, 1] 
  }}
  transition={{ 
    duration: 1.5, 
    repeat: Infinity, 
    ease: "easeInOut" 
  }}
/>
```

## Reduced Motion Support

### Implementation Pattern
```tsx
import { useReducedMotion } from 'framer-motion';

function AnimatedComponent() {
  const reduceMotion = useReducedMotion();
  
  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 20 }}
      animate={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      transition={reduceMotion ? undefined : { duration: 0.4 }}
    >
      Content
    </motion.div>
  );
}
```

### CSS Fallbacks
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Animation Categories

### Micro-interactions (0-200ms)
- Button hover/focus states
- Form field focus
- Toggle switches
- Checkbox/radio selections

### UI Feedback (200-300ms)
- Modal open/close
- Dropdown menus
- Toast notifications
- Loading spinners

### Content Transitions (300-500ms)
- Page navigation
- Tab switching
- Accordion expand/collapse
- Image galleries

### Ambient Animations (1s+)
- Background elements
- Floating particles
- Breathing effects
- Idle state animations

## Builder-Specific Motion

### Preview Updates
```tsx
// Smooth preview transitions when options change
<motion.div
  key={selectionHash}
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 1.05 }}
  transition={{ duration: 0.3, ease: "easeOut" }}
>
  <HarnessPreview />
</motion.div>
```

### Step Navigation
```tsx
// Progress indicator animation
<motion.div
  className="progress-bar"
  initial={{ width: 0 }}
  animate={{ width: `${(currentStep / totalSteps) * 100}%` }}
  transition={{ duration: 0.4, ease: "easeOut" }}
/>
```

### Option Selection
```tsx
// Highlight selected option
<motion.button
  layout
  animate={{
    backgroundColor: isSelected ? "rgba(59,175,218,0.12)" : "white",
    borderColor: isSelected ? "var(--color-primary)" : "var(--color-border)"
  }}
  transition={{ duration: 0.2 }}
>
  Option
</motion.button>
```

## Performance Guidelines

### Do's
- Use `transform` and `opacity` for animations
- Batch DOM updates with `layoutId` for shared element transitions
- Implement proper cleanup for infinite animations
- Test on lower-end devices

### Don'ts
- Animate `width`, `height`, or `top/left` properties
- Chain multiple sequential animations unnecessarily
- Use motion for decorative elements that don't add value
- Ignore reduced motion preferences

## Testing Motion

### Manual Testing
1. Test with `prefers-reduced-motion: reduce` enabled
2. Verify animations on 60Hz and 120Hz displays
3. Check performance on mobile devices
4. Ensure animations don't block user interactions

### Automated Testing
```typescript
// Test reduced motion fallbacks
test('respects reduced motion preference', () => {
  Object.defineProperty(window, 'matchMedia', {
    value: jest.fn(() => ({
      matches: true, // prefers-reduced-motion: reduce
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  });
  
  render(<AnimatedComponent />);
  // Assert static state is rendered
});
```

## Implementation Checklist

- [ ] All animations respect `prefers-reduced-motion`
- [ ] Motion tokens are used consistently
- [ ] Performance is tested on target devices
- [ ] Animations enhance rather than distract from content
- [ ] Loading states provide clear feedback
- [ ] Transitions maintain spatial relationships
- [ ] Interactive elements provide immediate feedback

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Web Animations API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API)
- [Reduced Motion Guidelines](https://web.dev/prefers-reduced-motion/)
- [Animation Performance](https://web.dev/animations-guide/)
