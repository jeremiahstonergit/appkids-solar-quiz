import { type DragEvent, useMemo } from 'react'
import type { MissingItemQuestion as MissingItemQuestionData } from '../../types/quiz'
import { shuffle } from '../../utils/shuffle'
import { ObjectCard } from '../ObjectCard'

type MissingItemQuestionProps = {
  question: MissingItemQuestionData
  value?: string
  checked: boolean
  onChange: (value: string) => void
  onComplete: (right: boolean) => void
}

export function MissingItemQuestion({ question, value, checked, onChange, onComplete }: MissingItemQuestionProps) {
  const candidates = useMemo(() => shuffle(question.candidates), [question])
  const place = (id: string) => {
    if (checked || !question.candidates.includes(id)) return
    onChange(id)
    onComplete(id === question.correct)
  }
  const drop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.currentTarget.classList.remove('drag-over')
    place(event.dataTransfer.getData('text/plain'))
  }

  return <div className="missing-game">
    <p className="hint">Перетащи подходящий объект в пустое место.</p>
    <div className="sequence">
      {question.sequence.map(id => <ObjectCard key={id} id={id} compact/>)}
      <div
        data-drop-id="missing"
        className={`missing-slot ${value ? 'filled' : ''} ${checked ? value === question.correct ? 'right' : 'wrong' : ''}`}
        onDragOver={event => { event.preventDefault(); event.currentTarget.classList.add('drag-over') }}
        onDragLeave={event => event.currentTarget.classList.remove('drag-over')}
        onDrop={drop}
      >
        {value ? <ObjectCard id={value} compact state={value === question.correct ? 'right' : 'wrong'}/> : <><b>?</b><small>Перетащи сюда</small></>}
      </div>
    </div>
    <div className="choice-grid three missing-candidates">{candidates.map(id => <ObjectCard
      key={id}
      id={id}
      draggable={!checked}
      onDragStart={event => { event.dataTransfer.setData('text/plain', id); event.dataTransfer.effectAllowed = 'move' }}
      onPointerDrop={dropId => { if (dropId === 'missing') place(id) }}
      selected={value === id}
      state={checked ? id === question.correct ? 'right' : value === id ? 'wrong' : undefined : undefined}
      onClick={checked ? undefined : () => place(id)}
    />)}</div>
  </div>
}
