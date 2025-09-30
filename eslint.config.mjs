// eslint.config.mjs (Slightly cleaner version)
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

export default [
  // 1) Combine all ignores into a single object for cleanliness
  {
    ignores: [
      "node_modules/**", 
      ".next/**", 
      "out/**", 
      "build/**",
      "dist/**",
      "coverage/**",
      "next-env.d.ts"
    ]
  },
  
  // 2) Next.js presets (via compat). next/core-web-vitals is the main one needed.
  ...compat.extends('next/core-web-vitals'), 

  // 3) Project-wide rules (add tweaks here if you want)
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    languageOptions: { 
      parserOptions: { 
        ecmaVersion: 'latest', 
        sourceType: 'module' 
      } 
    },
    rules: {
      // add custom rule changes here if needed
    }
  }, 
  
  // 4) Let common config files use require() without errors
  {
    files: ['*.config.{js,cjs,mjs}', 'next.config.*', 'postcss.config.*', 'tailwind.config.*'],
    rules: { '@typescript-eslint/no-require-imports': 'off' }
  }
];
