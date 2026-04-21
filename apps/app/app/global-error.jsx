'use client'

import * as Sentry from '@sentry/nextjs'
import { useEffect } from 'react'

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <html lang="ru">
      <body className="bg-bg text-white antialiased">
        <div className="min-h-screen flex items-center justify-center px-6">
          <div className="w-full max-w-sm animate-fade-in text-center">
            <div className="flex items-center gap-3 mb-8 justify-center">
              <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center glow-sm">
                <span className="text-sm font-black text-white">ОБ</span>
              </div>
              <span className="text-lg font-bold text-white">Оборот</span>
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Что-то пошло не так</h1>
            <p className="text-muted text-sm mb-8">Ошибка записана. Попробуй ещё раз.</p>
            <button
              onClick={reset}
              className="px-6 py-3 rounded-xl bg-accent text-white font-semibold hover:bg-accent-light transition-all"
            >
              Обновить
            </button>
          </div>
        </div>
      </body>
    </html>
  )
}
