import tseslint from 'typescript-eslint';

export default tseslint.config({
  extends: [tseslint.configs.recommended],
  files: ["**/*.ts", "**/*.tsx"],
  ignores: [
    "node_modules/**",
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-unused-vars": ["warn", {
      argsIgnorePattern: "^_",
      varsIgnorePattern: "^_"
    }],
  },
});

