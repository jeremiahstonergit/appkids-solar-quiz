import { asset } from '../constants/assets'
import { objects } from '../data/objects'
import type { Question } from '../types/quiz'

export const objectIdsForQuestion = (question: Question): string[] => {
  switch (question.type) {
    case 'multiple_choice':
    case 'odd_one_out':
    case 'sorting':
    case 'ranking':
      return question.options
    case 'missing_item':
      return [...question.sequence, ...question.candidates]
    case 'true_false':
      return []
  }
}

const preloadUrls = (urls: Iterable<string>) => {
  for (const url of new Set(urls)) {
    const image = new Image()
    image.decoding = 'async'
    image.src = url
  }
}

export const preloadStartupAssets = () => preloadUrls([
  asset('backgrounds', 'bg_start_solar_system.png'),
  asset('heroes', 'hero_start_solar_system.png'),
])

export const preloadGameShellAssets = () => preloadUrls([
  asset('backgrounds', 'bg_question_space.png'),
  asset('backgrounds', 'bg_finish_space.png'),
  asset('heroes', 'hero_finish_success.png'),
])

export const preloadQuestionAssets = (questions: readonly Question[]) => preloadUrls(
  questions.flatMap(objectIdsForQuestion).flatMap(id => {
    const file = objects[id]?.file
    return file ? [asset('objects', file)] : []
  }),
)
