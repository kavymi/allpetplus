# Global Navigation

## Overview

All pages in All Pet Plus now have a consistent global navigation header that provides easy access to key sections of the application.

## Implementation

### Component Location
`/apps/web/src/components/ui/global-header.tsx`

### Features

**Navigation Links:**
- Builder - Create custom harness designs
- Catalog - Browse pre-made harness templates
- Order tracking - Track order status
- FAQ - Frequently asked questions

**User Actions:**
- **Signed Out**: "Sign in" button (opens Clerk modal)
- **Signed In**: 
  - "Saved designs" button (access saved custom designs)
  - User avatar button (account menu)
- **All Users**: "Build your harness" CTA button

### Active Link Highlighting

The navigation automatically highlights the current active page based on the URL path:
- Builder pages show highlighted "Builder" link
- Catalog pages show highlighted "Catalog" link
- Order tracking pages show highlighted "Order tracking" link
- FAQ page shows highlighted "FAQ" link

### Layout Integration

The global header is added in the root layout (`/apps/web/src/app/layout.tsx`) and appears on all pages except:
- **Landing page** (`/`) - Uses its own custom header with different styling

### Responsive Behavior

**Desktop (md and above):**
- Full navigation menu visible
- "Sign in" / "Saved designs" buttons visible
- User avatar visible when signed in

**Mobile:**
- Logo and brand name visible
- Main "Build your harness" CTA button always visible
- User avatar visible when signed in
- Navigation links hidden (could be enhanced with mobile menu in future)

## Design System

**Styling:**
- Sticky positioning (`sticky top-0`) - stays visible on scroll
- High z-index (`z-50`) - appears above page content
- Backdrop blur effect for glassmorphism look
- Border bottom for subtle separation
- Color scheme uses CSS custom properties from design system

**Brand Elements:**
- Logo: "HH" in rounded container with primary color
- Tagline: "Custom comfort for every adventure"
- Consistent with landing page branding

## Code Example

```tsx
import { GlobalHeader } from '@/components/ui/global-header';

// In root layout
<body>
  <GlobalHeader />
  {children}
</body>
```

## Previous Implementation

**Before:**
- Only landing page had navigation
- Builder had its own simplified header
- Saved designs page had its own header
- Catalog and other pages had no consistent navigation

**After:**
- All pages share the same global navigation
- Consistent user experience across the app
- Easier navigation between sections
- Removed duplicate headers

## Accessibility

- Semantic `<header>` and `<nav>` elements
- Clear link text for screen readers
- Keyboard navigation support
- Focus states on interactive elements

## Future Enhancements

1. **Mobile Menu**: Add hamburger menu for mobile navigation
2. **Search**: Add search functionality to header
3. **Cart Badge**: Show cart item count in header
4. **Breadcrumbs**: Add breadcrumbs for deep page hierarchies
5. **Mega Menu**: Expand catalog/builder links into mega menus
6. **Notifications**: Add notification bell for signed-in users

## Related Components

- `/apps/web/src/components/landing/landing-header.tsx` - Landing page header (separate design)
- `/apps/web/src/components/ui/button.tsx` - Button component used in header
- `/apps/web/src/middleware.ts` - Clerk authentication middleware

## Testing

To test the global navigation:

1. Navigate to different pages - verify header appears
2. Click navigation links - verify correct routing
3. Sign in/out - verify button states change correctly
4. Check mobile view - verify responsive layout
5. Verify active link highlighting on each page



