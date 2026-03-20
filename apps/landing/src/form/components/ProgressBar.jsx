export default function ProgressBar({ current, total, progress }) {
  return (
    <div className="w-full px-6 pt-6 pb-2 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted font-medium tracking-wide uppercase">
          Шаг {current + 1} из {total}
        </span>
        <span className="text-xs text-accent font-semibold">{progress}%</span>
      </div>
      <div className="h-1 w-full bg-border rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  )
}
