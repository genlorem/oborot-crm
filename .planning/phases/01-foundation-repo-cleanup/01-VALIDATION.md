---
phase: 1
slug: foundation-repo-cleanup
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-04-21
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | vitest 3.2.4 (both apps; pinned due to Vite 5 peer) + @testing-library/react |
| **Config file** | `apps/landing/vitest.config.js`, `apps/app/vitest.config.mjs` (created Wave 0 by FOUND-03) |
| **Quick run command** | `npm run test -w apps/landing && npm run test -w apps/app` |
| **Full suite command** | `npm run lint && npm run test && npm run build` (root — delegates to each workspace) |
| **Estimated runtime** | ~45 seconds (no real network, jsdom + happy-dom) |

---

## Sampling Rate

- **After every task commit:** Run `{quick run command}` for the workspace whose files changed.
- **After every plan wave:** Run full suite (lint + test + build) across both workspaces.
- **Before `/gsd-verify-work`:** Full suite green + CF Pages preview deploy reachable + Sentry test event received from both apps.
- **Max feedback latency:** 60 seconds (vitest alone ~10s per app; ~45s for full root suite).

---

## Per-Task Verification Map

> Populated during /gsd-plan-phase — one row per plan task. Status updated during execution.

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 1-01-01 | 01 | 1 | FOUND-01 | — | Repo root clean; no stale deletions in `git status` | automated | `git status --porcelain \| grep -E '^ D ' \| wc -l \| xargs test 0 -eq` | ❌ W0 | ⬜ pending |
| 1-02-01 | 02 | 1 | FOUND-01 | — | `nashsklad`/`НашСклад` absent from tracked code | automated | `git grep -in 'nashsklad\|НашСклад' -- '*.js' '*.jsx' '*.json' '*.md' \| wc -l \| xargs test 0 -eq` | ❌ W0 | ⬜ pending |
| 1-03-01 | 03 | 2 | FOUND-02 | T-1-ENV-01 | App fails start with actionable error on missing env | unit + smoke | `vitest run env` in each app | ❌ W0 | ⬜ pending |
| 1-04-01 | 04 | 2 | FOUND-03 | — | Vitest runs green in both apps | unit | `npm run test -w apps/landing && npm run test -w apps/app` | ❌ W0 | ⬜ pending |
| 1-05-01 | 05 | 3 | FOUND-04 | — | CI green on sample PR (lint+test+build) | E2E | `gh run list --workflow=ci.yml --limit=1 --json conclusion -q '.[0].conclusion' \| grep -q success` | ❌ W0 | ⬜ pending |
| 1-06-01 | 06 | 3 | FOUND-05 | T-1-SENTRY-01 | Sentry captures a test error from landing | manual+probe | curl landing `/sentry-test` route → event id visible in Sentry | ❌ W0 | ⬜ pending |
| 1-06-02 | 06 | 3 | FOUND-05 | T-1-SENTRY-01 | Sentry captures a test error from app | manual+probe | `/api/sentry-test` route in Next app → event visible | ❌ W0 | ⬜ pending |
| 1-07-01 | 07 | 4 | FOUND-06 | T-1-DNS-01 | Landing reachable via CF Pages, not Railway | synthetic | `curl -sI https://oborotcrm.ru \| grep -i 'cf-ray'` | ❌ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

**Note:** Plan/Wave/TaskId values are placeholders pending /gsd-planner output. Planner must update this table with actual task IDs during planning.

---

## Wave 0 Requirements

- [ ] `apps/landing/vitest.config.js` + `apps/landing/src/test/setup.js` (jsdom, @testing-library/jest-dom)
- [ ] `apps/app/vitest.config.mjs` + `apps/app/test/setup.js` (jsdom, next/navigation mock)
- [ ] Install vitest@3.2.4, @vitest/ui@3.2.4, @testing-library/react, @testing-library/jest-dom, happy-dom in both apps (version pinned per research)
- [ ] Install @sentry/react@^10, @sentry/vite-plugin@^3 (landing)
- [ ] Install @sentry/nextjs@^10 (app) with `experimental.instrumentationHook: true` in `next.config.mjs`
- [ ] Install zod@^3 at root or per-app for env validator (D-23 resolved to zod by research §7)
- [ ] Create `.github/workflows/ci.yml` (first CI run seeds caches)
- [ ] CF Pages project created and wired to GitHub (manual prerequisite — may block FOUND-06 until user enables)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Sentry dashboard shows events from both apps | FOUND-05 | Requires Sentry org access (external SaaS) | Trigger dev-only `/sentry-test` route in each app, open Sentry dashboard, verify events show up with correct release tag |
| CF Pages preview URL generated for a PR | FOUND-06 | Requires CF account wired to repo | Open a PR with trivial landing change, confirm CF Pages bot posts preview URL in PR comments |
| `oborotcrm.ru` DNS points to Cloudflare | FOUND-06 | Requires registrar access | `dig NS oborotcrm.ru` returns `*.ns.cloudflare.com` |
| TLS auto-provisioned by Cloudflare | FOUND-06 | Cert issuance is async | `curl -sI https://oborotcrm.ru` returns 200 with valid cert (chrome://badge green) |
| New contributor 10-min onboarding works | FOUND-02 | Requires fresh environment | Fresh clone on secondary machine, follow README, both apps up within 10 min |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags in CI (`vitest run`, not `vitest`)
- [ ] Feedback latency < 60s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
