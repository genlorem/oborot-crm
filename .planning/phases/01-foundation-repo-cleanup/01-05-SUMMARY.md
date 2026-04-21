---
phase: 01-foundation-repo-cleanup
plan: 05
subsystem: observability
tags: [phase-1, sentry, error-tracking, observability, next14, vite]

# Dependency graph
requires: [01-04]
provides:
  - "@sentry/react ^10.49.0 + @sentry/vite-plugin ^5.2.0 in apps/landing"
  - "@sentry/nextjs ^10.49.0 in apps/app with 3-runtime config (client/server/edge)"
  - "Sentry.init guarded by DSN presence — safe no-op when VITE_SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN absent"
  - "apps/app/next.config.js wrapped with withSentryConfig + experimental.instrumentationHook: true (Next-14 CRITICAL)"
  - "apps/landing/vite.config.js: conditional sentryVitePlugin (SENTRY_AUTH_TOKEN gate) + build.sourcemap: true"
  - "Zero console.error in apps/ source — all 5 sites replaced with Sentry.captureException tagged by `op` (and `page: marketplace` where applicable)"
  - "apps/app/app/global-error.jsx: Next App Router error boundary feeding Sentry.captureException"
  - "apps/app/instrumentation.js: runtime-gated imports of sentry.server.config / sentry.edge.config"
affects: [01-06, 01-07, 01-08]

# Tech tracking
tech-stack:
  added:
    - "@sentry/react@^10.49.0 (apps/landing dep)"
    - "@sentry/vite-plugin@^5.2.0 (apps/landing devDep)"
    - "@sentry/nextjs@^10.49.0 (apps/app dep)"
  patterns:
    - "sentry-init-gated-by-dsn: `if (env?.VITE_SENTRY_DSN) Sentry.init({...})` — SDK no-ops when DSN absent (waitlist-stage safe default)"
    - "vite-plugin-conditional-by-auth-token: `process.env.SENTRY_AUTH_TOKEN && sentryVitePlugin(...)` inside a `.filter(Boolean)` array — local dev builds never break when token missing"
    - "next14-instrumentation-hook-explicit: `experimental.instrumentationHook: true` MUST be set on Next 14 (removed as default in Next 15+) — instrumentation.js is silently ignored without it"
    - "sentry-replay-client-only: replayIntegration goes in sentry.client.config.js; server/edge configs omit it (browser API crashes on server)"
    - "sentry-captureException-tagged-by-op: direct call at each catch site — no `logError()` wrapper utility (5 sites don't justify abstraction per PATTERNS §A)"
    - "global-error-returns-own-html: App Router convention — GlobalError must render its own `<html>` + `<body>` (replaces root layout on uncaught errors)"
    - "main-jsx-then-chain-preserved: .then()/.catch() chain kept from Plan 03 instead of plan-proposed top-level await — Vite ES2020 target rejects TLA (documented prior-wave gotcha)"
    - "react-router-v7-integration-present: reactRouterV7BrowserTracingIntegration exists in @sentry/react 10.49.0 (Assumption A1 VERIFIED via `Object.keys` grep)"

key-files:
  created:
    - apps/app/sentry.client.config.js
    - apps/app/sentry.server.config.js
    - apps/app/sentry.edge.config.js
    - apps/app/instrumentation.js
    - apps/app/app/global-error.jsx
  modified:
    - apps/landing/package.json
    - apps/app/package.json
    - package-lock.json
    - apps/landing/vite.config.js
    - apps/landing/src/main.jsx
    - apps/landing/src/landing/Landing.jsx
    - apps/landing/src/segments/Marketplace.jsx
    - apps/landing/src/form/hooks/useForm.js
    - apps/app/next.config.js
  deleted: []

key-decisions:
  - "Assumption A1 VERIFIED: `reactRouterV7BrowserTracingIntegration` is exported by @sentry/react 10.49.0 (confirmed via `Object.keys(require('@sentry/react'))` grep). No fallback to V6 needed."
  - "Manual setup chosen over wizard — reproducible, no interactive prompts, guaranteed Next-14 compatible (wizard docs favor Next 15+ and would skip the instrumentationHook flag per RESEARCH Pitfall 2)."
  - "Preserved .then()/.catch() chain in apps/landing/src/main.jsx instead of plan-template top-level await — Vite ES2020 target rejects TLA (Plan 03 wave context, STATE.md line 79). Sentry.init now runs inside the .then() callback after env is loaded + validated."
  - "Checkpoint Task 4 (human-action for Sentry account + DSN) DEFERRED to post-Wave-6 per execution prompt directive — code paths all no-op when DSN absent; no live-service dependency introduced."
  - "No wrapper utility (`lib/logger.js` etc.) — 5 console.error sites replaced with direct Sentry.captureException calls (PATTERNS §Shared Pattern A)."

patterns-established:
  - "Env-driven Sentry init (client): guard on parsed-env DSN field, not raw process.env — ensures Zod validator runs first so invalid env is caught BEFORE Sentry is poked with garbage DSN."
  - "Dummy-env build smoke: `NEXT_PUBLIC_SUPABASE_URL=... NEXT_PUBLIC_SUPABASE_ANON_KEY=... NEXT_PUBLIC_SENTRY_DSN=... npm run build --workspace=apps/app` — lets CI (Plan 07) validate app build integrity without real secrets (RESEARCH Pitfall 10 mitigation)."
  - "Source-maps plugin gate: `process.env.SENTRY_AUTH_TOKEN && sentryVitePlugin(...)` — plugin active only when CI populates the token; local builds log a warning and skip upload (no hard failure)."

requirements-completed: [FOUND-05]

# Metrics
duration: 4min
completed: 2026-04-21
---

# Phase 01 Plan 05: Sentry Error Tracking Summary

**Two atomic commits (`e492d4e`, `2d69b58`) install @sentry/react ^10.49.0 + @sentry/vite-plugin ^5.2.0 in apps/landing and @sentry/nextjs ^10.49.0 in apps/app, wire Next-14's mandatory `experimental.instrumentationHook: true` flag, and migrate all 5 `console.error` callsites to `Sentry.captureException` with contextual `op` tags. SDK no-ops gracefully when DSN absent — code ships today, live capture activates post-Wave-6 when developer populates VITE_SENTRY_DSN / NEXT_PUBLIC_SENTRY_DSN / SENTRY_AUTH_TOKEN. Both test suites (6 landing + 2 app) remain green; both apps build (landing clean; app with two advisory Next-15-facing deprecation warnings). FOUND-05 satisfied at code level.**

## Performance

- **Duration:** ~4 min
- **Started:** 2026-04-21T09:10:31Z
- **Completed:** 2026-04-21T09:14:33Z
- **Tasks:** 3 executed + 1 checkpoint auto-deferred (per execution prompt)
- **Commits:** 2 (task commits) — metadata commit follows
- **Files created:** 5
- **Files modified:** 9
- **New dependencies:** 3 top-level (7 + 30 + 131 = 168 transitive adds across two workspaces)

## Accomplishments

- **Landing Sentry wired**: `@sentry/react` at 10.49.0 + `@sentry/vite-plugin` at 5.2.0 in `apps/landing/package.json`. Vite config gains `sentryVitePlugin` (conditional on `SENTRY_AUTH_TOKEN`) + `build.sourcemap: true`. `main.jsx` invokes `Sentry.init({...})` inside the env-load `.then()` callback — initialization only runs when `env?.VITE_SENTRY_DSN` is present, preserving the EnvErrorBanner flow from Plan 03.
- **React Router v7 tracing verified**: `reactRouterV7BrowserTracingIntegration` confirmed present in installed SDK (Assumption A1). Integration receives `React.useEffect`, `useLocation`, `useNavigationType`, `createRoutesFromChildren`, `matchRoutes` from `react-router-dom` v7.
- **App Sentry wired (3 runtimes)**: `@sentry/nextjs` at 10.49.0 in `apps/app/package.json`. `next.config.js` now requires `@sentry/nextjs`, sets `experimental.instrumentationHook: true`, and is wrapped with `withSentryConfig(...)` using `{org: 'oborotcrm', project: 'app', silent: !CI, widenClientFileUpload: true, hideSourceMaps: true, disableLogger: true}`.
- **3 Sentry init files + instrumentation + global-error**: `sentry.client.config.js` (with `replayIntegration`), `sentry.server.config.js` (no replay), `sentry.edge.config.js` (no replay), `instrumentation.js` (runtime-gated imports + `./lib/env` fail-fast), `app/global-error.jsx` (client-side boundary with `'use client'`, own `<html>` + `<body>`, `Sentry.captureException(error)` in `useEffect`).
- **5 console.error sites → Sentry.captureException**: verified zero remaining in source directories (`apps/landing/src`, `apps/app/app`, `apps/app/lib`). Each site carries a contextual `op` tag (`sheets-webhook`, `telegram-notify`, `form-submit`) plus `page: 'marketplace'` on the two Marketplace sites — enables Sentry dashboard filtering by operation kind.
- **Both apps build**: `npm run build --workspace=apps/landing` exits 0 with sourcemaps (`.map` files); `npm run build --workspace=apps/app` (with dummy env) exits 0, 6 routes prerendered.
- **Test suites stay green**: 6 landing tests + 2 app tests still pass (no regressions from Sentry import or init guard).

## Task Commits

1. **Tasks 1 + 2 combined into Task 2 Step E's mandated commit** — `e492d4e` — `feat(sentry): add @sentry/react to landing + @sentry/nextjs to app`
   - 11 files changed, 2698 insertions(+), 251 deletions(-)
2. **Task 3** — `2d69b58` — `refactor: replace console.error with Sentry.captureException`
   - 3 files changed, 8 insertions(+), 5 deletions(-)

## Files Created/Modified

### Created (5 — all apps/app/)

- `apps/app/sentry.client.config.js` — `Sentry.init` with `replayIntegration({maskAllText: false, blockAllMedia: false})`, `tracesSampleRate: 0.1`, `replaysSessionSampleRate: 0.0`, `replaysOnErrorSampleRate: 1.0`.
- `apps/app/sentry.server.config.js` — `Sentry.init` minimal (no replay — browser API crashes on server).
- `apps/app/sentry.edge.config.js` — identical to server config (no replay).
- `apps/app/instrumentation.js` — `export async function register()` conditionally imports `./sentry.server.config` (nodejs) or `./sentry.edge.config` (edge), plus `./lib/env` side-effect for server-env fail-fast.
- `apps/app/app/global-error.jsx` — `'use client'` boundary with Tailwind tokens matching login page (`bg-bg text-white antialiased`, accent logo, reset button).

### Modified (9)

**Landing (5):**
- `apps/landing/package.json` — added `@sentry/react ^10.49.0` (dep), `@sentry/vite-plugin ^5.2.0` (devDep).
- `apps/landing/vite.config.js` — adds `sentryVitePlugin` conditional on `SENTRY_AUTH_TOKEN`, uses `.filter(Boolean)` to strip `false`, sets `build.sourcemap: true`, preserves preview `allowedHosts`.
- `apps/landing/src/main.jsx` — adds Sentry import + react-router-dom hook imports; `Sentry.init` runs inside the env-load `.then()` callback (preserves `.then()/.catch()` chain from Plan 03, avoids Vite ES2020 TLA issue).
- `apps/landing/src/landing/Landing.jsx` — adds `import * as Sentry from '@sentry/react'`; 2 catch blocks now call `Sentry.captureException(e, {tags: {op: ...}})`.
- `apps/landing/src/segments/Marketplace.jsx` — adds Sentry import; 2 catch blocks tagged with `op` + `page: 'marketplace'`.
- `apps/landing/src/form/hooks/useForm.js` — adds Sentry import; 1 catch block tagged `op: 'form-submit'`.

**App (3):**
- `apps/app/package.json` — added `@sentry/nextjs ^10.49.0` (dep).
- `apps/app/next.config.js` — `require('@sentry/nextjs')`, `experimental.instrumentationHook: true`, wrapped with `withSentryConfig({org, project, silent, widenClientFileUpload, hideSourceMaps, disableLogger})`.

**Lockfile:**
- `package-lock.json` — 168 transitive adds across both workspaces.

## Verification Output

### Landing build (`npm run build --workspace=apps/landing`)

```
vite v5.4.21 building for production...
✓ 438 modules transformed.
dist/index.html                   0.84 kB │ gzip:   0.56 kB
dist/assets/index-D2mky07O.css   19.53 kB │ gzip:   4.59 kB
dist/assets/env-DjScdqn5.js      59.24 kB │ gzip:  16.29 kB │ map:   366.87 kB
dist/assets/index-Ble599Xx.js   513.30 kB │ gzip: 166.86 kB │ map: 2,360.61 kB
✓ built in 1.31s
```

Sourcemaps present (`.map` files). No `SENTRY_AUTH_TOKEN` warning because plugin silent-skips when token absent (RESEARCH Pitfall 1).

### App build (`npm run build --workspace=apps/app` with dummy env)

```
[@sentry/nextjs] DEPRECATION WARNING: disableLogger is deprecated and will be removed in a future version. Use webpack.treeshake.removeDebugLogging instead.
  ▲ Next.js 14.2.35
  - Experiments (use with caution):
    · instrumentationHook
[@sentry/nextjs] DEPRECATION WARNING: It is recommended renaming your `sentry.client.config.js` file...
 ✓ Compiled successfully
 ✓ Generating static pages (6/6)

Route (app)                              Size     First Load JS
┌ ○ /                                    315 B           197 kB
├ ○ /_not-found                          1.03 kB         198 kB
├ ○ /dashboard                           1.17 kB         198 kB
└ ○ /login                               799 B           197 kB
```

Two advisory deprecation warnings are Next-15-facing (both informational on Next 14) — `disableLogger` and `sentry.client.config.js` rename to `instrumentation-client.ts`. Will be revisited when Next is upgraded.

### Landing tests (`npm run test --workspace=apps/landing`)

```
 ✓ src/__tests__/env.test.js (2 tests) 30ms
 ✓ src/__tests__/useForm.test.js (3 tests) 8ms
 ✓ src/__tests__/App.test.jsx (1 test) 20ms

 Test Files  3 passed (3)
      Tests  6 passed (6)
```

### App tests (`npm run test --workspace=apps/app`)

```
 ✓ __tests__/login.test.jsx (1 test) 14ms
 ✓ __tests__/layout.test.jsx (1 test) 1ms

 Test Files  2 passed (2)
      Tests  2 passed (2)
```

### console.error audit (source only, excluding dist/.next/node_modules/tests)

```bash
grep -rn 'console\.error' apps/landing/src apps/app/app apps/app/lib | grep -vE '__tests__|\.test\.|\.spec\.'
# → 0 matches
```

### Sentry.captureException count

- `apps/landing/src/landing/Landing.jsx`: 2 (op=sheets-webhook, op=telegram-notify)
- `apps/landing/src/segments/Marketplace.jsx`: 2 (both tagged page=marketplace)
- `apps/landing/src/form/hooks/useForm.js`: 1 (op=form-submit)

Total: 5 — exact match to the migration map in RESEARCH §Console.error.

## Decisions Made

- **Manual setup over wizard** — reproducible, no interactive prompts; wizard docs favor Next 15+ and would silently skip the `experimental.instrumentationHook: true` flag (RESEARCH Pitfall 2 — the single most likely Next-14 gotcha).
- **.then()/.catch() chain retained in main.jsx** — plan template in Task 1 Step C used a top-level `await` in `.jsx` entry, which Vite's ES2020 target rejects (documented in STATE.md line 79 from Plan 03 lessons). Sentry.init moved into the `.then()` callback so it still runs after env is loaded but never hits the TLA path.
- **Task 4 checkpoint auto-deferred** — execution prompt explicitly pre-approved this: code paths are DSN-safe no-ops, Sentry account provisioning is deferred post-Wave-6, Plan 01-07 will wire the CI secrets later.
- **replayIntegration only in client config** — server/edge runtimes cannot access browser APIs (`window`, `document`); placing it there would crash on first boot (PATTERNS §15).
- **Direct Sentry.captureException calls (no wrapper)** — per PATTERNS §Shared Pattern A: 5 sites don't justify a `lib/logger.js` abstraction; every catch block calls `Sentry.captureException(e, {tags: {op: '...'}})` directly, with `page: 'marketplace'` augmenting the Marketplace sites.

## Deviations from Plan

### 1. [Rule 3 - Blocking] Preserved .then()/.catch() chain in main.jsx

- **Found during:** Task 1 (reading current main.jsx, which already uses `.then()` chain after Plan 03)
- **Issue:** Plan 01-05 Task 1 Step C template uses top-level `await` in `main.jsx`. Vite ES2020 target rejects TLA — this was a fixed bug in Plan 03 (STATE.md line 79). Using the plan's template would re-introduce the bug.
- **Fix:** Kept the `.then()/.catch()` chain; moved `Sentry.init(...)` into the `.then()` callback so it still runs after env validation succeeds AND only when `env?.VITE_SENTRY_DSN` is truthy.
- **Files modified:** `apps/landing/src/main.jsx`
- **Commit:** e492d4e

### 2. [Minor - Scope] Task 4 checkpoint not triggered

- **Found during:** Task 3 completion (execution prompt explicit directive)
- **Issue:** Plan defines Task 4 as `checkpoint:human-action` blocking on Sentry account + DSNs. Execution prompt pre-approved deferring this to post-Wave-6 since all code paths no-op safely without DSN.
- **Fix:** Proceeded past Task 3 without stopping; documented the deferred work in "User Setup Still Required" below.
- **Files modified:** None (checkpoint is no-code)
- **Commit:** N/A

### 3. [Rule 2 - Scope] Plan's verify regex `grep -rn 'console\.error' apps/` would include dist/ artifacts

- **Found during:** Task 3 verification
- **Issue:** Plan Step E's grep pipes through `apps/` without excluding `dist/` or `.next/`. Prior builds left `apps/landing/dist/assets/index-*.js` containing bundled console.error from React DevTools internals — 33+ matches, all from minified React/ReactDOM internals, not from our source.
- **Fix:** Scoped verification to source directories only (`apps/landing/src`, `apps/app/app`, `apps/app/lib`) — returns 0. This is the correct interpretation of the plan's intent (production source code, not build artifacts). Note added here so Plan 06's ESLint `no-console` rule glob should also exclude `dist` / `.next`.
- **Files modified:** None (verification-only fix)
- **Commit:** N/A

## User Setup Still Required

**Deferred to post-Wave-6 per execution prompt directive.** Code ships today in safe no-op mode. Developer must complete these one-time manual steps before live error capture begins (ideally before Plan 01-07 wires CI):

1. **Sign up at https://sentry.io/signup/** using the Oborot team email.
2. **Create organization with slug `oborotcrm`** (MUST match `org: 'oborotcrm'` in `apps/landing/vite.config.js` + `apps/app/next.config.js`). If slug taken, pick another and update both files.
3. **Create two projects:**
   - `landing` (platform: React) — copy DSN → `VITE_SENTRY_DSN`
   - `app` (platform: Next.js) — copy DSN → `NEXT_PUBLIC_SENTRY_DSN`
4. **Create auth token:** User Settings → Auth Tokens → Create New Token named `oborot-ci-source-maps` with scope `project:releases` → copy → `SENTRY_AUTH_TOKEN`.
5. **Populate `.env.local`** (repo root or per-app — not committed):
   ```
   VITE_SENTRY_DSN=<landing-DSN>
   NEXT_PUBLIC_SENTRY_DSN=<app-DSN>
   SENTRY_AUTH_TOKEN=<your-auth-token>
   ```
6. **Smoke-test landing capture:** run `npm run dev --workspace=apps/landing`, trigger an error in browser console, verify event appears in Sentry dashboard (<60s).
7. **Smoke-test app capture:** add a temporary `throw` in a client component, run `npm run dev --workspace=apps/app`, verify event reaches the app project.
8. **Configure inbound filters + rate limits** per project (D-08 Claude's Discretion): enable "Filter out errors known to be unactionable", stay within 5k events/month free tier.
9. **Record DSNs in password manager + Cloudflare Pages env vars** (Plan 01-08 hosting). Never commit DSNs to git.

**Impact of deferral:** Until step 5 completes, production errors are silently dropped (SDK no-ops when DSN empty). No crashes, no regressions — just no observability. Plan 01-07 CI will also skip source-maps upload until `SENTRY_AUTH_TOKEN` is set as a GitHub Actions secret.

## Issues Encountered

- **Two Next-15-facing deprecation warnings** on `npm run build --workspace=apps/app`:
  - `disableLogger` → suggest `webpack.treeshake.removeDebugLogging`
  - `sentry.client.config.js` → suggest `instrumentation-client.ts`
  Both are informational on Next 14.2.35; no action needed until Next upgrade (post-Phase 1).
- **2 moderate + 1 high npm audit vulnerabilities** (carried forward from Plan 01-02+04 tree; not introduced by Sentry install).
- **PreToolUse read-before-edit hook warnings** fired multiple times during Edit calls — files were all read at session start; edits all landed correctly (verified by post-edit inspection + tests + commit diffs).

## Deferred Issues

| Category | Item | Reason |
|----------|------|--------|
| Observability | Live Sentry account + DSNs + smoke events | User Setup — step-by-step in section above. Deferred to post-Wave-6 per execution prompt. |
| Deprecations | `disableLogger` → `webpack.treeshake.removeDebugLogging` | Next 15+ upgrade (post-Phase 1). |
| Deprecations | `sentry.client.config.js` → `instrumentation-client.ts` | Next 15+ upgrade; requires Turbopack-compat refactor. |
| Security | 2 moderate + 1 high npm audit | Pre-existing transitive CVEs; tracked since Plan 01-02. |
| PII-masking | `replayIntegration({maskAllText: false})` | Intentional for waitlist stage (no real PII yet per RESEARCH Pitfall 8). Flip to `true` when Phase 3 auth arrives. |
| Grep-glob | Task 3 verify regex doesn't exclude `dist/` | Plan 06 ESLint `no-console` rule glob should exclude `dist/` and `.next/` to avoid false positives on bundled artifacts. |

## Threat Flags

No new threat surface beyond the plan's `<threat_model>`. All five threats mitigated or explicitly accepted:

- **T-1-05-01 (DSN in client bundle, accept):** DSN is designed to be public; inbound filters + rate limits are deferred to developer dashboard config (step 8 of User Setup).
- **T-1-05-02 (PII in replay, accept current stage):** `maskAllText: false` documented as intentional for waitlist; revisit flagged in Deferred Issues.
- **T-1-05-03 (SENTRY_AUTH_TOKEN leak, mitigate):** Token referenced only as `process.env.SENTRY_AUTH_TOKEN` in `apps/landing/vite.config.js`. Verified: `grep -r 'SENTRY_AUTH_TOKEN' apps/ --include='*.js' --include='*.jsx'` returns only that one vite.config.js line. Never prefixed with `VITE_` or `NEXT_PUBLIC_`.
- **T-1-05-04 (instrumentationHook missing, mitigate):** Flag set explicitly; `grep -q 'instrumentationHook: true' apps/app/next.config.js` passes. Smoke-test in user setup step 7 confirms server events flow.
- **T-1-05-05 (dummy DSN in CI build, accept):** CI build validates build integrity only; real capture is gated by prod env vars (Cloudflare Pages in Plan 08). Documented.

## Next Phase Readiness

- **FOUND-05 satisfied at code level**: SDK installed, init wired client+server+edge in both apps, all console.error sites migrated. `REQUIREMENTS.md` FOUND-05 checkbox can be ticked.
- **Ready for Plan 01-06 (ESLint)**: the `no-console: error` rule Plan 06 will enforce is already satisfied by this plan (0 console.error in source). ESLint config should exclude `dist/` + `.next/` + `node_modules/` globs to avoid false positives on bundled artifacts.
- **Ready for Plan 01-07 (CI)**: CI matrix can build both workspaces with dummy env (pattern established here). Plan 07 must add `SENTRY_AUTH_TOKEN` as GitHub Actions secret to activate source-maps upload (landing Vite plugin + app `withSentryConfig`).
- **Ready for Plan 01-08 (Cloudflare Pages)**: Plan 08 must populate `VITE_SENTRY_DSN` in CF Pages env vars to activate live capture on landing. App DSN populated wherever app deploys (Phase 2 ADR).
- **Bisect-safe**: HEAD~2 (`5ab830d`) green; HEAD~1 (`e492d4e`) adds Sentry deps + wiring — green with dummy env; HEAD (`2d69b58`) adds `Sentry.captureException` migrations — green.

## Self-Check: PASSED

Verified before STATE.md updates:

- **Commits exist:**
  - `e492d4e` — `feat(sentry): add @sentry/react to landing + @sentry/nextjs to app` ✓
  - `2d69b58` — `refactor: replace console.error with Sentry.captureException` ✓
- **All 5 new files exist:** `test -f apps/app/{sentry.client,sentry.server,sentry.edge}.config.js apps/app/instrumentation.js apps/app/app/global-error.jsx` all pass.
- **No unintentional deletions:** `git diff --diff-filter=D --name-only HEAD~2 HEAD` empty.
- **Dep versions confirmed:** `node -p "require('./apps/landing/package.json').dependencies['@sentry/react']"` → `^10.49.0`; same for vite-plugin (devDeps) and @sentry/nextjs.
- **Next-14 flag present:** `grep -q 'instrumentationHook: true' apps/app/next.config.js` passes.
- **Source sourcemap flag present:** `grep -q 'sourcemap: true' apps/landing/vite.config.js` passes.
- **Sentry.init guard present:** `grep -q 'env?.VITE_SENTRY_DSN' apps/landing/src/main.jsx` passes.
- **replayIntegration correctly scoped:** present in client config; absent in server + edge configs.
- **Zero console.error in source:** verified above (scoped grep).
- **Both test suites green:** 6 landing + 2 app passing.
- **Both builds clean:** landing exit 0, app exit 0 (with dummy env).
- **Working tree clean post-commits:** `git status --short` empty.

---
*Phase: 01-foundation-repo-cleanup*
*Completed: 2026-04-21*
