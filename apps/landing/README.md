# apps/landing — OborotCRM Landing

Публичный лендинг `oborotcrm.ru`: hero, waitlist-форма, сегментные страницы, internal roadmap.

## Стек

- **React 18** — UI-библиотека
- **Vite 5** — dev-сервер + build
- **React Router v7** — маршрутизация (`/`, `/form`, `/roadmap`, `/for/marketplace` и т.д.)
- **TailwindCSS 3** — стили
- **Zod 4** — runtime-валидация env

## Dev / Build

```bash
# Из корня монорепо:
npm run dev --workspace=apps/landing       # http://localhost:5173
npm run build --workspace=apps/landing     # → apps/landing/dist/
npm run preview --workspace=apps/landing   # превью production-сборки
```

Или сокращённо: `npm run landing` из корня.

## Env

Скопируй `apps/landing/.env.example` → `apps/landing/.env.local` и заполни.

| Переменная | Обязательно | Описание |
|---|---|---|
| `VITE_SHEETS_WEBHOOK_URL` | да | URL Google Apps Script — приём лидов в Google Sheets |
| `VITE_TG_BOT_TOKEN` | да (min 10 символов) | Токен Telegram-бота для уведомлений о новых лидах |
| `VITE_TG_CHAT_ID` | да | Chat ID, куда бот пишет уведомления |
| `VITE_SENTRY_DSN` | нет (URL) | DSN для client-side Sentry (публичный) |
| `VITE_SENTRY_RELEASE` | нет | Тег релиза — обычно задаётся в CI |

При отсутствии required переменных приложение не запустится — покажет `<EnvErrorBanner/>` с перечислением проблем. Значения переменных **никогда** не попадают в сообщения об ошибках (только имена) — CLAUDE.md §Секреты.

## Deploy

**Production:** Cloudflare Pages (auto-deploy на push в `main`). Настраивается в Plan 01-08 (FOUND-06).
**Preview:** Cloudflare Pages Preview — на каждый PR. Используется для проверки изменений перед merge и cache invalidation на prod.

Build command (для CF Pages): `npm run build --workspace=apps/landing`
Output directory: `apps/landing/dist`

Railway (`vite preview` как прод-сервер) выводится из эксплуатации после переезда на CF — см. Plan 01-08.

## Тесты

`npm run test --workspace=apps/landing` (Vitest + RTL). Тестовая инфраструктура добавляется в Plan 01-04 (FOUND-03).

## Google Apps Script

`apps/landing/google-apps-script.js` деплоится отдельно в Google Apps Script (Расширения → Apps Script → Web App). Ребранд-коммит `d353111` обновил header; переразвёртывание — отдельный ручной шаг, не в scope Phase 1.
