// apps/landing/src/lib/env.js
// Runtime validation of VITE_* env vars at module load (FOUND-02, D-22).
// Fails fast with descriptive errors containing only variable NAMES (not values)
// per CLAUDE.md §Секреты.
import { z } from 'zod'

export class EnvError extends Error {
  constructor(errors) {
    super('Environment variables missing or invalid')
    this.errors = errors
    this.name = 'EnvError'
  }
}

// VITE_SHEETS_WEBHOOK_URL is optional: Phase 2 LEAD-01 migrates lead capture
// to Supabase, so a missing GAS webhook is a valid runtime state — Landing.jsx
// already short-circuits on falsy webhookUrl. Empty string is coerced to
// undefined so CF Pages can omit the var cleanly.
const schema = z.object({
  VITE_SHEETS_WEBHOOK_URL: z.preprocess(
    (v) => (v === '' ? undefined : v),
    z.string().url().optional(),
  ),
  VITE_TG_BOT_TOKEN: z.string().min(10),
  VITE_TG_CHAT_ID: z.string().min(1),
  VITE_SENTRY_DSN: z.string().url().optional(),
  VITE_SENTRY_RELEASE: z.string().optional(),
})

// Vite inlines `import.meta.env.VITE_*` at build time — cannot pass the env
// object directly; must build the input explicitly.
const parsed = schema.safeParse({
  VITE_SHEETS_WEBHOOK_URL: import.meta.env.VITE_SHEETS_WEBHOOK_URL,
  VITE_TG_BOT_TOKEN: import.meta.env.VITE_TG_BOT_TOKEN,
  VITE_TG_CHAT_ID: import.meta.env.VITE_TG_CHAT_ID,
  VITE_SENTRY_DSN: import.meta.env.VITE_SENTRY_DSN,
  VITE_SENTRY_RELEASE: import.meta.env.VITE_SENTRY_RELEASE,
})

if (!parsed.success) {
  // Zod v4 exposes issues under `.issues` (renamed from v3's `.errors`).
  const errors = parsed.error.issues.map(e => `${e.path.join('.')}: ${e.message}`)
  throw new EnvError(errors)
}

export const env = parsed.data
