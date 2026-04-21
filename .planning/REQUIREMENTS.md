# Requirements: OborotCRM

**Defined:** 2026-04-21
**Core Value:** Продавец, живущий на маркетплейсах, может вести учёт и смотреть аналитику без прослоек и без потери данных — нативные интеграции WB/Ozon/ЯМ + бесконечное хранение истории.

## Source of these requirements

Сформированы из 15 требований `.planning/intel/requirements.md` (из корневого ROADMAP.md как PRD). Для GSD оставлены **только engineering-подзадачи**; маркетинговые активности вынесены в Out of Scope с пометкой "tracked in root ROADMAP.md, not GSD-managed". Mapping:

| Source requirement (REQ-*) | Engineering items extracted → | v1 IDs |
|----|----|----|
| REQ-brand-positioning | домен, канал, бот, UX-копирайт лендинга | LEAD-04 (segment landings); остальное уже VALIDATED |
| REQ-target-segments | ICP-сегмент B (малая команда) как основной для tier-лимитов | BILL-01 (лимиты тарифов) |
| REQ-pricing-tiers | 3 тарифа + Early Bird 50% навсегда для первых 500 | BILL-01, BILL-02, BILL-03 |
| REQ-phase0-audience-before-product | "Настроить CRM для сбора лидов", "Подготовить демо-режим с тестовыми данными" | LEAD-01..03, DEMO-01..02 |
| REQ-phase1-first-monetization | архитектура модулей, 2 модуля, сегментные лендинги, запуск платных тарифов, реферальная программа backend | MOD-01..03, MOD-04, LEAD-04, BILL-04, REF-01..02 |
| REQ-phase2-scale | ретаргет-инфра на лендинге (pixel+event), storage-масштаб под growth | (вынесено частично в Out of Scope; технический остаток — см. INT-04) |
| REQ-phase3-retention-upsell | Pro-тариф upsell, программа лояльности backend | BILL-05, LOY-01 |
| REQ-weekly-metrics | 5 метрик в админке | MET-01 |
| REQ-risk-mitigations | готовность MVP на месяц 4, hooks для personal onboarding | BILL-04 acceptance (MVP-gate), ADM-01 |
| REQ-utp-infinite-analytics-retention | архитектура хранения с нулём data loss | INT-01..04, STOR-01 |
| REQ-industry-modules | shell-архитектура, 2 модуля year-1 | MOD-01..04 |
| REQ-model-assumptions | не транслируется в engineering (финмодель) | Out of Scope |
| REQ-revenue-goal-y1 | не транслируется в engineering | Out of Scope |
| REQ-marketing-budget-allocation | не транслируется в engineering | Out of Scope |

---

## v1 Requirements

Требования для первого релиза CRM. Каждое маппится ровно на одну фазу роадмапа.

### Foundation (инфра/монорепо/CI)

- [x] **FOUND-01
**: Монорепо приведено в порядок: удалены старые root-файлы из git, переименован пакет `nashsklad` → `oborot-crm`, `apps/landing/google-apps-script.js` и упоминания "НашСклад" заменены на "Оборот"
- [ ] **FOUND-02**: На обоих приложениях (`apps/landing`, `apps/app`) настроены `.env.example`, валидация обязательных env vars на старте, документированный `README.md` для локального запуска и деплоя
- [ ] **FOUND-03**: Настроен минимальный testing-стек (Vitest + React Testing Library) в обоих приложениях; хотя бы один smoke-тест в каждом
- [ ] **FOUND-04**: Настроен CI (GitHub Actions) — lint + test на каждый PR в main
- [ ] **FOUND-05**: Error-tracking подключён (Sentry или аналог) на оба приложения, `console.error` убраны из прод-кода
- [ ] **FOUND-06**: Landing app переведён с `vite preview` на статический билд за CDN/edge (оставляем Railway или Vercel — решается ADR-ом)

### Lead Capture (миграция с Google Sheets)

- [ ] **LEAD-01**: Лиды с landing (waitlist email/Telegram + multi-step анкета) пишутся в Supabase, а не в Google Sheets; есть server-side дедупликация по контакту
- [ ] **LEAD-02**: Telegram-уведомления о лидах отправляются с бэкенда (API route в `apps/app`), токен бота больше не в VITE_* client-side
- [ ] **LEAD-03**: Счётчик Early Bird (`EARLY_BIRD_TAKEN`) читается из Supabase, не хардкод — показывает реальное число
- [ ] **LEAD-04**: Сегментные лендинги `/for/clothing`, `/for/electronics`, `/for/marketplace` и т.д. живые; каждый с собственным CTA и UTM-трекингом; контент-модель сегментов выведена в данные, не дублируется в JSX

### Demo Mode (публичный демо-режим с тестовыми данными)

- [ ] **DEMO-01**: Посетитель сайта может открыть `/demo` и увидеть полностью рабочий интерфейс CRM (товары, остатки, продажи, аналитика) на синтетических данных — без регистрации
- [ ] **DEMO-02**: Demo-режим изолирован: изменения в демо не видны другим посетителям; состояние сбрасывается при перезагрузке или через N минут неактивности

### Auth & Tenancy (многоарендная основа CRM)

- [ ] **AUTH-01**: Пользователь может зарегистрироваться по email + пароль через Supabase Auth, получить подтверждающий email
- [ ] **AUTH-02**: Пользователь может войти, сессия переживает refresh браузера; `/dashboard` защищён middleware (без сессии → редирект на `/login`)
- [ ] **AUTH-03**: Пользователь может сбросить пароль по email-ссылке
- [ ] **AUTH-04**: Данные каждого аккаунта (workspace) изолированы через Supabase RLS; в рамках workspace можно иметь несколько пользователей (до лимита тарифа)

### Marketplace Integrations (WB / Ozon / ЯМ, без прослоек)

- [ ] **INT-01**: Пользователь подключает аккаунт Wildberries через собственный API-ключ; идёт инкрементальная синхронизация товаров, остатков и продаж напрямую, без TopSeller
- [ ] **INT-02**: Пользователь подключает аккаунт Ozon через собственный API-ключ; аналогичный сценарий
- [ ] **INT-03**: Пользователь подключает аккаунт Яндекс.Маркет через собственный API-ключ; аналогичный сценарий
- [ ] **INT-04**: Синхронизация устойчива к rate limits и сетевым сбоям: backoff, retry, очередь задач, видимые пользователю ошибки; сбитая синхронизация не приводит к потере ранее загруженных данных

### Storage & Analytics Retention (USP — бесконечное хранение)

- [ ] **STOR-01**: Все данные, полученные из API маркетплейсов с момента подключения, пишутся в PostgreSQL (Supabase) с партиционированием по дате; нет TTL/auto-delete; есть план масштабирования (холодные партиции, архивное хранилище) задокументированный в ADR
- [ ] **STOR-02**: В интерфейсе CRM пользователь может посмотреть аналитику по продажам/остаткам за произвольный исторический период (включая период дальше лимитов API МП) — то, что было загружено, доступно всегда

### Industry Modules (shell-архитектура + первые два модуля)

- [ ] **MOD-01**: Спроектирована и задокументирована модульная архитектура: общий core (товары, остатки, продажи, аналитика, пользователи), отраслевые модули (shells) добавляют только поля/отчёты/UI; граница core↔module зафиксирована ADR
- [ ] **MOD-02**: Модуль **Одежда** (обязательный для сегмента B): артикулы с размерами, цветами, коллекциями; отчёты по остаткам в разрезе "размер × цвет"
- [ ] **MOD-03**: Модуль **Универсальный**: базовая работа с SKU без отраслевых специфик, покрывает всех остальных продавцов
- [ ] **MOD-04**: В UI пользователь может выбрать активный отраслевой модуль при создании workspace; смена модуля позже задокументирована (допускается или явно запрещена — решается ADR-ом)

### Billing (тарифы + Early Bird 50% навсегда)

- [ ] **BILL-01**: Опубликованы 3 тарифа: Старт (990 ₽/мес, до 200 SKU, 1 user), Бизнес (2 490 ₽/мес, до 2000 SKU, 5 users), Про (4 990 ₽/мес, безлимит SKU, 15 users); лимиты enforced (нельзя добавить 201-й SKU на Старте)
- [ ] **BILL-02**: Early Bird: первые 500 уникальных платящих аккаунтов получают 50% скидку навсегда (495 / 1 245 / 2 495 ₽); биллинг умеет хранить cohort-price per account, скидка не теряется при смене тарифа внутри участника cohort
- [ ] **BILL-03**: Пользователь может выбрать/сменить тариф и оплатить через российский платёжный шлюз (ЮKassa или аналог, RU+KZ — решается ADR-ом); triál → paid flow работает без ручного вмешательства
- [ ] **BILL-04**: MVP-гейт: к моменту запуска Фазы биллинга MVP достаточно зрелый, чтобы 20+ бета-пользователей могли начать платить (risk-mitigation per REQ-risk-mitigations)

### Referral & Loyalty (backend скидок и бонусов)

- [ ] **REF-01**: Реферальная программа "+1 месяц за друга": пользователь получает уникальную ссылку; при оплате приглашённого реферер получает +1 месяц к текущему тарифу автоматически
- [ ] **REF-02**: Партнёрская программа для фулфилмент-провайдеров (20% реферальные): отдельный тип партнёрского аккаунта с dashboard, отслеживание приведённых клиентов и суммы комиссий (выплаты ручные — это окей)
- [ ] **LOY-01**: Программа лояльности: аккаунт, проживший ≥6 месяцев, автоматически получает бонус (конкретика — скидка на следующий год / расширенный лимит — фиксируется ADR при реализации Фазы 7)

### Admin & Metrics (product observability)

- [ ] **MET-01**: В админке видны 5 недельных метрик: Leads, Activation (% создавших первый товар), Conversion (trial→paid), Churn, MRR — данные считаются на стороне сервера, не моками
- [ ] **ADM-01**: Есть admin-view "новые пользователи" для manual onboarding в первые 3 месяца (per risk-mitigation и product-first-gate) — контакт, дата регистрации, прошёл ли он активацию, last login

---

## v2 Requirements

Отложено на после v1. Трекаем, но не в текущем роадмапе.

### Отраслевые модули (год 2)

- **MOD-V2-01**: Модуль "Продукты питания" (срок годности, партии, температурный режим)
- **MOD-V2-02**: Модуль "Электроника" (серийные номера, гарантии, комплектация)
- **MOD-V2-03**: Модуль "Косметика" (партии, срок годности, сертификаты)
- **MOD-V2-04**: Отраслевые каналы привлечения: авто, детские (без отдельных модулей, но с сегментными лендингами)

### Сегмент C (агентства/фулфилменты)

- **SEGC-V2-01**: Multi-client dashboard для агентств/фулфилментов (5–30 клиентов под одним аккаунтом)
- **SEGC-V2-02**: Тариф 15 000–50 000 ₽/мес с lim'ами под агентства

### 1С-интеграции

- **INT-V2-01**: Нативная интеграция с 1С (упомянута в STORY как принцип, но не v1)

### Прочее

- **MOBILE-V2-01**: Мобильный клиент (web-first сейчас)
- **API-V2-01**: Публичный API для сторонних разработчиков
- **OAUTH-V2-01**: OAuth-логин (Google/Яндекс)

---

## Out of Scope

Явно исключено из GSD-роадмапа. Задокументировано чтобы не возвращаться.

| Feature / Requirement | Reason |
|---------|--------|
| REQ-marketing-budget-allocation (500k ₽ на маркетинг: Telegram-посевы, VK Ads, YouTube, VC.ru, PR, подкасты, резерв) | Tracked in root `ROADMAP.md` as business tasks, not GSD-managed. Не требует кода. |
| REQ-phase0-audience-before-product — маркетинговые подзадачи: первый пост в @oborotcrm, пост/опрос в TopSeller, платные посевы в 5–7 TG-каналах (80 000 ₽), статья на VC.ru (40 000 ₽), ручной outreach 50–100 продавцам, выставка в Астане (май, 140–270 000 ₽), печать (ролл-апы, флаеры, визитки, стикеры) | Tracked in root `ROADMAP.md` as business tasks, not GSD-managed. Engineering-часть ("настроить CRM для сбора лидов", "демо-режим с тестовыми данными") вынесена в LEAD-01..03 и DEMO-01..02. |
| REQ-phase1-first-monetization — маркетинговые подзадачи: 3–5 YouTube-видео (60 000 ₽), партнёрства с 5–10 фулфилментами (переговоры) | Tracked in root `ROADMAP.md`. Engineering-часть (backend реферальной программы) → REF-01, REF-02. |
| REQ-phase2-scale — маркетинговые подзадачи: VK Ads (150 000 ₽), ретаргет визитов, PR/подкасты/кейс в медиа (40 000 ₽), отраслевые каналы привлечения (food, cosmetics, auto, kids), отгрузка модулей food/electronics/cosmetics | Маркетинг → root ROADMAP.md. Модули food/electronics/cosmetics — v2 (MOD-V2-01..03). Ретаргет-пиксель — технический минимум обсудим отдельно в LEAD-04 trackingом, но отдельная фаза под это не создаётся. |
| REQ-phase3-retention-upsell — маркетинговые подзадачи: апсейл-кампания существующим клиентам, первые переговоры с агентствами | Маркетинг → root. Engineering → BILL-05 (Pro-upsell plumbing), LOY-01 (лояльность). |
| REQ-revenue-goal-y1 (5 000 000 ₽ выручки за 12 мес, 520 платящих, MRR 1 295 000 ₽ к месяцу 12) | Business metric, не engineering. Не является acceptance criteria для фаз GSD. Отслеживается в root ROADMAP.md. |
| REQ-model-assumptions (churn 5%, конверсия 25%, средний тариф Бизнес) | Финансовые допущения, не engineering. |
| Financial dashboard для учредителя (MRR-графики, cohort analysis) | В v1 достаточно MET-01 (internal weekly metrics). Полноценный finance-view — v2+. |
| Real-time webhook-нотификации от МП | v2+; инкрементальный polling достаточен для MVP per INT-04. |
| Интеграция с 1С | v2 (MOD-V2 / INT-V2-01). В год 1 WB/Ozon/ЯМ + собственный сайт покрывают Сегмент B. |
| Мобильный клиент | v2. Web-first. |
| Публичный API | v2+. |
| OAuth-логин | v2+. Email/password достаточно для MVP. |
| TypeScript-миграция | Откладываем; текущий JSX-код стабилен, миграция не блокирует ни одну фичу. |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| FOUND-01 | Phase 1 | Pending |
| FOUND-02 | Phase 1 | Pending |
| FOUND-03 | Phase 1 | Pending |
| FOUND-04 | Phase 1 | Pending |
| FOUND-05 | Phase 1 | Pending |
| FOUND-06 | Phase 1 | Pending |
| LEAD-01 | Phase 2 | Pending |
| LEAD-02 | Phase 2 | Pending |
| LEAD-03 | Phase 2 | Pending |
| LEAD-04 | Phase 2 | Pending |
| DEMO-01 | Phase 2 | Pending |
| DEMO-02 | Phase 2 | Pending |
| AUTH-01 | Phase 3 | Pending |
| AUTH-02 | Phase 3 | Pending |
| AUTH-03 | Phase 3 | Pending |
| AUTH-04 | Phase 3 | Pending |
| MOD-01 | Phase 4 | Pending |
| MOD-02 | Phase 4 | Pending |
| MOD-03 | Phase 4 | Pending |
| MOD-04 | Phase 4 | Pending |
| INT-01 | Phase 5 | Pending |
| INT-02 | Phase 5 | Pending |
| INT-03 | Phase 5 | Pending |
| INT-04 | Phase 5 | Pending |
| STOR-01 | Phase 5 | Pending |
| STOR-02 | Phase 5 | Pending |
| BILL-01 | Phase 6 | Pending |
| BILL-02 | Phase 6 | Pending |
| BILL-03 | Phase 6 | Pending |
| BILL-04 | Phase 6 | Pending |
| REF-01 | Phase 6 | Pending |
| REF-02 | Phase 6 | Pending |
| LOY-01 | Phase 7 | Pending |
| MET-01 | Phase 7 | Pending |
| ADM-01 | Phase 7 | Pending |

**Coverage:**
- v1 requirements: 35 total
- Mapped to phases: 35
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-21*
*Last updated: 2026-04-21 after initial GSD roadmap creation*
