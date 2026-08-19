import { type DragEvent, useEffect, useMemo, useState } from 'react'
import type { RankingQuestion as RankingQuestionData } from '../../types/quiz'
import { shuffle } from '../../utils/shuffle'
import { ObjectCard } from '../ObjectCard'

type RankingQuestionProps = {
  question: RankingQuestionData
  value: string[]
  checked: boolean
  onChange: (value: string[]) => void
  onComplete: (right: boolean) => void
}

export function RankingQuestion({ question, value, checked, onChange, onComplete }: RankingQuestionProps) {
  const options = useMemo(() => shuffle(question.options), [question])
  const [selected, setSelected] = useState<string | undefined>(undefined)
  const [errorSlot, setErrorSlot] = useState<number | undefined>(undefined)
  const [message, setMessage] = useState<'right' | 'wrong' | undefined>(undefined)
  const correct = question.correct.split(',')

  useEffect(() => {
    setSelected(undefined)
    setErrorSlot(undefined)
    setMessage(undefined)
  }, [question.id])

  const place = (id: string, target: number) => {
    if (checked || value[target] || !question.options.includes(id)) return
    if (correct[target] !== id) {
      setErrorSlot(target)
      setMessage('wrong')
      setTimeout(() => { setErrorSlot(undefined); setMessage(undefined) }, 700)
      return
    }
    const next = [...value]
    next[target] = id
    onChange(next)
    setSelected(undefined)
    setMessage('right')
    // Ranking intentionally lets a child retry until every object is in place.
    if (next.every(Boolean)) onComplete(true)
    else setTimeout(() => setMessage(undefined), 650)
  }

  const nativeDrop = (event: DragEvent<HTMLDivElement>, index: number) => {
    event.preventDefault()
    place(event.dataTransfer.getData('text/plain'), index)
  }
  const available = options.filter(id => !value.includes(id))

  return <div className="ranking-game">
    <p className="hint">Выбери объект и поставь в нужное место. Верные позиции закрепляются.</p>
    <div className="rank-slots-line">{correct.map((_, index) => <div
      key={index}
      data-drop-id={`rank-${index}`}
      className={`rank-slot ${value[index] ? 'right locked' : ''} ${errorSlot === index ? 'wrong shake' : ''}`}
      onClick={() => selected && place(selected, index)}
      onDragOver={event => { event.preventDefault(); event.currentTarget.classList.add('drag-over') }}
      onDragLeave={event => event.currentTarget.classList.remove('drag-over')}
      onDrop={event => { event.currentTarget.classList.remove('drag-over'); nativeDrop(event, index) }}
    ><b>{index + 1}</b>{value[index] ? <ObjectCard id={value[index]} compact state="right"/> : <span className="empty-rank">Перетащи сюда</span>}</div>)}</div>
    <div className="rank-pool">{available.map(id => <ObjectCard
      key={id}
      id={id}
      compact
      draggable={!checked}
      selected={selected === id}
      onClick={() => setSelected(current => current === id ? undefined : id)}
      onDragStart={event => { event.dataTransfer.setData('text/plain', id); event.dataTransfer.effectAllowed = 'move' }}
      onPointerDrop={dropId => { if (dropId.startsWith('rank-')) place(id, Number(dropId.slice(5))) }}
    />)}</div>
    {message && <div className={`instant-feedback ${message === 'right' ? 'success' : 'error'}`}>{message === 'right' ? '✓ На своём месте!' : '× Попробуй другое место'}</div>}
  </div>
}
