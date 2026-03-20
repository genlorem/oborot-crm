export default function RatingScale({ question, value, onChange }) {
  const scores = Array.from({ length: question.max - question.min + 1 }, (_, i) => i + question.min)

  return (
    <div className="w-full">
      <div className="flex gap-2 justify-between">
        {scores.map(score => (
          <button
            key={score}
            onClick={() => onChange(score)}
            className={`
              flex-1 aspect-square max-w-[52px] rounded-xl text-sm font-bold border
              transition-all duration-200
              ${value === score
                ? 'bg-accent border-accent text-white glow scale-110'
                : 'bg-surface border-border text-muted hover:border-accent/60 hover:text-white hover:scale-105'
              }
            `}
          >
            {score}
          </button>
        ))}
      </div>
      <div className="flex justify-between mt-3">
        <span className="text-xs text-muted">{question.minLabel}</span>
        <span className="text-xs text-muted">{question.maxLabel}</span>
      </div>
    </div>
  )
}
