export type Difficulty = 1 | 2 | 3
export type QuizObject = { id: string; label: string; file?: string; tone?: number }

type BaseQuestion = {
  id: number
  prompt: string
  explanation?: string
}

export type ChoiceQuestion = BaseQuestion & {
  type: 'multiple_choice' | 'odd_one_out'
  options: string[]
  correct: string
}

export type MissingItemQuestion = BaseQuestion & {
  type: 'missing_item'
  sequence: string[]
  candidates: string[]
  correct: string
}

export type SortingCategory = { id: string; label: string }

export type SortingQuestion = BaseQuestion & {
  type: 'sorting'
  options: string[]
  categories: [SortingCategory, SortingCategory]
  assignments: Record<string, string>
}

export type RankingQuestion = BaseQuestion & {
  type: 'ranking'
  options: string[]
  correct: string
}

export type TrueFalseQuestion = BaseQuestion & {
  type: 'true_false'
  correct: boolean
}

export type Question = ChoiceQuestion | MissingItemQuestion | SortingQuestion | RankingQuestion | TrueFalseQuestion
export type Mechanic = Question['type']
export type Answer = string | boolean | Record<string, string> | string[]
