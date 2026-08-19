import type { Answer, Question } from '../types/quiz'

const isAssignmentAnswer = (answer: Answer | undefined): answer is Record<string, string> =>
  typeof answer === 'object' && answer !== null && !Array.isArray(answer)

export const createInitialAnswer = (question: Question): Answer | undefined => {
  if (question.type === 'sorting') return {}
  if (question.type === 'ranking') return Array(question.options.length).fill('')
  return undefined
}

export const isAnswerCorrect = (question: Question, answer: Answer | undefined) => {
  switch (question.type) {
    case 'multiple_choice':
    case 'odd_one_out':
    case 'missing_item':
      return typeof answer === 'string' && answer === question.correct
    case 'true_false':
      return typeof answer === 'boolean' && answer === question.correct
    case 'sorting':
      return isAssignmentAnswer(answer) && question.options.every(id => answer[id] === question.assignments[id])
    case 'ranking':
      return Array.isArray(answer) && answer.join(',') === question.correct
  }
}
