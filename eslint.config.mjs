import { FlatCompat } from '@eslint/eslintrc';
 
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});
 

const config = compat.config(
  {
    extends: ['next'],
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],

      // JS/TS
      'no-unused-vars': 'warn',
      'no-console': 'warn',

      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
    },
  },
);


export default config;