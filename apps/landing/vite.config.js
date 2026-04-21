import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    // Must be LAST in plugins; only active in CI when auth token set.
    // `.filter(Boolean)` below removes the `false` when token absent so
    // local dev builds don't break (RESEARCH §Pitfall 1).
    process.env.SENTRY_AUTH_TOKEN && sentryVitePlugin({
      org: 'oborotcrm',
      project: 'landing',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ].filter(Boolean),
  build: {
    sourcemap: true,
  },
  preview: {
    allowedHosts: ['oborotcrm.ru', 'www.oborotcrm.ru'],
  },
})
