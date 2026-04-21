// apps/landing/src/components/EnvErrorBanner.jsx
// Renders when env validation fails. Uses ONLY inline styles — no Tailwind
// tokens, because this banner may render before the CSS bundle has loaded
// or when the build itself is misconfigured.
export default function EnvErrorBanner({ errors = [] }) {
  return (
    <div style={{
      padding: 32,
      background: '#0f0f13',
      color: '#ff6b6b',
      fontFamily: 'Inter, system-ui, sans-serif',
      minHeight: '100vh',
    }}>
      <h1 style={{ color: '#fff', fontSize: 24, marginBottom: 16 }}>
        Конфигурация неполная
      </h1>
      <p style={{ color: '#ccc', marginBottom: 16 }}>
        Приложение не запустится — отсутствуют или некорректны env-переменные:
      </p>
      <ul style={{ color: '#ff6b6b', fontFamily: 'monospace', marginBottom: 24 }}>
        {errors.map(e => <li key={e}><code>{e}</code></li>)}
      </ul>
      <p style={{ color: '#ccc' }}>
        Скопируй <code>.env.example</code> → <code>.env.local</code> и заполни значения.
        См. <code>README.md</code>.
      </p>
    </div>
  )
}
