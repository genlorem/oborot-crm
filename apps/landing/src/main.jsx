import { StrictMode } from 'react'
import React from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import {
  useLocation,
  useNavigationType,
  createRoutesFromChildren,
  matchRoutes,
} from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import EnvErrorBanner from './components/EnvErrorBanner'

// Validate env at module load by dynamically importing the validator
// module. Vite targets ES2020 by default — top-level `await` is NOT
// available, so we chain a `.then()`/`.catch()` before rendering.
// The validator throws synchronously on import eval, which Vite's
// esbuild-backed dynamic import surfaces as a promise rejection.
function render(envErrors) {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      {envErrors ? <EnvErrorBanner errors={envErrors} /> : <App />}
    </StrictMode>,
  )
}

import('./lib/env')
  .then((mod) => {
    const env = mod.env
    // Initialize Sentry only when DSN is present; SDK no-ops without init.
    // `maskAllText: false` is intentional for the waitlist stage — no real
    // PII yet (RESEARCH §Pitfall 8). Revisit when Phase 3 auth arrives.
    if (env?.VITE_SENTRY_DSN) {
      Sentry.init({
        dsn: env.VITE_SENTRY_DSN,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.reactRouterV7BrowserTracingIntegration({
            useEffect: React.useEffect,
            useLocation,
            useNavigationType,
            createRoutesFromChildren,
            matchRoutes,
          }),
          Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
        ],
        tracesSampleRate: 0.1,
        replaysSessionSampleRate: 0.0,
        replaysOnErrorSampleRate: 1.0,
        environment: import.meta.env.MODE,
        release: env.VITE_SENTRY_RELEASE || undefined,
      })
    }
    render(null)
  })
  .catch((e) => render(e.errors || [e.message || String(e)]))
