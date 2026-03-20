'use client'

export default function Login() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center px-6">
      <div className="w-full max-w-sm animate-fade-in">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center glow-sm">
            <span className="text-sm font-black text-white">ОБ</span>
          </div>
          <span className="text-lg font-bold text-white">Оборот</span>
        </div>

        <h1 className="text-2xl font-bold text-white mb-2">Войти</h1>
        <p className="text-muted text-sm mb-8">Авторизация будет добавлена в ближайшее время</p>

        <div className="p-4 rounded-xl bg-surface border border-border text-sm text-muted">
          Supabase Auth — в разработке
        </div>
      </div>
    </div>
  )
}
