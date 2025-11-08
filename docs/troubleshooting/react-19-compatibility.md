# React 19 Compatibility Fix

## Issue

The error "Cannot read properties of undefined (reading 'ReactCurrentOwner')" was occurring when importing from `@react-three/drei` in the 3D harness scene component.

## Root Cause

The project uses React 19.1.0, but many dependencies (including `@react-three/drei`, `@apollo/client`, `@clerk/nextjs`, `framer-motion`, etc.) were installing React 18.3.1 as a peer dependency, creating duplicate React installations in `node_modules`. This caused React Three Fiber to access the wrong React instance, leading to internal API errors.

## Solution

### 1. Updated React Three Fiber Dependencies

Updated to the latest versions that better support React 19:
- `@react-three/fiber`: `^9.0.0` → `^9.3.0`
- `@react-three/drei`: `^10.7.6` (kept, but forced to use React 19 via overrides)

### 2. Removed Unused Dependency

Removed `@react-three/postprocessing` as it wasn't used in the codebase and had peer dependency conflicts.

### 3. Added NPM Overrides

Added `overrides` to both root and web `package.json` to force all dependencies to use React 19:

```json
"overrides": {
  "react": "19.1.0",
  "react-dom": "19.1.0",
  "@types/react": "^19",
  "@types/react-dom": "^19"
}
```

### 4. Created .npmrc

Created a `.npmrc` file in the project root with:

```
legacy-peer-deps=true
```

This ensures that npm installs don't fail due to peer dependency conflicts when packages haven't updated their peer dependency ranges for React 19.

### 5. Clean Install

Ran a clean install:

```bash
rm -rf node_modules package-lock.json apps/*/node_modules services/*/node_modules
npm install
```

## Verification

After the fix, all packages now use React 19.1.0:

```bash
npm ls react react-dom
```

Should show only React 19.1.0 across all dependencies.

## Future Considerations

1. **Node Version**: The project uses Node v21.7.3, but some Jest packages require Node v24. Consider upgrading to Node v24 as specified in the workspace rules.

2. **Dependency Updates**: As packages release better React 19 support, the `overrides` approach can be gradually removed and replaced with natural peer dependency resolution.

3. **Package Audits**: Run `npm audit` periodically to check for security vulnerabilities and update dependencies accordingly.

## Related Files

- `/package.json` - Root package.json with overrides
- `/apps/web/package.json` - Web app package.json with updated dependencies and overrides
- `/.npmrc` - NPM configuration for legacy peer deps
- `/apps/web/src/components/builder/3d/harness-scene.tsx` - The component that was failing

## References

- [React 19 Release Notes](https://react.dev/blog/2024/12/05/react-19)
- [React Three Fiber v9 Migration](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction)
- [NPM Overrides Documentation](https://docs.npmjs.com/cli/v10/configuring-npm/package-json#overrides)

