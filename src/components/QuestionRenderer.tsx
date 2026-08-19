import type { Answer, Question } from '../types/quiz'
import { ChoiceQuestion } from './mechanics/ChoiceQuestion'
import { MissingItemQuestion } from './mechanics/MissingItemQuestion'
import { RankingQuestion } from './mechanics/RankingQuestion'
import { SortingQuestion } from './mechanics/SortingQuestion'
import { TrueFalseQuestion } from './mechanics/TrueFalseQuestion'

type QuestionRendererProps = {
  question: Question
  answer: Answer | undefined
  checked: boolean
  onChange: (answer: Answer) => void
  onComplete: (right: boolean) => void
}

const assignmentAnswer = (answer: Answer | undefined) =>
  typeof answer === 'object' && answer !== null && !Array.isArray(answer) ? answer : {}

export function QuestionRenderer({ question, answer, checked, onChange, onComplete }: QuestionRendererProps) {
  switch (question.type) {
    case 'multiple_choice':
    case 'odd_one_out':
      return <ChoiceQuestion question={question} value={typeof answer === 'string' ? answer : undefined} checked={checked} onChange={onChange}/>
    case 'missing_item':
      return <MissingItemQuestion question={question} value={typeof answer === 'string' ? answer : undefined} checked={checked} onChange={onChange} onComplete={onComplete}/>
    case 'sorting':
      return <SortingQuestion question={question} value={assignmentAnswer(answer)} checked={checked} onChange={onChange} onComplete={onComplete}/>
    case 'ranking':
      return <RankingQuestion question={question} value={Array.isArray(answer) ? answer : Array(question.options.length).fill('')} checked={checked} onChange={onChange} onComplete={onComplete}/>
    case 'true_false':
      return <TrueFalseQuestion question={question} value={typeof answer === 'boolean' ? answer : undefined} checked={checked} onChange={onChange}/>
  }
}
