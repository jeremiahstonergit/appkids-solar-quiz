import { useEffect, useMemo, useState } from 'react'
import type { Answer, Question } from '../types/quiz'
import { createInitialAnswer, isAnswerCorrect } from '../utils/quiz'
import { preloadQuestionAssets } from '../utils/preload'
import { QuestionRenderer } from './QuestionRenderer'

const mechanicLabels: Record<Question['type'], string> = {
  multiple_choice: 'Выбери ответ',
  odd_one_out: 'Найди лишнее',
  missing_item: 'Продолжи ряд',
  sorting: 'Разложи по группам',
  ranking: 'Выстрой порядок',
  true_false: 'Правда или ложь',
}

type QuizSessionProps = {
  questions: Question[]
  initialIndex?: number
  headerLabel: (question: Question, index: number) => string
  onHome: () => void
  onFinish: (score: number) => void
  onQuestionChange?: (question: Question) => void
}

const isInteractiveQuestion = (question: Question) =>
  question.type === 'sorting' || question.type === 'ranking' || question.type === 'missing_item'

export function QuizSession({ questions, initialIndex = 0, headerLabel, onHome, onFinish, onQuestionChange }: QuizSessionProps) {
  const [index, setIndex] = useState(initialIndex)
  const [answer, setAnswer] = useState<Answer | undefined>(undefined)
  const [checked, setChecked] = useState(false)
  const [score, setScore] = useState(0)
  const question = questions[index]
  const initialAnswer = useMemo(() => question ? createInitialAnswer(question) : undefined, [question])
  const currentAnswer = answer ?? initialAnswer

  useEffect(() => {
    if (!question) return
    preloadQuestionAssets(questions.slice(index, index + 3))
    onQuestionChange?.(question)
  }, [index, onQuestionChange, question, questions])

  if (!question) return null

  const correct = isAnswerCorrect(question, currentAnswer)
  const canCheck = currentAnswer !== undefined
  const submit = () => {
    if (!canCheck) return
    setChecked(true)
    if (correct) setScore(value => value + 1)
  }
  const completeInteractive = (right: boolean) => {
    if (checked) return
    setChecked(true)
    if (right) setScore(value => value + 1)
  }
  const next = () => {
    if (index === questions.length - 1) {
      onFinish(score)
      return
    }
    setIndex(value => value + 1)
    setAnswer(undefined)
    setChecked(false)
  }

  return <main className="screen quiz"><div className="quiz-shell">
    <header>
      <button className="home" aria-label="На главную" onClick={onHome}>⌂</button>
      <div className="progress-wrap">
        <div className="progress-meta"><span>{headerLabel(question, index)}</span><b>{index + 1} из {questions.length}</b></div>
        <div className="progress"><i style={{ width: `${(index + 1) / questions.length * 100}%` }}/></div>
      </div>
    </header>
    <section className="question-card">
      <span className="mechanic">{mechanicLabels[question.type]}</span>
      <h2>{question.prompt}</h2>
      <QuestionRenderer key={question.id} question={question} answer={currentAnswer} checked={checked} onChange={setAnswer} onComplete={completeInteractive}/>
      {checked && <div className={`feedback ${correct ? 'success' : 'error'}`}><b>{correct ? 'Верно!' : 'Разберёмся!'}</b>{question.explanation && <span>{question.explanation}</span>}</div>}
      {(checked || !isInteractiveQuestion(question)) && <button className="primary action" disabled={!checked && !canCheck} onClick={checked ? next : submit}>{checked ? index === questions.length - 1 ? 'Узнать результат' : 'Дальше →' : 'Проверить'}</button>}
    </section>
  </div></main>
}
