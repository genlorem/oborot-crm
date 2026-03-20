import ChoiceCard from './ChoiceCard'
import RatingScale from './RatingScale'

export default function SurveyStep({ step, answers, onSetAnswer, onToggleMulti }) {
  return (
    <div className="w-full animate-slide-up">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">{step.title}</h2>
        {step.subtitle && (
          <p className="text-sm text-muted leading-relaxed">{step.subtitle}</p>
        )}
      </div>

      <div className="flex flex-col gap-6">
        {step.questions.map(q => (
          <QuestionBlock
            key={q.id}
            question={q}
            value={answers[q.id]}
            onSetAnswer={v => onSetAnswer(q.id, v)}
            onToggle={v => onToggleMulti(q.id, v, q.maxSelect)}
          />
        ))}
      </div>
    </div>
  )
}

function QuestionBlock({ question, value, onSetAnswer, onToggle }) {
  if (question.type === 'single') {
    return (
      <div>
        {question.question && (
          <p className="text-sm font-semibold text-white mb-3">{question.question}</p>
        )}
        <div className="grid grid-cols-2 gap-2">
          {question.options.map(opt => (
            <ChoiceCard
              key={opt.value}
              option={opt}
              selected={value === opt.value}
              onClick={() => onSetAnswer(opt.value)}
            />
          ))}
        </div>
      </div>
    )
  }

  if (question.type === 'multi') {
    const selected = value || []
    const maxReached = question.maxSelect && selected.length >= question.maxSelect
    return (
      <div>
        {question.question && (
          <p className="text-sm font-semibold text-white mb-3">{question.question}</p>
        )}
        {question.maxSelect && (
          <p className="text-xs text-muted mb-3">
            Выбрано: {selected.length} / {question.maxSelect}
          </p>
        )}
        <div className="flex flex-col gap-2">
          {question.options.map(opt => (
            <ChoiceCard
              key={opt.value}
              option={opt}
              selected={selected.includes(opt.value)}
              onClick={() => onToggle(opt.value)}
              disabled={maxReached}
            />
          ))}
        </div>
      </div>
    )
  }

  if (question.type === 'rating') {
    return (
      <RatingScale
        question={question}
        value={value}
        onChange={onSetAnswer}
      />
    )
  }

  if (question.type === 'text') {
    return (
      <div>
        {question.question && (
          <p className="text-sm font-semibold text-white mb-2">{question.question}</p>
        )}
        <input
          type="text"
          value={value || ''}
          onChange={e => onSetAnswer(e.target.value)}
          placeholder={question.placeholder}
          className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-sm text-white placeholder-muted outline-none focus:border-accent focus:glow-sm transition-all"
        />
      </div>
    )
  }

  if (question.type === 'checkbox') {
    return (
      <label className="flex items-start gap-3 cursor-pointer group">
        <div
          className={`
            mt-0.5 w-5 h-5 rounded-md border shrink-0 flex items-center justify-center transition-all
            ${value ? 'bg-accent border-accent' : 'bg-surface border-border group-hover:border-accent/60'}
          `}
          onClick={() => onSetAnswer(!value)}
        >
          {value && (
            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>
        <span
          className="text-sm text-white leading-snug"
          onClick={() => onSetAnswer(!value)}
        >
          {question.question}
        </span>
      </label>
    )
  }

  return null
}
