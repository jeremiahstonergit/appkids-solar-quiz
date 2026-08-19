import { useEffect, useState } from 'react'
import { QuizSession } from './components/QuizSession'
import { asset } from './constants/assets'
import { difficultyMeta, questionDifficulty } from './data/difficulty'
import { questions } from './data/questions'
import type { Question } from './types/quiz'
import { preloadGameShellAssets, preloadQuestionAssets, preloadStartupAssets } from './utils/preload'

const debugQuestions = [...questions].sort((left, right) => left.id - right.id)

const questionIndexFromUrl = () => {
  const id = Number(new URLSearchParams(window.location.search).get('id'))
  return Number.isInteger(id) ? debugQuestions.findIndex(question => question.id === id) : -1
}

const replaceQuestionInUrl = (id?: number) => {
  const url = new URL(window.location.href)
  if (id === undefined) url.searchParams.delete('id')
  else url.searchParams.set('id', String(id))
  window.history.replaceState(null, '', url)
}

const syncQuestionUrl = (question: Question) => replaceQuestionInUrl(question.id)

export default function App() {
  const [initialQuestionIndex] = useState(questionIndexFromUrl)
  const [sessionStartIndex, setSessionStartIndex] = useState(Math.max(initialQuestionIndex, 0))
  const [screen, setScreen] = useState<'start' | 'quiz' | 'finish'>(initialQuestionIndex >= 0 ? 'quiz' : 'start')
  const [score, setScore] = useState(0)

  useEffect(preloadStartupAssets, [])
  useEffect(() => {
    if (initialQuestionIndex < 0) return
    preloadGameShellAssets()
    preloadQuestionAssets(debugQuestions.slice(initialQuestionIndex, initialQuestionIndex + 3))
  }, [initialQuestionIndex])

  const startQuiz = (questionIndex = 0) => {
    setSessionStartIndex(questionIndex)
    preloadGameShellAssets()
    preloadQuestionAssets(debugQuestions.slice(questionIndex, questionIndex + 3))
    setScore(0)
    setScreen('quiz')
  }

  const goHome = () => {
    replaceQuestionInUrl()
    setScreen('start')
  }

  if (screen === 'start') return <main className="screen start"><div className="start-content">
    <p className="eyebrow">Режим отладки</p>
    <h1>Проверка<br/>вопросов</h1>
    <p className="subtitle">Все вопросы по порядку, без случайной выборки</p>
    <img className="hero difficulty-hero" src={asset('heroes', 'hero_start_solar_system.png')} alt="Космический герой"/>
    <button className="primary" onClick={() => startQuiz()}>Начать проверку <span>→</span></button>
    <p className="session-note">{questions.length} вопросов · по возрастанию ID · все уровни сложности</p>
  </div></main>

  if (screen === 'finish') return <main className="screen finish"><div className="finish-card">
    <img src={asset('heroes', 'hero_finish_success.png')} alt="Победа"/>
    <p className="eyebrow">Проверка завершена</p>
    <h1>{score} из {debugQuestions.length}</h1>
    <p>Все вопросы пройдены по порядку.</p>
    <button className="primary" onClick={() => startQuiz()}>Проверить ещё раз ↻</button>
    <button className="secondary" onClick={goHome}>На стартовый экран</button>
  </div></main>

  return <QuizSession
    key={sessionStartIndex}
    questions={debugQuestions}
    initialIndex={sessionStartIndex}
    headerLabel={question => `ID ${question.id} · ${difficultyMeta[questionDifficulty[question.id]].label} · ${difficultyMeta[questionDifficulty[question.id]].age}`}
    onHome={goHome}
    onFinish={value => { setScore(value); replaceQuestionInUrl(); setScreen('finish') }}
    onQuestionChange={syncQuestionUrl}
  />
}
