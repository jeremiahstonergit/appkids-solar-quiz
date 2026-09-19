import { voice } from '../audio/player'
import { questionClip, feedbackClips, objectClip } from '../audio/clips'
import { ReplayVoice } from '../audio/AudioControls'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { Answer, Question } from '../types/quiz'
import { questionDifficulty } from '../data/difficulty'
import { createInitialAnswer, isAnswerCorrect, optionIds } from '../utils/quiz'
import { preloadQuestionAssets } from '../utils/preload'
import { shuffle } from '../utils/shuffle'
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
  const [spokenOptionId, setSpokenOptionId] = useState<string | undefined>(undefined)
  const [sortingRound, setSortingRound] = useState<{ questionId: number; index: number; visible: boolean }>()
  const question = questions[index]
  const initialAnswer = useMemo(() => question ? createInitialAnswer(question) : undefined, [question])
  const optionOrder = useMemo(() => question ? shuffle(optionIds(question)) : [], [question])
  const currentAnswer = answer ?? initialAnswer
  const sortingIndex = sortingRound?.questionId === question?.id ? sortingRound?.index ?? 0 : 0
  const sortingVisible = sortingRound?.questionId === question?.id ? sortingRound?.visible ?? true : true
  const onSortingActiveChange = useCallback((index: number, visible: boolean) => {
    if (!question) return
    setSortingRound(previous => previous?.questionId === question.id && previous.index === index && previous.visible === visible
      ? previous : { questionId: question.id, index, visible })
  }, [question])
  const rankingAnswer = question?.type === 'ranking' && Array.isArray(currentAnswer) ? currentAnswer : undefined

  useEffect(() => {
    if (!question) return
    preloadQuestionAssets(questions.slice(index, index + 3))
    onQuestionChange?.(question)
  }, [index, onQuestionChange, question, questions])

  const correct = question ? isAnswerCorrect(question, currentAnswer) : false
  const feedbackCorrect = checked && correct
  useEffect(() => {
    if (!question) return
    const visibleOptions = question.type === 'sorting'
      ? sortingVisible ? optionOrder.slice(sortingIndex, sortingIndex + 1) : []
      : optionOrder.filter(id => !rankingAnswer?.includes(id))
    const spokenOptions = !checked && questionDifficulty[question.id] === 1 ? visibleOptions : []
    const clips = checked ? feedbackClips(question, feedbackCorrect) : [questionClip(question.id), ...spokenOptions.map(objectClip)]
    const laterSortingObject = question.type === 'sorting' && sortingIndex > 0
    const autoplay = checked || (question.type === 'sorting'
      ? sortingVisible && (!laterSortingObject || spokenOptions.length > 0)
      : !rankingAnswer?.some(Boolean))
    return voice.setContext(clips, autoplay,
      clipIndex => setSpokenOptionId(clipIndex === null || clipIndex === 0 ? undefined : spokenOptions[clipIndex - 1]),
      !checked && laterSortingObject ? 1 : 0)
  }, [question, checked, feedbackCorrect, optionOrder, sortingIndex, sortingVisible, rankingAnswer])

  if (!question) return null

  const canCheck = currentAnswer !== undefined
  const submit = () => {
    if (checked || !canCheck) return
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
      <ReplayVoice label={checked ? "Повторить ответ" : "Повторить вопрос"}/>
      <QuestionRenderer key={question.id} question={question} answer={currentAnswer} checked={checked} optionOrder={optionOrder} spokenOptionId={spokenOptionId} onInteract={voice.stop} onSortingActiveChange={onSortingActiveChange} onChange={setAnswer} onComplete={completeInteractive}/>
      {checked && <div className={`feedback ${correct ? 'success' : 'error'}`}><b>{correct ? 'Верно!' : 'Разберёмся!'}</b>{question.explanation && <span>{question.explanation}</span>}{!correct && question.type === 'true_false' && <span>Верный ответ: {question.correct ? 'правда' : 'ложь'}.</span>}</div>}
      {(checked || !isInteractiveQuestion(question)) && <button className="primary action" disabled={!checked && !canCheck} onClick={checked ? next : submit}>{checked ? index === questions.length - 1 ? 'Узнать результат' : 'Дальше →' : 'Проверить'}</button>}
    </section>
  </div></main>
}
