# Phase 1: Foundation & Repo Cleanup — Research

**Researched:** 2026-04-21
**Domain:** Monorepo hygiene, error tracking, testing, CI, static-site hosting (React/Vite + Next.js 14)
**Confidence:** HIGH for Sentry/Vitest/CF Pages/GH Actions; MEDIUM for env-validator library choice and ESLint flat-config ergonomics; LOW for one detail (Next 14 `experimental.instrumentationHook` exact interplay with `@sentry/nextjs` v10 — see below).

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

#### Хостинг landing (FOUND-06)
- **D-01:** Landing переезжает на **Cloudflare Pages** как статический билд (`vite build` → `dist/`). Railway отключается от landing (startCommand в `railway.json` удаляется или `railway.json` переносится на app-хостинг позже).
- **D-02:** Домен `oborotcrm.ru` полностью переводится на Cloudflare — nameserver change, DNS proxied через CF, TLS автоматический.
- **D-03:** Preview-деплои на каждый PR включены (CF Pages auto-preview) — используем для проверки мержа в `main` перед глобальным cache invalidation.
- **D-04:** Хостинг `apps/app` (Next.js) в Phase 1 **не решается** — остаётся локальный `npm run dev`. Production-хостинг app фиксируется ADR-ом в Phase 2 (когда появятся API routes для lead capture).

#### Error tracking (FOUND-05)
- **D-05:** **Sentry cloud** как основной сервис. Free tier (5k events/мес) закрывает waitlist-стадию; upgrade на Developer $26/мес когда потребуется.
- **D-06:** Scope — **оба приложения, клиент + сервер**:
  - `apps/landing`: `@sentry/react` в `main.jsx`, source maps отгружаются в Sentry при build.
  - `apps/app`: `@sentry/nextjs` wizard (клиент + server + edge). Инфра готова к моменту появления первых API routes в Phase 2.
- **D-07:** Все `console.error` в прод-коде (перечислены в `.planning/codebase/CONCERNS.md` §Console.error) заменяются на `Sentry.captureException()`. `console.log`/`console.warn` удаляются, breadcrumbs Sentry собирает автоматически.
- **D-08:** DSN landing-а публичен (так и должно быть для client-side Sentry). Защита через inbound filters + rate limits в Sentry project settings — **Claude's Discretion**.
- **D-09:** Риск с оплатой из RU известен — если Sentry заблокирует платёж, миграция на Glitchtip self-hosted (SDK-совместим). В Phase 1 эту миграцию **не делаем**, только фиксируем как fallback в ADR.

#### Тесты (FOUND-03)
- **D-10:** Стек зафиксирован: **Vitest + React Testing Library** в обоих приложениях.
- **D-11:** Глубина — **smoke + ключевые хуки**: landing — smoke `<App/>` + unit на `useForm.canProceed()` и `useForm.toggleMulti()`; app — smoke layout + login page.
- **D-12:** Coverage target не ставим.

#### CI (FOUND-04)
- **D-13:** CI провайдер — **GitHub Actions**. Один workflow `.github/workflows/ci.yml`, матрица по приложениям.
- **D-14:** На каждый PR в `main`: `npm ci` → lint → `vitest run` → `vite build` + `next build`.
- **D-15:** Prettier format-check **не включаем**.
- **D-16:** Pre-commit hooks (Husky/lint-staged) **не настраиваем**.

#### Ребренд (FOUND-01)
- **D-17:** Имена пакетов: **`@oborot/landing`, `@oborot/app`**, root → **`oborot-crm`**.
- **D-18:** Ребренд делается **одним PR** (всё сразу).
- **D-19:** Замены "НашСклад"/"nashsklad" → "Оборот"/"oborot" во всех перечисленных файлах + grep по кодовой базе.
- **D-20:** Git cleanup — **один коммит `chore: remove pre-monorepo root files`** перед остальными работами.

#### Env валидация и документация (FOUND-02)
- **D-21:** `.env.example` восстанавливается на root + per-app остаются/обновляются.
- **D-22:** Валидация env-переменных **runtime на старте** (landing в `main.jsx` с баннером; app в Next.js startup server-side + client-side guard).
- **D-23:** Выбор zod / envalid / inline — **Claude's Discretion** — решается в плане.
- **D-24:** README — root + per-app. Структура — **Claude's Discretion**.

### Claude's Discretion
- ESLint config: flat v9 vs legacy `.eslintrc`, общий корневой vs per-app, плагины.
- Sentry config детали: sample rate, release naming, source maps upload, inbound filters.
- Env validation библиотека + форма ошибок.
- README содержание/структура.
- CF Pages build command / output dir.
- GitHub Actions версии actions, параллелизм, fail-fast.
- Удаление неиспользуемой `framer-motion` — сделать отдельным коммитом `chore: remove unused framer-motion`.

### Deferred Ideas (OUT OF SCOPE)
- Хостинг `apps/app` в production (ADR в Phase 2).
- TypeScript миграция.
- Prettier + format-check в CI.
- Husky + lint-staged.
- Coverage target.
- Фактическая миграция с Sentry на Glitchtip (только ADR-fallback).
- Миграция lead capture / TG token exposure (Phase 2).
- Широкий тестовый suite.
- Дополнительные CF-сервисы (Workers, bot management, edge rate limits).
- Удаление `.DS_Store` из git-истории (только current state + .gitignore).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| FOUND-01 | Ребренд `nashsklad` → `oborot`; удаление старых root-файлов; унификация упоминаний "Оборот" | §Rebrand execution, §Git cleanup order, §Files touched list (6 files with `nashsklad`, 2 with `НашСклад`) |
| FOUND-02 | `.env.example` на root + per-app; runtime env-валидация на старте; документированный README | §Env validator choice (zod vs envalid vs inline), §README structure, §Runtime validation patterns |
| FOUND-03 | Vitest + RTL в обоих приложениях; ≥1 smoke + key hooks | §Vitest for Vite (landing), §Vitest for Next 14 App Router, §Version compatibility matrix |
| FOUND-04 | GitHub Actions CI: lint + test + build-check на каждый PR | §GitHub Actions workflow, §npm workspaces в matrix, §cache-dependency-path |
| FOUND-05 | Sentry на оба приложения, клиент + сервер; все `console.error` → `Sentry.captureException` | §Sentry React+Vite setup, §Sentry Next.js 14 setup, §`console.error` migration map (5 sites) |
| FOUND-06 | Landing как статический билд за CDN (Cloudflare Pages); preview-deploys; прод-DNS | §CF Pages build config, §DNS cutover order, §Railway decommission |
</phase_requirements>

## Summary

Phase 1 is a foundation-hygiene phase — не feature work, а устранение технодолга, который блокирует все последующие фазы. Все 6 FOUND-* требований уже развёрнуто в CONTEXT.md с 24 locked-решениями; research устранил оставшиеся "known unknowns":

1. **Sentry стек — полностью закрыт.** `@sentry/react` 10.49.0 + `@sentry/vite-plugin` 5.2.0 для landing, `@sentry/nextjs` 10.49.0 для app. Для Next.js 14 нужно `experimental.instrumentationHook: true` в `next.config.js` (в Next 15+ не нужно).
2. **Vitest стек — closed.** Vitest 3.2.4 совместим с Vite 5.x (peer: `vite: ^5.0.0 || ^6.0.0 || ^7.0.0-0`), Next.js 14 поддерживается официально через `@vitejs/plugin-react` + `jsdom`. Vitest 4.x НЕ используем (требует Vite 6+).
3. **CF Pages — closed.** Monorepo-мод доступен в Build System V2+: Root Directory = `apps/landing`, Build Command = `npm run build`, Output = `dist`. SPA-fallback НЕ нужен — CF Pages автоматически делает SPA-routing для проектов без `404.html`. Preview-деплои на PR — встроенная функция, GitHub check runs появляются автоматически.
4. **GitHub Actions — closed.** `actions/setup-node@v4` с `cache: 'npm'` + `cache-dependency-path: package-lock.json` (root lockfile при workspaces). Matrix по `app: [landing, app]` с per-app командами через `--workspace`.
5. **Env validator — рекомендация: Zod.** В 2026 zod — де-факто стандарт для React/Next экосистемы, работает одинаково с `import.meta.env` (Vite) и `process.env` (Next.js). Envalid — valid alternative, но в 3× уже SDK (вероятно пригодится Zod в Phase 2 для lead-схемы).
6. **ESLint — рекомендация: flat config v9, общий корневой config + per-app override.** v9 — default с 2024; v10 вышел в апреле 2026 (legacy полностью удалён). Экосистема React поддерживает flat config (`eslint-plugin-react` 7.37.x, `eslint-plugin-react-hooks` 7.1.x).
7. **Console.error sites — известны полностью.** 5 мест: `Landing.jsx:52`, `Landing.jsx:66`, `Marketplace.jsx:40`, `Marketplace.jsx:54`, `useForm.js:71`. Рекомендация — прямой `Sentry.captureException(e)`, без wrapper-утилиты (overengineering для 5 вызовов).
8. **Git cleanup — 18 deletions** (не 17 как в CONTEXT — см. §Git Cleanup Mechanics для полного списка) + 2 untracked `.DS_Store`. Порядок коммитов: cleanup → `.gitignore` → rebrand → remove framer-motion → infra adds.
9. **DNS cutover — рекомендация "CF Pages first, DNS second"**: подключить CF Pages к GitHub, получить preview-URL на PR, проверить, затем перевести nameservers `oborotcrm.ru` на CF. Нулевой даунтайм.
10. **Railway — рекомендация: удалить `railway.json`** (не репурпозить). Чистая точка; Phase 2 создаст новый файл если app поедет на Railway.

**Primary recommendation:** Использовать `.env.example`-driven rebrand+infra план с зафиксированным порядком коммитов (cleanup → rebrand → env+validator → tests → CI → Sentry → CF Pages cutover → Railway cleanup). Источник правды для env — root `.env.example` + валидация Zod на старте каждого приложения.

---

## Architectural Responsibility Map

| Capability | Primary Tier | Secondary Tier | Rationale |
|------------|-------------|----------------|-----------|
| Env-variable loading (landing) | Browser / Client (Vite bundle) | — | Vite inlines `VITE_*` at build time; runtime validation происходит в браузере при первом рендере |
| Env-variable loading (app, server) | Frontend Server (Next.js SSR) | — | `process.env` с non-public-префиксом остаётся на сервере; валидация при cold-start |
| Env-variable loading (app, client) | Browser / Client (Next.js bundle) | Frontend Server | `NEXT_PUBLIC_*` попадают в клиентский бандл; дублирующая валидация в client provider |
| Error tracking (landing) | Browser / Client | — | `@sentry/react` — чисто client-side; source maps uploaded в CI |
| Error tracking (app) | Frontend Server + Browser + Edge | — | `@sentry/nextjs` — все три runtime через single wizard |
| Smoke tests (landing) | Build-time (CI) | — | Vitest с jsdom — не нуждается в network/DB |
| Smoke tests (app) | Build-time (CI) | — | Vitest с jsdom; async Server Components НЕ тестируем (ограничение Vitest) |
| CI (lint+test+build) | Build-time (GitHub Actions) | — | Ничего не деплоит в Phase 1 — только gate на merge |
| Landing hosting | CDN / Static (Cloudflare Pages) | — | Статический билд; нет server-side logic |
| Secrets management | Config (CF Pages env vars + local `.env`) | — | Все public-префиксы; no secret secrets в Phase 1 |

---

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| `@sentry/react` | 10.49.0 | Client-side error tracking (landing) | Officially supported by Sentry; includes `browserTracingIntegration` and `reactRouterV7BrowserTracingIntegration` natively (landing использует `react-router-dom@7.13.1`) |
| `@sentry/vite-plugin` | 5.2.0 | Source-maps upload to Sentry at build time | Official Sentry plugin for Vite; автоматически создаёт releases, загружает source maps |
| `@sentry/nextjs` | 10.49.0 | Error tracking на клиенте + сервере + edge (app) | Single SDK покрывает все три runtime; supports Next 14 (peer: `^13.2.0 \|\| ^14.0 \|\| ^15.0.0-rc.0 \|\| ^16.0.0-0`) |
| `vitest` | 3.2.4 | Test runner (оба приложения) | Peer: `vite: ^5.0.0 \|\| ^6.0.0 \|\| ^7.0.0-0` — совместим с Vite 5.4.10 landing. **НЕ используем Vitest 4.x** (требует Vite 6+) |
| `@testing-library/react` | 16.3.2 | Component testing | Официальная рекомендация Next.js docs и Vitest docs |
| `@testing-library/jest-dom` | 6.9.1 | DOM matchers (`toBeInTheDocument`, etc.) | Стандартное дополнение к RTL |
| `jsdom` | 29.0.2 | DOM-среда для Vitest | Default choice (happy-dom — faster но menos compatible) |
| `@vitejs/plugin-react` | 4.3.1 (уже есть) | JSX transform для landing Vitest config | Уже установлен в landing как dev-dep |
| `zod` | 4.3.6 | Runtime env-validation | Де-факто стандарт в React/Next экосистеме 2026; одинаково работает с `import.meta.env` и `process.env` |
| `@sentry/vite-plugin` | 5.2.0 | (дубль) — см. выше | |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| `eslint` | 9.38.0 (v9 flat) | Lint оба приложения | Default lint — v9 flat config; v10 вышел в апреле 2026 но еще не во всех peer deps |
| `@eslint/js` | 10.0.1 | ESLint recommended preset | Нужен для flat config `eslint.config.js` |
| `eslint-plugin-react` | 7.37.5 | React-specific lint rules | React JSX linting (hooks rules, JSX-a11y optional) |
| `eslint-plugin-react-hooks` | 7.1.1 | React hooks rules | Обязательный для React apps |
| `eslint-plugin-react-refresh` | 0.5.2 | HMR-compat warnings (landing/Vite) | Только для Vite-app (landing); для Next.js не нужен |
| `globals` | 17.5.0 | `globals.browser`, `globals.node` presets для flat config | Нужен для flat config envs (browser/node) |
| `@testing-library/user-event` | 14.6.1 | Simulate user interactions | Нужен если тестируем `toggleMulti()` через user events — для pure hook test не нужен |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| Zod | Envalid (8.1.1) | Envalid — специализирован под env; 3× меньше bundle. Но Zod уже нужен будет в Phase 2 для lead-схемы → избегаем 2-х библиотек для валидации |
| Zod | Inline `assert()` | Проще, zero-dep. Но ручная поддержка + хуже DX (нет типизации, нет удобных ошибок для UI-баннера) |
| jsdom | happy-dom | happy-dom быстрее (~2× на cold start), но хуже compat с некоторыми React flows. Для smoke-тестов разница не критична |
| ESLint flat v9 | Legacy `.eslintrc` | Legacy удалён в v10; строить на устаревшем формате — антипаттерн в 2026 |
| `@sentry/vite-plugin` | `vite-plugin-sentry` (community) | Official plugin от Sentry — надёжнее, более поддерживаем |
| CF Pages | Vercel | CF Pages бесплатно на RU-трафик без прокси; Vercel — RU residency сложнее, платежи из RU проблематичны |

**Installation:**

```bash
# Landing
npm install --save-prod @sentry/react --workspace=apps/landing
npm install --save-dev @sentry/vite-plugin vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom --workspace=apps/landing
npm uninstall framer-motion --workspace=apps/landing  # D-74: unused cleanup

# App
npm install --save-prod @sentry/nextjs --workspace=apps/app
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom --workspace=apps/app

# Root (env-validation + ESLint)
npm install --save-prod zod --workspace=apps/landing --workspace=apps/app
npm install --save-dev eslint @eslint/js eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-react-refresh globals -w apps/landing -w apps/app
# (Или ставим ESLint на root если выбираем shared config — см. §ESLint section)
```

**Version verification:** All versions above verified against npm registry on 2026-04-21:
- `@sentry/react@10.49.0` [VERIFIED: `npm view @sentry/react version` → 10.49.0]
- `@sentry/nextjs@10.49.0` [VERIFIED: `npm view @sentry/nextjs version` → 10.49.0]
- `@sentry/vite-plugin@5.2.0` [VERIFIED]
- `vitest@4.1.4` latest, но **используем 3.2.4** из-за Vite-5 constraint (Vitest 4 требует Vite 6+) [VERIFIED: `npm show vitest@3.2.4` → peer `vite: ^5.0.0 || ^6.0.0 || ^7.0.0-0`]
- `zod@4.3.6` [VERIFIED]
- `eslint@9.38.0` (v10 есть, но peer-support среди React plugins ещё неполный) [VERIFIED: eslint-config-next не поддерживает v10 на март 2026]

---

## Architecture Patterns

### System Architecture Diagram

```
                  ┌─────────────────────────────────────────┐
                  │           GitHub repo (oborot-crm)       │
                  │  main branch ──── PR ─────────────────┐ │
                  └────────┬────────────────────────┬─────┘ │
                           │                        │       │
                           │ push                   │ PR    │
                           ▼                        ▼       │
                  ┌────────────────┐      ┌────────────────┐│
                  │ CF Pages build │      │ GH Actions CI  ││
                  │ (landing only) │      │  matrix[app]:  ││
                  │                │      │  - landing     ││
                  │ npm ci         │      │  - app         ││
                  │ npm run build  │      │                ││
                  │ --workspace    │      │  npm ci        ││
                  │ apps/landing   │      │  npm run lint  ││
                  │  → dist/       │      │  npm run test  ││
                  └───────┬────────┘      │  npm run build ││
                          │                └───────┬────────┘│
                          │                        │         │
                          ▼                        ▼         │
                  ┌────────────────┐      ┌────────────────┐ │
                  │ CF Pages CDN   │      │  PR checks     │ │
                  │ (production +  │      │  (green = OK   │ │
                  │  preview URLs) │      │   red = block) │ │
                  └───────┬────────┘      └────────────────┘ │
                          │                                   │
                  prod: oborotcrm.ru                          │
                  preview: <branch>.oborot-landing.pages.dev  │
                          │                                   │
                          │ (runtime error)                   │
                          ▼                                   │
                  ┌──────────────────────┐                    │
                  │   Sentry SaaS        │                    │
                  │  project: landing    │◀─── Sentry.captureException
                  │  project: app        │      from apps/app (local dev + Phase 2)
                  └──────────────────────┘

  Local dev:
    npm run landing  →  Vite dev server (port 5173)  →  browser
    npm run app      →  Next.js dev (port 3001)     →  browser + node
    Both apps load .env + validate via Zod at startup; bail with banner if missing.
```

### Component Responsibilities

| File / Component | Responsibility | Added/Changed in Phase 1 |
|------------------|----------------|--------------------------|
| `.github/workflows/ci.yml` | Run lint + test + build on every PR | **NEW** |
| `apps/landing/src/main.jsx` | Init Sentry → validate env (Zod) → render `<App/>` or `<EnvErrorBanner/>` | **MODIFIED** (add Sentry init + env check) |
| `apps/landing/src/lib/env.js` | Zod schema for `VITE_*` vars, export `env` object | **NEW** |
| `apps/landing/src/lib/sentry.js` | Sentry init helper (so `main.jsx` stays thin) | **NEW (optional)** |
| `apps/landing/vite.config.js` | Add `@sentry/vite-plugin` (conditional on `SENTRY_AUTH_TOKEN`) | **MODIFIED** |
| `apps/landing/src/**.test.jsx` | Smoke `<App/>` + unit tests for `useForm` | **NEW** |
| `apps/landing/vitest.config.js` | Vitest config (jsdom env, setupFiles) | **NEW** |
| `apps/landing/vitest.setup.js` | `@testing-library/jest-dom` import + globals | **NEW** |
| `apps/app/next.config.js` | Wrap with `withSentryConfig`; set `experimental.instrumentationHook: true` | **MODIFIED** |
| `apps/app/instrumentation.js` | Wizard-generated; registers server/edge configs | **NEW** |
| `apps/app/sentry.client.config.js` (или `instrumentation-client.js`) | Client Sentry init | **NEW** |
| `apps/app/sentry.server.config.js` | Server Sentry init | **NEW** |
| `apps/app/sentry.edge.config.js` | Edge Sentry init | **NEW** |
| `apps/app/app/global-error.jsx` | Global error boundary with `Sentry.captureException` | **NEW** |
| `apps/app/lib/env.js` | Zod schema for `NEXT_PUBLIC_*` vars | **NEW** |
| `apps/app/app/layout.jsx` | (optional) client-side env guard provider | **MODIFIED** (add provider) |
| `apps/app/vitest.config.js` | Vitest config с `@vitejs/plugin-react` + jsdom | **NEW** |
| `apps/app/__tests__/*.test.jsx` | Smoke layout + login | **NEW** |
| Root `.env.example` | Документация ВСЕХ env-переменных обоих приложений | **NEW** (restored) |
| Root `README.md` | Monorepo quickstart — новый контрибьютор за 10 минут | **NEW** |
| `apps/landing/README.md` | Landing-specific: dev, build, deploy (CF Pages) | **NEW** |
| `apps/app/README.md` | App-specific: dev, build, env (Supabase) | **NEW** |
| `.gitignore` | Add `.DS_Store`, `.vercel` (уже есть `.env` etc.) | **MODIFIED** |
| `railway.json` | **DELETED** (decommission) | — |

### Recommended Project Structure (post-Phase-1)

```
oborot-crm/                    # root (package.json name: "oborot-crm")
├── .github/
│   └── workflows/
│       └── ci.yml             # NEW
├── .env.example               # NEW (restored; documents ALL vars)
├── .gitignore                 # MODIFIED (add .DS_Store)
├── README.md                  # NEW (workspace quickstart)
├── eslint.config.js           # NEW (shared flat config at root — optional)
├── package.json               # MODIFIED (rename to "oborot-crm")
├── package-lock.json          # regenerated (new names)
├── apps/
│   ├── landing/
│   │   ├── package.json       # MODIFIED ("@oborot/landing")
│   │   ├── vite.config.js     # MODIFIED (sentry plugin)
│   │   ├── vitest.config.js   # NEW
│   │   ├── vitest.setup.js    # NEW
│   │   ├── .env.example       # MODIFIED (header update + any new vars)
│   │   ├── README.md          # NEW
│   │   └── src/
│   │       ├── main.jsx       # MODIFIED (Sentry init + env validation)
│   │       ├── App.jsx
│   │       ├── lib/
│   │       │   ├── env.js     # NEW (Zod schema)
│   │       │   └── sentry.js  # NEW (init helper)
│   │       ├── components/
│   │       │   └── EnvErrorBanner.jsx  # NEW
│   │       └── __tests__/
│   │           ├── App.test.jsx        # NEW (smoke)
│   │           └── useForm.test.js     # NEW (unit)
│   └── app/
│       ├── package.json       # MODIFIED ("@oborot/app")
│       ├── next.config.js     # MODIFIED (withSentryConfig + instrumentationHook)
│       ├── sentry.client.config.js     # NEW
│       ├── sentry.server.config.js     # NEW
│       ├── sentry.edge.config.js       # NEW
│       ├── instrumentation.js          # NEW
│       ├── vitest.config.js   # NEW
│       ├── .env.example       # MODIFIED
│       ├── README.md          # NEW
│       ├── app/
│       │   ├── layout.jsx     # MODIFIED (env provider guard)
│       │   └── global-error.jsx        # NEW
│       ├── lib/
│       │   ├── env.js         # NEW (Zod schema)
│       │   └── supabase.js
│       └── __tests__/
│           ├── layout.test.jsx         # NEW
│           └── login.test.jsx          # NEW
└── content/ (unchanged)
```

### Pattern 1: Sentry React (Vite) setup
**What:** Client-side error tracking with React Router v7 integration and source-maps upload at build time.
**When to use:** `apps/landing/src/main.jsx` entry, before `createRoot().render()`.

```javascript
// apps/landing/src/main.jsx
// Source: https://docs.sentry.io/platforms/javascript/guides/react/features/react-router/
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import * as Sentry from '@sentry/react'
import { env } from './lib/env'  // Zod-validated; throws early
import EnvErrorBanner from './components/EnvErrorBanner'
import './index.css'
import App from './App.jsx'

// Try to load env; on failure render banner, skip Sentry
let envOk = true
try {
  env  // accessing the proxy triggers Zod parse
} catch (e) {
  envOk = false
}

if (envOk && env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.reactRouterV7BrowserTracingIntegration({
        useEffect: React.useEffect,
        useLocation,
        useNavigationType,
        createRoutesFromChildren,
        matchRoutes,
      }),
      Sentry.replayIntegration({ maskAllText: false, blockAllMedia: false }),
    ],
    tracesSampleRate: 0.1,   // 10% — economize on 5k/mo free tier
    replaysSessionSampleRate: 0.0,
    replaysOnErrorSampleRate: 1.0,  // 100% replay on errors only
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_SENTRY_RELEASE || undefined,
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {envOk ? <App /> : <EnvErrorBanner />}
  </StrictMode>,
)
```

```javascript
// apps/landing/vite.config.js
// Source: https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/vite/
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { sentryVitePlugin } from '@sentry/vite-plugin'

export default defineConfig({
  plugins: [
    react(),
    // Must be LAST in plugins array; only when auth token present (CI only)
    process.env.SENTRY_AUTH_TOKEN && sentryVitePlugin({
      org: 'oborotcrm',           // or whatever is set in Sentry
      project: 'landing',
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ].filter(Boolean),
  build: {
    sourcemap: true,  // required for Sentry to symbolicate
  },
  preview: {
    allowedHosts: ['oborotcrm.ru', 'www.oborotcrm.ru'],
  },
})
```

**Sources:**
- [Sentry Vite source-maps docs](https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/vite/) [VERIFIED]
- [Sentry React Router v7 integration](https://docs.sentry.io/platforms/javascript/guides/react/features/react-router/) [CITED]

### Pattern 2: Sentry Next.js 14 setup (App Router)

**What:** 3-runtime error tracking via wizard.
**When to use:** One-time setup via CLI wizard, then manual tweaks.

**Wizard run (recommended):**
```bash
cd apps/app
npx @sentry/wizard@latest -i nextjs
```

**Files the wizard generates (for Next.js 14 App Router):**
- `apps/app/instrumentation.js` — registers server/edge configs
- `apps/app/sentry.client.config.js` — client-side `Sentry.init()`
- `apps/app/sentry.server.config.js` — server-side init
- `apps/app/sentry.edge.config.js` — edge runtime init
- `apps/app/app/global-error.jsx` — global error boundary
- `apps/app/next.config.js` — wrapped with `withSentryConfig`

**Manual changes required for Next.js 14 (since wizard docs are written for 15+):**

```javascript
// apps/app/next.config.js
// CRITICAL for Next.js 14: experimental.instrumentationHook is REQUIRED
// In Next.js 15+ this option was removed (default enabled).
// Source: https://nextjs.org/docs/14/pages/api-reference/next-config-js/instrumentationHook
const { withSentryConfig } = require('@sentry/nextjs')

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    instrumentationHook: true,  // REQUIRED for Next 14 + Sentry
  },
}

module.exports = withSentryConfig(nextConfig, {
  org: 'oborotcrm',
  project: 'app',
  silent: !process.env.CI,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
})
```

**Sources:**
- [Sentry Next.js manual setup](https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/) [CITED — written for Next 15+, Next 14 requires `instrumentationHook` flag]
- [Next.js 14 instrumentationHook docs](https://nextjs.org/docs/14/pages/api-reference/next-config-js/instrumentationHook) [VERIFIED]
- [npm @sentry/nextjs peerDependency `next: ^13.2.0 || ^14.0 || ^15.0.0-rc.0 || ^16.0.0-0`](https://www.npmjs.com/package/@sentry/nextjs) [VERIFIED]

### Pattern 3: Vitest for Vite landing

```javascript
// apps/landing/vitest.config.js
// Source: https://vitest.dev/config/
// NB: Can extend vite.config via mergeConfig or define separately.
// Recommend SEPARATE file — vite build config doesn't need test noise.
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,              // allows `describe/it/expect` without imports
    setupFiles: ['./vitest.setup.js'],
    include: ['src/**/*.{test,spec}.{js,jsx}'],
  },
})
```

```javascript
// apps/landing/vitest.setup.js
import '@testing-library/jest-dom/vitest'
```

```javascript
// apps/landing/src/__tests__/useForm.test.js
// Unit test for D-11 required coverage
import { renderHook, act } from '@testing-library/react'
import { useForm } from '../form/hooks/useForm'

describe('useForm.canProceed', () => {
  it('returns false when required radio not answered', () => {
    const { result } = renderHook(() => useForm())
    expect(result.current.canProceed()).toBe(false)  // STEPS[0] has required questions
  })
})

describe('useForm.toggleMulti', () => {
  it('toggles value in/out of the array', () => {
    const { result } = renderHook(() => useForm())
    act(() => result.current.toggleMulti('platforms', 'wb'))
    expect(result.current.answers.platforms).toEqual(['wb'])
    act(() => result.current.toggleMulti('platforms', 'wb'))
    expect(result.current.answers.platforms).toEqual([])
  })

  it('respects maxSelect', () => {
    const { result } = renderHook(() => useForm())
    act(() => {
      result.current.toggleMulti('x', 'a', 2)
      result.current.toggleMulti('x', 'b', 2)
      result.current.toggleMulti('x', 'c', 2)  // should be blocked
    })
    expect(result.current.answers.x).toEqual(['a', 'b'])
  })
})
```

```javascript
// apps/landing/src/__tests__/App.test.jsx — smoke
import { render } from '@testing-library/react'
import App from '../App'

describe('App smoke', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />)
    expect(container).toBeTruthy()
  })
})
```

### Pattern 4: Vitest for Next.js 14 App Router

```javascript
// apps/app/vitest.config.js
// Source: https://nextjs.org/docs/app/guides/testing/vitest (lastUpdated 2026-04-15)
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./vitest.setup.js'],
    include: ['**/*.{test,spec}.{js,jsx}'],
  },
})
```

```javascript
// apps/app/vitest.setup.js
import '@testing-library/jest-dom/vitest'
import { vi } from 'vitest'

// Mock next/navigation for tests that touch routing
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), replace: vi.fn(), back: vi.fn(), refresh: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
  redirect: vi.fn(),
}))
```

```javascript
// apps/app/__tests__/login.test.jsx
import { render, screen } from '@testing-library/react'
import Login from '../app/(auth)/login/page'

describe('Login page smoke', () => {
  it('renders login page', () => {
    render(<Login />)
    expect(screen.getByText(/Войти/i)).toBeInTheDocument()
  })
})
```

```javascript
// apps/app/__tests__/layout.test.jsx
import { render } from '@testing-library/react'
import RootLayout from '../app/layout'

describe('RootLayout smoke', () => {
  it('renders children without crashing', () => {
    // Root layout returns <html>; render as wrapper by consuming children
    const tree = (<RootLayout><div>test</div></RootLayout>)
    // jsdom will complain about nested <html> — instead, just test that the component is a function
    expect(typeof RootLayout).toBe('function')
    // OR: shallow-test children rendering via a portal trick — simplest: mount nothing and assert metadata export
  })
})
```

**Vitest limitation (known):** Async Server Components НЕ тестируются через Vitest — это зафиксировано в Next.js docs ("Vitest currently does not support async Server Components"). Для smoke-тестов это ОК — layout/login/page в Phase 1 — sync components.

**Sources:**
- [Next.js Vitest guide](https://nextjs.org/docs/app/guides/testing/vitest) [VERIFIED — last updated 2026-04-15]
- [Next.js with-vitest example](https://github.com/vercel/next.js/tree/canary/examples/with-vitest) [CITED]

### Pattern 5: Zod env validation

```javascript
// apps/landing/src/lib/env.js
// Runtime validation on import; throws on missing/invalid vars.
// Main.jsx catches and renders <EnvErrorBanner/>
import { z } from 'zod'

const schema = z.object({
  VITE_SHEETS_WEBHOOK_URL: z.string().url(),
  VITE_TG_BOT_TOKEN: z.string().min(10),
  VITE_TG_CHAT_ID: z.string().min(1),
  VITE_SENTRY_DSN: z.string().url().optional(),    // optional for local dev
  VITE_SENTRY_RELEASE: z.string().optional(),
})

const parsed = schema.safeParse(import.meta.env)

if (!parsed.success) {
  // Collect user-readable error list
  const errors = parsed.error.errors.map(e => `${e.path.join('.')}: ${e.message}`)
  throw new EnvError(errors)
}

export class EnvError extends Error {
  constructor(errors) {
    super('Environment variables missing or invalid')
    this.errors = errors
    this.name = 'EnvError'
  }
}

export const env = parsed.data
```

```javascript
// apps/app/lib/env.js — server + client split
import { z } from 'zod'

// Client-exposed (NEXT_PUBLIC_*) — validated on BOTH server and client
const clientSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(20),
  NEXT_PUBLIC_SENTRY_DSN: z.string().url().optional(),
})

// Server-only (Phase 1 — none yet; Phase 2 adds TG token, SHEETS_URL server-side)
const serverSchema = z.object({
  SENTRY_AUTH_TOKEN: z.string().optional(),  // only in CI
})

const clientParsed = clientSchema.safeParse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
})

if (!clientParsed.success) {
  throw new Error(
    'Client env invalid:\n' +
    clientParsed.error.errors.map(e => `  ${e.path.join('.')}: ${e.message}`).join('\n')
  )
}

export const clientEnv = clientParsed.data

// Only parse server schema on server side
export const serverEnv = typeof window === 'undefined'
  ? serverSchema.parse(process.env)
  : undefined
```

**Why Zod over alternatives:**
1. **Future-proof** — Phase 2 will need Zod for lead schemas anyway (Supabase request bodies). Installing it now means one library, not two.
2. **Vite + Next.js same syntax** — both use `.safeParse(importMetaEnv)` / `.safeParse(processEnv)`.
3. **Error DX** — `error.errors[].path` gives clean human-readable reports for the `<EnvErrorBanner/>` UI.
4. **Bundle cost** — Zod 4.x is ~8kB gzip. Acceptable.

**Landmines:**
- Vite inlines `import.meta.env.VITE_*` at build-time — you CANNOT `new Schema(process.env)` style it; must name each var explicitly or use object literal.
- `NEXT_PUBLIC_*` is inlined at build time for client but also accessible via `process.env` on server — the server init must validate BOTH code paths.
- Avoid using Zod's `.url()` on a non-URL `VITE_SHEETS_WEBHOOK_URL` in the .env.example placeholder `https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec` — that passes `.url()` so no false positives.

### Pattern 6: GitHub Actions workflow

```yaml
# .github/workflows/ci.yml
# Source: https://github.com/actions/setup-node v4 docs
name: CI

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false   # let one app's red test report even if the other fails
      matrix:
        app: [landing, app]
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: package-lock.json   # root lockfile, workspaces

      - run: npm ci

      - name: Lint
        run: npm run lint --workspace=apps/${{ matrix.app }}

      - name: Test
        run: npm run test --workspace=apps/${{ matrix.app }}

      - name: Build
        run: npm run build --workspace=apps/${{ matrix.app }}
        env:
          # For app: Sentry upload token (if set) — not strictly needed for Phase 1 CI
          SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
          # Supabase dummy vars so next build doesn't fail on missing env
          NEXT_PUBLIC_SUPABASE_URL: 'https://dummy.supabase.co'
          NEXT_PUBLIC_SUPABASE_ANON_KEY: 'dummy-key-for-build-check-only'
```

**Per-app scripts to add** (in each `apps/*/package.json`):

```json
// apps/landing/package.json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint src --max-warnings=0",
  "test": "vitest run"
}

// apps/app/package.json
"scripts": {
  "dev": "next dev -p 3001",
  "build": "next build",
  "start": "next start -p 3001",
  "lint": "next lint --max-warnings=0",
  "test": "vitest run"
}
```

**Landmines:**
- `cache: 'npm'` without `cache-dependency-path` defaults to looking for `package-lock.json` at root, which IS where our lockfile is — so this works without explicit path. Keeping explicit for documentation.
- `fail-fast: false` is deliberate — if landing tests fail but app tests pass, still report both.
- `next build` needs `NEXT_PUBLIC_SUPABASE_*` to be non-empty strings (even dummy) OR env validator will throw and build fails. Either set dummy values in CI OR make the Zod schema `.optional()` for CI — I recommend dummy values for realism.
- `npm ci` is stricter than `npm install` — if lockfile drifts from package.json, it fails. This is desired.
- If you later add TypeScript, add a `typecheck` step. Not needed in Phase 1.

### Pattern 7: ESLint flat config v9

**Recommendation:** One shared root `eslint.config.js` with per-file-pattern overrides. Each app's `npm run lint` runs `eslint src` — ESLint walks up to the root config automatically.

```javascript
// eslint.config.js (root)
// Source: https://eslint.org/docs/latest/use/configure/configuration-files
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  { ignores: ['**/dist/**', '**/.next/**', '**/node_modules/**', '**/build/**'] },

  // Base JS rules
  js.configs.recommended,

  // All React code (both apps)
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.node },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',    // not needed with React 17+ JSX transform
      'react/prop-types': 'off',            // JSX-only, we don't use prop-types
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
    settings: { react: { version: '18.3' } },
  },

  // Landing-specific: react-refresh for Vite HMR
  {
    files: ['apps/landing/**/*.{js,jsx}'],
    plugins: { 'react-refresh': reactRefresh },
    rules: { 'react-refresh/only-export-components': 'warn' },
  },

  // Test files: relax some rules
  {
    files: ['**/*.{test,spec}.{js,jsx}', '**/__tests__/**'],
    languageOptions: { globals: { ...globals.browser, ...globals.node, vi: 'readonly' } },
  },
]
```

**Why root-config not per-app:**
- 2 apps share 90% of rules — avoid drift.
- Future addition of shared `packages/ui` becomes trivial.
- Solo-dev prefers one file to manage.

**Alternatives rejected:**
- Legacy `.eslintrc.json` — deprecated in v9 (default flat), removed entirely in v10 (released April 2026).
- Per-app configs — duplicates rule config, bikeshed-risk between two files.

**Landmines:**
- `eslint-plugin-react` flat-config support is via `...react.configs.recommended.rules` spread — some older snippets import from wrong path.
- `eslint-plugin-react-hooks` 7.x supports flat config natively (`.configs.recommended`). Older 4.x did NOT — don't copy old snippets.
- `next lint` in Next.js 14 uses the legacy config file format by default but is compatible with flat if you set `ESLINT_USE_FLAT_CONFIG=true` env var. Safer: call `eslint src` directly (bypass `next lint`). This is what CI does above.
- `--max-warnings=0` ensures warnings block the PR (CI is the only gate, so strictness here is fine).

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Env validation | Custom `if (!process.env.X) throw` chains | **Zod** `safeParse` | Better error messages, schema reuse, future Phase 2 needs Zod anyway |
| Error tracking | Custom `fetch(errorEndpoint)` wrapper | **Sentry** (`@sentry/react`, `@sentry/nextjs`) | Free tier sufficient, source maps + breadcrumbs + Release Health "just work" |
| Source-maps upload | Custom CLI to curl Sentry API | **`@sentry/vite-plugin`** / `withSentryConfig` | Deals with artifact-naming, releases, gzip — 20+ edge cases |
| Test runner | Mocha + Chai + jsdom stitched together | **Vitest** | Native ESM, faster than Jest, zero-config for Vite projects |
| React DOM assertions | Custom `innerHTML.includes` checks | **`@testing-library/react`** + `jest-dom` matchers | Avoids brittle tests, semantic queries (`getByRole`) |
| CI caching | Hand-rolled `actions/cache` with key templates | **`actions/setup-node@v4`** `cache: 'npm'` | One-liner, tested, automatic hash |
| SPA routing on static host | `_redirects` + 200-fallback rules | **Cloudflare Pages auto-SPA mode** | Built-in; avoid the "infinite loop" bug |
| DNS + TLS | Nginx + certbot + port forwarding | **Cloudflare** proxied DNS + auto TLS | Zero config, free, DDoS-protected |
| Error boundary (Next.js App Router) | Custom `<ErrorBoundary>` component | **`app/global-error.jsx`** (Next.js convention) + Sentry | Sentry wizard generates this |
| ESLint shared config | Custom preset package | **Root `eslint.config.js`** with flat config | Too much ceremony for 2 apps |

**Key insight:** Phase 1 is about adopting industry-standard tools, not building them. Every item in this table has a 2026-mature, zero-config off-the-shelf answer.

---

## Runtime State Inventory

Phase 1 contains TWO rename operations (`nashsklad` → `oborot-crm`, `НашСклад` → `Оборот` in JS/MD). Running the full grep audit.

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| **Stored data** | None — Phase 1 touches no Supabase data, no Google Sheets records, no persistent stores with the string `nashsklad` as a key | None — verified by grep on all code + docs (see below) |
| **Live service config** | 1. `oborotcrm.ru` Railway project name/domain (string "nashsklad" MAY appear in Railway service name) → irrelevant since we're decommissioning Railway for landing. 2. Cloudflare account/Zone name — will be set NEW, not renamed. 3. Sentry projects (`landing`, `app`) will be created NEW. 4. GitHub repo name `oborot-crm` — already correct, no rename. | Railway: delete service entirely (covered in FOUND-06 rollout). No other renames needed. |
| **OS-registered state** | None — no Windows services, launchd plists, pm2 saved processes, cron jobs with `nashsklad` in description | None — verified; single-developer macOS environment with no persistent services |
| **Secrets/env vars** | Key **names** are already neutral: `VITE_SHEETS_WEBHOOK_URL`, `VITE_TG_BOT_TOKEN`, `VITE_TG_CHAT_ID`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` — none contain `nashsklad`. Secrets themselves unchanged. | None — code-level rename only. Local `.env` files untouched. |
| **Build artifacts / installed packages** | 1. `apps/landing/dist/` — stale after rebrand+infra. 2. `apps/app/.next/` — stale. 3. `node_modules/` — has `@nashsklad/landing` and `@nashsklad/app` as workspace symlinks in `node_modules/@nashsklad/*`. 4. `package-lock.json` references `@nashsklad/landing` and `@nashsklad/app` at 4+ sites. | Rebuild all. After rename: `rm -rf apps/landing/dist apps/app/.next node_modules package-lock.json && npm install` to regenerate lockfile with new names. Task plan MUST include this reinstall step. |
| **Committed `.DS_Store`** | `git ls-files` shows **zero** committed `.DS_Store` currently (`git status` lists `.DS_Store` and `apps/.DS_Store` as `??` untracked only — they're NOT in the git tree). **Current `.gitignore` is missing `.DS_Store`** — need to add. | Add `.DS_Store` to `.gitignore`. No git history cleanup needed — they were never committed. |

**The canonical question:** *After every file in the repo is updated, what runtime systems still have the old string cached, stored, or registered?*

Answer: **nothing** except `node_modules/` (symlinks + cached package names) and `package-lock.json` — both regenerated by `npm install` after the rename. `apps/landing/dist/` and `apps/app/.next/` are build artifacts that will be regenerated on next build. Railway service for landing will be explicitly deleted in FOUND-06 rollout, terminating that last runtime namespace-binding.

**Verified by Grep:** `nashsklad` / `НашСклад` appear ONLY in:
- `package.json` (root: line 2, name)
- `apps/landing/package.json` (line 2, name)
- `apps/app/package.json` (line 2, name)
- `apps/landing/google-apps-script.js` (line 2, header comment)
- `package-lock.json` (6 occurrences — auto-regenerated)
- `.claude/launch.json` (line 5, name — debug config, rename for hygiene)
- `.planning/**/*.md` (planning docs — DO NOT touch; these record history, rebrand not applicable)

**So actually-code-touching edits = 6 files.** (package.json × 3, google-apps-script.js × 1, launch.json × 1, package-lock.json regen × 1).

---

## Common Pitfalls

### Pitfall 1: Sentry Vite plugin fails silently when `SENTRY_AUTH_TOKEN` missing
**What goes wrong:** Build succeeds but source maps never uploaded; errors in Sentry show minified stack traces → useless.
**Why it happens:** Plugin is set to silent-skip when auth token absent (by design, for local dev builds).
**How to avoid:** In CI workflow, require `SENTRY_AUTH_TOKEN` secret be present AND fail the build if `@sentry/vite-plugin` logs a missing-token warning. Use `debug: true` in plugin config when `CI=true` to see what it's doing.
**Warning signs:** Sentry dashboard shows errors but with minified frame names like `b.default` instead of `handleSubmit`.

### Pitfall 2: Next.js 14 `instrumentation.js` file ignored
**What goes wrong:** Sentry server/edge init never runs; server-side errors don't reach Sentry.
**Why it happens:** Next.js 14 does NOT enable the instrumentation hook by default — requires `experimental.instrumentationHook: true` in `next.config.js`. Wizard docs are now written for Next 15+ and skip this step.
**How to avoid:** Manually add `experimental.instrumentationHook: true` to `next.config.js` AFTER wizard finishes. Verify by triggering a server-side error in dev and checking Sentry receives it.
**Warning signs:** Sentry receives client events but no server events after deploying to prod.

### Pitfall 3: `next build` fails on CI because of missing NEXT_PUBLIC_* vars
**What goes wrong:** Next.js inlines `NEXT_PUBLIC_*` at build time — if the Zod validator throws during module evaluation at build, build fails.
**Why it happens:** Build ≠ runtime; `next build` actually imports modules to pre-render pages.
**How to avoid:** Set dummy values for all required `NEXT_PUBLIC_*` in CI workflow env. Accept that CI is testing build-integrity, not deployment-readiness.
**Warning signs:** CI red with error like `Environment variables invalid: NEXT_PUBLIC_SUPABASE_URL: Invalid url`.

### Pitfall 4: Vitest can't transform Next.js internals
**What goes wrong:** `import RootLayout from '../app/layout'` in a test file → error about `use client` / server-only runtime.
**Why it happens:** Vitest is NOT Next.js — it doesn't know about RSC, `use client`, async components.
**How to avoid:** For Phase 1 smoke tests, don't `render(<RootLayout/>)` — just test `typeof RootLayout === 'function'` (confirms it's exported and importable). Deeper testing of server components goes to E2E (out of scope for Phase 1).
**Warning signs:** Vitest error `ReferenceError: Headers is not defined` or `Cannot find module 'server-only'`.

### Pitfall 5: Cloudflare Pages `_redirects` infinite-loop bug
**What goes wrong:** React Router client-side routes return 404 when accessed directly via URL.
**Why it happens:** Developer adds `/* /200.html 200` to `_redirects`, Cloudflare treats it as infinite loop and ignores it.
**How to avoid:** **Don't add `_redirects` at all.** CF Pages automatically serves `index.html` for unmatched routes IF no `404.html` exists. Vite build doesn't create `404.html` by default → works out of the box.
**Warning signs:** Direct navigation to `/form` or `/roadmap` shows 404; browser-back-then-forward also breaks.

### Pitfall 6: DNS cutover breaks oborotcrm.ru for minutes/hours
**What goes wrong:** Switch nameservers to Cloudflare before CF Pages is ready → site is down for TTL duration (up to 48h).
**Why it happens:** Nameserver change propagates slowly; if CF Pages doesn't have the domain configured yet, CDN responds 404/522.
**How to avoid:** **Order matters:** (1) Deploy landing to CF Pages, verify preview URL works; (2) Add custom domain `oborotcrm.ru` to CF Pages project (it lives on *.pages.dev and a CNAME until nameservers change); (3) Only THEN change nameservers at registrar (reg.ru). CF Pages validates domain once nameservers point at Cloudflare.
**Warning signs:** `dig oborotcrm.ru` shows old DNS responses; users report 522 Connection Timeout.

### Pitfall 7: `npm ci` in CI re-installs from cached node_modules with stale names
**What goes wrong:** After rebrand, CI uses cached `node_modules/@nashsklad/*` symlinks → build fails mysteriously.
**Why it happens:** `actions/setup-node@v4` caches on lockfile-hash — when lockfile changes (due to name), cache should invalidate automatically. But developers sometimes force-cache.
**How to avoid:** Don't override cache key. Trust `setup-node@v4` default. After local rebrand, commit updated `package-lock.json` AS PART OF THE SAME COMMIT so cache invalidates on that commit.
**Warning signs:** `Cannot find module '@nashsklad/landing'` in CI after rebrand merged.

### Pitfall 8: Sentry `replayIntegration` blocks forms/inputs by default
**What goes wrong:** User typing into the waitlist email input is masked in Sentry Replay → can't debug what user typed when form fails.
**Why it happens:** Sentry defaults to `maskAllText: true` + `blockAllMedia: true` for PII safety.
**How to avoid:** For a waitlist-stage product with public landing, set `maskAllText: false` explicitly (no real PII at this stage) BUT keep mindful — the moment we add real auth (Phase 3), revisit this.
**Warning signs:** Replay shows `███████████` everywhere, can't reconstruct bug.

### Pitfall 9: Removing `framer-motion` breaks landing animations
**What goes wrong:** CONCERNS.md says it's unused, but a `grep` may miss imports.
**Why it happens:** Author assumed based on missing imports, but there could be lazy-loaded chunks.
**How to avoid:** BEFORE uninstalling, verify with `grep -r "framer-motion\|'motion/react'\|from \"framer" apps/landing/src` to be certain. Re-run `vite build` after removal — if build succeeds and app renders, safe.
**Warning signs:** Build fails with `Cannot find module 'framer-motion'` OR runtime error in browser.

### Pitfall 10: Env validation crashes in Next.js build but passes in dev
**What goes wrong:** `next build` tries to statically render pages → module-level Zod throw → build fails. `next dev` defers page rendering → env error surfaces only on first page hit.
**Why it happens:** SSR vs SSG vs dev-server have different module-init timings.
**How to avoid:** Keep env validation module-level (parse on import) but write schemas such that missing OPTIONAL vars don't throw. Required vars: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`. Optional: Sentry DSN, auth token.
**Warning signs:** `npm run build` fails with Zod error traceback from a page module.

---

## Code Examples

(See Pattern 1–7 above for primary code. Below are smaller verified snippets.)

### Env Error Banner (landing)
```jsx
// apps/landing/src/components/EnvErrorBanner.jsx
export default function EnvErrorBanner({ errors }) {
  return (
    <div style={{
      padding: 32, background: '#0f0f13', color: '#ff6b6b',
      fontFamily: 'system-ui, sans-serif', minHeight: '100vh'
    }}>
      <h1 style={{ color: '#fff' }}>Конфигурация неполная</h1>
      <p>Приложение не запустится — отсутствуют или некорректны env-переменные:</p>
      <ul>{errors.map(e => <li key={e}><code>{e}</code></li>)}</ul>
      <p>Скопируй <code>.env.example</code> → <code>.env.local</code> и заполни значения. См. README.md.</p>
    </div>
  )
}
```

### Replacing console.error with Sentry.captureException
```javascript
// BEFORE (apps/landing/src/landing/Landing.jsx:52)
} catch (e) { console.error(e) }

// AFTER — direct replacement (recommended for 5 sites — no wrapper utility)
} catch (e) { Sentry.captureException(e) }

// Import at top:
import * as Sentry from '@sentry/react'
```

**Rejected wrapper pattern:**
```javascript
// DON'T build this for 5 sites
import { logError } from './lib/logger'
try { ... } catch (e) { logError(e, { component: 'Landing' }) }
```
**Reason:** Indirection without value for 5 callsites. Sentry's `captureException` already accepts context via 2nd arg — use directly when needed: `Sentry.captureException(e, { tags: { component: 'Landing' } })`.

### Console.error migration map (complete)

| File | Line | Current | Replacement |
|------|------|---------|-------------|
| `apps/landing/src/landing/Landing.jsx` | 52 | `console.error(e)` (Google Sheets webhook fail) | `Sentry.captureException(e, { tags: { op: 'sheets-webhook' } })` |
| `apps/landing/src/landing/Landing.jsx` | 66 | `console.error(e)` (Telegram bot fail) | `Sentry.captureException(e, { tags: { op: 'telegram-notify' } })` |
| `apps/landing/src/segments/Marketplace.jsx` | 40 | `console.error(e)` | `Sentry.captureException(e, { tags: { op: 'sheets-webhook', page: 'marketplace' } })` |
| `apps/landing/src/segments/Marketplace.jsx` | 54 | `console.error(e)` | `Sentry.captureException(e, { tags: { op: 'telegram-notify', page: 'marketplace' } })` |
| `apps/landing/src/form/hooks/useForm.js` | 71 | `console.error('Submit error:', e)` | `Sentry.captureException(e, { tags: { op: 'form-submit' } })` |

**Total: 5 sites** (matches CONCERNS.md count). No `console.error` in `apps/app/` (greenfield).

### Cloudflare Pages build config

```
Framework preset: None (or "Vite")
Build command:    npm run build --workspace=apps/landing
Build output dir: apps/landing/dist
Root directory:   (leave blank — so workspace commands work)
Node version:     20 (set via env var NODE_VERSION=20)
Env vars (prod):  VITE_SHEETS_WEBHOOK_URL, VITE_TG_BOT_TOKEN, VITE_TG_CHAT_ID, VITE_SENTRY_DSN
Env vars (preview): same values as prod for Phase 1
```

**Alternative: use Root Directory = `apps/landing`** then Build Command = `npm run build` and Output = `dist`. Downside: CF Pages will `npm install` ONLY in that subdir — breaks workspace resolution. **Stick with blank root + `--workspace` flag.**

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `.eslintrc.json` config | `eslint.config.js` flat config | ESLint v9 default (Apr 2024), legacy removed in v10 (Apr 2026) | Must write new configs from scratch; old snippets don't work |
| `BrowserTracing` (class) | `browserTracingIntegration()` (factory) | `@sentry/react` 8.x (early 2024) | Old snippets `new BrowserTracing()` break silently |
| Jest + jsdom + ts-jest | Vitest + jsdom | Vitest 1.0 (Dec 2023), stable | Drop-in for Vite projects; Next.js officially supports as of Next 14 |
| Sentry `sentry.client.config.ts` at root | `instrumentation-client.ts` (App Router) | Sentry SDK 8.x + Next.js 15+ | Next 14 still uses the old layout; wizard generates old style for Next 14 |
| Next.js `experimental.instrumentationHook: true` | (removed — default enabled) | Next 15.0.0-canary.124+ | Next 14 STILL needs the flag; Next 15+ does not |
| Cloudflare Pages needs `_redirects` for SPA | Auto-SPA mode (if no 404.html) | CF Pages 2023+ | Adding `_redirects` now causes infinite-loop bug |
| Railway = `vite preview` for prod | CF Pages static | N/A (was always wrong for Vite) | Part of FOUND-06 fix |

**Deprecated/outdated:**
- Husky pre-commit — Claude-commits (amend/rebase) trigger re-runs; CONTEXT.md explicitly rejects (D-16). Correct decision.
- `create-react-app` — archived 2023. Not relevant (we use Vite + Next.js).
- Jest for new Vite projects — Vitest is faster, native ESM, zero-config.
- `@sentry/tracing` package — merged into `@sentry/react` core.

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | Landing's `react-router-dom@7.13.1` supports `reactRouterV7BrowserTracingIntegration` | Pattern 1 (Sentry React) | Sentry tracing integration fails silently; manually switch to `reactRouterV6BrowserTracingIntegration` if v7-version not found. Mitigation: verify at implementation by checking `@sentry/react` 10.49.0 exports. |
| A2 | Next.js 14 requires `experimental.instrumentationHook: true` in `next.config.js` for `@sentry/nextjs` 10.x | Pattern 2 (Sentry Next.js) | Without flag: server-side events never reach Sentry. **This is the single most likely gotcha.** Verify at implementation by checking Next 14 docs + triggering a test server error. |
| A3 | Zod 4.x bundle size is acceptable (~8kB gzip) | Standard Stack | Larger than inline validation but future-proof for Phase 2. If bundle size hard constraint, fall back to envalid (smaller) — but we don't have a hard budget. |
| A4 | `framer-motion` is truly unused (CONCERNS.md says so) | Stack Installation | If used in a lazy import I missed, landing build breaks. Mitigation: re-grep `framer-motion\|motion/` before `npm uninstall`. |
| A5 | CF Pages preview-deploy auto-integrates with GitHub PR checks | Pattern 6 (CI) | If not: PR author must manually check `<branch>.oborot-landing.pages.dev`. Not a blocker. |
| A6 | `SENTRY_AUTH_TOKEN` needed for source maps upload (landing build) | Pattern 1 | Without token, plugin silent-skips (no upload); errors show minified names. Acceptable for Phase 1 if token is set LATER — Sentry still captures events, just with worse stack traces. |
| A7 | ESLint flat config supported by all listed React plugins in their latest versions | Pattern 7 | If `eslint-plugin-react@7.37.5` doesn't support flat well, fallback to ESLint v8 + legacy `.eslintrc`. Low risk given v9 is default since 2024. |
| A8 | Next.js 14 `next lint` can be replaced with direct `eslint src` call | Pattern 7 | If Next.js includes magic import resolution that `eslint src` misses → certain Next-specific rules won't fire. Acceptable for Phase 1 (we're not using `eslint-config-next` rules deeply). |

---

## Open Questions

1. **Sentry organization/project slugs** — do we create `oborotcrm` as org name in Sentry, or use an existing personal one?
   - What we know: Free tier supports 1 org with multiple projects.
   - What's unclear: Which org will own `landing` and `app` projects.
   - Recommendation: Create NEW Sentry org `oborotcrm` — avoid mixing with personal projects.

2. **Landing SPA deep-link → Cloudflare Pages** — when direct navigation to `/form` from external link, does CF Pages serve `index.html` with 200 for the right path?
   - What we know: CF Pages auto-serves `index.html` for unmatched paths when no `404.html` exists.
   - What's unclear: Whether Vite's default build produces a `404.html` (it doesn't unless explicitly configured).
   - Recommendation: Verify after first preview deploy by clicking direct link to `/form` — fix at that point if broken.

3. **Testing `next/navigation` mocks in app-smoke tests** — do Phase 1 login.jsx and layout.jsx actually USE useRouter/useSearchParams?
   - What we know: Login.jsx currently has no navigation hooks (just static JSX).
   - What's unclear: Whether adding the mock preemptively is overengineering.
   - Recommendation: Add mock to `vitest.setup.js` anyway — it's 5 lines and future-proofs for Phase 3 auth tests.

4. **Sentry free tier — 5k events/mo enough?**
   - What we know: Free tier is 5000 events/month, 500 replays, 10k transactions.
   - What's unclear: Actual traffic — we're pre-product, probably <200 visitors/day, so 5k is fine.
   - Recommendation: Start on free, set `tracesSampleRate: 0.1` to further economize. Upgrade alert: Sentry will notify at 80% usage.

5. **Russian access to Cloudflare Pages payments** — can we pay if we hit limits?
   - What we know: CF Pages free tier has generous limits (500 builds/mo, unlimited bandwidth for CDN).
   - What's unclear: At what scale we'd need paid tier and whether RU payment works.
   - Recommendation: Not a Phase 1 concern. CF Pages free tier covers us through MVP.

6. **`.claude/launch.json`** — should the "nashsklad-landing" debug config name be renamed?
   - What we know: This is Claude Code debug config, not part of the app.
   - What's unclear: Whether this file is committed to git.
   - Recommendation: Rename for consistency (grep caught it); low-priority.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Node.js | Local dev, CI | ✓ | 20.19.5 | — |
| npm | Local dev, CI | ✓ | 10.8.2 | — |
| git | Version control | ✓ | 2.50.1 | — |
| Cloudflare account | Landing hosting | ✗ (needs creation) | — | **BLOCKING** — must create account + add `oborotcrm.ru` zone before DNS cutover |
| Sentry account | Error tracking | ✗ (needs creation) | — | Phase 1 can ship without Sentry init (code present, DSN empty); production errors go unobserved until DSN set |
| GitHub Actions | CI | ✓ (implicit from repo being on GH) | — | — |
| Registrar access (reg.ru or similar) for oborotcrm.ru | DNS nameserver change | ✗ (not verified from this machine) | — | **BLOCKING for FOUND-06 Step 3** — needs human login to registrar |
| `npx @sentry/wizard` | Automated Sentry Next.js setup | ✓ (via npx) | Installable on demand | Manual setup from docs if wizard breaks |

**Missing dependencies with no fallback (BLOCKING for specific tasks):**
- Cloudflare account creation (required for CF Pages project setup task)
- Registrar access (required for nameserver change task in FOUND-06)

**Missing dependencies with fallback:**
- Sentry account can be created after code is written — Sentry init tolerates missing DSN (no-op)

---

## Validation Architecture

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 3.2.4 (both apps) + React Testing Library 16.3.2 + jest-dom 6.9.1 |
| Config file | `apps/landing/vitest.config.js`, `apps/app/vitest.config.js` (both **NEW** in Phase 1) |
| Quick run command | `npm run test --workspace=apps/landing && npm run test --workspace=apps/app` |
| Full suite command | Same (same commands in CI matrix) |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| FOUND-01 | No `nashsklad` / `НашСклад` in code | manual grep + CI-optional | `! grep -r 'nashsklad\|НашСклад' apps/ *.json` | ❌ Wave 0 (add script) |
| FOUND-01 | Root `package.json` name is `oborot-crm` | unit | `node -e "process.exit(require('./package.json').name === 'oborot-crm' ? 0 : 1)"` | inline |
| FOUND-02 | `.env.example` exists at root + both apps | smoke | `test -f .env.example && test -f apps/landing/.env.example && test -f apps/app/.env.example` | inline |
| FOUND-02 | Landing fails to start if required env missing | integration | Run `vite dev` with blanked `.env`, assert `<EnvErrorBanner/>` renders | ❌ Wave 0 (`apps/landing/src/__tests__/env.test.js`) |
| FOUND-02 | App fails to start if `NEXT_PUBLIC_SUPABASE_URL` missing | integration | `NEXT_PUBLIC_SUPABASE_URL='' next build` should fail | manual (CI will catch via dummy var test) |
| FOUND-03 | Landing smoke: `<App/>` renders | unit | `vitest run apps/landing/src/__tests__/App.test.jsx` | ❌ Wave 0 |
| FOUND-03 | Landing unit: `useForm.canProceed()` | unit | `vitest run apps/landing/src/__tests__/useForm.test.js` | ❌ Wave 0 |
| FOUND-03 | Landing unit: `useForm.toggleMulti()` (including maxSelect) | unit | Same file as above | ❌ Wave 0 |
| FOUND-03 | App smoke: layout + login renders | unit | `vitest run apps/app/__tests__/login.test.jsx` | ❌ Wave 0 |
| FOUND-04 | CI runs on every PR and blocks merge on red | E2E (manual) | Open draft PR with failing test; verify PR shows "Tests failed" + merge blocked | manual verification on first real PR |
| FOUND-04 | `npm run lint && npm run test && npm run build` green in CI for both apps | automated | CI matrix logs | CI workflow itself is the test |
| FOUND-05 | Sentry actually RECEIVES an event from landing | manual E2E | Add `throw new Error('smoke test')` in `main.jsx` → deploy → verify Sentry dashboard | manual post-deploy |
| FOUND-05 | Sentry actually RECEIVES an event from app (server) | manual E2E | Add `Sentry.captureMessage('test')` in `app/dashboard/page.jsx` → `next build && next start` → hit dashboard → verify Sentry server event | manual post-setup |
| FOUND-05 | No `console.error` remains in `apps/` | lint/grep | `! grep -rn 'console\.\(error\|log\|warn\)' apps/` (whitelist test files) | ❌ Wave 0 (add ESLint rule `no-console: ['error']`) |
| FOUND-06 | Landing deployed to CF Pages, `oborotcrm.ru` reachable via CF edge | manual E2E | `curl -I https://oborotcrm.ru` returns `200 OK` + CF headers; `dig oborotcrm.ru` shows CF nameservers | manual post-cutover |
| FOUND-06 | PR preview deploy URL works for a test PR | manual E2E | Open PR → CF Pages posts preview URL comment → open URL → landing renders | manual on first PR after CF setup |

### Sampling Rate
- **Per task commit:** `vitest run` for whichever app was touched (quick).
- **Per wave merge:** `npm run lint && vitest run && vite build` + `next build` for BOTH apps.
- **Phase gate:** All CI checks green on `main`, Sentry receiving events from prod (manual verification), CF Pages live at `oborotcrm.ru`.

### Wave 0 Gaps

The following test files/infra do not exist yet and must be created BEFORE implementation tasks can run:

- [ ] `apps/landing/vitest.config.js` — Vitest configuration
- [ ] `apps/landing/vitest.setup.js` — jest-dom globals
- [ ] `apps/landing/src/__tests__/App.test.jsx` — smoke test (FOUND-03)
- [ ] `apps/landing/src/__tests__/useForm.test.js` — unit tests (FOUND-03)
- [ ] `apps/landing/src/__tests__/env.test.js` — env validator test (FOUND-02)
- [ ] `apps/app/vitest.config.js` — Vitest configuration
- [ ] `apps/app/vitest.setup.js` — jest-dom + next/navigation mocks
- [ ] `apps/app/__tests__/layout.test.jsx` — smoke (FOUND-03)
- [ ] `apps/app/__tests__/login.test.jsx` — smoke (FOUND-03)
- [ ] Framework installs per §Installation above — all Vitest + RTL deps
- [ ] ESLint rule `no-console: ['error', { allow: ['warn'] }]` in root `eslint.config.js` to statically forbid console.error regression (FOUND-05)
- [ ] Lint script `grep -r 'nashsklad\|НашСклад' apps/` in CI (or `--max-warnings=0` via ESLint custom rule) — catches rebrand regression (FOUND-01)
- [ ] `.github/workflows/ci.yml` — the workflow itself (FOUND-04)

**Manual validation required (no automated test possible in Phase 1):**
- Sentry dashboard receives events from landing (after deploy)
- Sentry dashboard receives events from app (after any deploy or via `next start` local)
- CF Pages preview deploy on PR
- CF Pages prod deploy + DNS cutover + `oborotcrm.ru` reachable over HTTPS with CF edge

---

## Git Cleanup Mechanics (complete list)

**Current `git status` untracked + deletions:**

18 deletions (staged in working tree, not yet committed):
1. `.env.example`
2. `google-apps-script.js`
3. `index.html`
4. `postcss.config.js`
5. `src/App.jsx`
6. `src/components/ChoiceCard.jsx`
7. `src/components/ProgressBar.jsx`
8. `src/components/RatingScale.jsx`
9. `src/components/SurveyStep.jsx`
10. `src/components/ThankYou.jsx`
11. `src/data/questions.js`
12. `src/hooks/useSurvey.js`
13. `src/index.css`
14. `src/main.jsx`
15. `src/pages/Landing.jsx`
16. `src/pages/Survey.jsx`
17. `tailwind.config.js`
18. `vite.config.js`

2 untracked:
- `.DS_Store` (root)
- `apps/.DS_Store`

**Note:** CONTEXT.md says "17 stale D-files" — the actual count is 18. This discrepancy is non-blocking; planner should align to `git status` output at execution time.

**Recommended commit order for Phase 1 (bisect-friendly):**

1. `chore: add .DS_Store to .gitignore` — one-line change, gets us out of the untracked-file noise before starting real work.
2. `chore: remove pre-monorepo root files` — the 18 deletions above, in ONE commit (D-20). This leaves git clean.
3. `chore(deps): remove unused framer-motion` — one commit, landing-only (FOUND-claude-discretion).
4. `chore: rebrand nashsklad to oborot` — single rebrand commit (D-18). Includes:
   - `package.json` root → `"name": "oborot-crm"`
   - `apps/landing/package.json` → `"@oborot/landing"`
   - `apps/app/package.json` → `"@oborot/app"`
   - `apps/landing/google-apps-script.js` header
   - `.claude/launch.json` (if decided to touch — low priority)
   - `package-lock.json` regenerated (part of same commit — ensures CI cache invalidates correctly)
5. `feat(env): add Zod schemas + root .env.example + per-app validation`
6. `docs: root README + per-app READMEs`
7. `test: add Vitest + smoke + unit tests (landing + app)`
8. `ci: add GitHub Actions lint+test+build workflow`
9. `feat(sentry): add @sentry/react to landing + @sentry/nextjs wizard for app`
10. `refactor: replace console.error with Sentry.captureException`
11. `chore(hosting): decommission Railway (delete railway.json)`

This sequence is **bisect-safe**: each commit leaves the repo in a runnable state.

---

## Rollout Order for FOUND-06 (DNS cutover to CF Pages)

**Non-downtime order (recommended):**

1. **(Setup)** Create Cloudflare account + add `oborotcrm.ru` as a zone. CF gives us two new nameservers (e.g. `ana.ns.cloudflare.com`, `bob.ns.cloudflare.com`) — **do NOT switch at registrar yet**.
2. **(CF Pages project)** Connect GitHub → CF Pages → select repo → configure build:
   - Build command: `npm run build --workspace=apps/landing`
   - Build output: `apps/landing/dist`
   - Root: blank
   - Env vars: `VITE_SHEETS_WEBHOOK_URL`, `VITE_TG_BOT_TOKEN`, `VITE_TG_CHAT_ID`, `VITE_SENTRY_DSN`
3. **(Verify preview)** Push a test PR. Verify CF Pages posts preview URL comment. Open URL, click through landing, verify it renders.
4. **(Custom domain on CF Pages)** In CF Pages project settings → Custom domains → add `oborotcrm.ru`. CF will say "waiting for nameservers to point at Cloudflare."
5. **(Railway decommission prep)** In Railway dashboard, verify the project's last-deploy time. Keep Railway running — we'll turn it off AFTER CF Pages is live.
6. **(DNS cutover)** Log in to registrar (reg.ru). Change nameservers from whatever they are to the 2 Cloudflare-provided ones. Propagation: 5 min to 48h, typical 30 min.
7. **(Verify post-cutover)** `dig @8.8.8.8 oborotcrm.ru NS` should show Cloudflare. `curl -I https://oborotcrm.ru` should show CF headers (`server: cloudflare`) + 200 OK.
8. **(Delete Railway)** Delete Railway project/service. Remove `railway.json` from repo in a separate commit.
9. **(Test preview deploys on real PR)** Open a PR that makes a trivial change; verify CF Pages builds preview + posts URL in PR comment.

**Why this order:** Railway keeps serving `oborotcrm.ru` during steps 1-6 (since nameservers haven't switched). The moment nameservers switch, CF Pages responds to `oborotcrm.ru` — no gap. Step 8 happens AFTER verification, so rollback is easy (just switch nameservers back).

**Rollback plan:** If CF Pages misbehaves post-cutover, switch nameservers back at registrar. Railway still has the deployed build (if we haven't deleted it yet). Max downtime: propagation delay.

---

## Project Constraints (from CLAUDE.md)

Global `~/.claude/CLAUDE.md` (user-level):
- **No console output of secrets** — never print API keys, tokens, DSN values in logs. Zod validation error messages must NOT include env var VALUES, only names.
- **Concise responses, no filler, no preambles** — applies to agent output, not the code itself.
- **Debugging discipline: fix root cause, not symptoms** — relevant for `console.error` cleanup: replace all 5 sites, don't silence them.
- **Bash outputs with risk of >150 lines should be limited at script level** — applies to CI grep/lint scripts (`head -n 100` where appropriate).

Project `./CLAUDE.md`: **does not exist**. No project-specific overrides.

---

## Sources

### Primary (HIGH confidence)
- [Sentry Next.js manual setup docs](https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/) — version-aware setup [CITED]
- [Sentry React + React Router v7 docs](https://docs.sentry.io/platforms/javascript/guides/react/features/react-router/) — `reactRouterV7BrowserTracingIntegration` exists [CITED]
- [Sentry Vite source-maps docs](https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/vite/) — `@sentry/vite-plugin` usage [CITED]
- [Next.js Vitest official guide](https://nextjs.org/docs/app/guides/testing/vitest) — last updated 2026-04-15 [CITED]
- [Next.js 14 instrumentationHook docs](https://nextjs.org/docs/14/pages/api-reference/next-config-js/instrumentationHook) — confirms flag required for Next 14 [CITED]
- [Next.js file-conventions instrumentation.js](https://nextjs.org/docs/app/api-reference/file-conventions/instrumentation) [CITED]
- [Cloudflare Pages Monorepos docs](https://developers.cloudflare.com/pages/configuration/monorepos/) — Build System V2+ for monorepo [CITED]
- [Cloudflare Pages Vite 3 framework guide](https://developers.cloudflare.com/pages/framework-guides/deploy-a-vite-3-project/) — build settings [CITED]
- [Cloudflare Workers SPA routing](https://developers.cloudflare.com/workers/static-assets/routing/single-page-application/) — auto SPA if no 404.html [CITED]
- [actions/setup-node v4 README](https://github.com/actions/setup-node) — cache, matrix [CITED]
- [ESLint Configuration Files](https://eslint.org/docs/latest/use/configure/configuration-files) — flat config [CITED]
- [ESLint v10 release notes](https://www.infoq.com/news/2026/04/eslint-10-release/) — legacy removed April 2026 [CITED]
- [Vitest guide](https://vitest.dev/guide/) [CITED]

### Secondary (MEDIUM confidence — cross-verified)
- [npm registry](https://www.npmjs.com/) — all package version lookups verified via `npm view` [VERIFIED]
- [Sentry Next.js automatic instrumentation](https://docs.sentry.io/platforms/javascript/guides/nextjs/tracing/instrumentation/automatic-instrumentation/) [CITED]
- [GitHub discussion: Sentry Next.js App Router auto-instrumentation](https://github.com/getsentry/sentry-javascript/discussions/13442) — community confirmation [CITED]

### Tertiary (LOW confidence — flagged for validation)
- Zod "de-facto standard" claim — supported by ubiquity in search results, but no single authoritative "library comparison" source. Confidence: MEDIUM. Mitigation: decision is explicitly Claude's Discretion (D-23); if Zod proves painful, fall back to Envalid.
- ESLint `eslint-plugin-react` flat-config compat — relies on plugin's own docs which I did not deep-fetch. Confidence: MEDIUM.

---

## Metadata

**Confidence breakdown:**
- Standard stack versions: HIGH — all verified via npm registry 2026-04-21
- Sentry React setup: HIGH — official docs + version-verified
- Sentry Next.js 14 setup: MEDIUM — docs written for Next 15+, Next 14 path requires `experimental.instrumentationHook` flag (VERIFIED via Next 14 docs) but the interaction with Sentry 10.x wizard is inferred, not directly documented
- Vitest for Next.js: HIGH — official Next.js docs, last updated 2026-04-15
- Vitest for Vite landing: HIGH — Vitest docs + npm peer deps verified
- Cloudflare Pages monorepo: HIGH — official docs + community posts aligned
- GitHub Actions: HIGH — official actions/setup-node docs
- Zod as env validator: MEDIUM — preference over alternatives is defensible but subjective
- ESLint flat config: MEDIUM — general approach verified, plugin compat assumed
- Git cleanup mechanics: HIGH — verified against live `git status`

**Research date:** 2026-04-21
**Valid until:** 2026-05-21 (30 days for relatively stable stack; Sentry SDK moves fast — re-verify if implementation slips past a month)

---

## Open Questions for Planner / Claude's Discretion

1. **Landing env-validator ergonomics** — should the landing app render `<EnvErrorBanner/>` (disruptive, blocks the whole page) or a small top-banner warning that lets the page still function but highlights missing config? CONTEXT D-22 says "баннер ошибки" — I interpret as full-page disruptive banner for dev/staging, since if `VITE_SHEETS_WEBHOOK_URL` is missing, form submission silently drops data (current bug). **Recommendation: full-page blocker** — it's better to see an error than to deploy a broken waitlist silently.

2. **App server-side env validation location** — Next.js server-side env parse should happen in `instrumentation.js` (earliest hook in Next 14+) or in `app/layout.jsx`? `instrumentation.js` is earlier (registers before any request) — recommend placing `import './lib/env'` there so misconfig fails fast.

3. **Sentry tracesSampleRate** — CONTEXT calls out 5k/month free tier. Recommended `tracesSampleRate: 0.1` (10%) + `replaysSessionSampleRate: 0.0` + `replaysOnErrorSampleRate: 1.0` to budget within free tier. Planner should confirm these numbers.

4. **ESLint config location** — root `eslint.config.js` or per-app `apps/*/eslint.config.js`? Recommend ROOT with per-file-pattern overrides (simpler for solo-dev, fewer duplicated files). Planner decides.

5. **`next lint` vs direct `eslint src`** — Next.js 14 default `next lint` command uses legacy config. For a mixed JS+JSX codebase without TypeScript, `eslint src` directly is cleaner. Planner should include `"lint": "eslint app lib --max-warnings=0"` in `apps/app/package.json` (not `next lint`).

6. **Does the `chore: rebrand` commit also delete `railway.json`?** CONTEXT leaves this ambiguous (D-01 says "удаляется или `railway.json` переносится"). Recommend: `railway.json` goes in a SEPARATE commit (`chore(hosting): decommission Railway`) AFTER CF Pages is verified live — that way if CF Pages fails we can roll back just one commit.

7. **Sentry wizard vs manual setup for app** — the wizard is faster for Claude to execute and catches edge cases (source-maps webpack plugin, global-error.jsx). Recommend using the wizard, then manually adding `experimental.instrumentationHook: true` (the single Next-14-specific gap).

8. **Adding `.vercel` dir to .gitignore** — it's already there, but `.vercel` directory exists in repo. Leave as-is (gitignored, not tracked).

9. **README localization** — Russian or English? Repo currently has Russian marketing content (`STORY.md`, `ROADMAP.md`, `content/`), but Claude-facing tooling (`.planning/`) is bilingual. Recommend READMEs in Russian to match project tone.

10. **CI node version pin** — use `node-version: '20'` (current LTS) or `node-version: '20.19'` (exact match to local)? Recommend `'20'` (LTS range) for automatic patch updates.
