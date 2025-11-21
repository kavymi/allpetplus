# shadcn/ui Integration Guide

**Last Updated:** November 21, 2025  
**Status:** Complete  
**Migration:** From custom components to shadcn/ui primitives

> 🎨 **Accessible, customizable UI components built on Radix UI**

---

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Available Components](#available-components)
4. [Usage Examples](#usage-examples)
5. [Customization](#customization)
6. [Migration from Custom Components](#migration-from-custom-components)
7. [Best Practices](#best-practices)
8. [Troubleshooting](#troubleshooting)

---

## Overview

shadcn/ui provides beautifully designed, accessible components that you can copy directly into your project. Built on top of Radix UI primitives and styled with Tailwind CSS.

### Why shadcn/ui?

- ✅ **Accessibility first** - WCAG compliant out of the box
- ✅ **Full control** - Components live in your codebase
- ✅ **Customizable** - Modify to match your design system
- ✅ **TypeScript** - Fully typed components
- ✅ **Radix UI** - Battle-tested primitives
- ✅ **Tailwind CSS v4** - Modern styling

### What's Installed

| Component | Status | Location | Purpose |
|-----------|--------|----------|---------|
| Button | ✅ | `components/ui/button.tsx` | Buttons with variants |
| Card | ✅ | `components/ui/card.tsx` | Content containers |
| Dialog | ✅ | `components/ui/dialog.tsx` | Modals and dialogs |
| Dropdown Menu | ✅ | `components/ui/dropdown-menu.tsx` | Context menus |
| Form | ✅ | `components/ui/form.tsx` | Form handling with validation |
| Input | ✅ | `components/ui/input.tsx` | Text inputs |
| Label | ✅ | `components/ui/label.tsx` | Form labels |
| Select | ✅ | `components/ui/select.tsx` | Dropdown selects |
| Tabs | ✅ | `components/ui/tabs.tsx` | Tabbed interfaces |
| Toast | ✅ | `components/ui/toast.tsx` | Notifications |
| Tooltip | ✅ | `components/ui/tooltip.tsx` | Hover tooltips |

---

## Installation

### Initial Setup (✅ Complete)

```bash
# shadcn/ui CLI was used to initialize
npx shadcn@latest init

# Components were added individually
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
# ... etc
```

### Adding New Components

```bash
# Browse available components
npx shadcn@latest add

# Add specific component
npx shadcn@latest add [component-name]

# Example
npx shadcn@latest add accordion
```

### Configuration

**Location:** `apps/web/components.json`

```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.ts",
    "css": "src/app/globals.css",
    "baseColor": "slate",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  }
}
```

---

## Available Components

### Button

**Variants:** default, destructive, outline, secondary, ghost, link

```typescript
import { Button } from '@/components/ui/button';

// Usage
<Button variant="default">Click me</Button>
<Button variant="outline" size="lg">Large Outline</Button>
<Button variant="destructive">Delete</Button>
<Button variant="ghost">Ghost Button</Button>
```

**Sizes:** sm, default, lg, icon

### Card

**Components:** Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter

```typescript
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

<Card>
  <CardHeader>
    <CardTitle>Card Title</CardTitle>
    <CardDescription>Card description goes here</CardDescription>
  </CardHeader>
  <CardContent>
    Main content
  </CardContent>
  <CardFooter>
    Footer content
  </CardFooter>
</Card>
```

### Dialog (Modal)

```typescript
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

<Dialog>
  <DialogTrigger asChild>
    <Button>Open Dialog</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Dialog Title</DialogTitle>
      <DialogDescription>
        Dialog description and content
      </DialogDescription>
    </DialogHeader>
    {/* Dialog content */}
  </DialogContent>
</Dialog>
```

### Form (with React Hook Form + Zod)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
});

export function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormDescription>
                Your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
```

### Select

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

<Select onValueChange={(value) => console.log(value)}>
  <SelectTrigger className="w-[180px]">
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
```

### Tabs

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">
    Account settings content
  </TabsContent>
  <TabsContent value="password">
    Password settings content
  </TabsContent>
</Tabs>
```

### Toast (Notifications)

```typescript
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';

export function ToastExample() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        toast({
          title: 'Success!',
          description: 'Your changes have been saved.',
          variant: 'default',
        });
      }}
    >
      Show Toast
    </Button>
  );
}

// Add Toaster to root layout
import { Toaster } from '@/components/ui/toaster';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
```

---

## Usage Examples

### Builder Options Pane

```typescript
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

export function BuilderOptions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Customize Your Harness</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="size">Size</Label>
          <Select onValueChange={(value) => updateSize(value)}>
            <SelectTrigger id="size">
              <SelectValue placeholder="Select size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="xs">Extra Small</SelectItem>
              <SelectItem value="s">Small</SelectItem>
              <SelectItem value="m">Medium</SelectItem>
              <SelectItem value="l">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <Button className="w-full" onClick={handleAddToCart}>
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
}
```

### Dashboard Layout

```typescript
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function Dashboard() {
  return (
    <Tabs defaultValue="designs" className="space-y-4">
      <TabsList>
        <TabsTrigger value="designs">My Designs</TabsTrigger>
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="pets">My Pets</TabsTrigger>
      </TabsList>
      
      <TabsContent value="designs" className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle>Saved Designs</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Design grid */}
          </CardContent>
        </Card>
      </TabsContent>
      
      {/* Other tabs */}
    </Tabs>
  );
}
```

### Confirmation Dialog

```typescript
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

export function DeleteDesignDialog() {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            design.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
```

---

## Customization

### Theming with CSS Variables

**Location:** `apps/web/src/app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* shadcn/ui variables */
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 222.2 47.4% 11.2%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96.1%;
    --secondary-foreground: 222.2 47.4% 11.2%;
    --muted: 210 40% 96.1%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96.1%;
    --accent-foreground: 222.2 47.4% 11.2%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 222.2 84% 4.9%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... dark mode variables */
  }
}
```

### Modifying Component Styles

Components are in your codebase, so you can modify them directly:

```typescript
// apps/web/src/components/ui/button.tsx

// Add new variant
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        // Add custom variant
        brand: "bg-gradient-to-r from-blue-500 to-purple-500 text-white",
      },
    },
  }
);
```

---

## Migration from Custom Components

### Migration Status

| Custom Component | shadcn Replacement | Status | Notes |
|------------------|-------------------|--------|-------|
| `CustomButton` | `Button` | ✅ Complete | Updated all usages |
| `CustomCard` | `Card` | ✅ Complete | Better accessibility |
| `CustomModal` | `Dialog` | ✅ Complete | Radix primitives |
| `CustomSelect` | `Select` | ✅ Complete | Keyboard navigation |
| `CustomTabs` | `Tabs` | ✅ Complete | ARIA compliant |
| `CustomToast` | `Toast` | ✅ Complete | Better UX |

### Migration Steps

1. **Install shadcn component**
   ```bash
   npx shadcn@latest add button
   ```

2. **Update imports**
   ```typescript
   // Before
   import { CustomButton } from '@/components/custom/button';
   
   // After
   import { Button } from '@/components/ui/button';
   ```

3. **Update props**
   ```typescript
   // Before
   <CustomButton color="primary" onClick={handleClick}>
     Click me
   </CustomButton>
   
   // After
   <Button variant="default" onClick={handleClick}>
     Click me
   </Button>
   ```

4. **Test thoroughly**
   - Verify visual appearance
   - Test accessibility (keyboard, screen readers)
   - Check mobile responsiveness

---

## Best Practices

### 1. Always Use TypeScript

```typescript
import { Button } from '@/components/ui/button';
import type { ButtonProps } from '@/components/ui/button';

// Extend button props
interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
}

export function CustomButton({ loading, children, ...props }: CustomButtonProps) {
  return (
    <Button disabled={loading} {...props}>
      {loading ? 'Loading...' : children}
    </Button>
  );
}
```

### 2. Composition Over Modification

```typescript
// ✅ Good: Compose new components
export function PrimaryButton(props: ButtonProps) {
  return <Button variant="default" className="bg-primary" {...props} />;
}

// ❌ Bad: Modifying component file directly
// Avoid editing ui/button.tsx unless absolutely necessary
```

### 3. Accessibility First

```typescript
// ✅ Always provide labels
<Button aria-label="Close dialog" onClick={onClose}>
  <X className="h-4 w-4" />
</Button>

// ✅ Use semantic HTML
<AlertDialog>
  <AlertDialogContent>
    <AlertDialogTitle>Delete Account</AlertDialogTitle>
    {/* Proper heading hierarchy */}
  </AlertDialogContent>
</AlertDialog>
```

### 4. Consistent Styling

```typescript
// Use Tailwind classes consistently
<Card className="p-6 space-y-4">
  <CardTitle>Title</CardTitle>
  <CardContent className="space-y-2">
    {/* Content */}
  </CardContent>
</Card>
```

---

## Troubleshooting

### Component Not Found

```bash
# Error: Module not found: Can't resolve '@/components/ui/button'

# Solution: Add the component
npx shadcn@latest add button
```

### Styling Not Applied

**Issue:** Component styles not showing

**Solution:** Ensure Tailwind is configured correctly

```typescript
// tailwind.config.ts
export default {
  content: [
    './src/pages/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}',
    './src/app/**/*.{ts,tsx}',
  ],
  // ...
};
```

### TypeScript Errors

**Issue:** Type errors after installing component

**Solution:** Restart TypeScript server in VS Code

```
Cmd+Shift+P → "TypeScript: Restart TS Server"
```

### Dark Mode Not Working

**Issue:** Dark mode styles not applying

**Solution:** Add dark mode class to html element

```typescript
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
```

---

## Quick Reference

### Installation Commands

```bash
# Initialize shadcn/ui
npx shadcn@latest init

# Add components
npx shadcn@latest add button card dialog form input label select tabs toast

# Add all components
npx shadcn@latest add
```

### Common Imports

```typescript
// UI Components
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

// Utilities
import { cn } from '@/lib/utils';
```

### Utility Function

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Usage
<Button className={cn('custom-class', isActive && 'active-class')}>
  Click me
</Button>
```

---

## Related Documentation

- [shadcn/ui Official Docs](https://ui.shadcn.com/)
- [Radix UI Documentation](https://www.radix-ui.com/)
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Component Architecture](/docs/architecture/component-architecture.md)
- [Design System](/docs/design/design-system-implementation.md)

---

**Last Updated:** November 21, 2025  
**Migration Status:** Complete  
**Components Installed:** 11  
**Next Steps:** Add more components as needed

