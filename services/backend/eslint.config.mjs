import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [tseslint.configs.recommended],
  files: ["**/*.ts"],
  ignores: [
    "node_modules/**",
    "dist/**",
    "build/**",
    "prisma/**",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn", // TODO: Fix all any types and change to error
    "@typescript-eslint/no-unused-vars": ["warn", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_"
    }],
    "@typescript-eslint/no-require-imports": "warn",
  },
});

