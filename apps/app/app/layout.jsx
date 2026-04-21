import './globals.css'
import '../lib/env'

export const metadata = {
  title: 'Оборот',
  description: 'Управление складом для продавцов маркетплейсов',
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="bg-bg text-white antialiased">{children}</body>
    </html>
  )
}
