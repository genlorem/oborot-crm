import { Link } from 'react-router-dom'
import { useForm } from '../hooks/useForm'
import ProgressBar from '../components/ProgressBar'
import FormStep from '../components/FormStep'
import ThankYou from '../components/ThankYou'

export default function Form() {
  const {
    step,
    currentStep,
    totalSteps,
    progress,
    answers,
    submitted,
    submitting,
    setAnswer,
    toggleMulti,
    canProceed,
    next,
    back,
    submit,
  } = useForm()

  const isLastStep = currentStep === totalSteps - 1

  if (submitted) {
    return (
      <div className="min-h-screen bg-bg flex flex-col">
        <ThankYou />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-6 pt-5 max-w-2xl mx-auto w-full">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center glow-sm">
            <span className="text-xs font-black text-white">ОБ</span>
          </div>
          <span className="text-sm font-bold text-white">Оборот</span>
        </Link>
        <span className="text-xs text-muted">Анкета продавца</span>
      </header>

      {/* Progress */}
      <ProgressBar current={currentStep} total={totalSteps} progress={progress} />

      {/* Content */}
      <main className="flex-1 flex flex-col px-6 pt-4 pb-6 max-w-2xl mx-auto w-full">
        <FormStep
          key={currentStep}
          step={step}
          answers={answers}
          onSetAnswer={setAnswer}
          onToggleMulti={toggleMulti}
        />

      </main>

      {/* Footer nav */}
      <footer className="px-6 pb-8 pt-2 max-w-2xl mx-auto w-full">
        <div className="flex gap-3">
          {currentStep > 0 && (
            <button
              onClick={back}
              className="flex-none px-5 py-3 rounded-xl border border-border text-muted text-sm font-medium hover:border-accent/50 hover:text-white transition-all"
            >
              ← Назад
            </button>
          )}
          <button
            onClick={isLastStep ? submit : next}
            disabled={!canProceed() || submitting}
            className={`
              flex-1 py-3 rounded-xl text-sm font-semibold transition-all duration-200
              ${canProceed() && !submitting
                ? 'bg-accent hover:bg-accent-light text-white glow'
                : 'bg-surface border border-border text-muted cursor-not-allowed'
              }
            `}
          >
            {submitting
              ? 'Отправляем...'
              : isLastStep
              ? 'Отправить анкету 🚀'
              : 'Продолжить →'}
          </button>
        </div>
        {isLastStep && (
          <p className="text-center text-xs text-muted mt-3">
            Поля на этом шаге необязательны — можно сразу отправить
          </p>
        )}
      </footer>
    </div>
  )
}
