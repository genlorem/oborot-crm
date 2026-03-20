import { useState } from 'react'
import { STEPS } from '../data/questions'

export function useForm() {
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = back

  const totalSteps = STEPS.length
  const step = STEPS[currentStep]
  const progress = Math.round(((currentStep) / totalSteps) * 100)

  function setAnswer(questionId, value) {
    setAnswers(prev => ({ ...prev, [questionId]: value }))
  }

  function toggleMulti(questionId, value, maxSelect) {
    setAnswers(prev => {
      const current = prev[questionId] || []
      if (current.includes(value)) {
        return { ...prev, [questionId]: current.filter(v => v !== value) }
      }
      if (maxSelect && current.length >= maxSelect) return prev
      return { ...prev, [questionId]: [...current, value] }
    })
  }

  function canProceed() {
    const step = STEPS[currentStep]
    for (const q of step.questions) {
      if (q.type === 'text' || q.type === 'checkbox') continue
      if (q.required === false) continue
      const val = answers[q.id]
      if (!val || (Array.isArray(val) && val.length === 0)) return false
    }
    return true
  }

  function next() {
    if (currentStep < totalSteps - 1) {
      setDirection(1)
      setCurrentStep(s => s + 1)
    }
  }

  function back() {
    if (currentStep > 0) {
      setDirection(-1)
      setCurrentStep(s => s - 1)
    }
  }

  async function submit() {
    setSubmitting(true)
    const webhookUrl = import.meta.env.VITE_SHEETS_WEBHOOK_URL
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...answers,
            platforms: (answers.platforms || []).join(', '),
            pains: (answers.pains || []).join(', '),
            wishes: (answers.wishes || []).join(', '),
          }),
        })
      } catch (e) {
        console.error('Submit error:', e)
      }
    }
    setSubmitting(false)
    setSubmitted(true)
  }

  return {
    step,
    currentStep,
    totalSteps,
    progress,
    answers,
    submitted,
    submitting,
    direction,
    setAnswer,
    toggleMulti,
    canProceed,
    next,
    back,
    submit,
  }
}
