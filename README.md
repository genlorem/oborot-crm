# OborotCRM

Бизнес-CRM для продавцов маркетплейсов — WB, Ozon, Яндекс.Маркет. Учёт, аналитика, прогноз и команда в одном месте, без прослоек и без потери истории.

Монорепо из двух приложений: **`apps/landing`** (Vite + React) — публичный лендинг `oborotcrm.ru`, и **`apps/app`** (Next.js 14 + Supabase) — сам CRM (скелет, активная разработка в Phase 2+).

## Быстрый старт

```bash
git clone <repo-url>
cd oborot-crm
npm install

# Скопируй шаблон и заполни значения (см. таблицу ниже)
cp .env.example .env.local

# В двух разных вкладках терминала:
npm run landing   # apps/landing на http://localhost:5173
npm run app       # apps/app на http://localhost:3001
```

Цель — **новый контрибьютор от clone до запущенных двух приложений за 10 минут**.

## Структура монорепо

```
oborot-crm/
├── apps/
│   ├── landing/         # Vite + React + Tailwind — публичный лендинг
│   └── app/             # Next.js 14 + Supabase — CRM-приложение (WIP)
├── content/             # Продуктовые тексты (TG-посты и т.п.)
├── .planning/           # GSD-артефакты (phases, requirements, roadmap)
├── .env.example         # Единая точка правды по всем env
├── ROADMAP.md           # Бизнес-дорожная карта (выход на 5М₽ за год)
├── STORY.md             # Продуктовый нарратив
└── package.json         # npm workspaces root
```

## Env vars

Единый `.env.example` на корне документирует все 9 переменных. На per-app контрибьюторах лежат `apps/landing/.env.example` и `apps/app/.env.example` — упрощённые аналоги.

| Переменная | Приложение | Обязательно | Где взять |
|---|---|---|---|
| `VITE_SHEETS_WEBHOOK_URL` | landing | да | Google Apps Script → Deploy → Web App URL (формат `https://script.google.com/macros/s/.../exec`) |
| `VITE_TG_BOT_TOKEN` | landing | да | [@BotFather](https://t.me/BotFather) → `/newbot` → скопируй токен |
| `VITE_TG_CHAT_ID` | landing | да | Напиши боту `/start`, затем `https://api.telegram.org/bot<TOKEN>/getUpdates` — найди `"chat":{"id":...}` |
| `VITE_SENTRY_DSN` | landing | нет | Sentry project settings → Client Keys (DSN) |
| `VITE_SENTRY_RELEASE` | landing | нет | Задаётся в CI, тегирует релизы |
| `NEXT_PUBLIC_SUPABASE_URL` | app | да | [Supabase dashboard](https://app.supabase.com) → Project Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | app | да | Там же → Project API keys → anon (public) |
| `NEXT_PUBLIC_SENTRY_DSN` | app | нет | Sentry project (другой DSN чем у landing) |
| `SENTRY_AUTH_TOKEN` | app | нет (server-only) | Sentry → User settings → Auth Tokens — используется только в CI для загрузки source maps |

Валидация env — runtime на старте приложения через Zod. Если required переменные отсутствуют:
- **landing** покажет баннер `Конфигурация неполная` с именами недостающих переменных.
- **app** упадёт на module-load с понятной ошибкой в терминале / в Next.js overlay.

## Скрипты

Корневые (делегируют в workspaces):

```bash
npm run landing            # dev-сервер landing (порт 5173)
npm run app                # dev-сервер app (порт 3001)
npm run build --workspace=apps/landing   # сборка landing в dist/
npm run build --workspace=apps/app       # сборка app (.next/)
```

Per-app тесты и lint будут добавлены в Plan 01-04 (Vitest + RTL) и Plan 01-06 (ESLint). Пока их нет.

## Где что лежит

- **Per-app README:** [`apps/landing/README.md`](apps/landing/README.md), [`apps/app/README.md`](apps/app/README.md)
- **Инженерные требования:** [`.planning/REQUIREMENTS.md`](.planning/REQUIREMENTS.md)
- **Бизнес-дорожная карта:** [`ROADMAP.md`](ROADMAP.md)
- **Продуктовый нарратив:** [`STORY.md`](STORY.md)
- **Планирование фаз:** [`.planning/phases/`](.planning/phases/) — каждая фаза содержит PLAN и SUMMARY

## Troubleshooting

- **На landing видишь чёрный экран с заголовком `Конфигурация неполная`** → скопируй `.env.example` в `.env.local` и заполни VITE_* переменные. Страница перезапустится сама после правок.
- **На app ошибка `Client env invalid: NEXT_PUBLIC_SUPABASE_URL: Invalid URL`** → Supabase-переменные пустые или неправильного формата. См. таблицу выше.
- **`npm install` требует Node 20+** → `nvm install 20 && nvm use 20`.

---

*Monorepo набирает скелет в Phase 1 (foundation cleanup) — тесты, CI, Sentry, error tracking и статический хостинг landing добавляются в последующих планах фазы.*
