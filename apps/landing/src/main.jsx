import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
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
  .then(() => render(null))
  .catch((e) => render(e.errors || [e.message || String(e)]))
