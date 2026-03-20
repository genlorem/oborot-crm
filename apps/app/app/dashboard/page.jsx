'use client'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6">
      <div className="text-center animate-fade-in">
        {/* Logo */}
        <div className="w-16 h-16 rounded-2xl bg-accent flex items-center justify-center glow mx-auto mb-6">
          <span className="text-2xl font-black text-white">ОБ</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-3">Оборот</h1>
        <p className="text-muted text-lg mb-8 max-w-sm">
          Здесь будет удобный склад для продавцов маркетплейсов
        </p>

        {/* Status badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border text-sm text-muted">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse inline-block" />
          В разработке
        </div>

        {/* Feature hints */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl text-left">
          {[
            { icon: '📦', title: 'Остатки в реальном времени', desc: 'Все склады и маркетплейсы в одном месте' },
            { icon: '📊', title: 'Аналитика юнит-экономики', desc: 'P&L по каждому SKU без Excel' },
            { icon: '🔮', title: 'Прогнозирование', desc: 'Когда и сколько закупить — без угадайки' },
          ].map(f => (
            <div key={f.title} className="p-4 rounded-xl bg-surface border border-border">
              <div className="text-2xl mb-2">{f.icon}</div>
              <div className="text-sm font-semibold text-white mb-1">{f.title}</div>
              <div className="text-xs text-muted leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
