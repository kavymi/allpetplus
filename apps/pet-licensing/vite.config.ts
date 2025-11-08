import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import tsConfigPaths from 'vite-tsconfig-paths';
import path from 'path';

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      routesDirectory: './app/routes',
      generatedRouteTree: './app/routeTree.gen.ts',
    }),
    react(),
    tsConfigPaths({
      root: '../../',
      projects: ['apps/pet-licensing/tsconfig.json'],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@pet/api': path.resolve(__dirname, '../../libs/api/src/index.ts'),
      '@pet/domain': path.resolve(__dirname, '../../libs/domain/src/index.ts'),
      '@pet/shared': path.resolve(__dirname, '../../libs/shared/src/index.ts'),
      '@pet/messaging': path.resolve(__dirname, '../../libs/messaging/src/index.ts'),
    },
  },
  server: {
    port: 3001,
    host: true,
  },
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
    sourcemap: true,
  },
});

