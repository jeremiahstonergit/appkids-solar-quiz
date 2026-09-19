import { useMemo } from 'react'
import type { ChoiceQuestion as ChoiceQuestionData } from '../../types/quiz'
import { resolveOptionOrder } from '../../utils/quiz'
import { ObjectCard } from '../ObjectCard'

type ChoiceQuestionProps = {
  question: ChoiceQuestionData
  optionOrder?: string[]
  value?: string
  checked: boolean
  spokenOptionId?: string
  onChange: (value: string) => void
}

export function ChoiceQuestion({ question, optionOrder, value, checked, spokenOptionId, onChange }: ChoiceQuestionProps) {
  const options = useMemo(() => resolveOptionOrder(question.options, optionOrder), [question, optionOrder])
  return <div className="choice-grid">{options.map(id => <ObjectCard
    key={id}
    id={id}
    spoken={spokenOptionId === id}
    selected={value === id}
    state={checked ? id === question.correct ? 'right' : value === id ? 'wrong' : undefined : undefined}
    onClick={checked ? undefined : () => onChange(id)}
  />)}</div>
}
