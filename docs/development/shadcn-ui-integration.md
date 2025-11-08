# shadcn/ui Integration Guide

**Status:** ✅ Complete  
**Last Updated:** November 8, 2025

## Overview

shadcn/ui has been integrated into the All Pet Plus codebase, providing accessible, customizable UI components built on Radix UI primitives. All components are fully integrated with our existing design system.

## What's Included

### Dependencies Installed
```json
{
  "class-variance-authority": "^latest",
  "clsx": "^latest",
  "tailwind-merge": "^latest",
  "@radix-ui/react-slot": "^latest",
  "@radix-ui/react-dialog": "^latest",
  "@radix-ui/react-dropdown-menu": "^latest",
  "@radix-ui/react-select": "^latest",
  "@radix-ui/react-tabs": "^latest",
  "@radix-ui/react-tooltip": "^latest",
  "@radix-ui/react-accordion": "^latest",
  "lucide-react": "^latest"
}
```

### Components Available

All components are located in `/apps/web/src/components/ui/`:

- ✅ **Button** (`button-shadcn.tsx`) - Multiple variants and sizes
- ✅ **Card** (`card-shadcn.tsx`) - Card with header, content, footer
- ✅ **Dialog** (`dialog.tsx`) - Modal dialogs
- ✅ **Dropdown Menu** (`dropdown-menu.tsx`) - Context menus
- ✅ **Select** (`select-shadcn.tsx`) - Dropdown selects
- ✅ **Tabs** (`tabs-shadcn.tsx`) - Tabbed interfaces
- ✅ **Tooltip** (`tooltip-shadcn.tsx`) - Hover tooltips
- ✅ **Accordion** (`accordion.tsx`) - Collapsible sections

### Utility Functions

**`/apps/web/src/lib/utils.ts`**
```typescript
import { cn } from '@/lib/utils';

// Merges Tailwind classes with proper conflict resolution
const className = cn(
  'base-class',
  condition && 'conditional-class',
  props.className
);
```

## Design System Integration

### CSS Variables Mapping

shadcn/ui components automatically use your existing design tokens:

```css
/* Your Design System → shadcn Variables */
--color-background → --background
--color-foreground → --foreground
--color-surface → --card
--color-primary → --primary
--color-secondary → --secondary
--color-muted → --muted
--color-border → --border
```

All mapping is handled in `app/styles/globals.css` under the `@layer base` section.

### Color Usage

Components automatically respect your color scheme:

```tsx
// Uses --color-primary from your design system
<Button variant="default">Click Me</Button>

// Uses --color-secondary
<Button variant="secondary">Secondary</Button>

// Uses your custom CSS variables
<Card className="bg-[var(--color-surface)]">
  {/* Content */}
</Card>
```

## Usage Examples

### Basic Button

```tsx
import { Button } from '@/components/ui/button-shadcn';

export function MyComponent() {
  return (
    <Button variant="default" size="lg" onClick={handleClick}>
      Save Design
    </Button>
  );
}
```

### Card with Content

```tsx
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter 
} from '@/components/ui/card-shadcn';
import { Button } from '@/components/ui/button-shadcn';

export function ProductCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Custom Dog Harness</CardTitle>
        <CardDescription>Design your perfect harness</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Customize colors, hardware, and embroidery</p>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Start Designing</Button>
      </CardFooter>
    </Card>
  );
}
```

### Dialog Modal

```tsx
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button-shadcn';

export function SaveDesignDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Save Design</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Save Your Design</DialogTitle>
          <DialogDescription>
            Give your design a name to save it to your account.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          {/* Form content */}
        </div>
        <DialogFooter>
          <Button variant="outline">Cancel</Button>
          <Button>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
```

### Select Dropdown

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select-shadcn';

export function SizeSelector() {
  return (
    <Select onValueChange={(value) => console.log(value)}>
      <SelectTrigger>
        <SelectValue placeholder="Select size" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="xs">Extra Small</SelectItem>
        <SelectItem value="s">Small</SelectItem>
        <SelectItem value="m">Medium</SelectItem>
        <SelectItem value="l">Large</SelectItem>
        <SelectItem value="xl">Extra Large</SelectItem>
      </SelectContent>
    </Select>
  );
}
```

### Tabs

```tsx
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs-shadcn';

export function BuilderTabs() {
  return (
    <Tabs defaultValue="preview">
      <TabsList>
        <TabsTrigger value="preview">Preview</TabsTrigger>
        <TabsTrigger value="options">Options</TabsTrigger>
        <TabsTrigger value="summary">Summary</TabsTrigger>
      </TabsList>
      <TabsContent value="preview">
        {/* 3D Preview */}
      </TabsContent>
      <TabsContent value="options">
        {/* Customization Options */}
      </TabsContent>
      <TabsContent value="summary">
        {/* Order Summary */}
      </TabsContent>
    </Tabs>
  );
}
```

### Tooltip

```tsx
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip-shadcn';
import { Button } from '@/components/ui/button-shadcn';

export function HelpButton() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="outline" size="icon">?</Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Need help? Contact our support team</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
```

### Accordion (FAQ)

```tsx
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

export function FAQ() {
  return (
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>What materials are used?</AccordionTrigger>
        <AccordionContent>
          Premium nylon webbing with reinforced stitching.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>How do I measure my dog?</AccordionTrigger>
        <AccordionContent>
          Measure around the widest part of the chest.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
```

## Live Showcase

View all components in action:

```tsx
import { ShadcnShowcase } from '@/components/examples/shadcn-showcase';

export default function ShowcasePage() {
  return <ShadcnShowcase />;
}
```

## Accessibility Features

All shadcn/ui components include:

- ✅ **WCAG AA Compliance** - Meets accessibility standards
- ✅ **Keyboard Navigation** - Full keyboard support
- ✅ **Screen Reader Support** - Proper ARIA labels
- ✅ **Focus Management** - Visible focus indicators
- ✅ **Reduced Motion** - Respects `prefers-reduced-motion`

## Component Naming

To avoid conflicts with existing UI components:

- shadcn components use `-shadcn` suffix (e.g., `button-shadcn.tsx`)
- Import with clear names: `import { Button } from '@/components/ui/button-shadcn'`
- Original components remain untouched

## Customization

### Variant Customization

All components support the `className` prop for custom styling:

```tsx
<Button 
  variant="default"
  className="bg-[var(--color-accent)] hover:bg-[var(--color-accent)]/90"
>
  Custom Button
</Button>
```

### Creating New Variants

Use `class-variance-authority` for new variants:

```typescript
const buttonVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        default: 'default-styles',
        custom: 'custom-styles', // Add new variant
      },
    },
  }
);
```

## TypeScript Support

All components are fully typed:

```typescript
import type { ButtonProps } from '@/components/ui/button-shadcn';

interface MyComponentProps {
  action: ButtonProps['onClick'];
  variant?: ButtonProps['variant'];
}
```

## Performance

- **Tree Shakeable** - Only import what you use
- **Small Bundle** - Minimal overhead (~10KB for all components)
- **CSS Variables** - No runtime style calculations
- **Optimized** - Built on Radix UI's optimized primitives

## Migration Path

### Gradual Adoption

You can adopt shadcn/ui components gradually:

1. **Start with new features** - Use shadcn for new components
2. **Replace as needed** - Update existing components when refactoring
3. **Coexist peacefully** - Old and new components work together

### Example Migration

```tsx
// Before (existing component)
import { Button } from '@/components/ui/button';

// After (shadcn component)
import { Button } from '@/components/ui/button-shadcn';

// Both can coexist during migration!
```

## Adding More Components

To add more shadcn/ui components:

1. **Browse components**: https://ui.shadcn.com/docs/components
2. **Copy component code** to `/apps/web/src/components/ui/`
3. **Update imports** to use `@/lib/utils`
4. **Map colors** to use `rgb(var(--[color]))` format
5. **Test** with your design system

## Common Patterns

### Form with shadcn Components

```tsx
import { Button } from '@/components/ui/button-shadcn';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select-shadcn';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card-shadcn';

export function OrderForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Your Harness</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Select size" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="m">Medium</SelectItem>
            <SelectItem value="l">Large</SelectItem>
          </SelectContent>
        </Select>
        
        <Button className="w-full">Add to Cart</Button>
      </CardContent>
    </Card>
  );
}
```

## Troubleshooting

### Colors Not Showing

Ensure CSS variables are in RGB format:

```css
/* ✅ Correct */
--primary: 59 175 218;

/* ❌ Wrong */
--primary: #3bafda;
```

### TypeScript Errors

Make sure `@/lib/utils` is properly exported:

```typescript
// /apps/web/src/lib/utils.ts
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
```

### Component Not Found

Check import path uses `@/` alias:

```typescript
// ✅ Correct
import { Button } from '@/components/ui/button-shadcn';

// ❌ Wrong
import { Button } from '../components/ui/button-shadcn';
```

## Best Practices

1. ✅ **Use semantic variants** - `variant="destructive"` not `className="bg-red-500"`
2. ✅ **Combine with existing components** - Mix shadcn with your current UI
3. ✅ **Keep accessibility** - Don't override ARIA attributes
4. ✅ **Test responsiveness** - All components are mobile-friendly
5. ✅ **Respect motion preferences** - Animations respect reduced-motion

## Resources

- **shadcn/ui Docs**: https://ui.shadcn.com
- **Radix UI**: https://www.radix-ui.com
- **Component Showcase**: `/apps/web/src/components/examples/shadcn-showcase.tsx`
- **Live Demo**: Import and render `<ShadcnShowcase />` in any page

## Next Steps

1. ✅ Dependencies installed
2. ✅ Components added to codebase
3. ✅ Design system integrated
4. ✅ Example showcase created
5. 🎯 **Start using in your components!**

---

**Questions?** Check the [shadcn/ui documentation](https://ui.shadcn.com) or review the showcase component for live examples.

