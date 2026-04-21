# apps/app — OborotCRM (Next.js)

Само CRM-приложение: auth, dashboard, товары, остатки, аналитика. В Phase 1 здесь только скелет (страницы `/`, `/login`, `/dashboard`, `/_not-found`) — функциональная разработка начнётся в Phase 2 (Auth + Lead capture) и далее.

## Стек

- **Next.js 14** (App Router)
- **Supabase** — БД + Auth + Realtime (клиент уже проинициализирован в `lib/supabase.js`)
- **TailwindCSS 3** — стили
- **React Query** и **Zustand** — установлены, но пока не задействованы; будут включены в соответствующих планах Phase 2+
- **Zod 4** — runtime-валидация env на module-load

## Dev / Build

```bash
# Из корня монорепо:
npm run dev --workspace=apps/app       # http://localhost:3001
npm run build --workspace=apps/app     # .next/
npm run start --workspace=apps/app     # production-сервер (порт 3001)
```

Или сокращённо: `npm run app` из корня.

## Env

Скопируй `apps/app/.env.example` → `apps/app/.env.local` и заполни.

| Переменная | Обязательно | Область | Описание |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | да (URL) | client + server | Supabase Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | да (≥20 символов) | client + server | Anon (public) API key |
| `NEXT_PUBLIC_SENTRY_DSN` | нет (URL) | client + server | DSN для `@sentry/nextjs` |
| `SENTRY_AUTH_TOKEN` | нет | **server-only** | Используется только в CI для загрузки source maps в Sentry |

Zod-валидатор в `lib/env.js` импортируется side-effect-ом из `app/layout.jsx`, поэтому при запуске/билде Next.js упадёт с описательной ошибкой, если required-переменные отсутствуют. В CI дамми-значения подставляются в Plan 01-07 (FOUND-04).

## Deploy

**Production hosting будет зафиксирован ADR-ом в Phase 2** (см. `.planning/phases/01-foundation-repo-cleanup/01-CONTEXT.md` §D-04). Варианты под рассмотрением: Cloudflare Workers + OpenNext vs Railway vs Vercel — решение зависит от сценариев API routes для lead capture (которые появятся в Phase 2 / LEAD-01..03).

В Phase 1 приложение запускается **только локально** через `npm run dev --workspace=apps/app`.

## Тесты

`npm run test --workspace=apps/app` (Vitest + RTL + jsdom + next/navigation mock). Тестовая инфраструктура добавляется в Plan 01-04 (FOUND-03).

## Структура

```
apps/app/
├── app/                    # Next.js App Router
│   ├── layout.jsx          # Root layout (импортирует lib/env для Zod validation)
│   ├── page.jsx            # /
│   ├── (auth)/login/       # /login
│   ├── dashboard/          # /dashboard
│   └── globals.css
├── lib/
│   ├── env.js              # Zod client/server schemas
│   └── supabase.js         # Supabase client (consumes validated clientEnv)
├── next.config.js
├── tailwind.config.js
└── package.json
```
