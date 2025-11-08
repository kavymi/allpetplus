# 3D Collar Customizer

**Purpose:** Interactive 3D dog collar visualization with real-time customization  
**Status:** Complete  
**Last Updated:** October 8, 2025

## Overview

The 3D Collar Customizer provides an interactive, hardware-accelerated 3D visualization of customizable dog collars. Users can rotate, zoom, and view their collar from any angle while making real-time customization changes with smooth animations.

## Quick Start

### Basic Usage

```tsx
'use client';

import { CollarScene } from '@/components/builder/3d';
import { useBuilderStore } from '@/components/builder/use-builder';

export default function CollarBuilder() {
  const selection = useBuilderStore((state) => state.selection);

  return (
    <div className="h-[600px] w-full">
      <CollarScene
        selection={selection}
        interactive={true}
        autoRotate={false}
      />
    </div>
  );
}
```

### With Custom Selection

```tsx
import { CollarScene } from '@/components/builder/3d';

const selection = {
  size: 'M',
  colorway: 'ocean',
  hardware: 'polished-silver',
  stitching: 'reflective',
};

<CollarScene selection={selection} interactive={true} />
```

## Components

### CollarScene

Main component that renders the 3D scene with camera, lighting, and controls.

**Props:**
- `selection: BuilderSelection` - Current collar configuration
- `interactive?: boolean` - Enable user interaction (default: `true`)
- `autoRotate?: boolean` - Auto-rotate the model (default: `false`)

### CollarModel

The 3D collar mesh with animations and material updates.

**Props:**
- `selection: BuilderSelection` - Current collar configuration
- `autoRotate?: boolean` - Auto-rotate the model (default: `false`)

## Customization Options

### Colorways

Available collar colors:

| ID | Name | Color |
|---|---|---|
| `sunset` | Sunset | `#FF7A59` |
| `ocean` | Ocean | `#3BAFDA` |
| `forest` | Forest | `#68D391` |
| `midnight` | Midnight | `#2D2D2D` |
| `lavender` | Lavender | `#A78BFA` |
| `coral` | Coral | `#FFD166` |

### Hardware Options

Available hardware finishes:

| ID | Name | Color |
|---|---|---|
| `rose-gold` | Rose Gold | `#E6B8A2` |
| `matte-black` | Matte Black | `#1A1A1A` |
| `polished-silver` | Polished Silver | `#C0C0C0` |
| `antique-brass` | Antique Brass | `#8B7355` |
| `gunmetal` | Gunmetal | `#2C3539` |

### Stitching

- `standard` - Regular stitching
- `reflective` - Reflective safety stitching with emissive glow

### Sizes

- `XS` - Extra Small
- `S` - Small
- `M` - Medium (default)
- `L` - Large
- `XL` - Extra Large

## Features

### ✨ Smooth Transitions

Uses Framer Motion for buttery-smooth color transitions:

```tsx
// Colors animate smoothly between selections
const fabricMotion = useMotionValue(fabricColor);
const smoothFabric = useSpring(fabricMotion, { 
  stiffness: 200, 
  damping: 26 
});
```

### 🎮 Interactive Controls

- **Drag to rotate** - Orbit around the collar
- **Scroll to zoom** - Zoom in/out with constraints
- **Touch gestures** - Full mobile support
- **Keyboard accessible** - Arrow keys for rotation

### ♿ Accessibility

- **Reduced motion support** - Respects `prefers-reduced-motion`
- **High contrast** - WCAG AA compliant
- **Keyboard navigation** - Full keyboard control
- **Screen reader friendly** - Proper ARIA labels

### ⚡ Performance

- **Hardware acceleration** - WebGL rendering
- **Adaptive quality** - Device pixel ratio clamped to [1, 2]
- **Suspense boundaries** - Graceful loading
- **Efficient updates** - Only re-renders on changes

## Advanced Usage

### Auto-Rotating Preview

Perfect for product pages:

```tsx
<CollarScene
  selection={selection}
  interactive={false}
  autoRotate={true}
/>
```

### Non-Interactive Display

For thumbnails or cards:

```tsx
<CollarScene
  selection={selection}
  interactive={false}
  autoRotate={false}
/>
```

### Custom Camera Position

Modify the scene for different views:

```tsx
// Edit collar-scene.tsx
<PerspectiveCamera 
  makeDefault 
  position={[2, 0, 4]}  // Side view
  fov={50} 
/>
```

## Example Implementation

See the full example in:
```
apps/web/src/components/examples/collar-preview-example.tsx
```

Run the example:
```bash
# Import and use in your page
import { CollarPreviewExample } from '@/components/examples/collar-preview-example';

export default function Page() {
  return <CollarPreviewExample />;
}
```

## Technical Details

### Dependencies

- `@react-three/fiber` - React renderer for Three.js
- `@react-three/drei` - Useful helpers for R3F
- `three` - 3D library
- `framer-motion` - Animation library

### Geometry

The collar uses the following Three.js geometries:

- **Collar band**: `TorusGeometry` - Main circular band
- **Buckle**: `BoxGeometry` - Clasp mechanism
- **D-ring**: `TorusGeometry` - Leash attachment
- **Reflective stitching**: `TorusGeometry` - Emissive accents

### Lighting Setup

```tsx
// Ambient lighting for base illumination
<ambientLight intensity={0.5} />

// Main directional light with shadows
<directionalLight position={[5, 5, 5]} intensity={1} castShadow />

// Fill light from opposite side
<directionalLight position={[-5, 3, -5]} intensity={0.3} />

// Top spotlight for highlights
<spotLight position={[0, 5, 0]} intensity={0.5} />

// Environment map for realistic reflections
<Environment preset="city" />
```

## Troubleshooting

### Performance Issues

1. **Lower device pixel ratio:**
```tsx
<Canvas dpr={[1, 1]} />
```

2. **Disable shadows:**
```tsx
<Canvas shadows={false} />
```

3. **Reduce shadow resolution:**
```tsx
<directionalLight shadow-mapSize-width={512} shadow-mapSize-height={512} />
```

### Visual Artifacts

- Ensure proper camera bounds
- Check material roughness/metalness values
- Verify lighting intensity

### Colors Not Updating

- Check that selection prop is changing
- Verify colorway IDs match `COLORWAY_MAP`
- Ensure motion values are being set

## Related Documentation

- [3D Harness Model](../architecture/3d-preview-system.md)
- [Builder Architecture](../architecture/component-architecture.md)
- [Motion Guidelines](../design/motion-guidelines.md)
- [Performance Guide](../development/performance-guide.md)




