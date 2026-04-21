---
phase: 01-foundation-repo-cleanup
plan: 02
subsystem: infra
tags: [rebrand, monorepo, package-names, lockfile]

# Dependency graph
requires: [01-01]
provides:
  - "Root package.json name is 'oborot-crm'"
  - "apps/landing package name is '@oborot/landing'"
  - "apps/app package name is '@oborot/app'"
  - "package-lock.json regenerated with @oborot/* workspace entries (4 refs, zero @nashsklad)"
  - "Workspace symlinks resolve: node_modules/@oborot/{landing,app}"
affects: [01-03, 01-04, 01-05, 01-06, 01-07, 01-08]

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "atomic-rebrand-commit: 3 package.json renames + GAS header + debug launch.json + regenerated lockfile in a single commit per D-18"
    - "lockfile-regen-in-same-commit: rm -rf node_modules package-lock.json && npm install before commit to keep CI cache hash aligned with name change (RESEARCH §Pitfall 7)"

key-files:
  created: []
  modified:
    - package.json
    - apps/landing/package.json
    - apps/app/package.json
    - apps/landing/google-apps-script.js
    - .claude/launch.json
    - package-lock.json
  deleted: []

key-decisions:
  - "Single atomic commit per D-18 — all 6 files (3 package.json + GAS header + launch.json + lockfile) land together; bisect-safe (builds before and after)"
  - "Lockfile regen via rm -rf node_modules package-lock.json && npm install (not npm install alone) — guarantees no stale @nashsklad/* symlinks linger in node_modules tree"
  - ".claude/launch.json rebrand included (Claude's Discretion per D-19 'любые другие вхождения') — hygiene, not user-facing"

patterns-established:
  - "Cross-cutting rename discipline: perform all string substitutions first, then regenerate generated artifacts (lockfile) in the same commit so CI invalidates cache atomically"

requirements-completed: [FOUND-01]

# Metrics
duration: 2min
completed: 2026-04-21
---

# Phase 01 Plan 02: Rebrand nashsklad → oborot Summary

**Single atomic commit `chore: rebrand nashsklad to oborot` renames 3 package.json name fields to `oborot-crm` / `@oborot/landing` / `@oborot/app`, rebrands GAS header and debug launch config, and regenerates package-lock.json — landing (241.45 kB) and app (Next.js, 4 routes) both build clean with new names.**

## Performance

- **Duration:** ~2 min
- **Started:** 2026-04-21T07:31:57Z
- **Completed:** 2026-04-21T07:33:58Z
- **Tasks:** 3
- **Commits:** 1 (atomic per D-18)
- **Files modified:** 6

## Accomplishments

- **All three package.json names renamed** — `nashsklad` → `oborot-crm` (root), `@nashsklad/landing` → `@oborot/landing`, `@nashsklad/app` → `@oborot/app`. Workspaces, scripts, deps untouched — surgical one-line-per-file edits.
- **Google Apps Script header rebranded** — `apps/landing/google-apps-script.js` line 2: `НашСклад — Google Apps Script` → `Оборот — Google Apps Script`. Total line count preserved (58). GAS file not re-deployed (deploy is separate manual step, not in this plan's scope).
- **Debug config rebranded** — `.claude/launch.json` `"nashsklad-landing"` → `"oborot-landing"`.
- **Lockfile regenerated from scratch** — full `rm -rf node_modules package-lock.json && npm install` (26s, 167 packages), producing `package-lock.json` with 4 `@oborot/(landing|app)` refs and 0 `@nashsklad/*` refs. Stale workspace symlinks eliminated.
- **Both apps build clean** — landing: 241.45 kB (gzip 77.62 kB) in 505ms; app: Next.js optimized build, 4 static routes generated, no errors.
- **Bisect-safe history** — repo builds both at `HEAD~1` (post-Plan-01-01 cleanup, old names) and `HEAD` (post-rebrand, new names).

## Task Commits

One atomic commit encompassing all three tasks per D-18:

1. **Tasks 1 + 2 + 3 (atomic rebrand)** — `d353111` (chore): `chore: rebrand nashsklad to oborot`
   - 6 files changed, 229 insertions(+), 218 deletions(-)
   - Files: `package.json`, `apps/landing/package.json`, `apps/app/package.json`, `apps/landing/google-apps-script.js`, `.claude/launch.json`, `package-lock.json`

## Files Created/Modified

- **`package.json`** (root) — `"name": "nashsklad"` → `"name": "oborot-crm"`. Only line 2 touched.
- **`apps/landing/package.json`** — `"name": "@nashsklad/landing"` → `"name": "@oborot/landing"`. Only line 2 touched.
- **`apps/app/package.json`** — `"name": "@nashsklad/app"` → `"name": "@oborot/app"`. Only line 2 touched.
- **`apps/landing/google-apps-script.js`** — line 2 header rebranded. File length unchanged (58 lines).
- **`.claude/launch.json`** — configuration `"name"` field rebranded.
- **`package-lock.json`** — full regeneration. 437 lines touched (diff stat); `lockfileVersion` preserved; workspace entries now `@oborot/landing` and `@oborot/app`.

## Verification Output

**Grep for stray brand strings (excl. `.planning/`, `package-lock.json`):**
```
$ git grep -iE 'nashsklad|НашСклад' -- ':!.planning/' ':!package-lock.json'
(zero lines — CLEAN)
```

**Lockfile internal consistency:**
```
$ grep -cE '@oborot/(landing|app)' package-lock.json
4
$ grep -cE '@nashsklad/' package-lock.json
0
```

**Workspace symlink resolution:**
```
$ ls -la node_modules/@oborot/
lrwxr-xr-x  app     -> ../../apps/app
lrwxr-xr-x  landing -> ../../apps/landing

$ ls -la node_modules/@nashsklad/
(does not exist — clean)
```

**Landing build (apps/landing):**
```
> @oborot/landing@0.1.0 build
> vite build
✓ 52 modules transformed.
dist/index.html                   0.84 kB │ gzip:  0.56 kB
dist/assets/index-CBxiN0v1.css   19.21 kB │ gzip:  4.54 kB
dist/assets/index-BpWV_byP.js   241.45 kB │ gzip: 77.62 kB
✓ built in 505ms
```

**App build (apps/app):**
```
> @oborot/app@0.1.0 build
> next build
▲ Next.js 14.2.35
✓ Compiled successfully
✓ Generating static pages (6/6)
Route (app)                              Size     First Load JS
┌ ○ /                                    138 B          87.3 kB
├ ○ /_not-found                          873 B          88.1 kB
├ ○ /dashboard                           995 B          88.2 kB
└ ○ /login                               620 B          87.8 kB
```

Note: The Next.js build completed without the env-validator error mentioned as "expected at this stage" in the plan action block — because env validation is NOT yet wired (Plan 03 will add it). `@supabase/supabase-js@createClient` was called with `undefined` URL/key at module-load but does not throw on construction; Plan 03 will introduce Zod guards that fail fast.

## Decisions Made

- **Single atomic commit per D-18.** All 6 files committed together. Rationale: package.json + lockfile are cross-referenced (lockfile embeds workspace names); splitting into separate commits would produce intermediate states where `npm ci` would diverge from on-disk state. Bisect-safe because every tool (vite, next, npm) reads both files together.
- **Full lockfile regen (rm + install) rather than `npm install` alone.** Rationale: `npm install` without prior removal leaves workspace symlinks in `node_modules/@nashsklad/*` from the previous install's cache. Clean regen guarantees no stale aliases — verified by `ls node_modules/@nashsklad` not existing post-install.
- **`.claude/launch.json` included in the rebrand commit.** CONTEXT D-19 calls out "любые другие вхождения"; PATTERNS §28 flags this as optional hygiene. Including it now keeps the commit genuinely atomic — otherwise a follow-up rename commit would break the "single PR per D-18" guidance.

## Deviations from Plan

None — plan executed exactly as written.

All acceptance criteria from all three tasks passed on first attempt:
- Task 1: `node -p "require('./package.json').name"` → `oborot-crm`; landing → `@oborot/landing`; app → `@oborot/app`.
- Task 2: GAS header `* Оборот — Google Apps Script` (exact match); launch.json has `oborot-landing`, zero `nashsklad`; wc -l of GAS file = 58 (unchanged).
- Task 3: grep clean; lockfile has 4×`@oborot/*`, 0×`@nashsklad/*`; both builds succeed; `node_modules/@oborot/*` symlinks present; commit message exactly `chore: rebrand nashsklad to oborot`.

## Issues Encountered

- **PreToolUse read-before-edit hook warnings** (3× on package.json, 1× on google-apps-script.js, 1× on launch.json). In each case the files had just been read via the initial context-loading Read calls; the Edit tool nonetheless completed successfully and downstream verification confirmed the content. No re-Read was needed — the hook is informational. Same pattern observed in Plan 01-01.
- **`npm audit` surfaced 3 pre-existing vulnerabilities** (2 moderate, 1 high) at install time. Out-of-scope per the executor's scope-boundary rule (not caused by this task's changes; these are pre-existing dep-tree CVEs). Logged for future attention; not fixing here.

## Deferred Issues

| Category | Item | Reason |
|----------|------|--------|
| Security | 3 npm audit vulnerabilities (2 moderate, 1 high) surfaced post-regen | Pre-existing; out-of-scope for this rebrand plan. Recommend triage in a dedicated `chore: audit dep tree` plan or during Plan 01-05/06 (Sentry/CI) when we add supply-chain monitoring |

## User Setup Required

None — no external service configuration required. GAS script is NOT re-deployed to Google Apps Script in this plan (deployment is a separate manual step; the cosmetic header change takes effect on next deploy whenever that happens, which is out of scope for Phase 1).

## Next Phase Readiness

- **Package names consistent across repo** — Wave 3 plans (01-03 env validation, 01-04 tests, 01-05 Sentry, 01-06 ESLint, 01-07 CI, 01-08 CF Pages hosting) can freely add dev-deps via `npm install --workspace=apps/landing/@oborot-based commands without name-collision surprises.
- **Lockfile cache key flipped** — when CI is wired up in Plan 01-07, the first CI run will see a fresh cache miss and regenerate correctly. No stale `@nashsklad` cache artefacts will linger.
- **Bisect surface clean** — git-bisect between 01-01 and 01-02 commits produces buildable intermediate states in both directions.
- **FOUND-01 satisfied** — PROJECT-level requirement (package rename + text rebrand per D-17, D-18, D-19) is now complete. REQUIREMENTS.md FOUND-01 checkbox will be ticked by the final metadata commit.

## Self-Check: PASSED

Verified before STATE.md updates:

- **Commit `d353111` exists** — `git log -1 --pretty='%h %s'` → `d353111 chore: rebrand nashsklad to oborot`.
- **6 files in the commit** — `git show --stat HEAD | grep '|'` shows exactly: `.claude/launch.json`, `apps/app/package.json`, `apps/landing/google-apps-script.js`, `apps/landing/package.json`, `package-lock.json`, `package.json`.
- **Zero deletions in commit** — `git diff --diff-filter=D --name-only HEAD~1 HEAD` returns empty.
- **Grep clean in tracked code** — `git grep -iE 'nashsklad|НашСклад' -- ':!.planning/' ':!package-lock.json'` returns zero lines.
- **Lockfile consistent** — `@oborot/(landing|app)` count = 4; `@nashsklad/` count = 0.
- **Landing build artifact exists** — `apps/landing/dist/index.html` + `apps/landing/dist/assets/` present after `npm run build --workspace=apps/landing`.
- **Working tree state** — `git status --short` shows zero modifications (all committed).

---
*Phase: 01-foundation-repo-cleanup*
*Completed: 2026-04-21*
