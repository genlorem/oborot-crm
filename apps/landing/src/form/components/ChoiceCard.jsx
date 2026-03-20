export default function ChoiceCard({ option, selected, onClick, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled && !selected}
      className={`
        w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border text-left
        transition-all duration-200 card-hover
        ${selected
          ? 'bg-accent-glow border-accent text-white glow-sm'
          : disabled
          ? 'bg-surface border-border text-muted opacity-50 cursor-not-allowed'
          : 'bg-surface border-border text-white hover:border-accent/50 hover:bg-accent-glow/50'
        }
      `}
    >
      <span className="text-xl leading-none shrink-0">{option.emoji}</span>
      <span className="text-sm font-medium leading-snug">{option.label}</span>
      {selected && (
        <span className="ml-auto shrink-0 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 12 12">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      )}
    </button>
  )
}
