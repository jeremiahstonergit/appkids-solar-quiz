import { type DragEvent, type PointerEvent as ReactPointerEvent, useEffect, useRef, useState } from 'react'
import { asset } from '../constants/assets'
import { objects } from '../data/objects'

type CardState = 'right' | 'wrong'

type ObjectCardProps = {
  id: string
  selected?: boolean
  state?: CardState
  onClick?: () => void
  compact?: boolean
  draggable?: boolean
  onDragStart?: (event: DragEvent<HTMLButtonElement>) => void
  onPointerDrop?: (dropId: string) => void
}

export function ObjectCard({ id, selected, state, onClick, compact = false, draggable = false, onDragStart, onPointerDrop }: ObjectCardProps) {
  const item = objects[id] ?? { id, label: id, tone: 0 }
  const imageFile = item.file
  const numeric = !imageFile && /^\d+$/.test(item.label)
  const [imageState, setImageState] = useState<'loading' | 'ready' | 'fallback' | 'error'>(imageFile ? 'loading' : 'fallback')
  const [touchOffset, setTouchOffset] = useState<{ x: number; y: number } | undefined>(undefined)
  const pointerStart = useRef<{ x: number; y: number } | undefined>(undefined)
  const didMove = useRef(false)
  const activeTarget = useRef<HTMLElement | undefined>(undefined)

  useEffect(() => setImageState(imageFile ? 'loading' : 'fallback'), [id, imageFile])

  const clearTarget = () => {
    activeTarget.current?.classList.remove('drag-over')
    activeTarget.current = undefined
  }

  const pointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!draggable || event.pointerType === 'mouse') return
    pointerStart.current = { x: event.clientX, y: event.clientY }
    didMove.current = false
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  const pointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!pointerStart.current) return
    const x = event.clientX - pointerStart.current.x
    const y = event.clientY - pointerStart.current.y
    if (Math.hypot(x, y) > 7) didMove.current = true
    if (!didMove.current) return
    event.preventDefault()
    setTouchOffset({ x, y })
    const target = document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-drop-id]')
    if (target !== activeTarget.current) {
      clearTarget()
      target?.classList.add('drag-over')
      activeTarget.current = target ?? undefined
    }
  }

  const pointerUp = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (!pointerStart.current) return
    if (didMove.current) {
      const target = activeTarget.current ?? document.elementFromPoint(event.clientX, event.clientY)?.closest<HTMLElement>('[data-drop-id]')
      if (target?.dataset.dropId) onPointerDrop?.(target.dataset.dropId)
    }
    clearTarget()
    pointerStart.current = undefined
    setTouchOffset(undefined)
  }

  const showFallback = !imageFile || imageState === 'error'
  const ready = imageState !== 'loading'

  return <button
    className={`object-card ${numeric ? 'numeric-card' : ''} ${selected ? 'selected' : ''} ${state ?? ''} ${compact ? 'compact' : ''} ${ready ? 'image-ready' : 'image-loading'} ${imageState === 'error' ? 'image-error' : ''} ${draggable ? 'draggable' : ''} ${touchOffset ? 'touch-dragging' : ''}`}
    style={touchOffset ? { transform: `translate3d(${touchOffset.x}px,${touchOffset.y}px,0) rotate(-3deg) scale(1.08)` } : undefined}
    onClick={event => {
      if (didMove.current) {
        event.preventDefault()
        didMove.current = false
        return
      }
      onClick?.()
    }}
    disabled={!onClick && !draggable}
    draggable={draggable}
    onDragStart={onDragStart}
    onDragEnd={clearTarget}
    onPointerDown={pointerDown}
    onPointerMove={pointerMove}
    onPointerUp={pointerUp}
    onPointerCancel={() => {
      clearTarget()
      pointerStart.current = undefined
      setTouchOffset(undefined)
    }}
  >
    <span className={`image-shell ${numeric ? 'numeric-shell' : ''}`}>
      {showFallback
        ? numeric
          ? <span className="numeric-answer">{item.label}</span>
          : <span className={`fallback-visual tone-${item.tone ?? 0}`} aria-label={imageState === 'error' ? `Нет изображения: ${item.label}` : undefined}>{item.label.length <= 2 ? item.label : item.label.slice(0, 1)}</span>
        : <><span className="image-placeholder"/><img src={asset('objects', imageFile)} alt="" draggable={false} onLoad={() => setImageState('ready')} onError={() => setImageState('error')}/></>}
    </span>
    {!numeric && <span className="object-label">{item.label}</span>}
  </button>
}
