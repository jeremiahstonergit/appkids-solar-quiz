export type Mechanic = 'multiple_choice' | 'odd_one_out' | 'missing_item' | 'sorting' | 'ranking' | 'true_false'
export type Difficulty = 1 | 2 | 3
export type QuizObject = { id: string; label: string; file?: string; tone?: number }
export type Question = {
  id: number
  type: Mechanic
  prompt: string
  options?: string[]
  correct?: string | boolean
  sequence?: string[]
  candidates?: string[]
  categories?: { id: string; label: string }[]
  assignments?: Record<string, string>
  explanation: string
}
