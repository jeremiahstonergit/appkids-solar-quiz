import { useEffect, useState } from 'react'
import { QuizSession } from './components/QuizSession'
import { asset } from './constants/assets'
import { createQuiz, difficultyMeta } from './data/difficulty'
import type { Difficulty, Question } from './types/quiz'
import { preloadGameShellAssets, preloadQuestionAssets, preloadStartupAssets } from './utils/preload'

export default function App() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | undefined>(undefined)
  const [sessionQuestions, setSessionQuestions] = useState<Question[]>([])
  const [screen, setScreen] = useState<'start' | 'quiz' | 'finish'>('start')
  const [score, setScore] = useState(0)

  useEffect(preloadStartupAssets, [])

  const startQuiz = (difficulty = selectedDifficulty) => {
    if (!difficulty) return
    const nextQuestions = createQuiz(difficulty)
    setSelectedDifficulty(difficulty)
    setSessionQuestions(nextQuestions)
    preloadGameShellAssets()
    preloadQuestionAssets(nextQuestions)
    setScore(0)
    setScreen('quiz')
  }

  if (screen === 'start') return <main className="screen start"><div className="start-content">
    <p className="eyebrow">Космическая викторина</p>
    <h1>Солнечная<br/>система</h1>
    <p className="subtitle">Выбери уровень сложности</p>
    <div className="difficulty-grid">{([1, 2, 3] as Difficulty[]).map(level => {
      const meta = difficultyMeta[level]
      return <button key={level} className={`difficulty-card level-${level} ${selectedDifficulty === level ? 'selected' : ''}`} onClick={() => setSelectedDifficulty(level)}><b>{meta.label}</b><span>{meta.age}</span><small>{meta.description}</small></button>
    })}</div>
    <img className="hero difficulty-hero" src={asset('heroes', 'hero_start_solar_system.png')} alt="Космический герой"/>
    <button className="primary" disabled={!selectedDifficulty} onClick={() => startQuiz()}>Начать <span>→</span></button>
    <p className="session-note">12 вопросов · по 2 задания каждого типа</p>
  </div></main>

  if (screen === 'finish') return <main className="screen finish"><div className="finish-card">
    <img src={asset('heroes', 'hero_finish_success.png')} alt="Победа"/>
    <p className="eyebrow">Миссия выполнена!</p>
    <h1>{score} из {sessionQuestions.length}</h1>
    <p>{selectedDifficulty && `${difficultyMeta[selectedDifficulty].label} · ${difficultyMeta[selectedDifficulty].age}`}</p>
    <p>{score >= 10 ? 'Ты настоящий знаток космоса!' : score >= 7 ? 'Отличный полёт!' : 'Хорошее начало, исследователь!'}</p>
    <button className="primary" onClick={() => startQuiz()}>Пройти ещё раз ↻</button>
    <button className="secondary" onClick={() => setScreen('start')}>Выбрать другой уровень</button>
  </div></main>

  return <QuizSession
    key={sessionQuestions.map(question => question.id).join('-')}
    questions={sessionQuestions}
    headerLabel={(_, index) => `Вопрос ${index + 1}${selectedDifficulty ? ` · ${difficultyMeta[selectedDifficulty].label}` : ''}`}
    onHome={() => setScreen('start')}
    onFinish={value => { setScore(value); setScreen('finish') }}
  />
}
