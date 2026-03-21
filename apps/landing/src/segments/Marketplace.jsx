import { useState } from 'react'
import { Link } from 'react-router-dom'

const PAINS = [
  { icon: '🐌', pain: 'Система тормозит на 500+ SKU', fix: 'Оборот быстрый даже на\u00a010\u00a0000\u00a0SKU' },
  { icon: '🧩', pain: 'Сложный интерфейс — не разобраться', fix: 'Разберёшься за 5 минут, без обучения' },
  { icon: '🔌', pain: 'Интеграции с МП — платные и кривые', fix: 'WB, Ozon и ЯМ работают из коробки' },
  { icon: '📊', pain: 'Нет аналитики — считаешь в Excel', fix: 'Маржа и ROI по каждому SKU автоматически' },
  { icon: '📱', pain: 'Мобилка — урезанная версия', fix: 'Полноценное мобильное приложение' },
  { icon: '💸', pain: 'Платишь за каждую функцию отдельно', fix: 'Одна подписка — всё включено' },
]

const STEPS = [
  { num: '1', title: 'Подключаешь маркетплейсы', desc: 'WB, Ozon, Яндекс.Маркет — привязываешь API за 2 минуты. Оборот сам загрузит товары, остатки, заказы.' },
  { num: '2', title: 'Видишь весь бизнес', desc: 'Дашборд с выручкой, маржой, остатками по всем МП. Одна вкладка вместо пяти.' },
  { num: '3', title: 'Управляешь, а не считаешь', desc: 'Система прогнозирует спрос, считает юнит-экономику и подсказывает что делать.' },
]

export default function Marketplace() {
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    if (!contact.trim()) return
    setLoading(true)

    const webhookUrl = import.meta.env.VITE_SHEETS_WEBHOOK_URL
    const tgBotToken = import.meta.env.VITE_TG_BOT_TOKEN
    const tgChatId = import.meta.env.VITE_TG_CHAT_ID

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: 'waitlist', contact, source: 'marketplace', date: new Date().toISOString() }),
        })
      } catch (e) { console.error(e) }
    }

    if (tgBotToken && tgChatId) {
      try {
        await fetch(`https://api.telegram.org/bot${tgBotToken}/sendMessage`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            chat_id: tgChatId,
            text: `🔥 Новый подписчик на Оборот (маркетплейсы)!\n📬 ${contact}`,
            parse_mode: 'HTML',
          }),
        })
      } catch (e) { console.error(e) }
    }

    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-bg text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-5 max-w-5xl mx-auto">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center glow-sm">
            <span className="text-sm font-black text-white">ОБ</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white leading-none">Оборот</span>
            <span className="text-[10px] text-muted leading-none mt-0.5">бизнес-CRM</span>
          </div>
        </Link>
        <span className="text-xs text-muted">для продавцов маркетплейсов</span>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-16 pb-20 max-w-3xl mx-auto text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-accent-glow border border-accent/30 rounded-full px-4 py-1.5 text-xs text-accent font-medium mb-8">
          🎁 Бесплатно для первых 500
        </div>

        <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5">
          Замени МойСклад<br />
          <span className="text-accent">за 20 минут</span>
        </h1>

        <p className="text-lg text-muted leading-relaxed mb-10 max-w-xl mx-auto">
          Оборот — бизнес-CRM, которая знает WB, Ozon и Яндекс.Маркет из коробки.
          Без настроек. Без доплат. Без боли.
        </p>

        {/* Form */}
        {submitted ? (
          <div className="animate-slide-up flex flex-col items-center gap-3">
            <div className="text-4xl">🎉</div>
            <p className="text-lg font-bold text-white">Ты в списке!</p>
            <p className="text-sm text-muted">6 месяцев бесплатно + скидка навсегда для ранних.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="text"
              value={contact}
              onChange={e => setContact(e.target.value)}
              placeholder="Telegram @username или email"
              className="flex-1 bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-muted outline-none focus:border-accent transition-all"
            />
            <button
              type="submit"
              disabled={loading || !contact.trim()}
              className="bg-accent hover:bg-accent-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-6 py-3 rounded-xl text-sm transition-all glow whitespace-nowrap"
            >
              {loading ? '...' : 'Хочу попробовать →'}
            </button>
          </form>
        )}

        <p className="text-xs text-muted mt-4">Первым 500 — 6 месяцев бесплатно + скидка 50% навсегда</p>
      </section>

      {/* 6 болей */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-3">Знакомые проблемы?</h2>
        <p className="text-muted text-center text-sm mb-10">Каждая — решена в Оборот</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {PAINS.map((p, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-5">
              <div className="text-2xl mb-3">{p.icon}</div>
              <div className="text-xs text-muted line-through mb-2">{p.pain}</div>
              <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                <span className="text-accent">✓</span> {p.fix}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Как это работает */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">Как это работает</h2>
        <div className="space-y-6">
          {STEPS.map((s, i) => (
            <div key={i} className="flex gap-5 items-start">
              <div className="w-10 h-10 shrink-0 rounded-xl bg-accent/10 border border-accent/30 flex items-center justify-center text-accent font-bold text-lg">
                {s.num}
              </div>
              <div>
                <h3 className="font-bold text-white mb-1">{s.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-20 max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Готов попробовать?</h2>
        <p className="text-muted mb-8">
          Записывайся в лист ожидания. Первым 500 — полгода бесплатно и скидка навсегда.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-semibold px-8 py-4 rounded-xl text-base transition-all glow"
        >
          Записаться на главной →
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted">
        <p>Оборот · Бизнес-CRM · <Link to="/" className="hover:text-white transition-colors">Главная</Link></p>
      </footer>
    </div>
  )
}
