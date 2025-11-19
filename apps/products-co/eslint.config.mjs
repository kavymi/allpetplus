import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

export default [
  ...compat.config({
    extends: ['next/core-web-vitals', 'next/typescript'],
  }),
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@next/next/no-img-element': 'off',
    },
  },
];
