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
          Управляй бизнесом,<br />
          <span className="text-accent">а не системой учёта</span>
        </h1>

        <p className="text-lg text-muted leading-relaxed mb-4 max-w-xl mx-auto">
          Оборот делает за тебя то, что в других системах занимает часы.
          Подключил — работает.
        </p>
        <p className="text-sm text-muted/70 mb-10">
          Всё что есть в сложных системах + интеграции с WB, Ozon и ЯМ из коробки. Без доплат.
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

      {/* Визуальное сравнение */}
      <section className="px-6 py-16 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-3">Почувствуй разницу</h2>
        <p className="text-muted text-center text-sm mb-10">Привычный хаос vs понятный интерфейс</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Старый UI */}
          <div className="rounded-2xl overflow-hidden border border-red-900/30">
            {/* Верхнее меню с иконками */}
            <div className="bg-gradient-to-b from-[#5a8db8] to-[#3b6fa0] px-2 py-2 flex items-end gap-0.5 overflow-hidden">
              {[
                { icon: '📊', label: 'Показатели' },
                { icon: '🛒', label: 'Закупки' },
                { icon: '📋', label: 'Продажи', active: true },
                { icon: '📦', label: 'Товары' },
                { icon: '👥', label: 'Контрагенты' },
                { icon: '🏭', label: 'Склад' },
                { icon: '💰', label: 'Деньги' },
                { icon: '🏪', label: 'Розница' },
                { icon: '🛍️', label: 'Онлайн' },
                { icon: '⚙️', label: 'Произв.' },
                { icon: '✅', label: 'Задачи' },
              ].map(t => (
                <div key={t.label} className={`flex flex-col items-center px-1.5 py-1 rounded-t ${t.active ? 'bg-white/20' : ''}`}>
                  <span className="text-[10px]">{t.icon}</span>
                  <span className="text-[7px] text-white/80 whitespace-nowrap">{t.label}</span>
                </div>
              ))}
            </div>
            {/* Вкладки */}
            <div className="bg-[#d4dce4] px-1 py-1 flex gap-0.5 border-b border-[#b0bec5] overflow-hidden">
              {['Заказы покупателей','Счета покупателям','Отгрузки','Отчёты комиссионера','Возвраты','Счета-фактуры','Прибыльность'].map(t => (
                <span key={t} className="text-[7px] text-[#333] px-1 py-0.5 bg-[#c5d0da] border border-[#a0b0c0] whitespace-nowrap">{t}</span>
              ))}
            </div>
            {/* Контент */}
            <div className="bg-[#eef1f5] p-2">
              <div className="flex items-center gap-1 mb-2 flex-wrap">
                <span className="text-[8px] text-[#555] bg-white border border-[#ccc] px-1.5 py-0.5">Фильтр</span>
                <span className="text-[7px] text-[#999] bg-white border border-[#ccc] px-1 py-0.5">Номер или комментарий</span>
                <span className="text-[7px] text-[#555] bg-white border border-[#ccc] px-1 py-0.5">Контрагент ▾</span>
                <span className="text-[7px] text-[#555] bg-white border border-[#ccc] px-1 py-0.5">Организация ▾</span>
                <span className="text-[7px] text-[#555] bg-white border border-[#ccc] px-1 py-0.5">Статус ▾</span>
                <span className="text-[7px] text-[#555] bg-white border border-[#ccc] px-1 py-0.5">Склад ▾</span>
                <span className="text-[7px] text-[#555] bg-white border border-[#ccc] px-1 py-0.5">Печать ▾</span>
                <span className="text-[7px] text-[#999] bg-white border border-[#ccc] px-1 py-0.5">⚙</span>
              </div>
              <table className="w-full text-[7px] text-[#333]">
                <thead>
                  <tr className="bg-[#dde3ea] border-b border-[#c0c8d0]">
                    {['☐','№','Время','Контрагент','Организация','Сумма','Оплачено','Отгружено','Статус'].map(h => (
                      <th key={h} className="text-left px-1 py-1 font-normal text-[#666]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { n: '00127', time: '21.03 14:32', agent: 'Розн. покуп...', org: 'ИП Иванов А.С.', sum: '14 200,00', paid: '14 200,00', ship: '14 200,00', status: 'Отгружен' },
                    { n: '00126', time: '21.03 11:05', agent: 'ООО "Стиль"', org: 'ИП Иванов А.С.', sum: '8 750,00', paid: '0,00', ship: '0,00', status: 'Новый' },
                    { n: '00125', time: '20.03 18:41', agent: 'Розн. покуп...', org: 'ИП Иванов А.С.', sum: '3 400,00', paid: '3 400,00', ship: '0,00', status: 'Подтверждён' },
                  ].map((row, i) => (
                    <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]'} border-b border-[#e0e0e0]`}>
                      <td className="px-1 py-1">☐</td>
                      <td className="px-1 py-1 text-[#1976d2]">{row.n}</td>
                      <td className="px-1 py-1">{row.time}</td>
                      <td className="px-1 py-1 text-[#999]">{row.agent}</td>
                      <td className="px-1 py-1">{row.org}</td>
                      <td className="px-1 py-1">{row.sum}</td>
                      <td className="px-1 py-1">{row.paid}</td>
                      <td className="px-1 py-1">{row.ship}</td>
                      <td className="px-1 py-1">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-[7px] text-[#999] mt-1">1-3 из 437</div>
            </div>
            <div className="bg-[#eef1f5] px-3 py-2 text-center">
              <span className="text-xs text-red-400 font-medium">😵 Знакомо?</span>
            </div>
          </div>

          {/* Новый UI — Оборот */}
          <div className="rounded-2xl overflow-hidden border border-accent/30">
            <div className="bg-[#0f0f13] px-4 py-3 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-accent/80 flex items-center justify-center">
                  <span className="text-[8px] font-black text-white">ОБ</span>
                </div>
                <span className="text-[11px] font-semibold text-white">Аналитика</span>
              </div>
              {/* Быстрый выбор периода */}
              <div className="flex items-center gap-1">
                <span className="text-[8px] text-muted bg-surface px-1.5 py-0.5 rounded">Вчера</span>
                <span className="text-[8px] text-muted bg-surface px-1.5 py-0.5 rounded">7 дн</span>
                <span className="text-[8px] text-white bg-accent/80 px-1.5 py-0.5 rounded font-medium">30 дн</span>
                <span className="text-[8px] text-muted bg-surface px-1.5 py-0.5 rounded">90 дн</span>
                <span className="text-[8px] text-muted bg-surface px-1.5 py-0.5 rounded border border-border">📅 21.02 — 21.03</span>
              </div>
            </div>
            <div className="bg-[#0f0f13] p-4">
              {/* Карточки метрик */}
              <div className="grid grid-cols-4 gap-2 mb-4">
                <div className="bg-surface rounded-lg p-2.5 border border-border">
                  <div className="text-[9px] text-muted mb-1">Выручка</div>
                  <div className="text-sm font-bold text-white">284 500 ₽</div>
                  <div className="text-[9px] text-green-400">↑ 12% к пред.</div>
                </div>
                <div className="bg-surface rounded-lg p-2.5 border border-border">
                  <div className="text-[9px] text-muted mb-1">Чистая прибыль</div>
                  <div className="text-sm font-bold text-white">108 500 ₽</div>
                  <div className="text-[9px] text-green-400">↑ 18%</div>
                </div>
                <div className="bg-surface rounded-lg p-2.5 border border-border">
                  <div className="text-[9px] text-muted mb-1">Ср. маржа</div>
                  <div className="text-sm font-bold text-white">38.2%</div>
                  <div className="text-[9px] text-green-400">↑ 2.1%</div>
                </div>
                <div className="bg-surface rounded-lg p-2.5 border border-border">
                  <div className="text-[9px] text-muted mb-1">ROI на товар</div>
                  <div className="text-sm font-bold text-white">214%</div>
                  <div className="text-[9px] text-green-400">↑ 11%</div>
                </div>
              </div>
              {/* Подзаголовок списка */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-[9px] text-muted">Топ по прибыли за 30 дней</span>
                <span className="text-[9px] text-accent">все товары →</span>
              </div>
              {/* Список */}
              <div className="space-y-1.5">
                {[
                  { name: 'Футболка оверсайз', mp: 'WB', sum: '12 400 ₽', margin: '42%', color: 'text-green-400' },
                  { name: 'Худи базовое', mp: 'Ozon', sum: '8 900 ₽', margin: '35%', color: 'text-green-400' },
                  { name: 'Шорты карго', mp: 'ЯМ', sum: '6 200 ₽', margin: '18%', color: 'text-yellow-400' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between bg-surface rounded-lg px-3 py-2 border border-border">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded bg-accent/10 flex items-center justify-center text-[8px] text-accent">{item.mp}</div>
                      <span className="text-[11px] text-white">{item.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-[10px] font-medium ${item.color}`}>{item.margin}</span>
                      <span className="text-[11px] font-semibold text-white">{item.sum}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[#0f0f13] px-3 py-2 border-t border-border text-center">
              <span className="text-xs text-accent font-medium">✨ Всё понятно с первого взгляда</span>
            </div>
          </div>
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
