import { type DragEvent, useEffect, useMemo, useRef, useState } from 'react'
import { sortingCategories } from '../../data/difficulty'
import type { SortingCategory, SortingQuestion as SortingQuestionData } from '../../types/quiz'
import { resolveOptionOrder } from '../../utils/quiz'
import { ObjectCard } from '../ObjectCard'

type SortingQuestionProps = {
  question: SortingQuestionData
  optionOrder?: string[]
  value: Record<string, string>
  checked: boolean
  onChange: (value: Record<string, string>) => void
  onComplete: (right: boolean) => void
  spokenOptionId?: string
  onActiveChange?: (index: number, visible: boolean) => void
  onInteract?: () => void
}

export function SortingQuestion({ question, optionOrder, value, checked, spokenOptionId, onActiveChange, onInteract, onChange, onComplete }: SortingQuestionProps) {
  const options = useMemo(() => resolveOptionOrder(question.options, optionOrder), [question, optionOrder])
  const [active, setActive] = useState(0)
  const [feedback, setFeedback] = useState<boolean | undefined>(undefined)
  const [chosen, setChosen] = useState<string | undefined>(undefined)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const categories = sortingCategories[question.id] ?? question.categories

  useEffect(() => {
    setActive(0)
    setFeedback(undefined)
    setChosen(undefined)
    return () => { if (timer.current) clearTimeout(timer.current) }
  }, [question.id])

  const id = options[active]
  useEffect(() => {
    onActiveChange?.(active, feedback === undefined && !checked)
  }, [active, feedback, checked, onActiveChange])

  const place = (category: string) => {
    if (!id || checked || feedback !== undefined || !categories.some(item => item.id === category)) return
    onInteract?.()
    const next = { ...value, [id]: category }
    const right = question.assignments[id] === category
    onChange(next)
    setChosen(category)
    setFeedback(right)
    timer.current = setTimeout(() => {
      if (active === options.length - 1) onComplete(options.every(item => next[item] === question.assignments[item]))
      else {
        setActive(index => index + 1)
        setFeedback(undefined)
        setChosen(undefined)
      }
    }, 650)
  }

  const nativeDrop = (event: DragEvent<HTMLElement>, category: string) => {
    event.preventDefault()
    place(category)
  }
  const zone = (category: SortingCategory, index: number) => <section
    key={category.id}
    data-drop-id={category.id}
    className={`sort-zone side-zone ${chosen === category.id ? feedback ? 'right' : 'wrong' : ''}`}
    onClick={() => place(category.id)}
    onDragOver={event => { event.preventDefault(); event.currentTarget.classList.add('drag-over') }}
    onDragLeave={event => event.currentTarget.classList.remove('drag-over')}
    onDrop={event => { event.currentTarget.classList.remove('drag-over'); nativeDrop(event, category.id) }}
  ><span className="zone-arrow">{index === 0 ? '←' : '→'}</span><h3>{category.label}</h3></section>

  return <div className="sorting-round">
    <div className="round-progress"><b>{active + 1}</b><span>из {options.length}</span><i style={{ width: `${(active + 1) / options.length * 100}%` }}/></div>
    <p className="hint">Перетащи объект влево или вправо. Можно просто нажать на нужную область.</p>
    <div className="sorting-stage">
      {zone(categories[0], 0)}
      <div className={`sort-current ${feedback !== undefined ? 'sort-object-gone' : ''}`}>
        {id && feedback === undefined && <ObjectCard
          key={id}
          id={id}
          spoken={spokenOptionId === id}
          onInteract={onInteract}
          draggable={!checked}
          onDragStart={event => { event.dataTransfer.setData('text/plain', id); event.dataTransfer.effectAllowed = 'move' }}
          onPointerDrop={place}
        />}
      </div>
      {zone(categories[1], 1)}
    </div>
  </div>
}
