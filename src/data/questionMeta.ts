import { questions } from './questions'
import type { Difficulty, Mechanic, Question } from '../types/quiz'

export const questionDifficulty: Record<number, Difficulty> = {
  1:2,2:1,3:2,4:1,5:2,6:1,7:1,8:3,9:1,10:2,
  11:2,12:2,13:3,14:1,15:2,16:3,17:1,18:2,19:3,20:2,
  21:2,22:1,23:2,24:2,25:2,26:2,27:3,28:3,29:2,30:1,
  31:1,32:2,33:2,34:1,35:2,36:3,37:2,38:2,39:1,40:1,
  41:1,42:2,43:1,44:2,45:1,46:2,47:1,48:2,49:3,50:3,
  51:1,52:1,53:3,54:2,55:3,56:1,57:1,58:2,59:2,60:2,
  61:3,62:3,63:3,64:1,65:2,66:3,67:1,68:2,69:3,
  70:3,71:3,72:3,73:3,74:2,75:3,76:3,77:2,78:3,
}

export type QuestionWithDifficulty = Question & { difficulty: Difficulty }
export const questionsWithDifficulty: QuestionWithDifficulty[] = questions.map(question => ({
  ...question,
  difficulty: questionDifficulty[question.id],
}))

export const sortingCategoryLabels: Record<number, [string, string]> = {
  21:['Ближе к Солнцу','Дальше от Солнца'],
  22:['Планеты','Спутники'],
  23:['Каменистые планеты','Планеты-гиганты'],
  24:['С кольцами','Без колец'],
  25:['Планеты','Спутники'],
  26:['Есть спутники','Нет спутников'],
  27:['Больше Земли','Меньше Земли'],
  28:['Ближе Марса','Дальше Марса'],
  29:['Газовые гиганты','Остальные'],
  30:['Звёзды','Не звёзды'],
  67:['Космонавты','Космические корабли'],
  68:['Космодромы','Космические корабли'],
  69:['Советские','Американские'],
}

export const difficultyInfo: Record<Difficulty, { title:string; age:string; description:string }> = {
  1:{title:'Лёгкий',age:'2–4 года',description:'Самые знакомые объекты и простые факты'},
  2:{title:'Средний',age:'4–6 лет',description:'Сравнения, свойства и больше космических знаний'},
  3:{title:'Сложный',age:'6+ лет',description:'История космонавтики и непростые закономерности'},
}

const mechanics: Mechanic[] = ['multiple_choice','odd_one_out','missing_item','sorting','ranking','true_false']
const shuffle = <T,>(items:T[]) => {
  const result=[...items]
  for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}
  return result
}

/** Two random questions of every mechanic, restricted to the selected level. */
export const createQuizForDifficulty = (difficulty:Difficulty) => shuffle(mechanics.flatMap(type =>
  shuffle(questionsWithDifficulty.filter(q => q.type===type && q.difficulty===difficulty)).slice(0,2),
))
