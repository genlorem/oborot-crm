---
phase: 01-foundation-repo-cleanup
plan: 04
subsystem: testing
tags: [phase-1, testing, vitest, rtl, smoke-tests, foundation]

# Dependency graph
requires: [01-03]
provides:
  - "Vitest 3.2.4 + RTL 16.3.2 configured in both workspaces (jsdom env, globals, setup files)"
  - "Landing test suite: 6 tests — App smoke + 3 useForm cases + 2 env-validator cases"
  - "App test suite: 2 tests — RootLayout typeof smoke + login page heading smoke"
  - "`npm run test --workspace=apps/<name>` exits 0 in both workspaces — ready for CI matrix in Plan 07"
  - "next/navigation mocked globally in app suite (future-proofs router-hook clients)"
  - "Supabase env pre-populated in app vitest.setup.js — RootLayout's '../lib/env' side-effect import survives test boot"
affects: [01-05, 01-06, 01-07, 01-08]

# Tech tracking
tech-stack:
  added:
    - "vitest@3.2.4 (dev) in apps/landing + apps/app"
    - "@testing-library/react@16.3.2 (dev) in apps/landing + apps/app"
    - "@testing-library/jest-dom@6.9.1 (dev) in apps/landing + apps/app"
    - "@testing-library/user-event@14.6.1 (dev) in apps/landing + apps/app"
    - "jsdom@29.0.2 (dev) in apps/landing + apps/app"
    - "@vitejs/plugin-react@4.3.1 (dev) in apps/app (landing already had it)"
  patterns:
    - "vitest-config-from-vitest-config-import: `import { defineConfig } from 'vitest/config'` (NOT 'vite') — subtle but required"
    - "testing-library-setup-via-jestdom-vitest: single-line setup `import '@testing-library/jest-dom/vitest'`"
    - "next-navigation-global-mock: vi.mock('next/navigation', () => {...}) in setup.js — covers all client-component tests"
    - "env-side-effect-guard-for-rsc-import: setup.js pre-populates process.env.NEXT_PUBLIC_SUPABASE_* so RootLayout's '../lib/env' import succeeds without real creds"
    - "layout-smoke-via-typeof-not-render: `expect(typeof RootLayout).toBe('function')` — avoids nested <html> jsdom crash (RESEARCH Pitfall 4)"
    - "env-test-with-stubenv-and-cache-bust: `vi.stubEnv(...)` + `import('../lib/env?t=' + Date.now())` forces re-evaluation per test"
    - "act-per-toggle-call: each `result.current.toggleMulti(...)` in its own `act()` — clean closure semantics for maxSelect cap test"

key-files:
  created:
    - apps/landing/vitest.config.js
    - apps/landing/vitest.setup.js
    - apps/landing/src/__tests__/App.test.jsx
    - apps/landing/src/__tests__/useForm.test.js
    - apps/landing/src/__tests__/env.test.js
    - apps/app/vitest.config.js
    - apps/app/vitest.setup.js
    - apps/app/__tests__/layout.test.jsx
    - apps/app/__tests__/login.test.jsx
  modified:
    - apps/landing/package.json
    - apps/app/package.json
    - package-lock.json
  deleted: []

key-decisions:
  - "Single combined commit per plan Step H — `test: add Vitest + smoke + unit tests (landing + app)` covers both workspaces atomically (12 files, 1456 insertions, 29 deletions). Matches RESEARCH §Git Cleanup Mechanics step 7 + plan verify regex."
  - "Dropped 'start' script from apps/landing/package.json — Cloudflare Pages (Plan 08) replaces vite preview production use; Railway decommissioned. Per plan Step B + PATTERNS §2."
  - "vi.stubEnv chosen over module-mocking for env.test.js — Vitest 3.x auto-restores stubs after each test, and `vi.resetModules()` in beforeEach forces re-evaluation so cache-busted `import('../lib/env?t=' + Date.now())` exercises the Zod parse body per case."
  - "layout.test.jsx uses `typeof RootLayout === 'function'` — NOT render() — per RESEARCH §Pitfall 4 (nested <html> inside jsdom's existing <html> throws). Deliberate test scope: verify module exports + env side-effect is survivable."
  - "next/navigation pre-mocked in setup even though login.jsx doesn't use router hooks today — future-proof; cheap insurance against regressions."

patterns-established:
  - "Smoke + key-hook tests only (D-11 scope contract): no coverage thresholds, no breadth. useForm.canProceed + toggleMulti are the D-11-highlighted risk area per CONCERNS §Inconsistent Form Data Aggregation."
  - "Test files under `apps/<ws>/src/__tests__/` (landing) / `apps/<ws>/__tests__/` (app) — matches Vitest default glob + future ESLint glob."
  - "No real credentials in test setup files (T-1-04-02 mitigation) — all placeholders are synthetic strings satisfying Zod schemas."

requirements-completed: [FOUND-03]

# Metrics
duration: 2min
completed: 2026-04-21
---

# Phase 01 Plan 04: Testing Infrastructure (Vitest + RTL) Summary

**Single atomic commit `41405e9` (test: add Vitest + smoke + unit tests) installs Vitest 3.2.4 + RTL 16.3.2 in both workspaces and wires 8 passing tests — landing (6: App smoke + useForm.canProceed/toggleMulti round-trip + toggleMulti maxSelect cap + env validator missing-var + env validator success path) and app (2: RootLayout typeof + login "Войти" heading). Both `npm run test --workspace=apps/<name>` exit 0; FOUND-03 satisfied; test infra ready for CI matrix in Plan 07.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-21T09:04:09Z
- **Completed:** 2026-04-21T09:06:04Z
- **Tasks:** 2 (combined into one commit per plan Step H)
- **Commits:** 1
- **Files created:** 9
- **Files modified:** 3
- **New dev dependencies:** 6 unique (×2 workspaces where shared)

## Accomplishments

- **Vitest configured in both workspaces**: jsdom env, globals, setup files, workspace-appropriate include globs.
- **Landing suite green (6 passes)**:
  - `App.test.jsx` (1 test): `render(<App/>)` doesn't crash — validates Router + lazy imports + Tailwind bundle.
  - `useForm.test.js` (3 tests): canProceed initial-false, toggleMulti round-trip add/remove, toggleMulti maxSelect cap with third toggle blocked.
  - `env.test.js` (2 tests): throws `EnvError` when `VITE_SHEETS_WEBHOOK_URL` blank; parses successfully with valid URLs + tokens.
- **App suite green (2 passes)**:
  - `layout.test.jsx` (1 test): `typeof RootLayout === 'function'` — validates module exports even though jsdom can't nest `<html>`.
  - `login.test.jsx` (1 test): `getByText(/Войти/i)` found — proves `'use client'` + Tailwind render path works under Vitest.
- **Test scripts wired**: `"test": "vitest run"` + `"lint": "eslint src --max-warnings=0"` (landing) / `"lint": "eslint app lib --max-warnings=0"` (app). `lint` script will fail until Plan 06 ships ESLint config — acceptable per plan Step B note.
- **`start` script removed from apps/landing**: CF Pages (Plan 08) supersedes Railway's `vite preview` production server.
- **next/navigation mock + Supabase env pre-population in app setup.js**: future-proofs router-hook tests; makes RootLayout's `import '../lib/env'` side-effect import survive test boot without real creds.

## Task Commits

1. **Tasks 1 + 2 combined** — `41405e9` — `test: add Vitest + smoke + unit tests (landing + app)`
   - 12 files changed, 1456 insertions(+), 29 deletions(-)

## Files Created/Modified

### Created (9)

**Landing (5):**
- `apps/landing/vitest.config.js` — `defineConfig` from `vitest/config`, plugins [react()], jsdom env, globals, `setupFiles: ['./vitest.setup.js']`, `include: ['src/**/*.{test,spec}.{js,jsx}']`.
- `apps/landing/vitest.setup.js` — single line `import '@testing-library/jest-dom/vitest'`.
- `apps/landing/src/__tests__/App.test.jsx` — smoke render of `<App/>`.
- `apps/landing/src/__tests__/useForm.test.js` — 3 unit tests against `useForm` hook (renderHook + act).
- `apps/landing/src/__tests__/env.test.js` — 2 tests using `vi.stubEnv` + dynamic import cache-busting to exercise Zod branches.

**App (4):**
- `apps/app/vitest.config.js` — same shape as landing; `include: ['**/*.{test,spec}.{js,jsx}']` + `exclude: ['**/node_modules/**', '**/.next/**']`.
- `apps/app/vitest.setup.js` — jest-dom matchers + pre-populated `process.env.NEXT_PUBLIC_SUPABASE_*` + `vi.mock('next/navigation', ...)` with all four common hooks.
- `apps/app/__tests__/layout.test.jsx` — `typeof RootLayout === 'function'` assertion.
- `apps/app/__tests__/login.test.jsx` — renders login page + checks "Войти" heading.

### Modified (3)

- `apps/landing/package.json` — added `test`, `lint` scripts; removed `start`; added 5 dev-deps (vitest, RTL, jest-dom, user-event, jsdom).
- `apps/app/package.json` — added `test`, `lint` scripts; added 6 dev-deps (vitest, @vitejs/plugin-react, RTL, jest-dom, user-event, jsdom).
- `package-lock.json` — 94 new packages resolved + 2 hoisted additions on second workspace install.

## Verification Output

### Landing test run (`npm run test --workspace=apps/landing`)

```
 RUN  v3.2.4 /Users/genlorem/Projects/oborot-crm/apps/landing

 ✓ src/__tests__/env.test.js (2 tests) 34ms
 ✓ src/__tests__/useForm.test.js (3 tests) 9ms
 ✓ src/__tests__/App.test.jsx (1 test) 52ms

 Test Files  3 passed (3)
      Tests  6 passed (6)
   Start at  14:05:07
   Duration  1.17s
```

### App test run (`npm run test --workspace=apps/app`)

```
 RUN  v3.2.4 /Users/genlorem/Projects/oborot-crm/apps/app

 ✓ __tests__/login.test.jsx (1 test) 14ms
 ✓ __tests__/layout.test.jsx (1 test) 1ms

 Test Files  2 passed (2)
      Tests  2 passed (2)
   Start at  14:05:41
   Duration  850ms
```

### `vi.stubEnv` confirmation (env.test.js passed cases)

- `env validator > throws EnvError when required var missing` ✓
- `env validator > parses successfully when required vars valid` ✓

Both in `apps/landing/src/__tests__/env.test.js`. `vi.stubEnv` mutates `import.meta.env` for the test; `vi.resetModules()` in beforeEach + `?t=` cache-busting query forces the Zod parse to re-run per case. Verified: EnvError fires when `VITE_SHEETS_WEBHOOK_URL=''` + parsed `.url()` validator catches blank-string.

## Decisions Made

- **Single combined commit per plan directive** — plan Step H explicitly mandates one commit covering both tasks; matched with `git commit -m "test: add Vitest + smoke + unit tests (landing + app)"` + detail bullets. Bisect-safe: HEAD~1 has no tests (green apps), HEAD has tests (green apps + 8 passing tests).
- **`vi.stubEnv` over module-mock** — simpler + Vitest 3.x auto-restores; dynamic import with `?t=` query string forces re-evaluation so each test hits the Zod parse body cleanly.
- **`typeof RootLayout === 'function'` smoke over render** — RESEARCH §Pitfall 4: jsdom's existing `<html>` collides with RootLayout's `<html>`. Assertion proves the module loads (incl. `import '../lib/env'` side-effect) without triggering the nested-html crash.
- **Pre-populated Supabase env in app setup.js** — mandatory for layout.test.jsx (RootLayout imports `../lib/env` which Zod-validates `NEXT_PUBLIC_SUPABASE_*`). Values are synthetic and ≥20 chars to satisfy `z.string().min(20)`.

## Deviations from Plan

None — plan executed exactly as written. Zod v4 `.issues` gotcha and Vite TLA gotcha flagged in prior-wave context both stayed dormant (Task 1's env.test.js uses Vitest's own runtime, not Vite's build — no TLA risk; Zod parse already uses `.issues` from Plan 03's fix).

## Issues Encountered

- **PreToolUse read-before-edit hook warnings** (twice on `apps/landing/package.json` and `apps/app/package.json`) — informational; edits landed correctly as verified by post-write `git diff`.
- **`npm audit`** still reports 3 moderate + 1 high vulnerabilities (deferred; pre-existing from Plan 01-02 dep tree).
- **Vite CJS deprecation warning** printed on `apps/app` test run — advisory only (`@vitejs/plugin-react` consumes Vite's CJS build); does not affect test outcomes.

## Deferred Issues

| Category | Item | Reason |
|----------|------|--------|
| Security | 3 moderate + 1 high npm audit vulnerabilities | Pre-existing transitive CVEs; tracked since Plan 01-02. |
| CI | Actual CI wiring + matrix runner config | Plan 07 (FOUND-04). This plan only prepares the scripts. |
| Lint | ESLint config | Plan 06 (FOUND-04-lint). `lint` scripts will fail until that plan ships — acceptable, flagged in plan Step B. |
| Test coverage | Broader test surface (form components, lead-capture flows, Supabase client) | D-11 + D-12 scope bar; revisit post-Phase 3 once contracts stabilize. |

## Threat Flags

No new threat surface introduced beyond what the plan's `<threat_model>` anticipated. All three threats (T-1-04-01..03) are mitigated:
- **T-1-04-01 (stubEnv leak):** `beforeEach(() => vi.resetModules())` + Vitest 3.x auto-restore after each test (confirmed: second test in env.test.js sees fresh env without explicit restore calls).
- **T-1-04-02 (secrets in setup):** `process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test.supabase.co'` — synthetic subdomain, not a real project. Anon key placeholder is `'test-anon-key-at-least-20-chars-long'` — clearly fake, ≥20 chars to satisfy Zod.
- **T-1-04-03 (nested-html DoS):** layout.test.jsx uses `typeof RootLayout === 'function'` — never calls `render(<RootLayout/>)`.

## User Setup Required

None. Tests run offline, no credentials needed. CI in Plan 07 will need the same synthetic env values (already baked into setup.js for app; landing tests use `vi.stubEnv` so no process.env leakage).

## Next Phase Readiness

- **FOUND-03 satisfied**: `npm run test` green in both workspaces with >=1 smoke + key-hook tests per D-11. REQUIREMENTS.md to be marked complete by the metadata commit.
- **Ready for Plan 01-05 (FOUND-05 Sentry)**: new Sentry imports in landing `main.jsx` + app `sentry.*.config.js` will need smoke tests — Vitest infra supports adding them without config changes.
- **Ready for Plan 01-06 (FOUND-04-lint)**: `lint` scripts exist; Plan 06 supplies eslint.config.js and tests under `__tests__/` match the default glob.
- **Ready for Plan 01-07 (FOUND-04-CI)**: CI matrix can run `npm run test --workspace=apps/${{ matrix.app }}` directly — scripts verified locally. Synthetic env already documented in setup.js for the app path.
- **Bisect-safe**: HEAD and HEAD~1 both leave repo runnable.

## Self-Check: PASSED

Verified before STATE.md updates:

- **Commit `41405e9` exists:** `git log -1 --oneline` confirms `test: add Vitest + smoke + unit tests (landing + app)`.
- **All 9 new files exist:** `test -f` all 9 paths returned success (file presence verified in post-commit check).
- **No deletions in commit:** `git diff --diff-filter=D --name-only HEAD~1 HEAD` returns empty.
- **`test` scripts wired:** `node -p "require('./apps/landing/package.json').scripts.test"` → `vitest run`; same for apps/app.
- **Configs set jsdom:** both `vitest.config.js` contain `environment: 'jsdom'`.
- **Landing run exits 0 with 6 passing tests** (verified above).
- **App run exits 0 with 2 passing tests** (verified above).
- **`next/navigation` mocked in app setup:** `grep "vi.mock('next/navigation'" apps/app/vitest.setup.js` matches.
- **Jest-dom imported in both setups:** grep confirms `@testing-library/jest-dom/vitest` in both files.
- **Landing test subjects**: useForm at `apps/landing/src/form/hooks/useForm.js` imported via `'../form/hooks/useForm'`; env at `'../lib/env'` — both paths resolve correctly.
- **Working tree clean post-commit** (git status --short empty).

---
*Phase: 01-foundation-repo-cleanup*
*Completed: 2026-04-21*
