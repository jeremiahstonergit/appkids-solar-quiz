import type { Difficulty, Mechanic } from '../types/quiz'
import { questions } from './questions'

export const difficultyMeta: Record<Difficulty, { label: string; age: string; description: string }> = {
  1: { label: 'Лёгкий', age: '2–4 года', description: 'Знакомые объекты и простые факты' },
  2: { label: 'Средний', age: '4–6 лет', description: 'Свойства, сравнения и классификация' },
  3: { label: 'Сложный', age: '6+ лет', description: 'История, хронология и сложные связи' },
}

export const questionDifficulty: Record<number, Difficulty> = {
  1:1,2:1,3:2,4:2,5:2,6:1,7:2,8:3,9:1,10:2,
  11:1,12:2,13:3,14:1,15:2,16:3,17:1,18:2,19:3,20:2,
  21:2,22:1,23:1,24:2,25:3,26:2,27:3,28:3,29:2,30:1,
  31:1,32:2,33:2,34:1,35:2,36:3,37:2,38:2,39:1,40:1,
  41:1,42:2,43:1,44:2,45:1,46:2,47:1,48:2,49:3,50:3,
  51:1,52:1,53:3,54:2,55:3,56:1,57:1,58:2,59:2,60:2,
  61:3,62:3,63:3,64:1,65:2,66:3,67:1,68:2,69:3,70:3,
  71:3,72:3,73:3,74:2,75:3,76:3,77:2,78:3,
}

export const sortingCategories: Record<number, [{ id: 'left'; label: string }, { id: 'right'; label: string }]> = {
  21: [{ id: 'left', label: 'Ближе к Солнцу' }, { id: 'right', label: 'Дальше от Солнца' }],
  22: [{ id: 'left', label: 'Планеты' }, { id: 'right', label: 'Спутники' }],
  23: [{ id: 'left', label: 'Каменистые планеты' }, { id: 'right', label: 'Планеты-гиганты' }],
  24: [{ id: 'left', label: 'С кольцами' }, { id: 'right', label: 'Без колец' }],
  25: [{ id: 'left', label: 'Вокруг Солнца' }, { id: 'right', label: 'Вокруг планеты' }],
  26: [{ id: 'left', label: 'Есть спутники' }, { id: 'right', label: 'Нет спутников' }],
  27: [{ id: 'left', label: 'Больше Земли' }, { id: 'right', label: 'Меньше Земли' }],
  28: [{ id: 'left', label: 'Ближе Марса' }, { id: 'right', label: 'Дальше Марса' }],
  29: [{ id: 'left', label: 'Газовые гиганты' }, { id: 'right', label: 'Остальные' }],
  30: [{ id: 'left', label: 'Звезды' }, { id: 'right', label: 'Не звезды' }],
  67: [{ id: 'left', label: 'Космонавты' }, { id: 'right', label: 'Космические корабли' }],
  68: [{ id: 'left', label: 'Космодромы' }, { id: 'right', label: 'Космические корабли' }],
  69: [{ id: 'left', label: 'Советские' }, { id: 'right', label: 'Американские' }],
}

const shuffle = <T,>(items: T[]) => {
  const result = [...items]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

const mechanics: Mechanic[] = ['multiple_choice', 'odd_one_out', 'missing_item', 'sorting', 'ranking', 'true_false']

export const createQuiz = (difficulty: Difficulty) => shuffle(mechanics.flatMap(type =>
  shuffle(questions.filter(question => question.type === type && questionDifficulty[question.id] === difficulty)).slice(0, 2),
))
