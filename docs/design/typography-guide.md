# 🔤 Typography Guide - All Pet Plus

## Font Stack

We use a carefully curated font pairing optimized for readability, performance, and brand personality.

### **Primary Fonts**

#### **1. Inter** (Body Text)
- **Usage**: Body text, UI elements, forms, buttons
- **Why**: Excellent readability at all sizes, optimized for screens
- **Weights**: 300 (Light), 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold)
- **Features**: OpenType features for improved legibility

```tsx
// Automatic for body text
<p>This uses Inter automatically</p>

// Explicit usage
<p className="font-[family-name:var(--font-inter)]">Body text</p>
```

#### **2. Plus Jakarta Sans** (Display/Headings)
- **Usage**: Headings, titles, hero text, marketing copy
- **Why**: Friendly, modern, playful personality perfect for pet products
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold), 800 (Extrabold)
- **Features**: Geometric with rounded terminals for warmth

```tsx
// Automatic for headings
<h1>This uses Plus Jakarta Sans</h1>

// Explicit usage
<h2 className="font-[family-name:var(--font-jakarta)]">Display heading</h2>
```

#### **3. JetBrains Mono** (Code/Technical)
- **Usage**: Code snippets, technical documentation, order numbers
- **Why**: Excellent ligatures, clear distinction between similar characters
- **Weights**: 400 (Regular), 500 (Medium), 600 (Semibold), 700 (Bold)
- **Features**: Programming ligatures, increased height for better readability

```tsx
<code className="font-[family-name:var(--font-mono)]">ORDER_12345</code>
```

---

## Typography Components

### **Semantic Components**

We provide React components for consistent typography:

```tsx
import { Heading, Display, Text, Label, Code, GradientText } from '@/components/ui/text';

// Display (extra large hero text)
<Display>Build Your Dream Harness</Display>

// Headings (h1-h6)
<Heading as="h1">Welcome to All Pet Plus</Heading>
<Heading as="h2" balance>Find the Perfect Fit</Heading>

// Body text
<Text size="lg">Large body text for emphasis</Text>
<Text muted pretty>Secondary information with better wrapping</Text>

// Labels
<Label htmlFor="name">Dog's Name</Label>

// Code
<Code>ORDER_12345</Code>

// Gradient text (for special emphasis)
<GradientText>Limited Time Offer</GradientText>
```

---

## Typography Scale

### **Modular Scale (1.25 ratio)**

| Name | Size | Usage |
|------|------|-------|
| `xs` | 12px | Fine print, captions |
| `sm` | 14px | Secondary text, labels |
| `base` | 16px | Body text (default) |
| `lg` | 18px | Emphasized body text |
| `xl` | 20px | Large UI text |
| `2xl` | 24px | Section headings |
| `3xl` | 30px | Page subheadings |
| `4xl` | 36px | Page headings |
| `5xl` | 48px | Hero text |
| `6xl` | 60px | Display text |
| `7xl` | 72px | Extra large display |

### **Responsive Headings**

Headings automatically scale with viewport:

```tsx
// h1: 32px → 56px (based on viewport)
<h1>Automatically responsive</h1>

// Custom responsive sizing
<h2 className="text-2xl sm:text-3xl lg:text-4xl">
  Custom responsive heading
</h2>
```

---

## Font Weights

| Name | Value | Usage |
|------|-------|-------|
| Light | 300 | Decorative, large text only |
| Regular | 400 | Body text, default |
| Medium | 500 | Subtle emphasis, UI elements |
| Semibold | 600 | Headings, strong emphasis |
| Bold | 700 | Important headings, buttons |
| Extrabold | 800 | Hero text, display headings |

```tsx
// Using utility classes
<p className="font-light">Light text</p>
<p className="font-normal">Regular text</p>
<p className="font-medium">Medium text</p>
<p className="font-semibold">Semibold text</p>
<p className="font-bold">Bold text</p>
<p className="font-extrabold">Extrabold text</p>
```

---

## Line Heights

| Name | Value | Usage |
|------|-------|-------|
| `tight` | 1.1 | Large headings |
| `snug` | 1.25 | Subheadings |
| `normal` | 1.5 | Body text (default) |
| `relaxed` | 1.75 | Long-form content |
| `loose` | 2 | Airy layouts |

```tsx
<h1 className="leading-tight">Tight heading</h1>
<p className="leading-relaxed">Relaxed paragraph</p>
```

---

## Letter Spacing

| Name | Value | Usage |
|------|-------|-------|
| `tighter` | -0.05em | Large display text |
| `tight` | -0.025em | Headings (default) |
| `normal` | 0em | Body text |
| `wide` | 0.025em | Uppercase labels |
| `widest` | 0.1em | All-caps emphasis |

```tsx
<h1 className="tracking-tight">Display Heading</h1>
<span className="tracking-widest uppercase">Label</span>
```

---

## Best Practices

### **✅ DO:**

1. **Use semantic HTML**
   ```tsx
   <h1>Main heading</h1>
   <h2>Subheading</h2>
   <p>Body text</p>
   ```

2. **Let headings scale automatically**
   ```tsx
   <h1>This automatically becomes 32px-56px responsive</h1>
   ```

3. **Use text-balance for headlines**
   ```tsx
   <h1 className="text-balance">
     Multi-line headlines look better balanced
   </h1>
   ```

4. **Use text-pretty for body text**
   ```tsx
   <p className="text-pretty">
     Long paragraphs wrap more aesthetically
   </p>
   ```

5. **Use the right font for the job**
   - Inter: UI, body text, forms
   - Jakarta: Headings, marketing copy
   - JetBrains Mono: Code, order numbers

### **❌ DON'T:**

1. **Don't use too many font weights**
   - Stick to Regular (400), Semibold (600), Bold (700)

2. **Don't mix fonts unnecessarily**
   ```tsx
   // ❌ Bad
   <h1 className="font-[family-name:var(--font-inter)]">Wrong font</h1>
   
   // ✅ Good
   <h1>Uses Jakarta automatically</h1>
   ```

3. **Don't use font-size directly**
   ```tsx
   // ❌ Bad
   <p style={{ fontSize: '18px' }}>Text</p>
   
   // ✅ Good
   <Text size="lg">Text</Text>
   ```

4. **Don't skip heading levels**
   ```tsx
   // ❌ Bad: h1 → h3
   <h1>Main</h1>
   <h3>Section</h3>
   
   // ✅ Good: h1 → h2 → h3
   <h1>Main</h1>
   <h2>Section</h2>
   <h3>Subsection</h3>
   ```

---

## Real-World Examples

### **Landing Page Hero**
```tsx
<section>
  <Display>
    Design a harness as unique as your dog
  </Display>
  <Text size="lg" className="mt-6" pretty>
    Mix colors, choose premium hardware, add embroidered names, 
    and get instant fit guidance.
  </Text>
</section>
```

### **Product Card**
```tsx
<article>
  <Heading as="h3">Adventure Harness</Heading>
  <Text muted size="sm" className="mt-2">
    Perfect for daily walks and outdoor adventures
  </Text>
  <Text weight="semibold" className="mt-4">
    $58.00
  </Text>
</article>
```

### **Form Labels**
```tsx
<div>
  <Label htmlFor="dogName">Dog's Name</Label>
  <input 
    id="dogName" 
    className="font-[family-name:var(--font-inter)]"
  />
</div>
```

### **Code/Order Number**
```tsx
<div>
  <Text muted size="sm">Order Number</Text>
  <Code>HH-2024-12345</Code>
</div>
```

---

## Performance Optimization

### **Font Loading Strategy**

1. **Preload critical fonts**
   - Inter and Jakarta are preloaded
   - JetBrains Mono loads on demand

2. **Display swap**
   - Prevents FOIT (Flash of Invisible Text)
   - Shows fallback immediately
   - Swaps when font loads

3. **Font subsetting**
   - Only Latin characters loaded
   - Reduces file size by ~70%

4. **Variable font optimization**
   - Inter supports variable font
   - Single file for all weights
   - Smaller than loading multiple weights

### **Fallback Stack**

```css
font-family: 
  var(--font-inter),           /* Primary */
  system-ui,                   /* System default */
  -apple-system,               /* macOS/iOS */
  BlinkMacSystemFont,          /* Chrome on macOS */
  'Segoe UI',                  /* Windows */
  sans-serif;                  /* Generic fallback */
```

---

## Accessibility

### **Readability**
- ✅ Minimum 16px body text
- ✅ Maximum line length: 75 characters
- ✅ Sufficient line height (1.5 for body)
- ✅ Proper contrast ratios (WCAG AA)

### **Font Features**
```css
/* Enabled by default */
font-feature-settings: 
  'cv11' 1,    /* Better single-story 'a' */
  'ss01' 1;    /* Stylistic set */
```

### **Responsive Typography**
- Scales smoothly between breakpoints
- Uses `clamp()` for fluid sizing
- Never too small on mobile

---

## Tools & Utilities

### **Font Utility Functions**

```tsx
import { getFontStyle, headingStyles, bodyStyles } from '@/lib/fonts';

// Get font style programmatically
const style = getFontStyle('display', 'bold');

// Apply heading styles
<h1 style={headingStyles.h1}>Heading</h1>

// Apply body styles
<p style={bodyStyles.large}>Large text</p>
```

---

## Migration from Geist

If updating existing components:

```tsx
// Old (Geist)
<h1 className="font-[family-name:var(--font-geist-sans)]">

// New (Jakarta for headings)
<h1>                    // Automatic!

// Old (Geist Sans)
<p className="font-[family-name:var(--font-geist-sans)]">

// New (Inter for body)
<p>                     // Automatic!
```

---

## Summary

✅ **Inter** for body text and UI  
✅ **Plus Jakarta Sans** for headings and display text  
✅ **JetBrains Mono** for code and technical content  
✅ Optimized loading with preload and display swap  
✅ Accessible, readable, and performant  
✅ Consistent scale and weights  
✅ Semantic React components available  

**Result**: A beautiful, cohesive, high-performance typography system that enhances the "Playful Modern" brand personality! 🎨
