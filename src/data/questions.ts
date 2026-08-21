import type { Question } from '../types/quiz'

export const questions: Question[] = [
  {
    "id": 1,
    "type": "multiple_choice",
    "prompt": "Какая звезда находится в центре Солнечной системы?",
    "options": [
      "o-solntse",
      "o-sirius",
      "o-polyarnaya-zvezda",
      "o-antares"
    ],
    "correct": "o-solntse",
    "explanation": "Солнце — звезда в центре нашей системы. Все планеты, включая Землю, движутся вокруг него."
  },
  {
    "id": 2,
    "type": "multiple_choice",
    "prompt": "Сколько планет в Солнечной системе?",
    "options": [
      "o-6",
      "o-7",
      "o-8",
      "o-9"
    ],
    "correct": "o-8",
    "explanation": "В Солнечной системе восемь планет. Плутон относится к карликовым планетам, поэтому в этот счёт не входит."
  },
  {
    "id": 3,
    "type": "multiple_choice",
    "prompt": "Какая планета ближе всего к Солнцу?",
    "options": [
      "o-venera",
      "o-zemlya",
      "o-merkuriy",
      "o-mars"
    ],
    "correct": "o-merkuriy",
    "explanation": "Меркурий — первая планета от Солнца, поэтому он ближе всех остальных."
  },
  {
    "id": 4,
    "type": "multiple_choice",
    "prompt": "Какая планета самая большая в Солнечной системе?",
    "options": [
      "o-saturn",
      "o-yupiter",
      "o-neptun",
      "o-zemlya"
    ],
    "correct": "o-yupiter",
    "explanation": "Юпитер — крупнейшая планета Солнечной системы: он намного больше Земли и остальных планет."
  },
  {
    "id": 5,
    "type": "multiple_choice",
    "prompt": "Какая планета самая горячая?",
    "options": [
      "o-merkuriy",
      "o-venera",
      "o-mars",
      "o-yupiter"
    ],
    "correct": "o-venera",
    "explanation": "Венеру сильнее всего нагревает её плотная атмосфера: она удерживает тепло, как очень мощная теплица."
  },
  {
    "id": 6,
    "type": "multiple_choice",
    "prompt": "На какой планете мы живём?",
    "options": [
      "o-mars",
      "o-zemlya",
      "o-venera",
      "o-merkuriy"
    ],
    "correct": "o-zemlya",
    "explanation": "Мы живём на Земле — третьей планете от Солнца."
  },
  {
    "id": 7,
    "type": "multiple_choice",
    "prompt": "У какой из этих планет есть кольца?",
    "options": [
      "o-saturn",
      "o-zemlya",
      "o-mars",
      "o-venera"
    ],
    "correct": "o-saturn",
    "explanation": "У Сатурна есть широкая система колец из льда, камней и пыли. Среди этих вариантов кольца есть только у него."
  },
  {
    "id": 8,
    "type": "multiple_choice",
    "prompt": "Какая планета находится дальше всего от Солнца среди восьми планет?",
    "options": [
      "o-uran",
      "o-saturn",
      "o-neptun",
      "o-mars"
    ],
    "correct": "o-neptun",
    "explanation": "Нептун — восьмая планета от Солнца, поэтому среди планет он находится дальше всех."
  },
  {
    "id": 9,
    "type": "multiple_choice",
    "prompt": "Как называется естественный спутник Земли?",
    "options": [
      "o-fobos",
      "o-luna",
      "o-evropa",
      "o-titan"
    ],
    "correct": "o-luna",
    "explanation": "Луна — естественный спутник Земли: она движется вокруг нашей планеты."
  },
  {
    "id": 10,
    "type": "multiple_choice",
    "prompt": "Как называется карликовая планета, которую раньше считали девятой планетой?",
    "options": [
      "o-tserera",
      "o-pluton",
      "o-erida",
      "o-mars"
    ],
    "correct": "o-pluton",
    "explanation": "Плутон долго называли девятой планетой, но теперь он относится к карликовым планетам."
  },
  {
    "id": 11,
    "type": "odd_one_out",
    "prompt": "Что из этого лишнее?",
    "options": [
      "o-merkuriy",
      "o-venera",
      "o-mars",
      "o-yupiter"
    ],
    "correct": "o-yupiter",
    "explanation": "Юпитер — планета-гигант, а Меркурий, Венера и Марс — каменистые планеты."
  },
  {
    "id": 12,
    "type": "odd_one_out",
    "prompt": "Что из этого лишнее?",
    "options": [
      "o-zemlya",
      "o-mars",
      "o-venera",
      "o-saturn"
    ],
    "correct": "o-saturn",
    "explanation": "Сатурн — планета-гигант, а Земля, Марс и Венера — каменистые планеты."
  },
  {
    "id": 13,
    "type": "odd_one_out",
    "prompt": "Что из этого лишнее?",
    "options": [
      "o-io",
      "o-evropa",
      "o-ganimed",
      "o-titan"
    ],
    "correct": "o-titan",
    "explanation": "Ио, Европа и Ганимед это спутники Юпитера, а Титан — спутник Сатурна."
  },
  {
    "id": 14,
    "type": "odd_one_out",
    "prompt": "Что из этого лишнее?",
    "options": [
      "o-merkuriy",
      "o-venera",
      "o-zemlya",
      "o-luna"
    ],
    "correct": "o-luna",
    "explanation": "Луна — спутник Земли, а Меркурий, Венера и Земля — планеты."
  },
  {
    "id": 15,
    "type": "odd_one_out",
    "prompt": "Что из этого лишнее?",
    "options": [
      "o-yupiter",
      "o-saturn",
      "o-uran",
      "o-zemlya"
    ],
    "correct": "o-zemlya",
    "explanation": "Земля — каменистая планета, а Юпитер, Сатурн и Уран — планеты-гиганты."
  },
  {
    "id": 16,
    "type": "odd_one_out",
    "prompt": "Что из этого лишнее?",
    "options": [
      "o-pluton",
      "o-tserera",
      "o-erida",
      "o-zemlya"
    ],
    "correct": "o-zemlya",
    "explanation": "Земля — обычная большая планета, а Плутон, Церера и Эрида относятся к карликовым планетам."
  },
  {
    "id": 17,
    "type": "odd_one_out",
    "prompt": "Что из этого лишнее?",
    "options": [
      "o-solntse",
      "o-yupiter",
      "o-saturn",
      "o-neptun"
    ],
    "correct": "o-solntse",
    "explanation": "Солнце — звезда, а Юпитер, Сатурн и Нептун — планеты."
  },
  {
    "id": 18,
    "type": "odd_one_out",
    "prompt": "Что из этого лишнее?",
    "options": [
      "o-merkuriy",
      "o-mars",
      "o-yupiter",
      "o-zemlya"
    ],
    "correct": "o-yupiter",
    "explanation": "Юпитер — планета-гигант, а Меркурий, Марс и Земля — каменистые планеты."
  },
  {
    "id": 19,
    "type": "odd_one_out",
    "prompt": "Что из этого лишнее?",
    "options": [
      "o-evropa",
      "o-ganimed",
      "o-kallisto",
      "o-luna"
    ],
    "correct": "o-luna",
    "explanation": "Европа, Ганимед и Каллисто — спутники Юпитера, а Луна — спутник Земли."
  },
  {
    "id": 20,
    "type": "odd_one_out",
    "prompt": "Что из этого лишнее?",
    "options": [
      "o-yupiter",
      "o-saturn",
      "o-uran",
      "o-mars"
    ],
    "correct": "o-mars",
    "explanation": "Марс — каменистая планета, а Юпитер, Сатурн и Уран — планеты-гиганты."
  },
  {
    "id": 21,
    "type": "sorting",
    "prompt": "Распредели планеты: слева — ближе к Солнцу, чем Земля; справа — дальше от Солнца, чем Земля.",
    "options": [
      "o-merkuriy",
      "o-venera",
      "o-mars",
      "o-yupiter"
    ],
    "categories": [
      {
        "id": "left",
        "label": "ближе к Солнцу, чем Земля"
      },
      {
        "id": "right",
        "label": "дальше от Солнца, чем Земля"
      }
    ],
    "assignments": {
      "o-merkuriy": "left",
      "o-venera": "left",
      "o-mars": "right",
      "o-yupiter": "right"
    },
    "explanation": "Планеты идут от Солнца так: Меркурий, Венера, Земля, Марс, Юпитер. Поэтому первые две ближе Земли, а Марс и Юпитер — дальше."
  },
  {
    "id": 22,
    "type": "sorting",
    "prompt": "Распредели: слева — планеты, справа — их спутники.",
    "options": [
      "o-zemlya",
      "o-luna",
      "o-yupiter",
      "o-evropa"
    ],
    "categories": [
      {
        "id": "left",
        "label": "Слева"
      },
      {
        "id": "right",
        "label": "Справа"
      }
    ],
    "assignments": {
      "o-zemlya": "left",
      "o-luna": "right",
      "o-yupiter": "left",
      "o-evropa": "right"
    },
    "explanation": "Земля и Юпитер — планеты. Луна вращается вокруг Земли, а Европа — вокруг Юпитера, поэтому они спутники."
  },
  {
    "id": 23,
    "type": "sorting",
    "prompt": "Распредели: слева — каменистые планеты, справа — планеты-гиганты.",
    "options": [
      "o-mars",
      "o-yupiter",
      "o-venera",
      "o-neptun"
    ],
    "categories": [
      {
        "id": "left",
        "label": "Слева"
      },
      {
        "id": "right",
        "label": "Справа"
      }
    ],
    "assignments": {
      "o-mars": "left",
      "o-yupiter": "right",
      "o-venera": "left",
      "o-neptun": "right"
    },
    "explanation": "Марс и Венера имеют твёрдую каменистую поверхность. Юпитер и Нептун — огромные планеты-гиганты."
  },
  {
    "id": 24,
    "type": "sorting",
    "prompt": "Распредели: слева — планеты с кольцами, справа — планеты без колец.",
    "options": [
      "o-saturn",
      "o-zemlya",
      "o-uran",
      "o-mars"
    ],
    "categories": [
      {
        "id": "left",
        "label": "Слева"
      },
      {
        "id": "right",
        "label": "Справа"
      }
    ],
    "assignments": {
      "o-saturn": "left",
      "o-zemlya": "right",
      "o-uran": "left",
      "o-mars": "right"
    },
    "explanation": "Кольца есть у всех четырёх планет-гигантов. Поэтому Сатурн и Уран — с кольцами, а Земля и Марс — без них."
  },
  {
    "id": 25,
    "type": "sorting",
    "prompt": "Распредели: слева — планеты, справа — спутники.",
    "options": [
      "o-mars",
      "o-luna",
      "o-venera",
      "o-titan"
    ],
    "categories": [
      {
        "id": "left",
        "label": "Слева"
      },
      {
        "id": "right",
        "label": "Справа"
      }
    ],
    "assignments": {
      "o-mars": "left",
      "o-luna": "right",
      "o-venera": "left",
      "o-titan": "right"
    },
    "explanation": "Марс и Венера — планеты. Луна — спутник Земли, а Титан — спутник Сатурна."
  },
  {
    "id": 26,
    "type": "sorting",
    "prompt": "Распредели планеты: слева — имеют спутники, справа — не имеют спутников.",
    "options": [
      "o-zemlya",
      "o-venera",
      "o-mars",
      "o-merkuriy"
    ],
    "categories": [
      {
        "id": "left",
        "label": "Слева"
      },
      {
        "id": "right",
        "label": "Справа"
      }
    ],
    "assignments": {
      "o-zemlya": "left",
      "o-venera": "right",
      "o-mars": "left",
      "o-merkuriy": "right"
    },
    "explanation": "У Земли есть Луна, а у Марса — Фобос и Деймос. У Меркурия и Венеры естественных спутников нет."
  },
  {
    "id": 27,
    "type": "sorting",
    "prompt": "Распредели: слева — больше Земли, справа — меньше Земли.",
    "options": [
      "o-yupiter",
      "o-mars",
      "o-saturn",
      "o-merkuriy"
    ],
    "categories": [
      {
        "id": "left",
        "label": "Слева"
      },
      {
        "id": "right",
        "label": "Справа"
      }
    ],
    "assignments": {
      "o-yupiter": "left",
      "o-mars": "right",
      "o-saturn": "left",
      "o-merkuriy": "right"
    },
    "explanation": "Юпитер и Сатурн намного больше Земли. Марс и Меркурий, наоборот, меньше неё."
  },
  {
    "id": 28,
    "type": "sorting",
    "prompt": "Распредели планеты: слева — ближе к Солнцу, чем Марс; справа — дальше от Солнца, чем Марс.",
    "options": [
      "o-zemlya",
      "o-venera",
      "o-yupiter",
      "o-neptun"
    ],
    "categories": [
      {
        "id": "left",
        "label": "ближе к Солнцу, чем Марс"
      },
      {
        "id": "right",
        "label": "дальше от Солнца, чем Марс"
      }
    ],
    "assignments": {
      "o-zemlya": "left",
      "o-venera": "left",
      "o-yupiter": "right",
      "o-neptun": "right"
    },
    "explanation": "Венера и Земля находятся ближе к Солнцу, чем Марс. Юпитер и Нептун расположены дальше Марса."
  },
  {
    "id": 29,
    "type": "sorting",
    "prompt": "Распредели: слева — газовые гиганты, справа — остальные.",
    "options": [
      "o-yupiter",
      "o-zemlya",
      "o-saturn",
      "o-mars"
    ],
    "categories": [
      {
        "id": "left",
        "label": "Слева"
      },
      {
        "id": "right",
        "label": "Справа"
      }
    ],
    "assignments": {
      "o-yupiter": "left",
      "o-zemlya": "right",
      "o-saturn": "left",
      "o-mars": "right"
    },
    "explanation": "Юпитер и Сатурн — газовые гиганты. Земля и Марс — каменистые планеты."
  },
  {
    "id": 30,
    "type": "sorting",
    "prompt": "Распредели: слева — звёзды, справа — не звёзды.",
    "options": [
      "o-solntse",
      "o-zemlya",
      "o-sirius",
      "o-luna"
    ],
    "categories": [
      {
        "id": "left",
        "label": "Слева"
      },
      {
        "id": "right",
        "label": "Справа"
      }
    ],
    "assignments": {
      "o-solntse": "left",
      "o-zemlya": "right",
      "o-luna": "right",
      "o-sirius": "left"
    },
    "explanation": "Солнце и Сириус — звёзды: они сами излучают свет. Земля — планета, а Луна — спутник."
  },
  {
    "id": 31,
    "type": "ranking",
    "prompt": "Расставь планеты по удалению от Солнца — от ближайшей к самой далёкой.",
    "options": [
      "o-merkuriy",
      "o-venera",
      "o-zemlya",
      "o-mars"
    ],
    "correct": "o-merkuriy,o-venera,o-zemlya,o-mars"
  },
  {
    "id": 32,
    "type": "ranking",
    "prompt": "Расставь планеты по размеру — от самой маленькой к самой большой.",
    "options": [
      "o-merkuriy",
      "o-zemlya",
      "o-neptun",
      "o-yupiter"
    ],
    "correct": "o-merkuriy,o-zemlya,o-neptun,o-yupiter"
  },
  {
    "id": 33,
    "type": "ranking",
    "prompt": "Расставь планеты от ближайшей к Солнцу к самой далёкой.",
    "options": [
      "o-mars",
      "o-saturn",
      "o-venera",
      "o-neptun"
    ],
    "correct": "o-venera,o-mars,o-saturn,o-neptun"
  },
  {
    "id": 34,
    "type": "ranking",
    "prompt": "Расставь планеты от самой маленькой к самой большой.",
    "options": [
      "o-mars",
      "o-merkuriy",
      "o-zemlya",
      "o-yupiter"
    ],
    "correct": "o-merkuriy,o-mars,o-zemlya,o-yupiter"
  },
  {
    "id": 35,
    "type": "ranking",
    "prompt": "Расставь планеты от ближайшей к Солнцу к самой далёкой.",
    "options": [
      "o-uran",
      "o-merkuriy",
      "o-yupiter",
      "o-zemlya"
    ],
    "correct": "o-merkuriy,o-zemlya,o-yupiter,o-uran"
  },
  {
    "id": 36,
    "type": "ranking",
    "prompt": "Расставь четыре планеты-гиганта от ближайшей к Солнцу к самой далёкой.",
    "options": [
      "o-neptun",
      "o-saturn",
      "o-yupiter",
      "o-uran"
    ],
    "correct": "o-yupiter,o-saturn,o-uran,o-neptun"
  },
  {
    "id": 37,
    "type": "ranking",
    "prompt": "Расставь каменистые планеты от ближайшей к Солнцу к самой далёкой.",
    "options": [
      "o-mars",
      "o-merkuriy",
      "o-venera",
      "o-zemlya"
    ],
    "correct": "o-merkuriy,o-venera,o-zemlya,o-mars"
  },
  {
    "id": 38,
    "type": "ranking",
    "prompt": "Расставь планеты от самой большой к самой маленькой.",
    "options": [
      "o-yupiter",
      "o-saturn",
      "o-uran",
      "o-neptun"
    ],
    "correct": "o-yupiter,o-saturn,o-uran,o-neptun"
  },
  {
    "id": 39,
    "type": "ranking",
    "prompt": "Расставь по размеру — от самого большого к самому маленькому.",
    "options": [
      "o-solntse",
      "o-yupiter",
      "o-zemlya",
      "o-luna"
    ],
    "correct": "o-solntse,o-yupiter,o-zemlya,o-luna"
  },
  {
    "id": 40,
    "type": "ranking",
    "prompt": "Расставь планеты по удалению от Солнца — от самой далёкой к ближайшей.",
    "options": [
      "o-neptun",
      "o-mars",
      "o-zemlya",
      "o-merkuriy"
    ],
    "correct": "o-neptun,o-mars,o-zemlya,o-merkuriy"
  },
  {
    "id": 41,
    "type": "true_false",
    "prompt": "В Солнечной системе восемь планет.",
    "correct": true
  },
  {
    "id": 42,
    "type": "true_false",
    "prompt": "Меркурий — самая горячая планета Солнечной системы.",
    "correct": false,
    "explanation": "Самая горячая планета — Венера: её плотная атмосфера удерживает тепло сильнее, чем Меркурий."
  },
  {
    "id": 43,
    "type": "true_false",
    "prompt": "Юпитер — самая большая планета Солнечной системы.",
    "correct": true
  },
  {
    "id": 44,
    "type": "true_false",
    "prompt": "У Венеры есть естественные спутники.",
    "correct": false,
    "explanation": "У Венеры нет естественных спутников."
  },
  {
    "id": 45,
    "type": "true_false",
    "prompt": "Луна вращается вокруг Земли.",
    "correct": true
  },
  {
    "id": 46,
    "type": "true_false",
    "prompt": "Сатурн — единственная планета с кольцами.",
    "correct": false,
    "explanation": "Кольца есть не только у Сатурна, но и у Юпитера, Урана и Нептуна."
  },
  {
    "id": 47,
    "type": "true_false",
    "prompt": "Плутон сейчас считается карликовой планетой.",
    "correct": true
  },
  {
    "id": 48,
    "type": "true_false",
    "prompt": "У Меркурия и Венеры нет естественных спутников.",
    "correct": true
  },
  {
    "id": 49,
    "type": "true_false",
    "prompt": "Нептун ближе к Солнцу, чем Уран.",
    "correct": false,
    "explanation": "Уран — седьмая планета от Солнца, а Нептун — восьмая, поэтому Нептун находится дальше."
  },
  {
    "id": 50,
    "type": "true_false",
    "prompt": "Земля — единственный мир в Солнечной системе, где нам достоверно известна жизнь.",
    "correct": true
  },
  {
    "id": 51,
    "type": "missing_item",
    "prompt": "Какой объект дополнит группу каменистых планет: Меркурий, Венера, Земля, ?",
    "sequence": [
      "o-merkuriy",
      "o-venera",
      "o-zemlya"
    ],
    "candidates": [
      "o-mars",
      "o-yupiter",
      "o-luna"
    ],
    "correct": "o-mars",
    "explanation": "Меркурий, Венера, Земля и Марс — четыре каменистые планеты Солнечной системы."
  },
  {
    "id": 52,
    "type": "missing_item",
    "prompt": "Что дополнит группу планет-гигантов: Юпитер, Сатурн, Уран, ?",
    "sequence": [
      "o-yupiter",
      "o-saturn",
      "o-uran"
    ],
    "candidates": [
      "o-neptun",
      "o-zemlya",
      "o-mars"
    ],
    "correct": "o-neptun",
    "explanation": "Юпитер, Сатурн, Уран и Нептун составляют группу четырёх планет-гигантов."
  },
  {
    "id": 53,
    "type": "missing_item",
    "prompt": "Что дополнит четвёрку больших спутников Юпитера: Ио, Европа, Ганимед, ?",
    "sequence": [
      "o-io",
      "o-evropa",
      "o-ganimed"
    ],
    "candidates": [
      "o-kallisto",
      "o-titan",
      "o-luna"
    ],
    "correct": "o-kallisto",
    "explanation": "Ио, Европа, Ганимед и Каллисто — четыре крупнейших спутника Юпитера, открытых Галилеем."
  },
  {
    "id": 54,
    "type": "missing_item",
    "prompt": "Что тоже относится к естественным спутникам: Луна, Фобос, Титан, ?",
    "sequence": [
      "o-luna",
      "o-fobos",
      "o-titan"
    ],
    "candidates": [
      "o-evropa",
      "o-venera",
      "o-tserera"
    ],
    "correct": "o-evropa",
    "explanation": "Европа — естественный спутник Юпитера. Венера является планетой, а Церера — карликовой планетой."
  },
  {
    "id": 55,
    "type": "missing_item",
    "prompt": "Что тоже относится к карликовым планетам: Плутон, Церера, Эрида, ?",
    "sequence": [
      "o-pluton",
      "o-tserera",
      "o-erida"
    ],
    "candidates": [
      "o-haumea",
      "o-zemlya",
      "o-mars"
    ],
    "correct": "o-haumea",
    "explanation": "Хаумеа, как Плутон, Церера и Эрида, относится к карликовым планетам."
  },
  {
    "id": 56,
    "type": "missing_item",
    "prompt": "Что дополнит группу каменистых планет: Меркурий, Венера, Марс, ?",
    "sequence": [
      "o-merkuriy",
      "o-venera",
      "o-mars"
    ],
    "candidates": [
      "o-zemlya",
      "o-saturn",
      "o-pluton"
    ],
    "correct": "o-zemlya",
    "explanation": "Земля дополняет четвёрку каменистых планет: Меркурий, Венера, Земля и Марс."
  },
  {
    "id": 57,
    "type": "missing_item",
    "prompt": "Что дополнит группу планет-гигантов: Юпитер, Сатурн, Нептун, ?",
    "sequence": [
      "o-yupiter",
      "o-saturn",
      "o-neptun"
    ],
    "candidates": [
      "o-uran",
      "o-venera",
      "o-zemlya"
    ],
    "correct": "o-uran",
    "explanation": "Уран дополняет группу планет-гигантов вместе с Юпитером, Сатурном и Нептуном."
  },
  {
    "id": 58,
    "type": "missing_item",
    "prompt": "Что дополнит четвёрку больших спутников Юпитера: Европа, Ганимед, Каллисто, ?",
    "sequence": [
      "o-evropa",
      "o-ganimed",
      "o-kallisto"
    ],
    "candidates": [
      "o-io",
      "o-titan",
      "o-luna"
    ],
    "correct": "o-io",
    "explanation": "Ио дополняет четвёрку крупнейших спутников Юпитера: Ио, Европа, Ганимед и Каллисто."
  },
  {
    "id": 59,
    "type": "missing_item",
    "prompt": "Что тоже относится к телам со спутниками: Земля, Марс, Юпитер, ?",
    "sequence": [
      "o-zemlya",
      "o-mars",
      "o-yupiter"
    ],
    "candidates": [
      "o-saturn",
      "o-venera",
      "o-merkuriy"
    ],
    "correct": "o-saturn",
    "explanation": "У Сатурна есть множество спутников. У Венеры и Меркурия естественных спутников нет."
  },
  {
    "id": 60,
    "type": "missing_item",
    "prompt": "Что тоже относится к планетам с кольцами: Сатурн, Уран, Нептун, ?",
    "sequence": [
      "o-saturn",
      "o-uran",
      "o-neptun"
    ],
    "candidates": [
      "o-yupiter",
      "o-zemlya",
      "o-mars"
    ],
    "correct": "o-yupiter",
    "explanation": "Кольца есть у всех четырёх планет-гигантов — Юпитера, Сатурна, Урана и Нептуна."
  },
  {
    "id": 61,
    "type": "multiple_choice",
    "prompt": "Кто стал первым человеком в космосе?",
    "options": [
      "o-yuriy-gagarin",
      "o-nil-armstrong",
      "o-valentina-tereshkova",
      "o-aleksey-leonov"
    ],
    "correct": "o-yuriy-gagarin",
    "explanation": "Юрий Гагарин первым из людей полетел в космос 12 апреля 1961 года на корабле «Восток-1»."
  },
  {
    "id": 62,
    "type": "multiple_choice",
    "prompt": "С какого космодрома стартовал Юрий Гагарин на корабле «Восток-1»?",
    "options": [
      "o-baykonur",
      "o-vostochnyy",
      "o-plesetsk",
      "o-kapustin-yar"
    ],
    "correct": "o-baykonur",
    "explanation": "Корабль «Восток-1» с Юрием Гагариным стартовал с космодрома Байконур."
  },
  {
    "id": 63,
    "type": "multiple_choice",
    "prompt": "На каком космическом корабле Валентина Терешкова стала первой женщиной в космосе?",
    "options": [
      "o-vostok-6",
      "o-vostok-1",
      "o-voshod-2",
      "o-soyuz"
    ],
    "correct": "o-vostok-6",
    "explanation": "Валентина Терешкова совершила свой космический полёт в июне 1963 года на корабле «Восток-6»."
  },
  {
    "id": 64,
    "type": "odd_one_out",
    "prompt": "Что из этого лишнее?",
    "options": [
      "o-yuriy-gagarin",
      "o-valentina-tereshkova",
      "o-aleksey-leonov",
      "o-baykonur"
    ],
    "correct": "o-baykonur",
    "explanation": "Юрий Гагарин, Валентина Терешкова и Алексей Леонов — космонавты. Байконур — космодром, то есть место запуска ракет."
  },
  {
    "id": 65,
    "type": "odd_one_out",
    "prompt": "Что из этого лишнее?",
    "options": [
      "o-vostok-1",
      "o-vostok-6",
      "o-voshod-2",
      "o-yuriy-gagarin"
    ],
    "correct": "o-yuriy-gagarin",
    "explanation": "«Восток-1», «Восток-6» и «Восход-2» — космические корабли. Юрий Гагарин — человек и космонавт."
  },
  {
    "id": 66,
    "type": "odd_one_out",
    "prompt": "Что из этого лишнее?",
    "options": [
      "o-baykonur",
      "o-vostochnyy",
      "o-plesetsk",
      "o-soyuz"
    ],
    "correct": "o-soyuz",
    "explanation": "Байконур, Восточный и Плесецк — космодромы. «Союз» — семейство космических кораблей."
  },
  {
    "id": 67,
    "type": "sorting",
    "prompt": "Распредели: слева — космонавты, справа — космические корабли.",
    "options": [
      "o-yuriy-gagarin",
      "o-valentina-tereshkova",
      "o-vostok-1",
      "o-vostok-6"
    ],
    "categories": [
      {
        "id": "left",
        "label": "Слева"
      },
      {
        "id": "right",
        "label": "Справа"
      }
    ],
    "assignments": {
      "o-yuriy-gagarin": "left",
      "o-valentina-tereshkova": "left",
      "o-vostok-1": "right",
      "o-vostok-6": "right"
    },
    "explanation": "Юрий Гагарин и Валентина Терешкова — люди-космонавты. «Восток-1» и «Восток-6» — корабли, на которых летали в космос."
  },
  {
    "id": 68,
    "type": "sorting",
    "prompt": "Распредели: слева — космодромы, справа — космические корабли.",
    "options": [
      "o-baykonur",
      "o-vostochnyy",
      "o-soyuz",
      "o-buran"
    ],
    "categories": [
      {
        "id": "left",
        "label": "Слева"
      },
      {
        "id": "right",
        "label": "Справа"
      }
    ],
    "assignments": {
      "o-baykonur": "left",
      "o-vostochnyy": "left",
      "o-soyuz": "right",
      "o-buran": "right"
    },
    "explanation": "Байконур и Восточный — места запуска ракет. «Союз» и «Буран» — космические корабли."
  },
  {
    "id": 69,
    "type": "sorting",
    "prompt": "Распредели: слева — советские, справа — американские.",
    "options": [
      "o-yuriy-gagarin",
      "o-vostok-1",
      "o-nil-armstrong",
      "o-apollon-11"
    ],
    "categories": [
      {
        "id": "left",
        "label": "Слева"
      },
      {
        "id": "right",
        "label": "Справа"
      }
    ],
    "assignments": {
      "o-yuriy-gagarin": "left",
      "o-vostok-1": "left",
      "o-nil-armstrong": "right",
      "o-apollon-11": "right"
    },
    "explanation": "Юрий Гагарин и «Восток-1» относятся к советской космонавтике. Нил Армстронг и «Аполлон-11» — к американской."
  },
  {
    "id": 70,
    "type": "ranking",
    "prompt": "Расставь космические корабли по времени запуска — от самого раннего к самому позднему.",
    "options": [
      "o-vostok-1",
      "o-vostok-6",
      "o-voshod-2",
      "o-apollon-11"
    ],
    "correct": "o-vostok-1,o-vostok-6,o-voshod-2,o-apollon-11"
  },
  {
    "id": 71,
    "type": "ranking",
    "prompt": "Расставь космические корабли по времени их исторических полётов — от самого раннего к самому позднему.",
    "options": [
      "o-vostok-6",
      "o-voshod-2",
      "o-apollon-11",
      "o-buran"
    ],
    "correct": "o-vostok-6,o-voshod-2,o-apollon-11,o-buran"
  },
  {
    "id": 72,
    "type": "ranking",
    "prompt": "Расставь людей по времени их знаменитых первых достижений в космосе — от самого раннего к самому позднему.",
    "options": [
      "o-yuriy-gagarin",
      "o-valentina-tereshkova",
      "o-aleksey-leonov",
      "o-nil-armstrong"
    ],
    "correct": "o-yuriy-gagarin,o-valentina-tereshkova,o-aleksey-leonov,o-nil-armstrong"
  },
  {
    "id": 73,
    "type": "true_false",
    "prompt": "Юрий Гагарин стартовал в космос с Байконура.",
    "correct": true
  },
  {
    "id": 74,
    "type": "true_false",
    "prompt": "Валентина Терешкова стала первой женщиной в космосе.",
    "correct": true
  },
  {
    "id": 75,
    "type": "true_false",
    "prompt": "Во время единственного орбитального полёта «Бурана» на борту находился экипаж.",
    "correct": false,
    "explanation": "Единственный орбитальный полёт «Бурана» прошёл полностью автоматически, без экипажа."
  },
  {
    "id": 76,
    "type": "missing_item",
    "prompt": "Кто дополнит группу людей, совершивших знаменитые первые достижения в космосе: Юрий Гагарин, Валентина Терешкова, Алексей Леонов, ?",
    "sequence": [
      "o-yuriy-gagarin",
      "o-valentina-tereshkova",
      "o-aleksey-leonov"
    ],
    "candidates": [
      "o-nil-armstrong",
      "o-aleksandr-pushkin",
      "o-petr-chaykovskiy"
    ],
    "correct": "o-nil-armstrong",
    "explanation": "Нил Армстронг первым ступил на Луну. Он дополняет группу людей, совершивших знаменитые первые достижения в космосе."
  },
  {
    "id": 77,
    "type": "missing_item",
    "prompt": "Что тоже относится к пилотируемым космическим кораблям: Восток-1, Восток-6, Восход-2, ?",
    "sequence": [
      "o-vostok-1",
      "o-vostok-6",
      "o-voshod-2"
    ],
    "candidates": [
      "o-soyuz",
      "o-sputnik-1",
      "o-habbl"
    ],
    "correct": "o-soyuz",
    "explanation": "«Союз» — пилотируемый космический корабль. «Спутник-1» был автоматическим спутником, а «Хаббл» — космический телескоп."
  },
  {
    "id": 78,
    "type": "missing_item",
    "prompt": "Что дополнит группу космодромов: Байконур, Плесецк, Восточный, ?",
    "sequence": [
      "o-baykonur",
      "o-plesetsk",
      "o-vostochnyy"
    ],
    "candidates": [
      "o-kapustin-yar",
      "o-buran",
      "o-soyuz"
    ],
    "correct": "o-kapustin-yar",
    "explanation": "Капустин Яр — космодром, как Байконур, Плесецк и Восточный. «Буран» и «Союз» — космические корабли."
  }
]
