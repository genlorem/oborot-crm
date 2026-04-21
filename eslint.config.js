import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    ignores: [
      '**/dist/**',
      '**/.next/**',
      '**/node_modules/**',
      '**/build/**',
      '**/.planning/**',
      '**/.sentry/**',
      '**/coverage/**',
    ],
  },

  js.configs.recommended,

  // All React code (both apps)
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      // FOUND-05 enforcement: prevent regression of console.error after Sentry migration.
      // warn/info still allowed for legitimate developer diagnostics.
      'no-console': ['error', { allow: ['warn', 'info'] }],
      // react-hooks/purity (new in plugin v7) flags Math.random() inside
      // useState() initializers — true positive in theory, but the Early Bird
      // counter in Landing.jsx is intentional stale-on-mount marketing copy.
      // Disable here rather than introduce new Zustand state just to satisfy
      // the linter. Revisit when Early Bird counter moves to server (Phase 2).
      'react-hooks/purity': 'off',
    },
    settings: { react: { version: '18.3' } },
  },

  // Landing-specific: react-refresh for Vite HMR
  {
    files: ['apps/landing/**/*.{js,jsx}'],
    plugins: { 'react-refresh': reactRefresh },
    rules: { 'react-refresh/only-export-components': 'warn' },
  },

  // Test files: relax rules (console.warn during debugging is legitimate)
  {
    files: ['**/*.{test,spec}.{js,jsx}', '**/__tests__/**'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node, vi: 'readonly' },
    },
    rules: {
      'no-console': 'off',
      'react/display-name': 'off',
    },
  },

  // google-apps-script.js: runs in Google V8, different globals
  {
    files: ['apps/landing/google-apps-script.js'],
    languageOptions: {
      globals: {
        SpreadsheetApp: 'readonly',
        ContentService: 'readonly',
        Logger: 'readonly',
      },
    },
    rules: { 'no-unused-vars': 'off', 'no-console': 'off' },
  },

  // Next.js app: server-only globals
  {
    files: ['apps/app/**/*.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
]
