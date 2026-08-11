import type { QuizObject } from '../types/quiz'

const list: QuizObject[] = [
  {
    "id": "o-solntse",
    "label": "Солнце",
    "file": "sun.png",
    "tone": 0
  },
  {
    "id": "o-merkuriy",
    "label": "Меркурий",
    "file": "mercury.png",
    "tone": 1
  },
  {
    "id": "o-venera",
    "label": "Венера",
    "file": "venus.png",
    "tone": 2
  },
  {
    "id": "o-zemlya",
    "label": "Земля",
    "file": "earth.png",
    "tone": 3
  },
  {
    "id": "o-mars",
    "label": "Марс",
    "file": "mars.png",
    "tone": 4
  },
  {
    "id": "o-yupiter",
    "label": "Юпитер",
    "file": "jupiter.png",
    "tone": 5
  },
  {
    "id": "o-saturn",
    "label": "Сатурн",
    "tone": 6
  },
  {
    "id": "o-uran",
    "label": "Уран",
    "tone": 7
  },
  {
    "id": "o-neptun",
    "label": "Нептун",
    "tone": 0
  },
  {
    "id": "o-luna",
    "label": "Луна",
    "file": "moon.png",
    "tone": 1
  },
  {
    "id": "o-pluton",
    "label": "Плутон",
    "tone": 2
  },
  {
    "id": "o-tserera",
    "label": "Церера",
    "tone": 3
  },
  {
    "id": "o-erida",
    "label": "Эрида",
    "tone": 4
  },
  {
    "id": "o-haumea",
    "label": "Хаумеа",
    "tone": 5
  },
  {
    "id": "o-io",
    "label": "Ио",
    "tone": 6
  },
  {
    "id": "o-evropa",
    "label": "Европа",
    "tone": 7
  },
  {
    "id": "o-ganimed",
    "label": "Ганимед",
    "tone": 0
  },
  {
    "id": "o-kallisto",
    "label": "Каллисто",
    "tone": 1
  },
  {
    "id": "o-titan",
    "label": "Титан",
    "tone": 2
  },
  {
    "id": "o-fobos",
    "label": "Фобос",
    "tone": 3
  },
  {
    "id": "o-yuriy-gagarin",
    "label": "Юрий Гагарин",
    "file": "yuri_gagarin.png",
    "tone": 4
  },
  {
    "id": "o-sputnik-1",
    "label": "Спутник-1",
    "file": "sputnik_1.png",
    "tone": 5
  },
  {
    "id": "o-vostok-1",
    "label": "Восток-1",
    "file": "vostok_1.png",
    "tone": 6
  },
  {
    "id": "o-apollon-11",
    "label": "Аполлон-11",
    "tone": 7
  },
  {
    "id": "o-lunohod-1",
    "label": "Луноход-1",
    "tone": 0
  },
  {
    "id": "o-voyadzher-1",
    "label": "Вояджер-1",
    "tone": 1
  },
  {
    "id": "o-habbl",
    "label": "Хаббл",
    "file": "hubble.png",
    "tone": 2
  },
  {
    "id": "o-mks",
    "label": "МКС",
    "tone": 3
  },
  {
    "id": "o-vostok-6",
    "label": "Восток-6",
    "file": "vostok_6.png",
    "tone": 4
  },
  {
    "id": "o-voshod-2",
    "label": "Восход-2",
    "file": "voskhod_2.png",
    "tone": 5
  },
  {
    "id": "o-soyuz",
    "label": "Союз",
    "file": "soyuz.png",
    "tone": 6
  },
  {
    "id": "o-buran",
    "label": "Буран",
    "file": "buran.png",
    "tone": 7
  },
  {
    "id": "o-nil-armstrong",
    "label": "Нил Армстронг",
    "file": "neil_armstrong.png",
    "tone": 0
  },
  {
    "id": "o-valentina-tereshkova",
    "label": "Валентина Терешкова",
    "file": "valentina_tereshkova.png",
    "tone": 1
  },
  {
    "id": "o-aleksey-leonov",
    "label": "Алексей Леонов",
    "file": "alexei_leonov.png",
    "tone": 2
  },
  {
    "id": "o-baykonur",
    "label": "Байконур",
    "file": "baikonur.png",
    "tone": 3
  },
  {
    "id": "o-vostochnyy",
    "label": "Восточный",
    "tone": 4
  },
  {
    "id": "o-plesetsk",
    "label": "Плесецк",
    "tone": 5
  },
  {
    "id": "o-kapustin-yar",
    "label": "Капустин Яр",
    "tone": 6
  },
  {
    "id": "o-6",
    "label": "6",
    "tone": 7
  },
  {
    "id": "o-7",
    "label": "7",
    "tone": 0
  },
  {
    "id": "o-8",
    "label": "8",
    "tone": 1
  },
  {
    "id": "o-9",
    "label": "9",
    "tone": 2
  }
]

export const objects: Record<string, QuizObject> = Object.fromEntries(list.map(item => [item.id, item]))

