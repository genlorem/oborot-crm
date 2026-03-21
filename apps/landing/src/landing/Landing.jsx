import { useState } from 'react'
import { Link } from 'react-router-dom'

const EARLY_BIRD_LIMIT = 500
const EARLY_BIRD_TAKEN = 213

const EARLY_BIRD_PERKS = [
  { emoji: '🎁', title: '6 месяцев бесплатно', desc: 'Полный доступ ко всем функциям без оплаты — сразу после запуска.' },
  { emoji: '💎', title: 'Цена заморожена навсегда', desc: 'Тариф на старте — твой на всё время. Даже когда поднимем цены.' },
  { emoji: '🎙️', title: 'Влияешь на продукт', desc: 'Прямой доступ к команде. Твои хотелки идут в приоритет.' },
  { emoji: '⚡', title: 'Ранний доступ к бете', desc: 'Попадёшь в продукт первым — до публичного запуска.' },
]

const MODULES = [
  { emoji: '📦', title: 'Учёт товаров', desc: 'Остатки, приёмки, перемещения — реалтайм по всем точкам.' },
  { emoji: '📊', title: 'Аналитика', desc: 'Маржа, ROI и юнит-экономика по каждому SKU автоматически.' },
  { emoji: '🧠', title: 'Прогнозирование', desc: 'Система скажет что и когда заказывать — до того как закончится.' },
  { emoji: '💰', title: 'Финансы', desc: 'Выручка, прибыль, расходы — полная картина бизнеса.' },
  { emoji: '👥', title: 'Команда', desc: 'Роли, доступы, задачи. Каждый видит только своё.' },
  { emoji: '🔌', title: 'Интеграции', desc: 'WB, Ozon, ЯМ, 1С, банки — всё подключено из коробки.' },
]

const COMPARE = [
  { them: 'Только учёт товаров',         us: 'Учёт + аналитика + финансы + команда' },
  { them: 'Тормозит на 1000 SKU',        us: 'Быстрый даже на 10 000 SKU' },
  { them: 'Интеграции — за доп. плату',   us: 'Все интеграции включены' },
  { them: 'Онбординг — 2 недели',         us: 'Разберётся за 5 минут' },
]

export default function Landing() {
  const [contact, setContact] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [count] = useState(Math.floor(Math.random() * 40) + 180)

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
          body: JSON.stringify({ type: 'waitlist', contact, date: new Date().toISOString() }),
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
            text: `🔥 Новый подписчик на Оборот!\n📬 ${contact}`,
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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center glow-sm">
            <span className="text-sm font-black text-white">ОБ</span>
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-white leading-none">Оборот</span>
            <span className="text-[10px] text-muted leading-none mt-0.5">бизнес-CRM</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/roadmap" className="text-sm text-muted hover:text-white transition-colors hidden sm:block">Роадмап</Link>
          <Link
            to="/form"
            className="text-sm text-muted hover:text-white transition-colors"
          >
            Пройти анкету →
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-6 pt-16 pb-20 max-w-3xl mx-auto text-center animate-fade-in">
        <div className="inline-flex items-center gap-2 bg-accent-glow border border-accent/30 rounded-full px-4 py-1.5 text-xs text-accent font-medium mb-8">
          🚀 Строим прямо сейчас — войди первым
        </div>

        <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5">
          Не учёт товаров.<br />
          <span className="text-accent">Управление бизнесом.</span>
        </h1>

        <p className="text-lg text-muted leading-relaxed mb-4 max-w-xl mx-auto">
          Бизнес-CRM для тех, кто продаёт. Учёт, аналитика, прогноз и команда — в одном месте.
        </p>
        <p className="text-sm text-muted/70 mb-10">
          Нативные интеграции с WB, Ozon и Яндекс.Маркет из коробки. Без доплат.
        </p>

        {/* Waitlist form */}
        {submitted ? (
          <div className="animate-slide-up flex flex-col items-center gap-3">
            <div className="text-4xl">🎉</div>
            <p className="text-lg font-bold text-white">Ты в списке!</p>
            <p className="text-sm text-muted">Расскажем как только запустимся.</p>
            <Link
              to="/form"
              className="mt-4 text-sm bg-surface border border-border px-5 py-2.5 rounded-xl hover:border-accent/50 transition-all"
            >
              Пройти анкету и помочь с разработкой →
            </Link>
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
              {loading ? 'Записываю...' : 'Записаться →'}
            </button>
          </form>
        )}

        <p className="text-xs text-muted mt-4">
          Уже записались <span className="text-white font-semibold">{count} предпринимателей</span> · 6 месяцев бесплатно · Без спама
        </p>
      </section>

      {/* Early Bird */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <div className="bg-surface border border-accent/30 rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-accent-glow rounded-3xl pointer-events-none" />
          <div className="relative">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <div>
                <div className="inline-flex items-center gap-1.5 bg-accent/20 text-accent text-xs font-bold px-3 py-1 rounded-full mb-3">
                  🔥 Только первые {EARLY_BIRD_LIMIT} человек
                </div>
                <h2 className="text-2xl font-bold text-white">Плюшки ранних пользователей</h2>
                <p className="text-muted text-sm mt-1">Записался сейчас — получаешь всё это при запуске</p>
              </div>
              <div className="sm:text-right shrink-0">
                <div className="text-3xl font-black text-white">{EARLY_BIRD_TAKEN}</div>
                <div className="text-xs text-muted">из {EARLY_BIRD_LIMIT} мест занято</div>
                <div className="mt-2 w-40 h-1.5 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-accent rounded-full" style={{ width: `${(EARLY_BIRD_TAKEN / EARLY_BIRD_LIMIT) * 100}%` }} />
                </div>
                <div className="text-xs text-accent font-medium mt-1">Осталось {EARLY_BIRD_LIMIT - EARLY_BIRD_TAKEN} мест</div>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {EARLY_BIRD_PERKS.map((perk, i) => (
                <div key={i} className="flex gap-3 bg-bg/60 rounded-2xl p-4 border border-border">
                  <span className="text-2xl shrink-0">{perk.emoji}</span>
                  <div>
                    <div className="font-semibold text-white text-sm">{perk.title}</div>
                    <div className="text-xs text-muted mt-0.5 leading-relaxed">{perk.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6 модулей */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-3">Всё что нужно бизнесу — внутри</h2>
        <p className="text-muted text-center text-sm mb-10">Один инструмент вместо пяти. Без лишних подписок.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {MODULES.map((m, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-5 card-hover">
              <div className="text-3xl mb-3">{m.emoji}</div>
              <h3 className="font-bold text-white mb-1">{m.title}</h3>
              <p className="text-sm text-muted leading-relaxed">{m.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Сравнение */}
      <section className="px-6 py-16 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-3">Старый подход vs Оборот</h2>
        <p className="text-muted text-center text-sm mb-10">Почему предприниматели переходят</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {COMPARE.map((item, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl p-5">
              <div className="text-xs text-muted line-through mb-2">{item.them}</div>
              <div className="text-sm font-semibold text-white flex items-center gap-1.5">
                <span className="text-accent">✓</span> {item.us}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="px-6 py-20 max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Помоги сделать лучше</h2>
        <p className="text-muted mb-8">
          Пройди короткую анкету — расскажи что бесит в текущих инструментах.
          Это напрямую влияет на то что мы построим первым.
        </p>
        <Link
          to="/form"
          className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white font-semibold px-8 py-4 rounded-xl text-base transition-all glow"
        >
          Пройти анкету — 3 минуты ⚡
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 text-center text-xs text-muted">
        <p>Оборот · Бизнес-CRM · <Link to="/roadmap" className="hover:text-white transition-colors">Роадмап →</Link></p>
      </footer>
    </div>
  )
}
