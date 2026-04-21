import { useState } from 'react'
import { Link } from 'react-router-dom'

const STATUSES = [
  { key: 'done', label: 'Готово', color: '#22c55e', bg: 'bg-green-500/10', border: 'border-green-500/30', text: 'text-green-400' },
  { key: 'building', label: 'В разработке', color: '#6366f1', bg: 'bg-accent/10', border: 'border-accent/30', text: 'text-accent' },
  { key: 'planned', label: 'Планируется', color: '#a855f7', bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400' },
  { key: 'ideas', label: 'Идеи', color: '#64748b', bg: 'bg-slate-500/10', border: 'border-slate-500/30', text: 'text-slate-400' },
]

const FEATURES = [
  // Готово
  { status: 'done', title: 'Синхронизация с Wildberries', desc: 'Автоматический импорт заказов, остатков и аналитики. Работает напрямую, без прослоек.', tag: 'Интеграции' },
  { status: 'done', title: 'Синхронизация с Ozon', desc: 'Полная интеграция — заказы, FBO/FBS остатки, финансовые отчёты.', tag: 'Интеграции' },
  { status: 'done', title: 'Синхронизация с Яндекс.Маркет', desc: 'Заказы, остатки и аналитика из ЯМ в одном окне с WB и Ozon.', tag: 'Интеграции' },
  { status: 'done', title: 'Учёт товаров и остатков', desc: 'Быстрая работа даже на 10 000+ SKU. Реалтайм остатки по всем складам.', tag: 'Учёт' },
  { status: 'done', title: 'ИИ-прогнозирование спроса', desc: 'Система сама подсказывает что, когда и сколько заказывать у поставщика.', tag: 'AI' },
  { status: 'done', title: 'Бесконечное хранение аналитики', desc: 'Вся история продаж хранится навсегда. Маркетплейсы отдают данные только за 3 месяца — мы храним всё.', tag: 'Данные' },
  { status: 'done', title: 'Мультиканальные продажи', desc: 'Маркетплейсы, сайт, шоурум — все каналы в одном интерфейсе.', tag: 'Продажи' },

  // В разработке
  { status: 'building', title: 'Юнит-экономика по SKU', desc: 'Маржа, ROI, себестоимость и прибыль по каждому товару — не в Excel, а в реальном времени.', tag: 'Аналитика' },
  { status: 'building', title: 'Управление закупками', desc: 'Планирование поставок на основе прогноза. Автозаказ у поставщиков.', tag: 'Автоматизация' },
  { status: 'building', title: 'Командная работа', desc: 'Роли, доступы, задачи. Менеджер видит своё, руководитель — всё.', tag: 'Команда' },
  { status: 'building', title: 'Дашборд CEO', desc: 'Один экран — вся картина бизнеса. Выручка, маржа, тренды, проблемы.', tag: 'Аналитика' },

  // Планируется
  { status: 'planned', title: 'Автоматический расчёт цен', desc: 'Система пересчитывает цены на основе себестоимости, конкурентов и маржи.', tag: 'Автоматизация' },
  { status: 'planned', title: 'Мобильное приложение', desc: 'Полноценное приложение, а не урезанная версия. Push-уведомления о проблемах.', tag: 'Мобайл' },
  { status: 'planned', title: 'Интеграция с 1С', desc: 'Двусторонняя синхронизация для тех, кто ведёт бухгалтерию в 1С.', tag: 'Интеграции' },
  { status: 'planned', title: 'Мониторинг и алерты', desc: 'Тихие падения больше не пройдут незамеченными. Система сама предупредит если что-то сломалось.', tag: 'Надёжность' },
  { status: 'planned', title: 'Отраслевые модули', desc: 'При регистрации выбираете отрасль — система подгружает нужные поля и убирает лишнее. Первые: одежда и универсальный.', tag: 'Платформа' },

  // Идеи
  { status: 'ideas', title: 'Маркетплейс-сканер', desc: 'Анализ конкурентов, трендов и ниш. Поиск товаров с высокой маржой.', tag: 'Аналитика' },
  { status: 'ideas', title: 'Интеграция с KaspiShop', desc: 'Для продавцов в Казахстане — полная синхронизация с Kaspi.', tag: 'Интеграции' },
  { status: 'ideas', title: 'ИИ-ассистент', desc: 'Спроси систему голосом: «Какой товар продаётся хуже всего?» — и получи ответ.', tag: 'AI' },
  { status: 'ideas', title: 'API для разработчиков', desc: 'Открытое API для тех, кто хочет строить свои интеграции и отчёты.', tag: 'Платформа' },
  { status: 'ideas', title: 'Модуль «Продукты питания»', desc: 'Сроки годности, партии, температурный режим, ХАССП, маркировка Честный Знак.', tag: 'Отрасли' },
  { status: 'ideas', title: 'Модуль «Электроника»', desc: 'Серийные номера, гарантия, совместимость, трекинг серийников.', tag: 'Отрасли' },
  { status: 'ideas', title: 'Модуль «Косметика»', desc: 'Сертификаты, ингредиенты, сроки годности, декларации.', tag: 'Отрасли' },
]

export default function Roadmap() {
  const [activeFilter, setActiveFilter] = useState('all')

  const filtered = activeFilter === 'all'
    ? FEATURES
    : FEATURES.filter(f => f.status === activeFilter)

  const counts = STATUSES.reduce((acc, s) => {
    acc[s.key] = FEATURES.filter(f => f.status === s.key).length
    return acc
  }, {})

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
        <span className="text-xs text-muted uppercase tracking-widest">Продуктовый роадмап</span>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Hero */}
        <div className="mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-black mb-4">
            Что мы<br /><span className="text-accent">строим</span>
          </h1>
          <p className="text-muted text-lg max-w-xl leading-relaxed">
            Оборот развивается вместе с продавцами. Здесь — что уже работает,
            над чем мы сейчас трудимся и что появится дальше.
          </p>
        </div>

        {/* Статус-бар */}
        <div className="flex flex-wrap gap-2 mb-10">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
              activeFilter === 'all'
                ? 'bg-white/10 border-white/20 text-white'
                : 'bg-transparent border-border text-muted hover:text-white hover:border-white/20'
            }`}
          >
            Все ({FEATURES.length})
          </button>
          {STATUSES.map(s => (
            <button
              key={s.key}
              onClick={() => setActiveFilter(s.key)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                activeFilter === s.key
                  ? `${s.bg} ${s.border} ${s.text}`
                  : 'bg-transparent border-border text-muted hover:text-white hover:border-white/20'
              }`}
            >
              {s.label} ({counts[s.key]})
            </button>
          ))}
        </div>

        {/* Фичи по статусам */}
        {(activeFilter === 'all' ? STATUSES : STATUSES.filter(s => s.key === activeFilter)).map(status => {
          const items = filtered.filter(f => f.status === status.key)
          if (items.length === 0) return null

          return (
            <section key={status.key} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: status.color }} />
                <h2 className="text-xl font-bold">{status.label}</h2>
                <span className="text-xs text-muted">({items.length})</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {items.map((f, i) => {
                  const s = STATUSES.find(x => x.key === f.status)
                  return (
                    <div
                      key={i}
                      className={`${s.bg} border ${s.border} rounded-2xl p-5 transition-all hover:scale-[1.01]`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-sm font-bold text-white leading-snug">{f.title}</h3>
                        <span className={`shrink-0 text-[10px] font-medium uppercase tracking-wider ${s.text}`}>
                          {f.tag}
                        </span>
                      </div>
                      <p className="text-xs text-muted leading-relaxed">{f.desc}</p>
                    </div>
                  )
                })}
              </div>
            </section>
          )
        })}

        {/* CTA */}
        <section className="text-center py-10 border-t border-border">
          <h3 className="text-lg font-bold mb-2">Не нашли то, что нужно?</h3>
          <p className="text-muted text-sm mb-6">Расскажите нам — мы строим Оборот для вас</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/form"
              className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-semibold px-8 py-4 rounded-xl text-base transition-all glow"
            >
              Заполнить анкету
            </Link>
            <a
              href="https://t.me/oborotcrm"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-surface border border-border hover:border-white/20 text-white font-semibold px-8 py-4 rounded-xl text-base transition-all"
            >
              Telegram-канал
            </a>
          </div>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted">
        <p>Оборот · Строим вместе с продавцами</p>
      </footer>
    </div>
  )
}
