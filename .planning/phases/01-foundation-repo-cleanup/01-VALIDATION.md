---
phase: 1
slug: foundation-repo-cleanup
status: planned
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-21
planned: 2026-04-21
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution. Updated after /gsd-plan-phase with real task IDs from plans 01-08.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.2.4 (both apps; pinned due to Vite 5 peer) + @testing-library/react |
| **Config file** | `apps/landing/vitest.config.js`, `apps/app/vitest.config.js` (created Plan 04) |
| **Quick run command** | `npm run test --workspace=apps/landing && npm run test --workspace=apps/app` |
| **Full suite command** | `npm run lint && npm run test && npm run build` (root — delegates via workspace matrix) |
| **Estimated runtime** | ~45 seconds (no real network; jsdom; smoke + hook unit) |

---

## Sampling Rate

- **After every task commit:** Run quick Vitest for the workspace whose files changed (`npm run test --workspace=apps/<name>`)
- **After every plan wave:** Run full suite (lint + test + build) across both workspaces
- **Before `/gsd-verify-work`:** Full suite green + CF Pages preview reachable + Sentry receives a test event from both apps (manual)
- **Max feedback latency:** 60 seconds (vitest ~10s per app; full root ~45s)

---

## Per-Task Verification Map

Populated from Plans 01-08. Task IDs follow `{phase}-{plan}-{task}` format.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|--------|
| 1-01-01 | 01 | 1 | FOUND-01 | T-1-01-02 | .gitignore extended, .DS_Store no longer untracked | unit | `grep -q '^\.DS_Store$' .gitignore && grep -q '^\*\*/\.DS_Store$' .gitignore` | ⬜ pending |
| 1-01-02 | 01 | 1 | FOUND-01 | T-1-01-01 | All 18 stale root deletions committed | unit | `git status --porcelain \| grep '^ D ' \| wc -l \| xargs test 0 -eq` | ⬜ pending |
| 1-01-03 | 01 | 1 | FOUND-01 | T-1-01-03 | framer-motion removed; landing still builds | integration | `! grep -q 'framer-motion' apps/landing/package.json && npm run build --workspace=apps/landing 2>&1 \| grep -q 'built in'` | ⬜ pending |
| 1-02-01 | 02 | 2 | FOUND-01 | T-1-02-01 | Package names renamed (root + both workspaces) | unit | `node -p "require('./package.json').name" \| grep -q '^oborot-crm$'` | ⬜ pending |
| 1-02-02 | 02 | 2 | FOUND-01 | — | GAS header + launch.json rebranded | unit | `grep -q 'Оборот — Google Apps Script' apps/landing/google-apps-script.js && ! grep -q nashsklad .claude/launch.json` | ⬜ pending |
| 1-02-03 | 02 | 2 | FOUND-01 | T-1-02-02 | Zero 'nashsklad'/'НашСклад' in tracked code; lockfile regenerated | integration | `git grep -iE 'nashsklad\|НашСклад' -- ':!.planning/' ':!package-lock.json' \| wc -l \| xargs test 0 -eq && grep -qE '@oborot/(landing\|app)' package-lock.json` | ⬜ pending |
| 1-03-01 | 03 | 3 | FOUND-02 | T-1-03-01 | Zod validators + EnvErrorBanner created; supabase.js rewired | smoke | `test -f apps/landing/src/lib/env.js && test -f apps/app/lib/env.js && grep -q clientEnv apps/app/lib/supabase.js` | ⬜ pending |
| 1-03-02 | 03 | 3 | FOUND-02 | T-1-03-04 | Three .env.example files present | unit | `test -f .env.example && test -f apps/landing/.env.example && test -f apps/app/.env.example && grep -q NEXT_PUBLIC_SENTRY_DSN apps/app/.env.example` | ⬜ pending |
| 1-03-03 | 03 | 3 | FOUND-02 | — | Root + per-app READMEs written | unit | `test -f README.md && test -f apps/landing/README.md && test -f apps/app/README.md && grep -qE 'Cloudflare Pages' apps/landing/README.md` | ⬜ pending |
| 1-04-01 | 04 | 4 | FOUND-03 | — | Landing Vitest suite green (App + useForm + env) | unit | `npm run test --workspace=apps/landing 2>&1 \| grep -qE 'Tests.*passed\|✓'` | ⬜ pending |
| 1-04-02 | 04 | 4 | FOUND-03 | T-1-04-03 | App Vitest suite green (layout + login) | unit | `npm run test --workspace=apps/app 2>&1 \| grep -qE 'Tests.*passed\|✓'` | ⬜ pending |
| 1-05-01 | 05 | 5 | FOUND-05 | T-1-05-01 | Sentry React installed; vite plugin + sourcemap; main.jsx init guarded | integration | `grep -q sentryVitePlugin apps/landing/vite.config.js && grep -q Sentry.init apps/landing/src/main.jsx && npm run build --workspace=apps/landing 2>&1 \| grep -q 'built in'` | ⬜ pending |
| 1-05-02 | 05 | 5 | FOUND-05 | T-1-05-04 | @sentry/nextjs + instrumentationHook=true; 3 runtime configs | integration | `grep -q 'instrumentationHook: true' apps/app/next.config.js && test -f apps/app/instrumentation.js && test -f apps/app/app/global-error.jsx` | ⬜ pending |
| 1-05-03 | 05 | 5 | FOUND-05 | — | Zero console.error outside tests | unit | `[ $(grep -rn 'console\.error' apps/ --include='*.js' --include='*.jsx' 2>/dev/null \| grep -vE '__tests__\|\.test\.\|\.spec\.' \| wc -l) -eq 0 ]` | ⬜ pending |
| 1-05-04 | 05 | 5 | FOUND-05 | — | Developer sets up Sentry org + DSNs (checkpoint:human-action) | manual | Resume-signal from developer: `approved: sentry wired, smoke event received in both projects` | ⬜ pending |
| 1-06-01 | 06 | 6 | FOUND-04 | T-1-06-01 | ESLint flat config with no-console rule; both workspace lints green | integration | `test -f eslint.config.js && grep -q "'no-console': \['error'" eslint.config.js && npm run lint --workspace=apps/landing && npm run lint --workspace=apps/app` | ⬜ pending |
| 1-07-01 | 07 | 7 | FOUND-04 | — | CI workflow file created with matrix | unit | `test -f .github/workflows/ci.yml && grep -q 'app: \[landing, app\]' .github/workflows/ci.yml` | ⬜ pending |
| 1-07-02 | 07 | 7 | FOUND-04 | T-1-07-03 | First CI run green; branch protection set (checkpoint:human-action) | E2E manual | `gh run list --workflow=ci.yml --limit=1 --json conclusion -q '.[0].conclusion' \| grep -q success` + developer confirms branch protection rule active | ⬜ pending |
| 1-08-01 | 08 | 8 | FOUND-06 | T-1-08-01 | CF Pages project live; preview on PR works (checkpoint:human-action) | E2E manual | Developer confirms `https://oborot-landing.pages.dev` renders landing + PR opens CF preview comment | ⬜ pending |
| 1-08-02 | 08 | 8 | FOUND-06 | T-1-08-01 | DNS cutover done; oborotcrm.ru on Cloudflare (checkpoint:human-action) | synthetic | `dig @8.8.8.8 oborotcrm.ru NS \| grep -q cloudflare && curl -sI https://oborotcrm.ru \| grep -iE '^server:\s*cloudflare'` | ⬜ pending |
| 1-08-03 | 08 | 8 | FOUND-06 | T-1-08-02 | railway.json removed; no Railway references remain | unit | `test ! -f railway.json && [ $(git grep -iE 'railway\.json\|railway\.app\|RAILWAY_' -- ':!.planning/' 2>/dev/null \| wc -l) -eq 0 ]` | ⬜ pending |
| 1-08-04 | 08 | 8 | FOUND-06 | — | All 5 ROADMAP Phase 1 success criteria met (phase-level checkpoint:human-verify) | manual | Developer acceptance walkthrough; resume-signal `approved: all 5 ROADMAP Phase 1 success criteria met` | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**Coverage note:** Every FOUND-01..FOUND-06 requirement has at least one task in the map. FOUND-04 appears in two tasks (06 ESLint for lint precondition + 07 GitHub Actions for the workflow itself). FOUND-05 appears in three (05-01, 05-02, 05-03) to cover landing SDK + app SDK + console.error migration distinctly.

---

## Wave 0 Requirements

All test/infra scaffolding needed BEFORE implementation tasks is bundled into the plans themselves — no separate Wave 0 exists. Specifically:
- Plan 04 creates Vitest configs + setup files (covers FOUND-03 test infrastructure)
- Plan 06 creates eslint.config.js (covers FOUND-04 lint precondition)
- Plan 07 creates .github/workflows/ci.yml (covers FOUND-04 CI)
- Plan 03 creates env validators before Plan 04 tests can reference them

Additional manual prerequisites (must happen before the relevant plan can close):
- **Sentry account + DSN** (Plan 05 Task 4 — may be skipped; SDK no-ops without DSN)
- **GitHub SENTRY_AUTH_TOKEN secret + branch protection on `main`** (Plan 07 Task 2)
- **Cloudflare account + CF Pages project + custom domain + registrar nameserver change** (Plan 08 Tasks 1-2)
- **Railway service deletion** (Plan 08 Task 3 prerequisite)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Sentry dashboard shows events from both apps | FOUND-05 | Requires Sentry org access (external SaaS) | Trigger throwaway `throw new Error(...)` in each app in dev, verify events appear in Sentry dashboard within 60s |
| CF Pages preview URL generated on PR | FOUND-06 | Requires CF Pages project + GitHub App wiring | Open PR → CF Pages posts preview URL comment → open URL → landing renders |
| `oborotcrm.ru` DNS points to Cloudflare | FOUND-06 | Requires registrar access | `dig NS oborotcrm.ru` returns `*.ns.cloudflare.com` |
| TLS auto-provisioned by Cloudflare | FOUND-06 | Cert issuance async | `curl -sI https://oborotcrm.ru` returns 200 + `server: cloudflare` header + valid cert chain |
| New contributor 10-min onboarding | FOUND-02 | Requires fresh environment | Fresh clone on secondary machine → follow root README → both apps up within 10 min |
| Red CI blocks merge | FOUND-04 | Requires branch protection rule + live PR | Developer opens throwaway PR with intentionally failing test → CI red → Merge button disabled |

---

## Validation Sign-Off

- [x] All tasks have `<action>` and `<verify>` (per gsd-sdk query verify.plan-structure — all 8 plans valid)
- [x] Sampling continuity: no 3 consecutive tasks without automated verify (checkpoints gate but non-checkpoint tasks all have grep-checkable `<automated>` lines)
- [x] Wave 0 covered by Plans 03/04/06/07 as their first-step scaffolding (no separate Wave 0 phase)
- [x] No watch-mode flags in CI (`vitest run` not `vitest`)
- [x] Feedback latency < 60s for local test runs
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** planned (8 plans; all structurally valid; manual prerequisites documented)
