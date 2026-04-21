// apps/app/lib/env.js
// Runtime validation of NEXT_PUBLIC_* (client + server) and server-only
// vars. Fires at first import; also imported as a side-effect from
// app/layout.jsx to trigger validation at RSC module load.
import { z } from 'zod'

const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
})

const serverSchema = z.object({
  SENTRY_AUTH_TOKEN: z.string().optional(),
})

const clientParsed = clientSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
})

if (!clientParsed.success) {
  // Zod v4 exposes issues under `.issues` (renamed from v3's `.errors`).
  throw new Error(
    'Client env invalid:\n' +
    clientParsed.error.issues
      .map(e => `  ${e.path.join('.')}: ${e.message}`)
      .join('\n')
  )
}

export const clientEnv = clientParsed.data

// Server-only validation (skipped in the browser bundle).
export const serverEnv = typeof window === 'undefined'
  ? serverSchema.parse(process.env)
  : undefined
