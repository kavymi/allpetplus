# shadcn/ui Quick Reference

## Quick Imports

```tsx
// Button
import { Button } from '@/components/ui/button-shadcn';

// Card
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card-shadcn';

// Dialog
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Dropdown Menu
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

// Select
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select-shadcn';

// Tabs
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs-shadcn';

// Tooltip
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip-shadcn';

// Accordion
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

// Utility
import { cn } from '@/lib/utils';
```

## Quick Examples

### Button Variants
```tsx
<Button variant="default">Default</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Button Sizes
```tsx
<Button size="default">Default</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button size="icon"><Icon /></Button>
```

### Simple Dialog
```tsx
<Dialog>
  <DialogTrigger asChild>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Title</DialogTitle>
      <DialogDescription>Description</DialogDescription>
    </DialogHeader>
    {/* Content */}
    <DialogFooter>
      <Button>Action</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Simple Select
```tsx
<Select onValueChange={setValue}>
  <SelectTrigger>
    <SelectValue placeholder="Choose..." />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="1">Option 1</SelectItem>
    <SelectItem value="2">Option 2</SelectItem>
  </SelectContent>
</Select>
```

### Simple Card
```tsx
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
  <CardFooter>
    <Button>Action</Button>
  </CardFooter>
</Card>
```

## Color Mapping

Your design system colors automatically work:

| Your Variable | shadcn Variable | Usage |
|---------------|----------------|-------|
| `--color-background` | `--background` | Page backgrounds |
| `--color-foreground` | `--foreground` | Text color |
| `--color-surface` | `--card` | Card backgrounds |
| `--color-primary` | `--primary` | Primary buttons |
| `--color-secondary` | `--secondary` | Secondary buttons |
| `--color-border` | `--border` | Border colors |

## Pro Tips

1. **Use `cn()` for conditional classes:**
   ```tsx
   <Button className={cn("base-class", isActive && "active-class")}>
   ```

2. **Combine with existing variables:**
   ```tsx
   <Card className="bg-[var(--color-surface)]">
   ```

3. **Custom variants are easy:**
   ```tsx
   <Button variant="default" className="bg-[var(--color-accent)]">
   ```

4. **All components are accessible** - keyboard navigation works out of the box

5. **Components are responsive** - work on mobile without extra work

## Common Patterns

### Form with Select
```tsx
<div className="space-y-4">
  <Select onValueChange={setSize}>
    <SelectTrigger>
      <SelectValue placeholder="Select size" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="m">Medium</SelectItem>
      <SelectItem value="l">Large</SelectItem>
    </SelectContent>
  </Select>
  <Button className="w-full">Submit</Button>
</div>
```

### Confirmation Dialog
```tsx
const [open, setOpen] = useState(false);

<Dialog open={open} onOpenChange={setOpen}>
  <DialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Are you sure?</DialogTitle>
      <DialogDescription>This action cannot be undone.</DialogDescription>
    </DialogHeader>
    <DialogFooter>
      <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
      <Button variant="destructive" onClick={handleDelete}>Delete</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

### Dropdown Menu
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">Menu</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Actions</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuItem>Duplicate</DropdownMenuItem>
    <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

## See Full Guide

📖 Complete documentation: `/docs/development/shadcn-ui-integration.md`

🎨 Live examples: `/apps/web/src/components/examples/shadcn-showcase.tsx`

