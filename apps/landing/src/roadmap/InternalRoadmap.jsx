import { Link } from 'react-router-dom'

const POSITIONING = {
  brand: 'Оборот',
  product: 'OborotCRM',
  domain: 'oborotcrm.ru',
  telegram: '@oborotcrm',
  category: 'Бизнес-CRM для продавцов',
  slogan: 'Управляй бизнесом, а не системой учёта',
  sub: 'Бизнес-CRM для тех, кто продаёт. Учёт, аналитика, прогноз и команда — в одном месте.',
  entry: 'Продавцы маркетплейсов (WB, Ozon, ЯМ)',
  scale: 'Любой торговый бизнес (розница, опт, интернет-магазины)',
}

const SEGMENTS = [
  { name: 'A — Соло-продавец', size: '1 чел, 50–300 SKU', price: 'до 1 500 руб/мес', priority: 'Год 1 (доп.)', main: false },
  { name: 'B — Малая команда', size: '2–5 чел, 200–2000 SKU', price: '2 500–5 000 руб/мес', priority: 'Год 1 (основной)', main: true },
  { name: 'C — Агентства/фулфилменты', size: '5–30 клиентов', price: '15 000–50 000 руб/мес', priority: 'Год 2', main: false },
]

const TARIFFS = [
  { name: 'Старт', price: '990', limits: 'до 200 SKU, 1 пользователь', early: '495' },
  { name: 'Бизнес', price: '2 490', limits: 'до 2000 SKU, 5 пользователей', early: '1 245', star: true },
  { name: 'Про', price: '4 990', limits: 'безлимит SKU, 15 пользователей', early: '2 495' },
]

const FINANCE = [
  { month: '1–3', paying: '0 (бета)', mrr: '0' },
  { month: '4', paying: '30', mrr: '75 000' },
  { month: '5', paying: '60', mrr: '149 000' },
  { month: '6', paying: '100', mrr: '249 000' },
  { month: '7', paying: '150', mrr: '373 000' },
  { month: '8', paying: '210', mrr: '523 000' },
  { month: '9', paying: '280', mrr: '697 000' },
  { month: '10', paying: '360', mrr: '896 000' },
  { month: '11', paying: '440', mrr: '1 096 000' },
  { month: '12', paying: '520', mrr: '1 295 000' },
]

const PHASES = [
  {
    num: 0, period: 'Месяц 1–3', title: 'Аудитория до продукта',
    goal: '2 000+ в листе ожидания, 200+ анкет', color: '#6366f1', budget: '120 000',
    groups: [
      { name: 'Инфраструктура', tasks: [
        { done: true, text: 'Купить домен oborotcrm.ru' },
        { done: true, text: 'Задеплоить лендинг на Railway' },
        { done: true, text: 'Настроить DNS (A-записи + TXT верификация)' },
        { done: true, text: 'Создать Telegram-канал @oborotcrm' },
        { done: true, text: 'Создать Telegram-бота @oborotcrm_bot' },
        { done: false, text: 'Задеплоить CRM для сбора лидов (отдельный сервис)' },
        { done: false, text: 'Подключить формы лендинга к API сбора лидов' },
        { done: false, text: 'Настроить TG-уведомления о новых подписках' },
      ]},
      { name: 'Контент и TG-канал', tasks: [
        { done: false, text: 'Пост-знакомство: история основателя (STORY.md)' },
        { done: false, text: 'Пост: сравнение «было → стало» (скриншот лендинга)' },
        { done: false, text: 'Пост: «5 болей продавца, которые никто не чинит»' },
        { done: false, text: 'Пост: первый скриншот дашборда OborotCRM' },
        { done: false, text: 'Публикация 2–3 раза в неделю (минимум 20 постов за фазу)' },
      ]},
      { name: 'Посевы и реклама', tasks: [
        { done: false, text: 'Составить список 20+ TG-каналов для посевов (WB, Ozon, МП)' },
        { done: false, text: 'Запросить цены и условия размещения' },
        { done: false, text: 'Написать 3 варианта рекламного поста (A/B тест)' },
        { done: false, text: 'Купить посевы в 5–7 каналах (бюджет 80 000 руб)' },
        { done: false, text: 'Замерить CAC по каждому каналу → оптимизировать' },
      ]},
      { name: 'Прямые продажи', tasks: [
        { done: false, text: 'Собрать базу 100 активных продавцов из TG-чатов' },
        { done: false, text: 'Написать скрипт личного сообщения (3 варианта)' },
        { done: false, text: 'Разослать 50 сообщений в неделю 1' },
        { done: false, text: 'Разослать 50 сообщений в неделю 2' },
        { done: false, text: 'Цель: 20 согласий на бета-тест' },
      ]},
      { name: 'Контент-маркетинг', tasks: [
        { done: false, text: 'Написать статью на VC.ru: «Почему я строю замену МойСклад»' },
        { done: false, text: 'Пост/опрос в TopSeller: «Чем ведёте учёт?» (без рекламы)' },
        { done: false, text: 'Кросспост статьи в TG-канал + личные рассылки' },
      ]},
      { name: 'Выставка Астана (май)', tasks: [
        { done: false, text: 'Узнать название выставки, даты, стоимость участия' },
        { done: false, text: 'Забронировать мини-островок (2x2 м)' },
        { done: false, text: 'Подготовить демо-режим OborotCRM с тестовыми данными' },
        { done: false, text: 'Сделать зацикленную видео-презентацию (30 сек, 5 слайдов)' },
        { done: false, text: 'Дизайн: макет ролл-апа (2 шт)' },
        { done: false, text: 'Дизайн: макет флаера A5 (лицо + оборот)' },
        { done: false, text: 'Дизайн: макет визитки + стикеров' },
        { done: false, text: 'Печать: 2 ролл-апа, 300 флаеров, 500 визиток, 500 стикеров, 100 блокнотов' },
        { done: false, text: 'Подготовить «калькулятор маржи» для демо на стенде' },
        { done: false, text: 'Настроить QR-код → TG-бот для сбора контактов на выставке' },
        { done: false, text: 'Арендовать экран 43" или привезти свой' },
        { done: false, text: 'Провести выставку: собрать 200+ контактов' },
        { done: false, text: 'Обработать лиды: написать всем в течение 48 часов' },
      ]},
    ],
  },
  {
    num: 1, period: 'Месяц 4–6', title: 'Монетизация первых',
    goal: '100 платящих, 600 000 руб выручки', color: '#8b5cf6', budget: '90 000',
    groups: [
      { name: 'Продукт', tasks: [
        { done: false, text: 'Запустить регистрацию и онбординг' },
        { done: false, text: 'Подключить платёжную систему (ЮKassa / Тинькофф)' },
        { done: false, text: 'Реализовать 3 тарифа: Старт / Бизнес / Про' },
        { done: false, text: 'Страница биллинга в личном кабинете' },
        { done: false, text: 'Триальный период 14 дней (автоматический)' },
        { done: false, text: 'Email/TG-напоминание за 3 дня до конца триала' },
      ]},
      { name: 'Отраслевые модули', tasks: [
        { done: false, text: 'Спроектировать архитектуру модулей (конфиг полей по отрасли)' },
        { done: false, text: 'Экран выбора отрасли при регистрации' },
        { done: false, text: 'Модуль «Одежда»: размеры, цвета, коллекции, сезоны, размерная сетка' },
        { done: false, text: 'Модуль «Универсальный»: базовый набор полей без отраслевой привязки' },
        { done: false, text: 'Тестирование модулей с 5 бета-юзерами из каждой отрасли' },
      ]},
      { name: 'Реферальная программа', tasks: [
        { done: false, text: 'Реализовать реферальные ссылки в ЛК' },
        { done: false, text: 'Механика: приглашённый регистрируется → оба получают +1 мес бесплатно' },
        { done: false, text: 'Дашборд рефералов (сколько пригласил, сколько конвертировалось)' },
        { done: false, text: 'Бюджет на призы: 30 000 руб (топ-рефералам)' },
      ]},
      { name: 'Партнёрства', tasks: [
        { done: false, text: 'Составить список 20 фулфилментов (Россия + Казахстан)' },
        { done: false, text: 'Подготовить партнёрское предложение (PDF)' },
        { done: false, text: 'Провести 10 звонков/встреч' },
        { done: false, text: 'Подписать 5 партнёрских соглашений (реф. % 20%)' },
      ]},
      { name: 'YouTube', tasks: [
        { done: false, text: 'Сценарий видео 1: «Как я заменил МойСклад своей CRM»' },
        { done: false, text: 'Сценарий видео 2: «5 скрытых расходов продавца на WB»' },
        { done: false, text: 'Сценарий видео 3: «Обзор OborotCRM — что внутри»' },
        { done: false, text: 'Съёмка и монтаж 3 видео (бюджет 60 000 руб)' },
        { done: false, text: 'Публикация + продвижение через TG и посевы' },
      ]},
      { name: 'Сегментные лендинги', tasks: [
        { done: false, text: 'Страница /for/clothing — боли продавцов одежды' },
        { done: false, text: 'Страница /for/electronics — боли продавцов электроники' },
        { done: false, text: 'UTM-метки для каждого сегмента → отслеживание конверсии' },
      ]},
    ],
  },
  {
    num: 2, period: 'Месяц 7–9', title: 'Масштаб',
    goal: '280 платящих, MRR 700 000+ руб', color: '#a855f7', budget: '190 000',
    groups: [
      { name: 'Платная реклама', tasks: [
        { done: false, text: 'Создать рекламный кабинет VK Реклама' },
        { done: false, text: 'Настроить пиксель на oborotcrm.ru' },
        { done: false, text: 'Запустить кампании: интересы «маркетплейсы», «малый бизнес»' },
        { done: false, text: 'A/B тест креативов (3 варианта)' },
        { done: false, text: 'Ретаргет: посетители лендинга, не подписавшиеся' },
        { done: false, text: 'Бюджет: 150 000 руб, целевой CAC < 500 руб' },
      ]},
      { name: 'PR и медиа', tasks: [
        { done: false, text: 'Составить список 10 подкастов про e-commerce / стартапы' },
        { done: false, text: 'Написать питчи и разослать' },
        { done: false, text: 'Записать 2–3 подкаста как гость' },
        { done: false, text: 'Подготовить кейс: «Как OborotCRM сэкономил X продавцу Y часов»' },
        { done: false, text: 'Опубликовать кейс на VC.ru + отраслевых медиа' },
        { done: false, text: 'Бюджет: 40 000 руб' },
      ]},
      { name: 'Отраслевые каналы', tasks: [
        { done: false, text: 'Посевы в TG-каналах по пищёвке (производители, поставщики)' },
        { done: false, text: 'Посевы в beauty-сообществах (косметика на МП)' },
        { done: false, text: 'Контакт с ассоциациями предпринимателей (ОПОРА, ТПП)' },
        { done: false, text: 'Выступление на MPConf / ecom-конференции' },
      ]},
      { name: 'Продукт: новые модули', tasks: [
        { done: false, text: 'Модуль «Продукты питания»: сроки годности, партии, ХАССП' },
        { done: false, text: 'Модуль «Электроника»: серийные номера, гарантия' },
        { done: false, text: 'Яндекс.Директ: кампания по запросам «CRM для бизнеса»' },
      ]},
    ],
  },
  {
    num: 3, period: 'Месяц 10–12', title: 'Удержание и апсейл',
    goal: '520 платящих, MRR 1 300 000+ руб', color: '#c084fc', budget: '100 000',
    groups: [
      { name: 'Апсейл и удержание', tasks: [
        { done: false, text: 'Проанализировать churn: причины, сегменты, паттерны' },
        { done: false, text: 'Внедрить NPS-опрос (автоматический, каждые 30 дней)' },
        { done: false, text: 'Программа лояльности: >6 мес = бонусные фичи' },
        { done: false, text: 'Апсейл Бизнес → Про: in-app уведомления при достижении лимитов' },
        { done: false, text: 'Email-цепочка реактивации для ушедших клиентов' },
      ]},
      { name: 'Сегмент C: агентства', tasks: [
        { done: false, text: 'Подготовить мультитенантный функционал (1 аккаунт = N клиентов)' },
        { done: false, text: 'Тариф «Агентство»: кастомный прайс 15 000–50 000 руб' },
        { done: false, text: 'Составить список 30 фулфилментов и агентств' },
        { done: false, text: 'Провести 10 демо-звонков' },
        { done: false, text: 'Подписать 3–5 контрактов' },
      ]},
      { name: 'Расширение', tasks: [
        { done: false, text: 'Модуль «Косметика»: сертификаты, ингредиенты, декларации' },
        { done: false, text: 'Страница /for/food, /for/cosmetics' },
        { done: false, text: 'Интеграция с 1С (двусторонняя синхронизация)' },
        { done: false, text: 'Мобильное приложение: MVP (React Native / PWA)' },
      ]},
    ],
  },
]

const BUDGET = [
  { item: 'Посевы в Telegram', amount: '120 000', when: 'Месяц 1–4' },
  { item: 'VK таргет', amount: '100 000', when: 'Месяц 7–10' },
  { item: 'YouTube / видео', amount: '80 000', when: 'Месяц 3–7' },
  { item: 'Реферальная программа', amount: '50 000', when: 'Месяц 4–12' },
  { item: 'Контент (VC.ru)', amount: '50 000', when: 'Месяц 1–6' },
  { item: 'PR / подкасты', amount: '40 000', when: 'Месяц 6–9' },
  { item: 'Резерв', amount: '60 000', when: 'По ситуации' },
]

const RISKS = [
  { risk: 'Продукт не готов к месяцу 4', fix: 'Запустить MVP сырым с 20 бета-юзерами' },
  { risk: 'Churn >10%', fix: 'Онбординг-звонок каждому новому лично' },
  { risk: 'МойСклад демпингует', fix: 'Не воевать ценой — воевать UX' },
  { risk: 'Не набрать 500 подписчиков', fix: 'Начать посевы в Telegram немедленно' },
]

function Section({ title, children }) {
  return (
    <section className="mb-12">
      <h2 className="text-xl font-bold mb-5 pb-2 border-b border-border">{title}</h2>
      {children}
    </section>
  )
}

export default function InternalRoadmap() {
  const totalDone = PHASES.reduce((sum, p) => sum + p.groups.flatMap(g => g.tasks).filter(t => t.done).length, 0)
  const totalTasks = PHASES.reduce((sum, p) => sum + p.groups.flatMap(g => g.tasks).length, 0)

  return (
    <div className="min-h-screen bg-bg text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center glow-sm">
            <span className="text-sm font-black text-white">ОБ</span>
          </div>
          <span className="font-bold text-white">Оборот</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="bg-red-500/20 border border-red-500/40 text-red-400 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full">
            Внутренний
          </span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Hero */}
        <div className="mb-10">
          <h1 className="text-3xl sm:text-4xl font-black mb-3">
            Внутренний <span className="text-accent">роадмап</span>
          </h1>
          <p className="text-muted text-base">
            Цель: <span className="text-white font-bold">5 000 000 руб</span> выручки за 12 месяцев.
            Бюджет на маркетинг: <span className="text-white font-bold">500 000 руб</span>.
          </p>
          <div className="mt-4 flex items-center gap-3">
            <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden">
              <div className="h-full bg-accent rounded-full" style={{ width: `${(totalDone / totalTasks) * 100}%` }} />
            </div>
            <span className="text-xs text-muted">{totalDone}/{totalTasks} задач</span>
          </div>
        </div>

        {/* Позиционирование */}
        <Section title="Позиционирование">
          <div className="grid grid-cols-2 gap-3">
            {Object.entries({
              'Бренд': POSITIONING.brand,
              'Продукт': POSITIONING.product,
              'Домен': POSITIONING.domain,
              'Telegram': POSITIONING.telegram,
              'Категория': POSITIONING.category,
              'Точка входа': POSITIONING.entry,
            }).map(([k, v]) => (
              <div key={k} className="bg-surface border border-border rounded-xl p-3">
                <div className="text-[10px] text-muted uppercase tracking-widest mb-1">{k}</div>
                <div className="text-sm text-white">{v}</div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-accent/10 border border-accent/30 rounded-xl p-4">
            <div className="text-[10px] text-accent uppercase tracking-widest mb-1">Слоган</div>
            <div className="text-base font-bold text-white">{POSITIONING.slogan}</div>
            <div className="text-xs text-muted mt-1">{POSITIONING.sub}</div>
          </div>
        </Section>

        {/* Сегменты */}
        <Section title="Целевые сегменты">
          <div className="space-y-2">
            {SEGMENTS.map((s, i) => (
              <div key={i} className={`flex items-center gap-4 p-3 rounded-xl border ${s.main ? 'bg-accent/5 border-accent/30' : 'bg-surface border-border'}`}>
                <span className={`text-sm font-bold ${s.main ? 'text-accent' : 'text-white'}`}>{s.name}</span>
                <span className="text-xs text-muted ml-auto">{s.size}</span>
                <span className="text-xs text-white font-medium">{s.price}</span>
                <span className={`text-[10px] uppercase tracking-widest ${s.main ? 'text-accent' : 'text-muted'}`}>{s.priority}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Тарифы */}
        <Section title="Тарифы">
          <div className="grid grid-cols-3 gap-3">
            {TARIFFS.map((t, i) => (
              <div key={i} className={`rounded-xl p-4 border ${t.star ? 'bg-accent/10 border-accent/30' : 'bg-surface border-border'}`}>
                <div className="text-xs text-muted mb-1">{t.name} {t.star && '★'}</div>
                <div className="text-xl font-black text-white">{t.price} <span className="text-xs font-normal text-muted">руб/мес</span></div>
                <div className="text-xs text-muted mt-1">{t.limits}</div>
                <div className="text-xs text-green-400 mt-2">Early bird: {t.early} руб/мес</div>
              </div>
            ))}
          </div>
        </Section>

        {/* Финмодель */}
        <Section title="Финансовая модель">
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            <div className="grid grid-cols-3 gap-0 text-xs text-muted p-3 border-b border-border">
              <span>Месяц</span>
              <span>Платящих</span>
              <span>MRR</span>
            </div>
            {FINANCE.map((f, i) => (
              <div key={i} className={`grid grid-cols-3 gap-0 text-sm p-3 ${i !== FINANCE.length - 1 ? 'border-b border-border' : ''}`}>
                <span className="text-muted">{f.month}</span>
                <span className="text-white">{f.paying}</span>
                <span className="text-white font-medium">{f.mrr} ₽</span>
              </div>
            ))}
          </div>
          <div className="mt-3 bg-accent/10 border border-accent/30 rounded-xl p-3 text-center">
            <span className="text-xs text-muted">Итого ARR: </span>
            <span className="text-lg font-black text-accent">~5 353 000 ₽</span>
          </div>
        </Section>

        {/* Фазы */}
        <Section title="Фазы выхода на рынок">
          <div className="space-y-6">
            {PHASES.map((phase) => {
              const allTasks = phase.groups.flatMap(g => g.tasks)
              const done = allTasks.filter(t => t.done).length
              const total = allTasks.length
              return (
                <div key={phase.num} className="relative pl-6 border-l-2" style={{ borderColor: phase.color }}>
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-bg" style={{ borderColor: phase.color }} />
                  <div className="bg-surface border border-border rounded-xl p-5">
                    <div className="flex flex-wrap items-center gap-3 mb-1">
                      <span className="text-xs font-bold uppercase tracking-widest" style={{ color: phase.color }}>
                        Фаза {phase.num}
                      </span>
                      <span className="text-xs text-muted">{phase.period}</span>
                      <span className="text-xs text-muted ml-auto">{phase.budget} ₽</span>
                      <span className="text-xs text-muted">{done}/{total}</span>
                    </div>
                    <h3 className="text-base font-bold text-white mb-1">{phase.title}</h3>
                    <p className="text-xs text-muted mb-1">{phase.goal}</p>
                    <div className="h-1.5 bg-bg rounded-full overflow-hidden mb-4">
                      <div className="h-full rounded-full" style={{ width: `${total > 0 ? (done / total) * 100 : 0}%`, backgroundColor: phase.color }} />
                    </div>
                    <div className="space-y-4">
                      {phase.groups.map((group, gi) => {
                        const gDone = group.tasks.filter(t => t.done).length
                        return (
                          <div key={gi}>
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-[10px] font-bold uppercase tracking-widest text-muted">{group.name}</span>
                              <span className="text-[10px] text-muted">{gDone}/{group.tasks.length}</span>
                              <div className="flex-1 h-px bg-border" />
                            </div>
                            <div className="space-y-1.5 ml-1">
                              {group.tasks.map((task, i) => (
                                <div key={i} className="flex items-start gap-2">
                                  <div className={`w-3.5 h-3.5 rounded shrink-0 mt-0.5 flex items-center justify-center border ${
                                    task.done ? 'bg-green-500 border-green-500' : 'border-border'
                                  }`}>
                                    {task.done && <span className="text-[8px] text-white">✓</span>}
                                  </div>
                                  <span className={`text-xs leading-relaxed ${task.done ? 'line-through text-muted' : 'text-white'}`}>
                                    {task.text}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </Section>

        {/* Бюджет */}
        <Section title="Бюджет: 500 000 руб">
          <div className="bg-surface border border-border rounded-xl overflow-hidden">
            {BUDGET.map((b, i) => (
              <div key={i} className={`flex items-center gap-4 p-3 ${i !== BUDGET.length - 1 ? 'border-b border-border' : ''}`}>
                <span className="text-sm text-white flex-1">{b.item}</span>
                <span className="text-sm text-white font-medium">{b.amount} ₽</span>
                <span className="text-xs text-muted w-24 text-right">{b.when}</span>
              </div>
            ))}
          </div>
        </Section>

        {/* Риски */}
        <Section title="Риски и митигация">
          <div className="space-y-2">
            {RISKS.map((r, i) => (
              <div key={i} className="flex gap-4 bg-surface border border-border rounded-xl p-3">
                <div className="flex-1">
                  <div className="text-[10px] text-red-400 uppercase tracking-widest mb-1">Риск</div>
                  <div className="text-sm text-white">{r.risk}</div>
                </div>
                <div className="flex-1">
                  <div className="text-[10px] text-green-400 uppercase tracking-widest mb-1">Митигация</div>
                  <div className="text-sm text-white">{r.fix}</div>
                </div>
              </div>
            ))}
          </div>
        </Section>

        {/* Правило */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 mb-8">
          <div className="text-[10px] text-yellow-400 uppercase tracking-widest mb-2">Правило</div>
          <p className="text-sm text-white leading-relaxed">
            Продукт важнее маркетинга. Маркетинг включать только когда retention &gt;70% на месяц.
            Первые 3 месяца — онбордить каждого вручную, звонить, спрашивать, фиксить.
          </p>
        </div>

        {/* Навигация */}
        <div className="flex gap-3 pt-4 border-t border-border">
          <Link to="/roadmap" className="text-xs text-accent hover:underline">Публичный роадмап →</Link>
          <Link to="/" className="text-xs text-muted hover:underline">Лендинг →</Link>
        </div>
      </div>
    </div>
  )
}
