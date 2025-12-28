import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // 1. Global Ignores (Must be the first object)
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "dist/**",
      "coverage/**",
      "next-env.d.ts",
    ],
  },

  // 2. Next.js Config
  ...compat.extends('next/core-web-vitals'),

  // 3. Project-wide rules
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    rules: {
      // You can add custom rules here
    },
  },

  // 4. Config file overrides
  {
    files: ['*.config.{js,cjs,mjs}', 'next.config.*', 'postcss.config.*', 'tailwind.config.*'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
].filter((config) => config !== undefined); // Safety check to prevent "undefined index" errors

export default eslintConfig;