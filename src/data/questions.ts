import type { Question } from '../types/quiz'

export const questions: Question[] = [
  { id: 1, type: 'multiple_choice', prompt: 'На какой планете мы живём?', options: ['mars','earth','venus','jupiter'], correct: 'earth', explanation: 'Наш дом — планета Земля.' },
  { id: 2, type: 'odd_one_out', prompt: 'Что здесь лишнее?', options: ['mercury','venus','mars','moon'], correct: 'moon', explanation: 'Луна — спутник, а остальные объекты — планеты.' },
  { id: 3, type: 'missing_item', prompt: 'Какой планеты не хватает в ряду?', sequence: ['mercury','venus','earth'], candidates: ['mars','moon','jupiter'], correct: 'mars', explanation: 'После Земли от Солнца расположен Марс.' },
  { id: 4, type: 'sorting', prompt: 'Разложи планеты относительно Земли', options: ['mercury','venus','mars','jupiter'], categories: [{id:'near',label:'Ближе к Солнцу'},{id:'far',label:'Дальше от Солнца'}], assignments: {mercury:'near',venus:'near',mars:'far',jupiter:'far'}, explanation: 'Меркурий и Венера ближе к Солнцу; Марс и Юпитер — дальше.' },
  { id: 5, type: 'ranking', prompt: 'Расставь планеты от Солнца', options: ['earth','mercury','mars','venus'], correct: 'mercury,venus,earth,mars', explanation: 'Верный порядок: Меркурий, Венера, Земля, Марс.' },
  { id: 6, type: 'true_false', prompt: 'Юрий Гагарин был первым человеком в космосе', correct: true, explanation: 'Верно! Юрий Гагарин полетел в космос в 1961 году.' },
  { id: 7, type: 'multiple_choice', prompt: 'Кто первым ступил на Луну?', options: ['gagarin','tereshkova','leonov','armstrong'], correct: 'armstrong', explanation: 'Первым на Луну ступил Нил Армстронг.' },
  { id: 8, type: 'odd_one_out', prompt: 'Какой объект не был космическим кораблём?', options: ['vostok1','vostok6','voskhod2','baikonur'], correct: 'baikonur', explanation: 'Байконур — космодром, откуда запускают ракеты.' },
  { id: 9, type: 'missing_item', prompt: 'Кого не хватает среди космонавтов?', sequence: ['gagarin','tereshkova','leonov'], candidates: ['armstrong','hubble','buran'], correct: 'armstrong', explanation: 'Нил Армстронг — астронавт, остальные варианты не люди.' },
  { id: 10, type: 'sorting', prompt: 'Раздели людей и космические аппараты', options: ['gagarin','tereshkova','sputnik1','buran'], categories: [{id:'people',label:'Люди'},{id:'craft',label:'Аппараты'}], assignments: {gagarin:'people',tereshkova:'people',sputnik1:'craft',buran:'craft'}, explanation: 'Гагарин и Терешкова — люди; Спутник-1 и Буран — аппараты.' },
  { id: 11, type: 'ranking', prompt: 'Расставь события от раннего к позднему', options: ['leonov','sputnik1','armstrong','gagarin'], correct: 'sputnik1,gagarin,leonov,armstrong', explanation: 'Спутник-1, полёт Гагарина, выход Леонова в космос, высадка Армстронга.' },
  { id: 12, type: 'true_false', prompt: 'Солнце — это планета', correct: false, explanation: 'Нет. Солнце — звезда.' },
]
