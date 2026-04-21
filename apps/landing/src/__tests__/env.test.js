import { describe, it, expect, beforeEach, vi } from 'vitest'

describe('env validator', () => {
  beforeEach(() => {
    vi.resetModules()
  })

  it('throws EnvError when required TG var missing', async () => {
    vi.stubEnv('VITE_SHEETS_WEBHOOK_URL', 'https://script.google.com/macros/s/x/exec')
    vi.stubEnv('VITE_TG_BOT_TOKEN', '')
    vi.stubEnv('VITE_TG_CHAT_ID', '123')
    await expect(import('../lib/env?t=' + Date.now())).rejects.toMatchObject({
      name: 'EnvError',
    })
  })

  it('parses successfully when required vars valid', async () => {
    vi.stubEnv('VITE_SHEETS_WEBHOOK_URL', 'https://script.google.com/macros/s/x/exec')
    vi.stubEnv('VITE_TG_BOT_TOKEN', '1234567890:ABCdef')
    vi.stubEnv('VITE_TG_CHAT_ID', '123')
    const mod = await import('../lib/env?t=' + Date.now() + '-ok')
    expect(mod.env.VITE_SHEETS_WEBHOOK_URL).toMatch(/^https:/)
  })

  it('accepts empty VITE_SHEETS_WEBHOOK_URL (optional, coerced to undefined)', async () => {
    vi.stubEnv('VITE_SHEETS_WEBHOOK_URL', '')
    vi.stubEnv('VITE_TG_BOT_TOKEN', '1234567890:ABCdef')
    vi.stubEnv('VITE_TG_CHAT_ID', '123')
    const mod = await import('../lib/env?t=' + Date.now() + '-nosheets')
    expect(mod.env.VITE_SHEETS_WEBHOOK_URL).toBeUndefined()
  })
})
