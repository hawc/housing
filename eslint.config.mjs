import eslintNextPlugin from '@next/eslint-plugin-next';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';
import { defineConfig } from 'eslint/config';
 
const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    plugins: {
      next: eslintNextPlugin,
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],

      // JS/TS
      'no-unused-vars': 'warn',
      'no-console': 'warn',

      'no-unused-vars': [
      'error',
      {
        'args': 'none',
        'vars': 'all',
        'varsIgnorePattern': '^_',
        'ignoreRestSiblings': true
      }
    ]
    },
  },
]);


export default eslintConfig;