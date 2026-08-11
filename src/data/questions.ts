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
  { id: 13, type: 'multiple_choice', prompt: 'Какая планета ближе всех к Солнцу?', options: ['mercury','venus','earth','mars'], correct: 'mercury', explanation: 'Ближе всех к Солнцу находится Меркурий.' },
  { id: 14, type: 'multiple_choice', prompt: 'Какая планета самая большая?', options: ['earth','mars','venus','jupiter'], correct: 'jupiter', explanation: 'Юпитер — самая большая планета Солнечной системы.' },
  { id: 15, type: 'multiple_choice', prompt: 'Кто был первой женщиной в космосе?', options: ['tereshkova','gagarin','leonov','armstrong'], correct: 'tereshkova', explanation: 'Первой женщиной-космонавтом стала Валентина Терешкова.' },
  { id: 16, type: 'multiple_choice', prompt: 'На каком корабле летал Юрий Гагарин?', options: ['vostok1','vostok6','soyuz','buran'], correct: 'vostok1', explanation: 'Юрий Гагарин совершил полёт на корабле «Восток-1».' },
  { id: 17, type: 'odd_one_out', prompt: 'Что здесь не является планетой?', options: ['earth','mars','jupiter','sun'], correct: 'sun', explanation: 'Солнце — звезда, остальные объекты — планеты.' },
  { id: 18, type: 'odd_one_out', prompt: 'Кто из них не летал в космос?', options: ['gagarin','tereshkova','leonov','baikonur'], correct: 'baikonur', explanation: 'Байконур — космодром, а не человек.' },
  { id: 19, type: 'odd_one_out', prompt: 'Какой аппарат отличается от остальных?', options: ['vostok1','vostok6','voskhod2','hubble'], correct: 'hubble', explanation: 'Хаббл — космический телескоп, остальные — пилотируемые корабли.' },
  { id: 20, type: 'odd_one_out', prompt: 'Что здесь является естественным спутником?', options: ['moon','mercury','venus','mars'], correct: 'moon', explanation: 'Луна — естественный спутник Земли.' },
  { id: 21, type: 'missing_item', prompt: 'Что продолжает ряд планет?', sequence: ['venus','earth','mars'], candidates: ['jupiter','moon','sun'], correct: 'jupiter', explanation: 'После Марса от Солнца расположен Юпитер.' },
  { id: 22, type: 'missing_item', prompt: 'Какого аппарата не хватает?', sequence: ['sputnik1','vostok1','voskhod2'], candidates: ['soyuz','moon','baikonur'], correct: 'soyuz', explanation: '«Союз» продолжает ряд советских космических аппаратов.' },
  { id: 23, type: 'missing_item', prompt: 'Кто дополнит команду космонавтов?', sequence: ['gagarin','tereshkova','leonov'], candidates: ['armstrong','hubble','sputnik1'], correct: 'armstrong', explanation: 'Нил Армстронг — человек и астронавт.' },
  { id: 24, type: 'missing_item', prompt: 'Чего не хватает среди объектов в космосе?', sequence: ['sun','earth','moon'], candidates: ['mars','baikonur','gagarin'], correct: 'mars', explanation: 'Марс, как и остальные в ряду, находится в космосе.' },
  { id: 25, type: 'sorting', prompt: 'Раздели планеты и другие объекты', options: ['earth','jupiter','sun','moon'], categories: [{id:'planets',label:'Планеты'},{id:'other',label:'Не планеты'}], assignments: {earth:'planets',jupiter:'planets',sun:'other',moon:'other'}, explanation: 'Земля и Юпитер — планеты; Солнце — звезда, Луна — спутник.' },
  { id: 26, type: 'sorting', prompt: 'Раздели космонавтов и места', options: ['gagarin','armstrong','baikonur','earth'], categories: [{id:'people',label:'Люди'},{id:'places',label:'Места'}], assignments: {gagarin:'people',armstrong:'people',baikonur:'places',earth:'places'}, explanation: 'Гагарин и Армстронг — люди; Байконур и Земля — места.' },
  { id: 27, type: 'sorting', prompt: 'Раздели корабли и другие аппараты', options: ['vostok1','soyuz','sputnik1','hubble'], categories: [{id:'ships',label:'Корабли'},{id:'devices',label:'Другие аппараты'}], assignments: {vostok1:'ships',soyuz:'ships',sputnik1:'devices',hubble:'devices'}, explanation: '«Восток-1» и «Союз» — корабли; Спутник-1 и Хаббл — другие аппараты.' },
  { id: 28, type: 'sorting', prompt: 'Что ближе и дальше от Солнца, чем Марс?', options: ['mercury','earth','venus','jupiter'], categories: [{id:'near',label:'Ближе Марса'},{id:'far',label:'Дальше Марса'}], assignments: {mercury:'near',earth:'near',venus:'near',jupiter:'far'}, explanation: 'Меркурий, Венера и Земля ближе Марса; Юпитер — дальше.' },
  { id: 29, type: 'ranking', prompt: 'Расставь от Земли к дальнему космосу', options: ['jupiter','earth','moon','mars'], correct: 'earth,moon,mars,jupiter', explanation: 'Сначала Земля и её Луна, затем более далёкие Марс и Юпитер.' },
  { id: 30, type: 'ranking', prompt: 'Расставь полёты от раннего к позднему', options: ['tereshkova','armstrong','gagarin','leonov'], correct: 'gagarin,tereshkova,leonov,armstrong', explanation: 'Гагарин, Терешкова, Леонов, затем Армстронг.' },
  { id: 31, type: 'ranking', prompt: 'Расставь планеты от маленькой к большой', options: ['jupiter','mercury','earth','mars'], correct: 'mercury,mars,earth,jupiter', explanation: 'Меркурий, Марс, Земля, Юпитер — от меньшей к большей.' },
  { id: 32, type: 'ranking', prompt: 'Расставь планеты от Солнца', options: ['jupiter','venus','mars','earth'], correct: 'venus,earth,mars,jupiter', explanation: 'Венера, Земля, Марс, Юпитер.' },
  { id: 33, type: 'true_false', prompt: 'Луна вращается вокруг Земли', correct: true, explanation: 'Верно! Луна — естественный спутник Земли.' },
  { id: 34, type: 'true_false', prompt: 'Юпитер меньше Земли', correct: false, explanation: 'Нет. Юпитер намного больше Земли.' },
  { id: 35, type: 'true_false', prompt: 'Алексей Леонов первым вышел в открытый космос', correct: true, explanation: 'Верно! Это произошло в 1965 году.' },
  { id: 36, type: 'true_false', prompt: 'На Луне можно дышать без скафандра', correct: false, explanation: 'Нет. На Луне нет воздуха для дыхания.' },
]

const shuffle = <T,>(items: T[]) => {
  const result=[...items]
  for(let i=result.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[result[i],result[j]]=[result[j],result[i]]}
  return result
}

export const createQuiz = () => shuffle([
  ...(['multiple_choice','odd_one_out','missing_item','sorting','ranking','true_false'] as const)
    .flatMap(type=>shuffle(questions.filter(question=>question.type===type)).slice(0,2)),
])
