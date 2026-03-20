export default function ThankYou() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-6 py-12 animate-slide-up">
      <div className="text-6xl mb-6 animate-pulse-slow">🚀</div>
      <h2 className="text-3xl font-bold text-white mb-3">Спасибо!</h2>
      <p className="text-muted text-base leading-relaxed max-w-sm mb-8">
        Ваши ответы получены. Мы строим Оборот — простой и быстрый инструмент без лишней боли.
        Расскажем когда запустимся.
      </p>

      <div className="w-full max-w-sm bg-surface border border-border rounded-2xl p-5 mb-6">
        <p className="text-sm text-muted mb-3">Следите за прогрессом в канале</p>
        <a
          href="https://t.me/topseller"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent-light transition-colors text-white font-semibold py-3 px-4 rounded-xl text-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.248l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.447 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.12l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.833.941z"/>
          </svg>
          topseller
        </a>
      </div>

      <p className="text-xs text-muted">
        Сделано с ❤️ командой Оборот
      </p>
    </div>
  )
}
