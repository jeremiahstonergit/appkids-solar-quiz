import type { TrueFalseQuestion as TrueFalseQuestionData } from '../../types/quiz'

type TrueFalseQuestionProps = {
  question: TrueFalseQuestionData
  value?: boolean
  checked: boolean
  onChange: (value: boolean) => void
}

export function TrueFalseQuestion({ question, value, checked, onChange }: TrueFalseQuestionProps) {
  return <div className="truth-grid">
    <button className={`truth yes ${checked ? question.correct ? 'right' : value === true ? 'wrong' : '' : ''} ${value === true ? 'selected' : ''}`} disabled={checked} onClick={() => onChange(true)}>✓<span>Правда</span></button>
    <button className={`truth no ${checked ? !question.correct ? 'right' : value === false ? 'wrong' : '' : ''} ${value === false ? 'selected' : ''}`} disabled={checked} onClick={() => onChange(false)}>×<span>Ложь</span></button>
  </div>
}
