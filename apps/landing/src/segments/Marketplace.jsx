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
          {/* Старый UI — заполненный */}
          <div className="rounded-2xl overflow-hidden border border-red-900/30 flex flex-col">
            <div className="bg-[#2075a8] px-2 py-1.5 flex items-end gap-0.5 overflow-hidden">
              {['Показатели','Закупки','Продажи','Товары','Контрагенты','Склад','Деньги','Розница','Онлайн','Произв.','Задачи'].map((t, i) => (
                <div key={t} className={`flex flex-col items-center px-1 py-0.5 rounded-t ${i === 2 ? 'bg-white/20' : ''}`}>
                  <span className="text-[7px] text-white/80 whitespace-nowrap">{t}</span>
                </div>
              ))}
            </div>
            <div className="bg-[#d4dce4] px-1 py-0.5 flex gap-0.5 border-b border-[#b0bec5] overflow-hidden">
              {['Заказы покупателей','Счета покупателям','Отгрузки','Отчёты комиссионера','Возвраты','Счета-фактуры','Прибыльность'].map(t => (
                <span key={t} className="text-[6px] text-[#333] px-1 py-0.5 bg-[#c5d0da] border border-[#a0b0c0] whitespace-nowrap">{t}</span>
              ))}
            </div>
            <div className="bg-[#eef1f5] p-1.5 flex-1">
              <div className="flex items-center gap-0.5 mb-1.5 flex-wrap">
                {['Фильтр','Номер','Контрагент ▾','Организация ▾','Статус ▾','Склад ▾','Канал ▾','Печать ▾','⚙'].map(t => (
                  <span key={t} className="text-[6px] text-[#555] bg-white border border-[#ccc] px-1 py-0.5">{t}</span>
                ))}
              </div>
              <table className="w-full text-[6px] text-[#333]">
                <thead>
                  <tr className="bg-[#dde3ea] border-b border-[#c0c8d0]">
                    {['☐','№','Время','Контрагент','Орг-ция','Сумма','Оплач.','Отгруж.','Статус'].map(h => (
                      <th key={h} className="text-left px-0.5 py-0.5 font-normal text-[#666]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { n: '00127', time: '21.03 14:32', agent: 'Розн. покуп...', org: 'ИП Иванов', sum: '14 200', paid: '14 200', ship: '14 200', status: 'Отгружен' },
                    { n: '00126', time: '21.03 11:05', agent: 'ООО Стиль', org: 'ИП Иванов', sum: '8 750', paid: '0', ship: '0', status: 'Новый' },
                    { n: '00125', time: '20.03 18:41', agent: 'Розн. покуп...', org: 'ИП Иванов', sum: '3 400', paid: '3 400', ship: '0', status: 'Подтв.' },
                    { n: '00124', time: '20.03 16:12', agent: 'ИП Петров', org: 'ИП Иванов', sum: '22 100', paid: '22 100', ship: '22 100', status: 'Отгружен' },
                    { n: '00123', time: '20.03 09:44', agent: 'Розн. покуп...', org: 'ИП Иванов', sum: '5 600', paid: '5 600', ship: '5 600', status: 'Отгружен' },
                    { n: '00122', time: '19.03 20:15', agent: 'ООО Маркет', org: 'ИП Иванов', sum: '17 300', paid: '0', ship: '0', status: 'Новый' },
                    { n: '00121', time: '19.03 15:33', agent: 'Розн. покуп...', org: 'ИП Иванов', sum: '9 800', paid: '9 800', ship: '0', status: 'Подтв.' },
                    { n: '00120', time: '19.03 11:07', agent: 'ООО Стиль', org: 'ИП Иванов', sum: '4 250', paid: '4 250', ship: '4 250', status: 'Отгружен' },
                  ].map((row, i) => (
                    <tr key={i} className={`${i % 2 === 0 ? 'bg-white' : 'bg-[#f8f9fa]'} border-b border-[#e0e0e0]`}>
                      <td className="px-0.5 py-0.5">☐</td>
                      <td className="px-0.5 py-0.5 text-[#1976d2]">{row.n}</td>
                      <td className="px-0.5 py-0.5">{row.time}</td>
                      <td className="px-0.5 py-0.5 text-[#999]">{row.agent}</td>
                      <td className="px-0.5 py-0.5">{row.org}</td>
                      <td className="px-0.5 py-0.5">{row.sum}</td>
                      <td className="px-0.5 py-0.5">{row.paid}</td>
                      <td className="px-0.5 py-0.5">{row.ship}</td>
                      <td className="px-0.5 py-0.5">{row.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-[6px] text-[#999] mt-1">1-8 из 437 · Итого: 85 400,00</div>
            </div>
            <div className="bg-[#dde3ea] px-3 py-1.5 text-center border-t border-[#c0c8d0]">
              <span className="text-[10px] text-[#888]">Знакомо?</span>
            </div>
          </div>

          {/* Новый UI — Оборот, продажи */}
          <div className="rounded-2xl overflow-hidden border border-accent/30 flex flex-col">
            <div className="bg-[#0f0f13] px-4 py-2.5 flex items-center justify-between border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-accent/80 flex items-center justify-center">
                  <span className="text-[8px] font-black text-white">ОБ</span>
                </div>
                <span className="text-[11px] font-semibold text-white">Заказы</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[7px] text-muted bg-surface px-1.5 py-0.5 rounded">Вчера</span>
                <span className="text-[7px] text-muted bg-surface px-1.5 py-0.5 rounded">7 дн</span>
                <span className="text-[7px] text-white bg-accent/80 px-1.5 py-0.5 rounded font-medium">30 дн</span>
                <span className="text-[7px] text-muted bg-surface px-1.5 py-0.5 rounded">90 дн</span>
                <span className="text-[7px] text-muted bg-surface px-1.5 py-0.5 rounded border border-border">21.02 — 21.03</span>
              </div>
            </div>
            <div className="bg-[#0f0f13] p-3 flex-1">
              {/* Табы: Сводка / Потоварно */}
              <div className="flex items-center gap-0 mb-3 border-b border-border">
                <span className="text-[8px] text-muted px-3 py-1.5 border-b border-transparent">Сводка</span>
                <span className="text-[8px] text-white px-3 py-1.5 border-b-2 border-accent font-medium">Потоварно</span>
                <span className="text-[8px] text-muted px-3 py-1.5 border-b border-transparent">По каналам</span>
                <span className="text-[8px] text-muted px-3 py-1.5 border-b border-transparent">Динамика</span>
              </div>
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                <div className="bg-surface rounded-lg p-2 border border-border">
                  <div className="text-[8px] text-muted mb-0.5">Выручка</div>
                  <div className="text-[12px] font-bold text-white">284 500 ₽</div>
                  <div className="text-[8px] text-green-400">+12%</div>
                </div>
                <div className="bg-surface rounded-lg p-2 border border-border">
                  <div className="text-[8px] text-muted mb-0.5">Прибыль</div>
                  <div className="text-[12px] font-bold text-white">108 500 ₽</div>
                  <div className="text-[8px] text-green-400">+18%</div>
                </div>
                <div className="bg-surface rounded-lg p-2 border border-border">
                  <div className="text-[8px] text-muted mb-0.5">Маржа</div>
                  <div className="text-[12px] font-bold text-white">38.2%</div>
                  <div className="text-[8px] text-green-400">+2.1%</div>
                </div>
                <div className="bg-surface rounded-lg p-2 border border-border">
                  <div className="text-[8px] text-muted mb-0.5">ROI</div>
                  <div className="text-[12px] font-bold text-white">214%</div>
                  <div className="text-[8px] text-green-400">+11%</div>
                </div>
              </div>

              {/* Таблица продаж */}
              <table className="w-full text-[8px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-1.5 text-[7px] text-muted font-medium">Товар</th>
                    <th className="text-left py-1.5 text-[7px] text-muted font-medium">Канал</th>
                    <th className="text-right py-1.5 text-[7px] text-muted font-medium">Продаж</th>
                    <th className="text-right py-1.5 text-[7px] text-muted font-medium">Выручка</th>
                    <th className="text-right py-1.5 text-[7px] text-muted font-medium">Маржа</th>
                    <th className="text-right py-1.5 text-[7px] text-muted font-medium">Прибыль</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: 'Футболка оверсайз', mp: 'WB', mpColor: 'text-purple-400', sales: 142, rev: '89 400', margin: '42%', mColor: 'text-green-400', profit: '37 500' },
                    { name: 'Худи базовое', mp: 'Ozon', mpColor: 'text-blue-400', sales: 98, rev: '64 200', margin: '35%', mColor: 'text-green-400', profit: '22 400' },
                    { name: 'Брюки карго', mp: 'Сайт', mpColor: 'text-emerald-400', sales: 76, rev: '45 600', margin: '51%', mColor: 'text-green-400', profit: '23 200' },
                    { name: 'Шорты льняные', mp: 'ЯМ', mpColor: 'text-yellow-400', sales: 54, rev: '32 400', margin: '28%', mColor: 'text-yellow-400', profit: '9 100' },
                    { name: 'Кепка бейсболка', mp: 'Успех', mpColor: 'text-orange-400', sales: 89, rev: '26 700', margin: '48%', mColor: 'text-green-400', profit: '12 800' },
                    { name: 'Носки набор 5шт', mp: 'WB', mpColor: 'text-purple-400', sales: 234, rev: '16 400', margin: '18%', mColor: 'text-red-400', profit: '2 950' },
                    { name: 'Рубашка лён', mp: 'Ozon', mpColor: 'text-blue-400', sales: 31, rev: '9 800', margin: '33%', mColor: 'text-green-400', profit: '3 230' },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-border/50 hover:bg-surface/50">
                      <td className="py-1.5 text-white">{row.name}</td>
                      <td className={`py-1.5 ${row.mpColor} font-medium`}>{row.mp}</td>
                      <td className="py-1.5 text-right text-muted">{row.sales}</td>
                      <td className="py-1.5 text-right text-white">{row.rev} ₽</td>
                      <td className={`py-1.5 text-right font-medium ${row.mColor}`}>{row.margin}</td>
                      <td className="py-1.5 text-right text-white font-medium">{row.profit} ₽</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="flex items-center justify-between mt-2">
                <span className="text-[7px] text-muted">7 из 48 товаров</span>
                <span className="text-[7px] text-accent">показать все →</span>
              </div>
            </div>
            <div className="bg-[#0f0f13] px-3 py-1.5 border-t border-border text-center">
              <span className="text-[10px] text-accent font-medium">Всё понятно с первого взгляда</span>
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
