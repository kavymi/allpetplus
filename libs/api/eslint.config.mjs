import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [tseslint.configs.recommended],
  files: ["**/*.ts"],
  ignores: [
    "node_modules/**",
    "dist/**",
    "build/**",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["warn", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_"
    }],
  },
});

