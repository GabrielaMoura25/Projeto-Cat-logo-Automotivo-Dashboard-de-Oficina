import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  {
    ignores: ['node_modules/**', 'coverage/**'],
  },
  // Configuração para arquivos backend (Node.js)
  {
    files: [
      'src/**/*.js',
      'src/**/*.mjs',
      'src/**/*.cjs',
      'scripts/**/*.js',
      'scripts/**/*.mjs',
      'scripts/**/*.cjs',
    ],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: globals.node,
      sourceType: 'commonjs',
    },
  },
  // Configuração para arquivos de teste (Jest)
  {
    files: [
      'tests/**/*.js',
      'tests/**/*.mjs',
      'tests/**/*.cjs',
      'jest.setup.js',
    ],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      sourceType: 'commonjs',
    },
  },
]);
