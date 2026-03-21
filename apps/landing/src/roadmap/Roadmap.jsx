import { Link } from 'react-router-dom'

const UTPS_ALL = [
  { id: 1, text: 'Разбирается за 5 минут — без обучения и инструкций', score: 9, tags: ['UX', 'онбординг'] },
  { id: 2, text: 'Все маркетплейсы из коробки — никаких настроек и доп. оплат', score: 10, tags: ['интеграции', 'цена'] },
  { id: 3, text: 'Реалтайм остатки по всем складам и МП в одном экране', score: 8, tags: ['функционал'] },
  { id: 4, text: 'Аналитика как у CFO — маржа, ROI, юнит-экономика по каждому SKU', score: 8, tags: ['аналитика'] },
  { id: 5, text: 'Быстрый даже на 10 000 SKU — никаких зависших страниц', score: 7, tags: ['производительность'] },
  { id: 6, text: 'Мобилка которая реально работает — не урезанная версия', score: 7, tags: ['мобайл'] },
  { id: 7, text: 'Прогнозирование спроса — система сама скажет что и когда заказывать', score: 8, tags: ['AI', 'автоматизация'] },
  { id: 8, text: 'Один инструмент вместо 5 вкладок — WB + Ozon + ЯМ в едином окне', score: 9, tags: ['интеграции'] },
  { id: 9, text: 'Поддержка отвечает за 15 минут, а не за 3 дня', score: 6, tags: ['сервис'] },
  { id: 10, text: 'МойСклад за 20 минут в день вместо 3 часов', score: 9, tags: ['время', 'сравнение'] },
]

const TOP3 = [2, 1, 10] // id победителей

const MASTER_UTP = 'Оборот — единственная система учёта, где WB, Ozon и ЯМ работают из коробки. Без настроек, без доплат, без боли.'

const PHASES = [
  {
    num: 0,
    label: 'Фаза 0',
    period: 'Месяц 1–3',
    title: 'Аудитория до продукта',
    goal: '2 000+ в листе ожидания, 200+ анкет',
    color: '#6366f1',
    tasks: [
      { done: false, text: 'Пост в topseller с анкетой и лендингом oborotcrm.ru' },
      { done: false, text: 'Платные посевы в 5–7 Telegram-каналах WB/Ozon — 80 000 руб' },
      { done: true,  text: 'Создать лендинг с формой листа ожидания' },
      { done: true,  text: 'Создать анкету для сбора болей аудитории' },
      { done: false, text: 'Запустить Telegram-канал Оборот — инсайты из анкет' },
      { done: false, text: '2 статьи на VC.ru — 40 000 руб' },
      { done: false, text: 'Написать вручную 50–100 активным продавцам → 20 бета-юзеров' },
    ],
    budget: '120 000 ₽',
  },
  {
    num: 1,
    label: 'Фаза 1',
    period: 'Месяц 4–6',
    title: 'Монетизация первых',
    goal: '100 платящих, 600 000 руб выручки',
    color: '#8b5cf6',
    tasks: [
      { done: false, text: 'Запустить платные тарифы (месяц 4)' },
      { done: false, text: 'Анонс в листе ожидания — early bird конвертация' },
      { done: false, text: 'Реферальная программа: +1 мес за друга — 30 000 руб' },
      { done: false, text: 'Партнёрства с 5–10 фулфилментами — реф. % 20%' },
      { done: false, text: '3–5 видео на YouTube — 60 000 руб' },
    ],
    budget: '90 000 ₽',
  },
  {
    num: 2,
    label: 'Фаза 2',
    period: 'Месяц 7–9',
    title: 'Масштаб',
    goal: '280 платящих, MRR 700 000+ руб',
    color: '#a855f7',
    tasks: [
      { done: false, text: 'VK Реклама на аудиторию малый бизнес + маркетплейсы — 150 000 руб' },
      { done: false, text: 'Ретаргет посетителей лендинга' },
      { done: false, text: 'PR: интервью на подкастах, кейс в медиа — 40 000 руб' },
    ],
    budget: '190 000 ₽',
  },
  {
    num: 3,
    label: 'Фаза 3',
    period: 'Месяц 10–12',
    title: 'Удержание и апсейл',
    goal: '520 платящих, MRR 1 300 000+ руб',
    color: '#c084fc',
    tasks: [
      { done: false, text: 'Запуск тарифа Про + апсейл текущих' },
      { done: false, text: 'Программа лояльности (>6 мес = бонусы)' },
      { done: false, text: 'Первые переговоры с агентствами (Сегмент C)' },
    ],
    budget: '100 000 ₽',
  },
]

const METRICS = [
  { emoji: '👤', label: 'Лиды', desc: 'Новые подписки на лист ожидания' },
  { emoji: '⚡', label: 'Активация', desc: '% создавших первый товар в системе' },
  { emoji: '💳', label: 'Конверсия', desc: 'Триал → платный. Цель: 25%' },
  { emoji: '🔁', label: 'Churn', desc: 'Отток. Цель: <5%/мес' },
  { emoji: '📈', label: 'MRR', desc: 'Ежемесячная выручка и динамика' },
]

const RISKS = [
  { risk: 'Продукт не готов к месяцу 4', fix: 'Запустить MVP сырым с 20 бета-юзерами' },
  { risk: 'Churn >10%', fix: 'Онбординг-звонок каждому новому лично' },
  { risk: 'МойСклад демпингует', fix: 'Не воевать ценой — воевать UX' },
  { risk: 'Не набрать 500 подписчиков', fix: 'Начать посевы в Telegram немедленно' },
]

export default function Roadmap() {
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
        <span className="text-xs text-muted uppercase tracking-widest">Публичный роадмап</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Hero */}
        <div className="mb-16 animate-fade-in">
          <div className="inline-flex items-center gap-2 bg-accent-glow border border-accent/30 rounded-full px-4 py-1.5 text-xs text-accent font-medium mb-6">
            📍 Где мы сейчас и куда идём
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Публичный<br /><span className="text-accent">роадмап</span>
          </h1>
          <p className="text-muted text-lg max-w-xl leading-relaxed">
            Мы строим открыто. Здесь — наши планы, приоритеты и прогресс.
            Цель: 5 000 000 руб выручки за 12 месяцев.
          </p>
        </div>

        {/* УТП */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-2">Почему Оборот</h2>
          <p className="text-muted text-sm mb-8">Мы разобрали 10 причин выбрать нас и выбрали главную</p>

          {/* Все 10 */}
          <div className="mb-8">
            <div className="text-xs text-muted uppercase tracking-widest mb-4">10 кандидатов</div>
            <div className="space-y-2">
              {UTPS_ALL.map((u) => {
                const isTop = TOP3.includes(u.id)
                return (
                  <div
                    key={u.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      isTop
                        ? 'border-accent/40 bg-accent/5'
                        : 'border-border bg-surface opacity-50'
                    }`}
                  >
                    <span className={`text-xs font-mono mt-0.5 w-4 shrink-0 ${isTop ? 'text-accent' : 'text-muted'}`}>
                      {u.id}
                    </span>
                    <span className={`text-sm leading-relaxed ${isTop ? 'text-white' : 'text-muted'}`}>
                      {u.text}
                    </span>
                    {isTop && (
                      <span className="ml-auto shrink-0 text-xs text-accent font-bold">★ топ</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Топ-3 */}
          <div className="mb-8">
            <div className="text-xs text-muted uppercase tracking-widest mb-4">Топ-3 победителя</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {TOP3.map((id, idx) => {
                const u = UTPS_ALL.find(x => x.id === id)
                const medals = ['🥇', '🥈', '🥉']
                return (
                  <div key={id} className="bg-surface border border-accent/30 rounded-2xl p-4">
                    <div className="text-2xl mb-2">{medals[idx]}</div>
                    <p className="text-sm text-white leading-relaxed">{u.text}</p>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Мастер УТП */}
          <div className="bg-accent/10 border border-accent/40 rounded-2xl p-6">
            <div className="text-xs text-accent uppercase tracking-widest mb-3">Главное УТП</div>
            <p className="text-xl font-bold text-white leading-snug">{MASTER_UTP}</p>
          </div>
        </section>

        {/* Таймлайн фаз */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8">Фазы выхода на рынок</h2>
          <div className="space-y-8">
            {PHASES.map((phase) => (
              <div key={phase.num} className="relative pl-6 border-l-2" style={{ borderColor: phase.color }}>
                <div
                  className="absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 bg-bg"
                  style={{ borderColor: phase.color }}
                />
                <div className="bg-surface border border-border rounded-2xl p-6">
                  <div className="flex flex-wrap items-center gap-3 mb-1">
                    <span className="text-xs font-bold uppercase tracking-widest" style={{ color: phase.color }}>
                      {phase.label}
                    </span>
                    <span className="text-xs text-muted">{phase.period}</span>
                    <span className="ml-auto text-xs text-muted">бюджет {phase.budget}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-1">{phase.title}</h3>
                  <p className="text-sm text-muted mb-4">Цель: {phase.goal}</p>
                  <div className="space-y-2">
                    {phase.tasks.map((task, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <div className={`w-4 h-4 rounded shrink-0 mt-0.5 flex items-center justify-center border ${
                          task.done ? 'bg-accent border-accent' : 'border-border'
                        }`}>
                          {task.done && <span className="text-[10px] text-white">✓</span>}
                        </div>
                        <span className={`text-sm leading-relaxed ${task.done ? 'line-through text-muted' : 'text-white'}`}>
                          {task.text}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Метрики */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Ключевые метрики</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {METRICS.map((m, i) => (
              <div key={i} className="bg-surface border border-border rounded-2xl p-4 text-center">
                <div className="text-2xl mb-2">{m.emoji}</div>
                <div className="text-sm font-bold text-white mb-1">{m.label}</div>
                <div className="text-xs text-muted leading-relaxed">{m.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Риски */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Риски и митигация</h2>
          <div className="bg-surface border border-border rounded-2xl overflow-hidden">
            {RISKS.map((r, i) => (
              <div key={i} className={`flex gap-4 p-4 ${i !== RISKS.length - 1 ? 'border-b border-border' : ''}`}>
                <div className="flex-1">
                  <div className="text-xs text-muted mb-1">⚠ Риск</div>
                  <div className="text-sm text-white">{r.risk}</div>
                </div>
                <div className="flex-1">
                  <div className="text-xs text-muted mb-1">✓ Митигация</div>
                  <div className="text-sm text-white">{r.fix}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="text-center py-8 border-t border-border">
          <p className="text-muted text-sm mb-4">Хочешь повлиять на то что мы строим?</p>
          <Link
            to="/form"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-semibold px-8 py-4 rounded-xl text-base transition-all glow"
          >
            Пройти анкету — 3 минуты ⚡
          </Link>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted">
        <p>Оборот · Строим вместе с продавцами</p>
      </footer>
    </div>
  )
}
