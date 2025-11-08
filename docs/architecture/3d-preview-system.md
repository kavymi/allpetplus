# 3D Preview System Architecture

## Overview

The All Pet Plus builder uses React Three Fiber (R3F) for interactive 3D harness previews, providing customers with an immersive, playful experience while maintaining excellent performance and accessibility.

## Technology Stack

### Core Libraries
- **@react-three/fiber** (v8.2.2) - React renderer for Three.js
- **@react-three/drei** - Useful helpers (OrbitControls, Environment, ContactShadows, PerspectiveCamera)
- **framer-motion** - Animation library for UI and 3D material transitions
- **three** - 3D rendering engine
- **three-stdlib** - Additional Three.js utilities and loaders
- **@react-three/postprocessing** - Post-processing effects (bloom, SSAO, etc.)
- **r3f-perf** - Performance monitoring for 3D scenes

### State Management Decision
- **Zustand** ✅ - Single source of truth for builder state
  - Provides persistence middleware (localStorage)
  - Dev tools support
  - Complex actions and selectors
  - Already integrated with URL sync
- **No valtio** ✅ - Avoiding dual state libraries
  - Valtio is great for simple reactive stores
  - But Zustand middleware (persist, devtools) is more valuable
  - Single state library reduces complexity

### Why This Stack?

1. **Framer Motion Integration**: Unified motion system for 2D UI and 3D transitions
2. **Performance**: Hardware-accelerated WebGL + optimized animations
3. **React Native**: Component-based 3D with hooks and React patterns
4. **Battle-Tested**: R3F used by major e-commerce (Nike, Stripe, etc.)
5. **Accessible**: Graceful 2D fallbacks, reduced-motion support, WebGL detection
6. **Scalable**: Easy to add materials, animations, and post-processing
7. **Tree-Shakeable**: LazyMotion support for smaller bundles

### Important Note on framer-motion-3d
`framer-motion-3d` is **deprecated** and no longer supported. Instead, we use:
- **framer-motion** hooks (`useMotionValue`, `useSpring`) for smooth value interpolation
- **R3F's `useFrame`** to apply motion values to 3D materials each frame
- **AnimatePresence** for page/component transitions
- This approach provides better performance and is officially supported

## Architecture

### Component Hierarchy

```
BuilderPreviewPane (preview-pane.tsx)
  ├─ HarnessScene (3d/harness-scene.tsx)
  │   ├─ Canvas (R3F)
  │   ├─ Scene
  │   │   ├─ Lighting
  │   │   ├─ Camera
  │   │   ├─ Environment
  │   │   ├─ HarnessModel (3d/harness-model.tsx)
  │   │   └─ ContactShadows
  │   └─ OrbitControls
  └─ Fallback2DPreview (when WebGL unavailable)
```

### File Structure

```
apps/web/src/components/builder/
├── 3d/
│   ├── harness-model.tsx      # Main harness 3D model
│   ├── harness-scene.tsx      # Scene setup (lights, camera, controls)
│   ├── materials.ts           # Material configurations
│   ├── animations.ts          # Animation presets
│   └── index.ts               # Exports
├── preview-pane.tsx           # Wrapper with 2D/3D toggle
└── ...
```

## Realistic Harness Geometry

The 3D harness model is designed to accurately represent real dog harness construction using webbing straps, not solid blocks.

### Anatomical Structure

Real dog harnesses consist of:
- **Webbing straps** (1-2 inches wide nylon/polyester)
- **Y-shaped or H-shaped** strap configuration
- **Back/spine strap** running vertically along the dog's back
- **Chest and belly straps** wrapping horizontally around the body
- **Shoulder straps** connecting chest to back pieces
- **D-ring attachment** on the back for leash connection
- **Buckles and adjustment points** on the sides
- **Padded chest plate** for comfort
- **Stitching details** for durability and aesthetics

### 3D Implementation

```typescript
// Realistic strap dimensions
const strapWidth = 0.12;      // 1-2 inches in world units
const strapThickness = 0.03;  // Thin like actual webbing

// Key components:
- Back/spine strap (vertical center piece)
- Top handle with padded grip
- Chest strap (horizontal upper)
- Belly/girth strap (horizontal lower)  
- Left & right shoulder straps (angled)
- D-ring attachment point (back center)
- Side buckles for adjustment
- Chest plate padding
- Reflective stitching accents (optional)
- Regular stitching details
```

### Why This Matters

- **Accuracy**: Customers can visualize the actual product structure
- **Trust**: Realistic preview reduces returns and increases confidence
- **Education**: Shows how the harness fits and functions
- **Differentiation**: Sets apart from competitors with blocky mockups

## Key Features

### 1. Automatic Fallback System

```typescript
// Detects WebGL support
const canvas = document.createElement('canvas');
const gl = canvas.getContext('webgl');

// Falls back to 2D if:
// - WebGL not supported
// - User prefers reduced motion
// - Performance is poor (future enhancement)
```

### 2. Dynamic Code Splitting

```typescript
// 3D scene only loads when needed
const HarnessScene = dynamic(
  () => import('./3d/harness-scene'),
  { 
    ssr: false,  // Client-only rendering
    loading: () => <LoadingState />
  }
);
```

### 3. Material System

Materials map builder selections to visual properties:

```typescript
const COLORWAY_MAP = {
  sunset: '#FF7A59',    // Coral/orange
  ocean: '#3BAFDA',     // Turquoise
  forest: '#68D391',    // Green
  midnight: '#2D2D2D',  // Dark gray
  lavender: '#A78BFA',  // Purple
  coral: '#FFD166',     // Yellow-orange
};

const HARDWARE_MAP = {
  'rose-gold': '#E6B8A2',
  'matte-black': '#1A1A1A',
  'polished-silver': '#C0C0C0',
  'antique-brass': '#8B7355',
  'gunmetal': '#2C3539',
};
```

### 4. Animation System

Smooth transitions powered by Framer Motion + R3F:

```typescript
// Create motion values for smooth interpolation
const fabricMotion = useMotionValue(fabricColor);
const smoothFabric = useSpring(fabricMotion, { 
  stiffness: 200, 
  damping: 26 
});

// Update motion values when selection changes
useMemo(() => {
  fabricMotion.set(fabricColor);
}, [fabricColor, fabricMotion]);

// Apply to materials in useFrame
useFrame(() => {
  if (bodyRef.current) {
    const material = bodyRef.current.material as THREE.MeshStandardMaterial;
    material.color.set(smoothFabric.get());
  }
});
```

**Why This Approach?**
- Unified motion system with UI (same Framer Motion config)
- Better performance than framer-motion-3d (deprecated)
- Full control over animation timing and easing
- Works seamlessly with reduced motion preferences

### 5. Performance Optimizations

- **Code Splitting**: 3D bundle loads on demand
- **Lazy Loading**: Components render only when visible
- **LOD (Future)**: Level-of-detail for complex models
- **Instance Rendering**: For repeated elements (buckles, stitching)
- **Shadow Optimization**: Contact shadows instead of full shadow maps

## Integration with Builder State

### State Flow

```
BuilderShell (Zustand store)
  ↓
BuilderPreviewPane
  ↓ (selection props)
HarnessScene
  ↓
HarnessModel (animated materials)
```

### Selection Mapping

```typescript
interface BuilderSelection {
  size?: string;          // Model scale
  colorway?: string;      // Fabric material color
  hardware?: string;      // Metal material color/finish
  stitching?: string;     // Accent elements (reflective strips)
  personalization?: string; // Text embroidery (future)
  addons?: string;        // Additional elements (future)
}
```

## Camera & Controls

### Camera Setup
```typescript
<PerspectiveCamera 
  makeDefault 
  position={[0, 1, 5]} 
  fov={50} 
/>
```

### Orbit Controls
```typescript
<OrbitControls
  enablePan={false}        // Disable panning
  enableZoom={true}        // Enable zoom
  minDistance={3}          // Min zoom
  maxDistance={8}          // Max zoom
  minPolarAngle={π/4}      // Limit vertical rotation
  maxPolarAngle={π/1.5}
  dampingFactor={0.05}     // Smooth transitions
  rotateSpeed={0.5}        // Slower rotation
/>
```

## Lighting Strategy

```typescript
// Ambient light for overall scene illumination
<ambientLight intensity={0.5} />

// Key light (main directional)
<directionalLight 
  position={[5, 5, 5]} 
  intensity={1} 
  castShadow 
/>

// Fill light (soften shadows)
<directionalLight 
  position={[-5, 3, -5]} 
  intensity={0.3} 
/>

// Rim light (highlight edges)
<spotLight 
  position={[0, 5, 0]} 
  intensity={0.5} 
  angle={0.3} 
/>

// Environment map for realistic reflections
<Environment preset="city" />
```

## Accessibility Features

### 1. Reduced Motion Support
```typescript
const reduceMotion = useReducedMotion();
const shouldAutoRotate = autoRotate && !reduceMotion;

// Disable auto-rotation for users who prefer reduced motion
```

### 2. Keyboard Navigation
```typescript
// OrbitControls supports keyboard:
// Arrow keys: Rotate
// +/- keys: Zoom
```

### 3. Screen Reader Support
```typescript
<div aria-label={`3D preview of ${selection.size} harness in ${selection.colorway} colorway`}>
  <Canvas />
</div>
```

## Performance Budgets

### Target Metrics
- **FPS**: Maintain 60fps on modern devices, 30fps minimum
- **Initial Load**: < 200ms for Canvas setup
- **Material Transitions**: < 300ms
- **Bundle Size**: < 150KB for 3D code (gzipped)

### Optimization Techniques

1. **Frustum Culling**: Automatic in Three.js
2. **Texture Optimization**: Compressed textures, mipmaps
3. **Geometry Optimization**: Simplified meshes for harness parts
4. **Shader Compilation**: Pre-warm materials on load
5. **Adaptive Quality**: Reduce detail on lower-end devices

## Future Enhancements

### Phase 2: Advanced Materials
- **Fabric Textures**: Normal maps for fabric weave
- **Hardware Reflections**: PBR materials for realistic metal
- **Embroidery**: Text geometry for personalization
- **Wear & Tear**: Subtle imperfections for realism

### Phase 3: Advanced Interactions
- **360° Spin**: Automated camera path
- **Exploded View**: Show harness components separately
- **AR Preview**: Export to AR Quick Look (iOS) / Scene Viewer (Android)
- **Photo Mode**: High-quality screenshot export

### Phase 4: Video Export
- **Remotion + R3F**: Generate marketing videos
- **Social Sharing**: Auto-generate preview videos for sharing
- **Email Marketing**: Personalized product videos

## Development Guidelines

### Adding New Harness Parts

1. Create geometry in `harness-model.tsx`
2. Map selection to material properties
3. Add animation with react-spring
4. Test performance impact

```typescript
// Example: Adding a new buckle
<animated.mesh ref={newBuckleRef} position={[x, y, z]}>
  <cylinderGeometry args={[...]} />
  <animated.meshStandardMaterial
    color={hardwareCol}
    metalness={0.9}
    roughness={0.2}
  />
</animated.mesh>
```

### Material Guidelines

- **Roughness**: 0.0 (mirror) to 1.0 (matte)
- **Metalness**: 0.0 (dielectric) to 1.0 (conductor)
- **Emissive**: Use sparingly for reflective elements
- **Transparency**: Avoid if possible (performance cost)

### Testing 3D Components

```typescript
describe('HarnessModel', () => {
  it('renders with correct colors', () => {
    const selection = { colorway: 'sunset', hardware: 'rose-gold' };
    render(<HarnessModel selection={selection} />);
    // Assert material colors match selection
  });

  it('respects reduced motion', () => {
    const { container } = render(
      <HarnessModel selection={selection} autoRotate={true} />
    );
    // Assert no rotation when prefers-reduced-motion
  });
});
```

## Troubleshooting

### Common Issues

**Black Screen**
- Check WebGL support in browser
- Verify Canvas is client-side rendered (`'use client'`)
- Ensure lights are properly positioned

**Poor Performance**
- Reduce shadow quality
- Simplify geometry
- Disable anti-aliasing on low-end devices
- Use lower DPR (device pixel ratio)

**Material Not Updating**
- Check react-spring config
- Verify color mapping in selection
- Ensure animated.mesh is used

**Controls Not Working**
- Verify OrbitControls is inside Canvas
- Check that camera is set to `makeDefault`
- Ensure no CSS `pointer-events: none` on canvas

## Resources

- [React Three Fiber Docs](https://docs.pmnd.rs/react-three-fiber)
- [Drei Helpers](https://github.com/pmndrs/drei)
- [Three.js Docs](https://threejs.org/docs/)
- [PBR Material Guide](https://marmoset.co/posts/basic-theory-of-physically-based-rendering/)
- [WebGL Best Practices](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API/WebGL_best_practices)

## Advanced Framer Motion + R3F Patterns

### LazyMotion for Bundle Optimization ⭐
```typescript
// apps/web/src/app/layout.tsx
import { LazyMotion, domAnimation } from 'framer-motion';

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <LazyMotion features={domAnimation} strict>
        {children}
      </LazyMotion>
    </ClerkProvider>
  );
}
```
**Why**: Tree-shakes unused Framer features, reduces bundle by ~20KB

### Camera Animations (Step Focus)
```typescript
// Animate camera when user edits specific parts
import { useMotionValue, useSpring, useTransform } from 'framer-motion';

function useCameraFocus(activeStep: string) {
  const cameraX = useMotionValue(0);
  const cameraY = useMotionValue(1);
  const cameraZ = useMotionValue(5);

  useEffect(() => {
    // Focus on chest when editing logo/personalization
    if (activeStep === 'personalization') {
      cameraX.set(0);
      cameraY.set(0.5);
      cameraZ.set(3);
    }
    // Orbit to shoulders for strap adjustments
    else if (activeStep === 'hardware') {
      cameraX.set(1);
      cameraY.set(1.5);
      cameraZ.set(4);
    }
    // Default view
    else {
      cameraX.set(0);
      cameraY.set(1);
      cameraZ.set(5);
    }
  }, [activeStep]);

  const smoothX = useSpring(cameraX, { stiffness: 100, damping: 20 });
  const smoothY = useSpring(cameraY, { stiffness: 100, damping: 20 });
  const smoothZ = useSpring(cameraZ, { stiffness: 100, damping: 20 });

  return { smoothX, smoothY, smoothZ };
}

// In Scene component
const { smoothX, smoothY, smoothZ } = useCameraFocus(activeStep);

useFrame(() => {
  camera.position.x = smoothX.get();
  camera.position.y = smoothY.get();
  camera.position.z = smoothZ.get();
  camera.lookAt(0, 0, 0);
});
```

### Interactive Mesh Highlights
```typescript
// Highlight selected part with hover states
function HardwareMesh({ isActive, onClick }) {
  const scale = useMotionValue(1);
  const smoothScale = useSpring(scale, { stiffness: 300, damping: 20 });

  useEffect(() => {
    scale.set(isActive ? 1.05 : 1);
  }, [isActive]);

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.scale.setScalar(smoothScale.get());
    }
  });

  return (
    <mesh
      ref={meshRef}
      onClick={onClick}
      onPointerOver={() => scale.set(1.03)}
      onPointerOut={() => scale.set(isActive ? 1.05 : 1)}
    >
      {/* geometry and material */}
    </mesh>
  );
}
```

### Exploded View Animation
```typescript
// Separate harness parts during onboarding step
function ExplodedViewAnimation({ step }) {
  const explode = useMotionValue(0);
  const smoothExplode = useSpring(explode, { stiffness: 150, damping: 25 });

  useEffect(() => {
    explode.set(step === 'hardware' ? 1 : 0);
  }, [step]);

  useFrame(() => {
    const offset = smoothExplode.get() * 0.5;
    
    // Move each part outward from center
    bodyRef.current.position.y = offset;
    handleRef.current.position.y = 1.2 + offset * 0.8;
    buckleRef.current.position.z = 0.25 + offset;
    strapRef.current.position.x = offset * -0.6;
  });

  return <group>{/* harness parts */}</group>;
}
```

### Material Crossfade with Shader Uniforms
```typescript
// Advanced: Crossfade between two textures
function MaterialTransition({ textureA, textureB, progress }) {
  const mixAmount = useMotionValue(0);
  const smoothMix = useSpring(mixAmount, { stiffness: 200, damping: 26 });

  useEffect(() => {
    mixAmount.set(progress);
  }, [progress]);

  useFrame(() => {
    if (materialRef.current) {
      materialRef.current.uniforms.uMixAmount.value = smoothMix.get();
    }
  });

  return (
    <shaderMaterial
      ref={materialRef}
      uniforms={{
        uTextureA: { value: textureA },
        uTextureB: { value: textureB },
        uMixAmount: { value: 0 },
      }}
      // Custom shader code
    />
  );
}
```

### Page Transitions
```typescript
// Wrap builder routes with AnimatePresence
<AnimatePresence mode="wait">
  <motion.div
    key={pathname}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    {children}
  </motion.div>
</AnimatePresence>
```

### Scroll-Based Reveals
```typescript
// Hero → Builder transition
const { scrollYProgress } = useScroll();
const scale = useTransform(scrollYProgress, [0, 1], [1, 1.2]);
const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0]);

<motion.div style={{ scale, opacity }}>
  <HarnessPreview />
</motion.div>
```

## Performance Optimizations (Mobile Storefront-Safe)

### 1. KTX2 Textures & DRACO Compression
```typescript
import { useGLTF } from '@react-three/drei';
import { DRACOLoader } from 'three-stdlib';

// Preload compressed models
useGLTF.preload('/models/harness.glb', true); // true = use DRACO

function HarnessGLTF() {
  const { scene } = useGLTF('/models/harness.glb', true, {
    dracoDecoderPath: 'https://www.gstatic.com/draco/versioned/decoders/1.5.6/'
  });
  
  return <primitive object={scene} />;
}
```

**Benefits**:
- **90% smaller** geometry files (DRACO)
- **50-75% smaller** textures (KTX2 vs PNG)
- **Faster GPU upload** (compressed GPU formats)

### 2. Performance Mode Toggle
```typescript
function PerformanceModeProvider() {
  const [performanceMode, setPerformanceMode] = useState<'auto' | 'high' | 'low'>('auto');
  const [actualMode, setActualMode] = useState<'high' | 'low'>('high');

  useEffect(() => {
    if (performanceMode === 'auto') {
      // Detect device capabilities
      const isMobile = /Android|iPhone|iPad/i.test(navigator.userAgent);
      const hasGoodGPU = /* check WebGL extensions */;
      setActualMode(isMobile || !hasGoodGPU ? 'low' : 'high');
    } else {
      setActualMode(performanceMode);
    }
  }, [performanceMode]);

  return (
    <Canvas
      dpr={actualMode === 'high' ? [1, 2] : 1}  // Pixel ratio
      shadows={actualMode === 'high'}            // Shadows only in high mode
      gl={{
        powerPreference: actualMode === 'high' ? 'high-performance' : 'low-power'
      }}
    >
      {/* Only render post-processing in high mode */}
      {actualMode === 'high' && (
        <EffectComposer>
          <Bloom intensity={0.5} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
```

### 3. Conditional Post-Processing
```typescript
// Only mount effects when NOT animating (expensive)
function AdaptivePostProcessing({ isAnimating }) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!isAnimating) {
      // Delay mounting until animation settles
      const timer = setTimeout(() => setEnabled(true), 500);
      return () => clearTimeout(timer);
    } else {
      setEnabled(false);
    }
  }, [isAnimating]);

  if (!enabled) return null;

  return (
    <EffectComposer>
      <Bloom intensity={0.3} luminanceThreshold={0.9} />
      <SSAO radius={0.02} intensity={0.5} />
    </EffectComposer>
  );
}
```

### 4. Model Preloading
```typescript
// Preload all harness variants on app initialization
useEffect(() => {
  // Preload base model
  useGLTF.preload('/models/harness-base.glb', true);
  
  // Preload texture variants (optional)
  const loader = new TextureLoader();
  COLORWAY_TEXTURES.forEach(url => {
    loader.load(url);
  });
}, []);
```

## Shopify Integration Strategy

### 1. Config Serialization
```typescript
// Serialize builder selection to cart line item properties
function serializeBuilderConfig(selection: BuilderSelection): Array<{ key: string; value: string }> {
  return Object.entries(selection)
    .filter(([_, value]) => value != null)
    .map(([key, value]) => ({
      key: `hh:${key}`,  // Namespace to avoid conflicts
      value: String(value),
    }));
}

// Add to Shopify cart
await shopifyMutation({
  cartId,
  lines: [{
    merchandiseId: baseVariantId,
    quantity: 1,
    attributes: serializeBuilderConfig(selection),
  }],
});
```

### 2. Preview Image Export
```typescript
// Capture 3D preview for cart thumbnail
async function capturePreviewImage(gl: THREE.WebGLRenderer): Promise<string> {
  // Render at higher resolution
  gl.setSize(1200, 1200);
  gl.render(scene, camera);
  
  // Export as WebP
  const dataURL = gl.domElement.toDataURL('image/webp', 0.9);
  
  // Upload to CDN (Cloudinary)
  const response = await fetch('/api/upload-preview', {
    method: 'POST',
    body: JSON.stringify({ image: dataURL }),
  });
  
  const { url } = await response.json();
  return url;
}

// Attach to cart line item
attributes.push({
  key: 'hh:preview_url',
  value: previewImageUrl,
});
```

### 3. Pricing Strategy Options

**Option A: Single Base Variant + Server-Side Deltas**
```typescript
// Client sends selections
const selections = { colorway: 'sunset', hardware: 'rose-gold' };

// Server (Fastify) calculates price
const basePrice = 58.00;
const deltas = {
  hardware: { 'rose-gold': 12.00, 'matte-black': 0 },
  stitching: { 'reflective': 8.00, 'standard': 0 },
  personalization: { custom: 10.00, none: 0 },
};

const total = basePrice + 
  (deltas.hardware[selections.hardware] || 0) +
  (deltas.stitching[selections.stitching] || 0) +
  (deltas.personalization[selections.personalization] || 0);

// Create draft order with computed price
await shopify.draftOrder.create({
  lineItems: [{ variantId: baseVariantId, quantity: 1 }],
  customAttributes: serializeConfig(selections),
  totalPrice: total,
});
```

**Option B: Exploded SKU Matrix**
```typescript
// Map combinations to unique Shopify variants
const variantKey = `${selections.size}-${selections.colorway}-${selections.hardware}`;
const variantMap = {
  'M-sunset-rose-gold': 'gid://shopify/ProductVariant/12345',
  'M-sunset-matte-black': 'gid://shopify/ProductVariant/12346',
  // ... hundreds of combinations
};

const merchandiseId = variantMap[variantKey];
```

**Recommendation**: **Option A** (server-side deltas)
- Fewer SKUs to manage
- Flexible pricing updates
- Better inventory tracking
- Line item properties show full config

## Integration Checklist

### Phase 1 (Complete) ✅
- [x] Install R3F v9.0 + drei v10.7
- [x] Install Framer Motion for unified animations
- [x] Remove deprecated framer-motion-3d
- [x] Choose Zustand over valtio (single state library)
- [x] Create harness model component  
- [x] Set up scene with lighting
- [x] Integrate with Zustand builder state
- [x] Add camera controls (OrbitControls)
- [x] Implement 2D fallback
- [x] Add WebGL detection
- [x] Support reduced motion
- [x] Document Framer Motion patterns
- [x] LazyMotion tree-shaking setup
- [x] Keep Three.js versions in lockstep (0.180)

### Phase 2 (Performance & Polish)
- [ ] Implement PBR textures (fabric weave, hardware reflections)
- [ ] Add DRACO compression for models
- [ ] Use KTX2 textures for GPU efficiency
- [ ] Performance mode toggle (high/low quality)
- [ ] Conditional post-processing (when not animating)
- [ ] Model preloading on app init
- [ ] r3f-perf panel for diagnostics
- [ ] Camera focus animations (step-based)
- [ ] Interactive mesh highlights (hover states)
- [ ] Exploded view for onboarding

### Phase 3 (Advanced Interactions)
- [ ] Embroidery text geometry
- [ ] Material crossfade transitions
- [ ] Screenshot export to CDN
- [ ] Shopify cart integration with preview images
- [ ] AR export (iOS Quick Look / Android Scene Viewer)
- [ ] 360° auto-spin mode
- [ ] Comparison view (side-by-side variants)

### Phase 4 (Marketing & Scale)
- [ ] Remotion + R3F video generation
- [ ] Social sharing preview videos
- [ ] Email marketing personalized videos
- [ ] A/B testing 2D vs 3D conversion
- [ ] Analytics for 3D engagement
- [ ] Performance monitoring in production
