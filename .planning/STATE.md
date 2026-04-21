---
gsd_state_version: 1.0
milestone: v1.0
milestone_name: milestone
status: executing
stopped_at: Completed 01-05-PLAN.md
last_updated: "2026-04-21T09:14:33.000Z"
last_activity: 2026-04-21
progress:
  total_phases: 7
  completed_phases: 0
  total_plans: 8
  completed_plans: 5
  percent: 63
---

# Project State

## Project Reference

See: .planning/PROJECT.md (updated 2026-04-21)

**Core value:** Продавец, живущий на маркетплейсах, может вести учёт и смотреть аналитику без прослоек и без потери данных — нативные интеграции WB/Ozon/ЯМ + бесконечное хранение истории.
**Current focus:** Phase 01 — Foundation & Repo Cleanup

## Current Position

Phase: 01 (Foundation & Repo Cleanup) — EXECUTING
Plan: 6 of 8
Status: Ready to execute
Last activity: 2026-04-21

Progress: [██████░░░░] 63%

## Performance Metrics

**Velocity:**

- Total plans completed: 0
- Average duration: —
- Total execution time: 0.0 hours

**By Phase:**

| Phase | Plans | Total | Avg/Plan |
|-------|-------|-------|----------|
| — | — | — | — |

**Recent Trend:**

- Last 5 plans: —
- Trend: — (no data yet)

*Updated after each plan completion*
| Phase 01 P01 | 2min | 3 tasks | 3 files |
| Phase 01 P02 | 2min | 3 tasks | 6 files |
| Phase 01 P03 | 4min | 3 tasks tasks | 15 files files |
| Phase 01 P04 | 2min | 2 tasks | 12 files |
| Phase 01 P05 | 4min | 3 tasks (+1 checkpoint deferred) | 14 files |

## Accumulated Context

### Decisions

Decisions are logged in PROJECT.md Key Decisions table.
Recent decisions affecting current work:

- Pre-Phase 1: Монорепо npm workspaces `apps/landing` (Vite) + `apps/app` (Next.js) — зафиксировано существующим кодом
- Pre-Phase 1: Supabase как платформа для БД + Auth — клиент уже проинициализирован в `apps/app/lib/supabase.js`
- Pre-Phase 1: Lead capture переносим на Supabase (отказ от Google Sheets) — Phase 2
- Pre-Phase 1: Industry-modules = core + shells (не отдельные приложения) — Phase 4
- Pre-Phase 1: Infinite analytics retention — архитектурное решение с v1, закладываем в Phase 5
- Pre-Phase 1: GSD управляет только engineering; маркетинг (500k ₽ на посевы/VK/YouTube/PR/выставку/печать) остаётся в корневом `ROADMAP.md`
- Plan 01-01: committed .gitignore before 18-file deletion so .DS_Store ignored immediately (bisect-friendly hygiene order)
- Plan 01-01: framer-motion removed from apps/landing (zero import sites; landing build 240.81 kB ok)
- Plan 01-01: explicit per-path git add for deletions to exclude unrelated STATE.md mod from the cleanup commit
- Plan 01-02: single atomic rebrand commit (D-18) covering 3 package.json + GAS header + launch.json + regenerated lockfile — bisect-safe
- Plan 01-02: full lockfile regen via rm -rf node_modules package-lock.json && npm install to eliminate stale @nashsklad/* workspace symlinks
- Plan 01-03: Zod v4 API — use .issues not .errors (v3→v4 rename); applied to both env validators
- Plan 01-03: main.jsx uses dynamic import().then/.catch (not top-level await) — Vite ES2020 target rejects TLA
- Plan 01-03: two atomic commits — feat(env) covers Zod+validators+.env.example (12 files), docs covers READMEs (3 files); both bisect-safe
- Plan 01-04: single combined commit per plan Step H — Vitest 3.2.4 + RTL 16.3.2 in both workspaces; 8 tests total (landing 6, app 2); plan's verify regex matches exactly `test: add Vitest + smoke + unit tests (landing + app)`
- Plan 01-04: Zod v4 `.issues` + Vite TLA gotchas from Wave 3 stayed dormant — env.test.js uses Vitest runtime (no Vite build path), env validator's `.issues` already fixed in Plan 03
- Plan 01-04: `typeof RootLayout === 'function'` smoke instead of render — avoids jsdom nested-html crash (RESEARCH Pitfall 4)
- Plan 01-04: app vitest.setup.js pre-populates synthetic `NEXT_PUBLIC_SUPABASE_*` so RootLayout's `import '../lib/env'` side-effect survives test boot
- Plan 01-05: Assumption A1 VERIFIED — `reactRouterV7BrowserTracingIntegration` present in @sentry/react 10.49.0 (no V6 fallback needed)
- Plan 01-05: manual Sentry setup preferred over wizard — wizard favors Next 15+ and silently skips the Next-14 `experimental.instrumentationHook: true` flag (RESEARCH Pitfall 2)
- Plan 01-05: preserved main.jsx `.then()/.catch()` chain instead of plan-template top-level await — Vite ES2020 rejects TLA (Plan 03 gotcha carried forward); `Sentry.init` runs inside the env-load `.then()` callback
- Plan 01-05: Task 4 (checkpoint:human-action for Sentry DSN) auto-deferred per execution prompt — all code paths no-op when DSN absent; account creation scheduled post-Wave-6
- Plan 01-05: replayIntegration only in client config (browser-only API); server/edge configs omit it
- Plan 01-05: direct `Sentry.captureException(e, {tags: {op: ...}})` calls — no logger wrapper (5 sites don't justify abstraction per PATTERNS §A)
- Plan 01-05: grep for `console.error` in source MUST exclude `dist/` and `.next/` — bundled React internals produce false positives; Plan 06 ESLint glob to follow suit

### Pending Todos

None yet.

### Blockers/Concerns

Из `.planning/codebase/CONCERNS.md` — вещи, которые Phase 1 должна закрыть как часть cleanup:

- Google Sheets — single point of failure (addressed in Phase 2)
- Telegram bot token в VITE_* (клиентский бандл) — security issue (addressed in Phase 2 / LEAD-02)
- `EARLY_BIRD_TAKEN=213` хардкод (addressed in Phase 2 / LEAD-03)
- Нет тестов, нет CI, нет error tracking (addressed in Phase 1 / FOUND-03..05)
- Railway = `vite preview` для прод-трафика (addressed in Phase 1 / FOUND-06)
- Пакеты `nashsklad` + "НашСклад" в коде (addressed in Phase 1 / FOUND-01)
- `.env.example` удалён, нет README (addressed in Phase 1 / FOUND-02)
- ADR-gap: technical architecture (monorepo layout, backend stack, data store, auth, hosting, RU+KZ data residency) не формализованы — создавать ADR по ходу Phase 1..5 при принятии ключевых решений

### Gaps flagged downstream

Из `.planning/intel/SYNTHESIS.md` — отсутствующие инпуты:

- No SPECs: API-контракты с WB/Ozon/ЯМ, 1С-протокол, analytics retention SLA, billing/Early-Bird enforcement не формализованы. Решаются в Phase 5 и 6 через ADR по ходу планирования.
- Модульные границы core ↔ industry-modules не специфицированы заранее — решается в ADR в Phase 4.

## Deferred Items

Items acknowledged and carried forward from previous milestone close:

| Category | Item | Status | Deferred At |
|----------|------|--------|-------------|
| *(none)* | | | |

## Session Continuity

Last session: 2026-04-21T09:14:33.000Z
Stopped at: Completed 01-05-PLAN.md
Resume file: None

**Planned Phase:** 1 (Foundation & Repo Cleanup) — 8 plans — 2026-04-21T05:12:34.537Z
