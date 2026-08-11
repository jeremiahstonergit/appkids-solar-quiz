import type { QuizObject } from '../types/quiz'

export const objects: Record<string, QuizObject> = Object.fromEntries([
  ['sun', 'Солнце', 'sun.png'], ['moon', 'Луна', 'moon.png'], ['mercury', 'Меркурий', 'mercury.png'],
  ['venus', 'Венера', 'venus.png'], ['earth', 'Земля', 'earth.png'], ['mars', 'Марс', 'mars.png'],
  ['jupiter', 'Юпитер', 'jupiter.png'], ['gagarin', 'Юрий Гагарин', 'yuri_gagarin.png'],
  ['tereshkova', 'Валентина Терешкова', 'valentina_tereshkova.png'], ['leonov', 'Алексей Леонов', 'alexei_leonov.png'],
  ['armstrong', 'Нил Армстронг', 'neil_armstrong.png'], ['baikonur', 'Байконур', 'baikonur.png'],
  ['vostok1', 'Восток-1', 'vostok_1.png'], ['vostok6', 'Восток-6', 'vostok_6.png'],
  ['voskhod2', 'Восход-2', 'voskhod_2.png'], ['soyuz', 'Союз', 'soyuz.png'],
  ['sputnik1', 'Спутник-1', 'sputnik_1.png'], ['hubble', 'Хаббл', 'hubble.png'], ['buran', 'Буран', 'buran.png'],
].map(([id, label, file]) => [id, { id, label, file }]))
