import { useMemo } from 'react'
import type { ChoiceQuestion as ChoiceQuestionData } from '../../types/quiz'
import { shuffle } from '../../utils/shuffle'
import { ObjectCard } from '../ObjectCard'

type ChoiceQuestionProps = {
  question: ChoiceQuestionData
  value?: string
  checked: boolean
  onChange: (value: string) => void
}

export function ChoiceQuestion({ question, value, checked, onChange }: ChoiceQuestionProps) {
  const options = useMemo(() => shuffle(question.options), [question])
  return <div className="choice-grid">{options.map(id => <ObjectCard
    key={id}
    id={id}
    selected={value === id}
    state={checked ? id === question.correct ? 'right' : value === id ? 'wrong' : undefined : undefined}
    onClick={checked ? undefined : () => onChange(id)}
  />)}</div>
}
