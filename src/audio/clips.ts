import { ASSET_BASE } from '../constants/assets'
import type { Question } from '../types/quiz'
export { optionIds } from '../utils/quiz'
export const clip = (path: string) => `${ASSET_BASE}/audio/${path}.mp3`
export const questionClip = (id: number) => clip(`questions/q${String(id).padStart(3, '0')}`)
export const explanationClip = (id: number) => clip(`explanations/e${String(id).padStart(3, '0')}`)
export const objectClip = (id: string) => clip(`objects/${id}`)
export const uiClip = (kind: 'greeting' | 'praise' | 'encourage' | 'finish', count = kind === 'praise' ? 8 : 4) =>
  clip(`ui/${kind}_${String(1 + Math.floor(Math.random() * count)).padStart(2, '0')}`)
export const feedbackClips = (question: Question, correct: boolean) => {
  // No explanation is recorded for true statements: repeat the true fact.
  if (!correct && question.type === 'true_false' && question.correct && !question.explanation) return [questionClip(question.id)]
  // Support recordings refer to an explanation; do not promise one when none exists.
  const reaction = correct ? [uiClip('praise')] : question.explanation ? [uiClip('encourage')] : []
  return question.explanation ? [...reaction, explanationClip(question.id)] : reaction
}
