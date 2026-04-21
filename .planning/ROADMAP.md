# Roadmap: OborotCRM — Engineering (GSD)

## Overview

Этот роадмап покрывает **только инженерную часть** OborotCRM. Маркетинговые активности (Telegram-посевы, VK Ads, VC.ru, подкасты, выставки, печать, реферальные переговоры) живут в корневом `ROADMAP.md` как бизнес-задачи и не управляются через GSD.

Путь: от наведения порядка в монорепе (Phase 1) → перенос лидогенерации и демо-режима с Google Sheets на собственный бэкенд (Phase 2) → многоарендная основа CRM с Auth через Supabase (Phase 3) → модульная архитектура и первые два отраслевых модуля Одежда+Универсальный (Phase 4) → нативные интеграции WB/Ozon/ЯМ с бесконечным хранением истории — USP продукта (Phase 5) → биллинг с тремя тарифами и Early Bird 50% навсегда плюс реферальная программа (Phase 6) → удержание через программу лояльности и недельные метрики в админке для manual onboarding (Phase 7).

Текущая стартовая точка — живой лендинг на `apps/landing/` и скелет Next.js+Supabase в `apps/app/`. Phase 1 начинает с реальной точки, а не с "чистого листа".

См. связанные документы:
- `.planning/PROJECT.md` — core value, context, constraints, key decisions
- `.planning/REQUIREMENTS.md` — список v1-требований, v2, out-of-scope, traceability
- `.planning/intel/` — исходные intel-файлы (requirements, constraints, context, decisions)
- `.planning/codebase/` — состояние кодовой базы (STACK, ARCHITECTURE, STRUCTURE, CONVENTIONS, TESTING, INTEGRATIONS, CONCERNS)
- `/ROADMAP.md` (root) — бизнес-роадмап с маркетингом и финмоделью (не GSD)

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

- [ ] **Phase 1: Foundation & Repo Cleanup** — Монорепо, env, тесты, CI, error tracking, ребренд кода
- [ ] **Phase 2: Lead Capture Migration + Demo Mode** — Переезд лидов с Google Sheets на Supabase, сегментные лендинги, публичный демо-режим
- [ ] **Phase 3: Auth & Multi-Tenant Foundation** — Supabase Auth, protected routes, workspace-изоляция через RLS
- [ ] **Phase 4: Module Architecture + First Two Modules** — Core-shell архитектура, модули Одежда и Универсальный
- [ ] **Phase 5: Marketplace Integrations + Infinite Storage** — Нативные WB/Ozon/ЯМ без прослоек, бесконечное хранение истории (USP)
- [ ] **Phase 6: Billing + Referral Program** — 3 тарифа + Early Bird 50% навсегда, реферальная программа "+1 месяц", партнёрская программа фулфилментов
- [ ] **Phase 7: Retention — Loyalty + Metrics + Admin** — Программа лояльности, недельные метрики в админке, admin-view для manual onboarding

## Phase Details

### Phase 1: Foundation & Repo Cleanup
**Goal**: Монорепо приведено в production-ready состояние — понятный локальный запуск, переименованные пакеты, тесты, CI, error tracking — чтобы все последующие фазы строились на твёрдой почве, а не на хаосе "НашСклад/Оборот/Vite-preview-как-прод".
**Depends on**: Nothing (first phase)
**Requirements**: FOUND-01, FOUND-02, FOUND-03, FOUND-04, FOUND-05, FOUND-06
**Success Criteria** (what must be TRUE):
  1. Новый контрибьютор клонирует репо, следует `README.md`, за 10 минут поднимает оба приложения локально с нужными env-переменными
  2. Слова "НашСклад" и `nashsklad` отсутствуют в кодовой базе (package names, комментарии, Google Apps Script header); в git остаются только живые файлы, без 17+ удалений на root
  3. Любой PR в `main` прогоняет lint + тесты в CI; красный CI блокирует мердж
  4. Ошибки на проде (оба приложения) видны в Sentry или аналоге, не только в консоли браузера пользователя
  5. Landing отдаётся как статика за CDN/edge (не `vite preview` на Railway)
**Plans**: 8 plans
- [ ] 01-01-PLAN.md — Repo cleanup: .gitignore + delete 18 stale root files + remove unused framer-motion
- [ ] 01-02-PLAN.md — Rebrand nashsklad → oborot across package.json, Google Apps Script header, launch.json, lockfile
- [ ] 01-03-PLAN.md — Zod env validators + root .env.example + per-app READMEs (10-min onboarding)
- [ ] 01-04-PLAN.md — Vitest + RTL: smoke tests + useForm unit coverage + env.test
- [ ] 01-05-PLAN.md — Sentry SDK install + init (both apps, client/server/edge) + console.error migration
- [ ] 01-06-PLAN.md — Shared ESLint v9 flat config with no-console:error enforcing FOUND-05 durability
- [ ] 01-07-PLAN.md — GitHub Actions CI matrix (lint + test + build) on every PR and push to main
- [ ] 01-08-PLAN.md — Cloudflare Pages migration + DNS cutover + Railway decommission
**UI hint**: yes

### Phase 2: Lead Capture Migration + Demo Mode
**Goal**: Лиды и анкеты пишутся в собственный бэкенд (Supabase), а не в Google Sheets; токен Telegram-бота больше не утекает в клиент; любой посетитель сайта может попробовать CRM в `/demo` без регистрации; сегментные лендинги `/for/*` живут и трекаются.
**Depends on**: Phase 1
**Requirements**: LEAD-01, LEAD-02, LEAD-03, LEAD-04, DEMO-01, DEMO-02
**Success Criteria** (what must be TRUE):
  1. Посетитель отправляет email/Telegram на лендинге — лид появляется в Supabase в течение секунды, дубликаты по контакту не пишутся повторно
  2. Telegram-уведомления о новых лидах продолжают приходить в команду, но токен бота больше недоступен в `index-*.js` клиентского бандла
  3. Счётчик Early Bird на лендинге показывает реальное число платящих (или подписавшихся, уточняется в плане) из базы, а не хардкод `213`
  4. По ссылкам `/for/clothing`, `/for/electronics`, `/for/marketplace` открываются полноценные сегментные лендинги с UTM-трекингом и своим CTA
  5. Посетитель открывает `/demo` и может кликать по рабочему CRM с тестовыми товарами, остатками, продажами, аналитикой — без регистрации; его действия не видны другим посетителям
**Plans**: TBD
**UI hint**: yes

### Phase 3: Auth & Multi-Tenant Foundation
**Goal**: `apps/app` перестаёт быть скелетом — появляется реальная регистрация, вход, защита роутов и изоляция данных по workspace через Supabase RLS. Это фундамент, без которого биллинг, модули и интеграции не имеют смысла.
**Depends on**: Phase 2
**Requirements**: AUTH-01, AUTH-02, AUTH-03, AUTH-04
**Success Criteria** (what must be TRUE):
  1. Новый пользователь регистрируется по email+паролю, получает подтверждающее письмо, подтверждает и попадает в свой пустой dashboard
  2. Пользователь закрывает браузер, открывает снова — он всё ещё залогинен; попытка зайти на `/dashboard` без сессии редиректит на `/login`
  3. Пользователь жмёт "Забыл пароль", получает письмо с ссылкой, сбрасывает и входит с новым паролем
  4. Два разных аккаунта создают товары под одинаковым артикулом — ни один не видит данные другого ни через UI, ни через прямой запрос к Supabase (RLS блокирует)
  5. В рамках одного workspace владелец может добавить ещё пользователей (до лимита тарифа — сам лимит enforced в Phase 6, в Phase 3 достаточно наличия таблицы workspace-members)
**Plans**: TBD
**UI hint**: yes

### Phase 4: Module Architecture + First Two Modules
**Goal**: Зафиксирована и реализована модульная архитектура (общий core + отраслевые shells), отгружены первые два модуля — Одежда (основной для Сегмента B) и Универсальный (закрывает всех остальных). Это позволяет осмысленно продавать продукт продавцам одежды (целевой ICP) и оставляет путь к следующим вертикалям без ломки core.
**Depends on**: Phase 3
**Requirements**: MOD-01, MOD-02, MOD-03, MOD-04
**Success Criteria** (what must be TRUE):
  1. Новый пользователь при создании workspace выбирает активный модуль (Одежда или Универсальный); выбор записан в БД и определяет доступные поля/отчёты в UI
  2. Пользователь модуля "Одежда" создаёт товар с вариантами "размер × цвет" и видит отчёт по остаткам в этом разрезе; пользователь "Универсального" этих полей не видит
  3. В кодовой базе есть чёткое разделение `core/` (товары, остатки, продажи, аналитика, пользователи) и `modules/clothing`, `modules/universal`; новый модуль добавляется без правок core (проверено на примере скелета третьего модуля в ADR)
  4. Граница core ↔ module и правила добавления новых модулей задокументированы как ADR в `.planning/decisions/`
**Plans**: TBD
**UI hint**: yes

### Phase 5: Marketplace Integrations + Infinite Storage
**Goal**: USP продукта становится реальным: пользователь подключает свои аккаунты WB, Ozon и Яндекс.Маркет **напрямую** (без TopSeller и прослоек), и OborotCRM начинает складывать всю историю в своё хранилище **бессрочно** — чтобы когда API маркетплейсов "отрежут" данные, история у продавца уже была в OborotCRM.
**Depends on**: Phase 4
**Requirements**: INT-01, INT-02, INT-03, INT-04, STOR-01, STOR-02
**Success Criteria** (what must be TRUE):
  1. Пользователь в UI вставляет API-ключ Wildberries → видит как постепенно подтягиваются его товары, остатки и продажи; синхронизация инкрементальная (работает в фоне, не блокирует UI)
  2. Тот же сценарий для Ozon и Яндекс.Маркет
  3. Если API маркетплейса временно недоступно или rate-limit — пользователь видит статус ошибки в UI, синхронизация возобновляется автоматически после паузы, ранее загруженные данные не теряются
  4. Все загруженные данные хранятся в Supabase PostgreSQL с партиционированием по дате; TTL/auto-delete отсутствует; стратегия роста хранилища (холодные партиции, архивное хранилище, план на 100k+ SKU × 3 МП × 2 года) зафиксирована ADR-ом
  5. Пользователь в аналитике может выбрать произвольный исторический период (включая период за пределами стандартного лимита API маркетплейса) — данные, которые были загружены в OborotCRM, отображаются всегда
**Plans**: TBD
**UI hint**: yes

### Phase 6: Billing + Referral Program
**Goal**: CRM превращается в платный продукт: три тарифа с enforced-лимитами, Early Bird 50% пожизненно для первых 500, работающий платёжный flow (trial → paid) через RU-gateway, плюс реферальная программа "+1 месяц за друга" и отдельный кабинет для фулфилмент-партнёров с 20%-комиссиями.
**Depends on**: Phase 5
**Requirements**: BILL-01, BILL-02, BILL-03, BILL-04, REF-01, REF-02
**Success Criteria** (what must be TRUE):
  1. Пользователь видит в UI три тарифа (Старт / Бизнес / Про), выбирает один и оплачивает через ЮKassa (или аналог); по завершении оплаты его лимиты SKU/пользователей меняются автоматически
  2. Один из первых 500 платящих видит свою персональную цену с пометкой "Early Bird навсегда"; при смене тарифа внутри early-bird cohort скидка сохраняется; 501-й пользователь Early Bird не получает
  3. Попытка превысить лимит тарифа (201-й SKU на Старте, 6-й пользователь на Бизнесе) блокируется в UI и на бэкенде с понятной ошибкой
  4. Пользователь получает уникальную реферальную ссылку; когда приглашённый оплачивает — реферер автоматически получает +1 месяц к текущей подписке
  5. Фулфилмент-партнёр регистрируется как отдельный тип аккаунта, видит свой dashboard с приведёнными клиентами и суммой начисленной 20%-комиссии (выплата ручная — ок)
**Plans**: TBD
**UI hint**: yes

### Phase 7: Retention — Loyalty + Metrics + Admin
**Goal**: Есть инструменты, чтобы удержание реально измерять и на него влиять — недельные метрики (Leads/Activation/Conversion/Churn/MRR) в админке, программа лояльности для аккаунтов ≥6 месяцев, и view "новые пользователи" для продуктового гейта (ручной онбординг первые 3 месяца, пока month-1 retention <70%).
**Depends on**: Phase 6
**Requirements**: LOY-01, MET-01, ADM-01
**Success Criteria** (what must be TRUE):
  1. Основатель открывает `/admin/metrics` и видит актуальные недельные значения 5 метрик (Leads, Activation %, Conversion trial→paid %, Churn %, MRR) — посчитанные на бэкенде из реальных данных Supabase
  2. Аккаунт, проживший ≥6 месяцев и активный, автоматически получает бонус (конкретика зафиксирована ADR при планировании фазы — например, месяц в подарок или расширенный SKU-лимит)
  3. Основатель открывает `/admin/users` и видит список всех аккаунтов за последние 3 месяца с: контактами, датой регистрации, дошёл ли пользователь до активации (создал первый товар), last login — достаточно чтобы дозваниваться каждому
  4. Бонусы лояльности и метрики рассчитываются периодической задачей (cron / Supabase scheduled function), без ручного триггера
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Repo Cleanup | 1/8 | In progress | - |
| 2. Lead Capture Migration + Demo Mode | 0/TBD | Not started | - |
| 3. Auth & Multi-Tenant Foundation | 0/TBD | Not started | - |
| 4. Module Architecture + First Two Modules | 0/TBD | Not started | - |
| 5. Marketplace Integrations + Infinite Storage | 0/TBD | Not started | - |
| 6. Billing + Referral Program | 0/TBD | Not started | - |
| 7. Retention — Loyalty + Metrics + Admin | 0/TBD | Not started | - |
