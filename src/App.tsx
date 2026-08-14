import { type DragEvent, type PointerEvent as ReactPointerEvent, useEffect, useMemo, useRef, useState } from 'react'
import { asset } from './constants/assets'
import { objects } from './data/objects'
import { createQuizForDifficulty, difficultyInfo, sortingCategoryLabels } from './data/questionMeta'
import type { Difficulty, Question } from './types/quiz'

type Answer = string | boolean | Record<string, string> | string[]

type ObjectCardProps = {
  id: string
  selected?: boolean
  state?: 'right' | 'wrong'
  onClick?: () => void
  compact?: boolean
  draggable?: boolean
  onDragStart?: (event: DragEvent<HTMLButtonElement>) => void
  onPointerDrop?: (dropId: string) => void
}

const ObjectCard = ({ id, selected, state, onClick, compact = false, draggable = false, onDragStart, onPointerDrop }: ObjectCardProps) => {
  const item = objects[id]
  const numeric = !item.file && /^\d+$/.test(item.label)
  const [loaded, setLoaded] = useState(!item.file)
  const [touchOffset, setTouchOffset] = useState<{ x:number; y:number }>()
  const pointerStart = useRef<{ x:number; y:number } | undefined>(undefined)
  const didMove = useRef(false)
  const activeTarget = useRef<HTMLElement | undefined>(undefined)

  const clearTarget = () => {
    activeTarget.current?.classList.remove('drag-over')
    activeTarget.current = undefined
  }
  const pointerDown = (event:ReactPointerEvent<HTMLButtonElement>) => {
    if (!draggable || event.pointerType === 'mouse') return
    pointerStart.current = { x:event.clientX, y:event.clientY }
    didMove.current = false
    event.currentTarget.setPointerCapture(event.pointerId)
  }
  const pointerMove = (event:ReactPointerEvent<HTMLButtonElement>) => {
    if (!pointerStart.current) return
    const x = event.clientX - pointerStart.current.x
    const y = event.clientY - pointerStart.current.y
    if (Math.hypot(x,y) > 7) didMove.current = true
    if (!didMove.current) return
    event.preventDefault()
    setTouchOffset({ x,y })
    const target = document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLElement>('[data-drop-id]')
    if (target !== activeTarget.current) {
      clearTarget()
      target?.classList.add('drag-over')
      activeTarget.current = target ?? undefined
    }
  }
  const pointerUp = (event:ReactPointerEvent<HTMLButtonElement>) => {
    if (!pointerStart.current) return
    if (didMove.current) {
      const target = activeTarget.current ?? document.elementFromPoint(event.clientX,event.clientY)?.closest<HTMLElement>('[data-drop-id]')
      if (target?.dataset.dropId) onPointerDrop?.(target.dataset.dropId)
    }
    clearTarget()
    pointerStart.current = undefined
    setTouchOffset(undefined)
  }

  return <button
    className={`object-card ${numeric?'numeric-card':''} ${selected?'selected':''} ${state??''} ${compact?'compact':''} ${loaded?'image-ready':'image-loading'} ${draggable?'draggable':''} ${touchOffset?'touch-dragging':''}`}
    style={touchOffset ? { transform:`translate3d(${touchOffset.x}px,${touchOffset.y}px,0) rotate(-3deg) scale(1.08)` } : undefined}
    onClick={event => {
      if (didMove.current) { event.preventDefault(); didMove.current=false; return }
      onClick?.()
    }}
    disabled={!onClick && !draggable}
    draggable={draggable}
    onDragStart={onDragStart}
    onDragEnd={clearTarget}
    onPointerDown={pointerDown}
    onPointerMove={pointerMove}
    onPointerUp={pointerUp}
    onPointerCancel={() => { clearTarget(); pointerStart.current=undefined; setTouchOffset(undefined) }}
  >
    {numeric ? <span className="number-answer">{item.label}</span> : <>
      <span className="image-shell">
        {item.file ? <>
          <span className="image-placeholder"/>
          <img src={asset('objects',item.file)} alt="" draggable={false} onLoad={() => setLoaded(true)}/>
        </> : <span className={`fallback-visual tone-${item.tone??0}`} aria-hidden="true">{item.label.slice(0,1)}</span>}
      </span>
      <span>{item.label}</span>
    </>}
  </button>
}

function Choice({ q, value, checked, setValue }:{ q:Question; value?:string; checked:boolean; setValue:(v:string)=>void }) {
  return <div className="choice-grid">{q.options!.map(id => <ObjectCard key={id} id={id} selected={value===id}
    state={checked ? id===q.correct ? 'right' : value===id ? 'wrong' : undefined : undefined}
    onClick={checked ? undefined : () => setValue(id)}/>)}</div>
}

function Missing({ q, value, checked, setValue, onComplete }:{ q:Question; value?:string; checked:boolean; setValue:(v:string)=>void; onComplete:(right:boolean)=>void }) {
  const place = (id:string) => {
    if (checked || !q.candidates!.includes(id)) return
    setValue(id)
    onComplete(id===q.correct)
  }
  const drop = (event:DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.currentTarget.classList.remove('drag-over')
    place(event.dataTransfer.getData('text/plain'))
  }
  return <div className="missing-game">
    <p className="hint">Перетащи подходящий объект в пустое место или нажми на ответ.</p>
    <div className="sequence">{q.sequence!.map(id=><ObjectCard key={id} id={id} compact/>)}
      <div data-drop-id="missing" className={`missing-slot ${value?'filled':''} ${checked?(value===q.correct?'right':'wrong'):''}`}
        onDragOver={event=>{event.preventDefault();event.currentTarget.classList.add('drag-over')}}
        onDragLeave={event=>event.currentTarget.classList.remove('drag-over')} onDrop={drop}>
        {value ? <ObjectCard id={value} compact state={value===q.correct?'right':'wrong'}/> : <><b>?</b><small>Перетащи сюда</small></>}
      </div>
    </div>
    <div className="choice-grid three missing-candidates">{q.candidates!.map(id=><ObjectCard key={id} id={id} draggable={!checked}
      onDragStart={event=>{event.dataTransfer.setData('text/plain',id);event.dataTransfer.effectAllowed='move'}}
      onPointerDrop={dropId=>{if(dropId==='missing')place(id)}} selected={value===id}
      state={checked?id===q.correct?'right':value===id?'wrong':undefined:undefined} onClick={checked?undefined:()=>place(id)}/>)}</div>
  </div>
}

function Sorting({ q, value, checked, setValue, onComplete }:{ q:Question; value:Record<string,string>; checked:boolean; setValue:(v:Record<string,string>)=>void; onComplete:(right:boolean)=>void }) {
  const [active,setActive] = useState(0)
  const [feedback,setFeedback] = useState<boolean>()
  const [chosen,setChosen] = useState<string>()
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  useEffect(() => {
    setActive(0);setFeedback(undefined);setChosen(undefined)
    return () => { if(timer.current) clearTimeout(timer.current) }
  },[q.id])

  const id=q.options![active]
  const labels=sortingCategoryLabels[q.id]
  const categories=q.categories!.map((category,index)=>({ ...category, label:labels?.[index] ?? category.label }))
  const place=(category:string)=>{
    if(checked || feedback!==undefined || !categories.some(item=>item.id===category)) return
    const next={...value,[id]:category}
    const right=q.assignments![id]===category
    setValue(next);setChosen(category);setFeedback(right)
    timer.current=setTimeout(()=>{
      if(active===q.options!.length-1) onComplete(q.options!.every(item=>next[item]===q.assignments![item]))
      else { setActive(index=>index+1);setFeedback(undefined);setChosen(undefined) }
    },650)
  }
  const nativeDrop=(event:DragEvent<HTMLElement>,category:string)=>{event.preventDefault();place(category)}
  const zone=(category:{id:string;label:string},index:number)=><section key={category.id} data-drop-id={category.id}
    className={`sort-zone side-zone ${chosen===category.id?(feedback?'right':'wrong'):''}`}
    onClick={()=>place(category.id)} onDragOver={event=>{event.preventDefault();event.currentTarget.classList.add('drag-over')}}
    onDragLeave={event=>event.currentTarget.classList.remove('drag-over')}
    onDrop={event=>{event.currentTarget.classList.remove('drag-over');nativeDrop(event,category.id)}}>
      <span className="zone-arrow">{index===0?'←':'→'}</span><h3>{category.label}</h3><small>Перенести сюда</small>
    </section>

  return <div className="sorting-round">
    <div className="round-progress"><b>{active+1}</b><span>из {q.options!.length}</span><i style={{width:`${(active+1)/q.options!.length*100}%`}}/></div>
    <p className="hint">Перетащи объект влево или вправо. После ответа объект исчезнет.</p>
    <div className="sorting-stage">{zone(categories[0],0)}
      <div className="sort-current">{feedback===undefined ? <ObjectCard key={id} id={id} draggable={!checked}
        onDragStart={event=>{event.dataTransfer.setData('text/plain',id);event.dataTransfer.effectAllowed='move'}} onPointerDrop={place}/> : <div className="sort-current-placeholder"/>}</div>
      {zone(categories[1],1)}
    </div>
  </div>
}

function Ranking({ q, value, checked, setValue, onComplete }:{ q:Question; value:string[]; checked:boolean; setValue:(v:string[])=>void; onComplete:(right:boolean)=>void }) {
  const [selected,setSelected]=useState<string>()
  const [errorSlot,setErrorSlot]=useState<number>()
  const [message,setMessage]=useState<'right'|'wrong'>()
  const correct=(q.correct as string).split(',')
  useEffect(()=>{setSelected(undefined);setErrorSlot(undefined);setMessage(undefined)},[q.id])
  const place=(id:string,target:number)=>{
    if(checked || value[target] || !q.options!.includes(id)) return
    if(correct[target]!==id){setErrorSlot(target);setMessage('wrong');setTimeout(()=>{setErrorSlot(undefined);setMessage(undefined)},700);return}
    const next=[...value];next[target]=id;setValue(next);setSelected(undefined);setMessage('right')
    if(next.every(Boolean)) onComplete(true); else setTimeout(()=>setMessage(undefined),650)
  }
  const nativeDrop=(event:DragEvent<HTMLDivElement>,index:number)=>{event.preventDefault();place(event.dataTransfer.getData('text/plain'),index)}
  const available=q.options!.filter(id=>!value.includes(id))
  return <div className="ranking-game"><p className="hint">Выбери объект и поставь в нужное место. Верные позиции закрепляются.</p>
    <div className="rank-slots-line">{correct.map((_,index)=><div key={index} data-drop-id={`rank-${index}`}
      className={`rank-slot ${value[index]?'right locked':''} ${errorSlot===index?'wrong shake':''}`}
      onClick={()=>selected&&place(selected,index)} onDragOver={event=>{event.preventDefault();event.currentTarget.classList.add('drag-over')}}
      onDragLeave={event=>event.currentTarget.classList.remove('drag-over')}
      onDrop={event=>{event.currentTarget.classList.remove('drag-over');nativeDrop(event,index)}}>
        <b>{index+1}</b>{value[index]?<ObjectCard id={value[index]} compact state="right"/>:<span className="empty-rank">Перетащи сюда</span>}
    </div>)}</div>
    <div className="rank-pool">{available.map(id=><ObjectCard key={id} id={id} compact draggable={!checked} selected={selected===id}
      onClick={()=>setSelected(current=>current===id?undefined:id)}
      onDragStart={event=>{event.dataTransfer.setData('text/plain',id);event.dataTransfer.effectAllowed='move'}}
      onPointerDrop={dropId=>{if(dropId.startsWith('rank-'))place(id,Number(dropId.slice(5)))}}/>)}</div>
    {message&&<div className={`instant-feedback ${message==='right'?'success':'error'}`}>{message==='right'?'✓ На своём месте!':'× Попробуй другое место'}</div>}
  </div>
}

export default function App(){
  const [difficulty,setDifficulty]=useState<Difficulty>(2)
  const [sessionQuestions,setSessionQuestions]=useState(()=>createQuizForDifficulty(2))
  const [screen,setScreen]=useState<'start'|'quiz'|'finish'>('start')
  const [index,setIndex]=useState(0)
  const [answer,setAnswer]=useState<Answer>()
  const [checked,setChecked]=useState(false)
  const [score,setScore]=useState(0)
  const q=sessionQuestions[index]

  useEffect(()=>{
    const urls=[...Object.values(objects).flatMap(item=>item.file?[asset('objects',item.file)]:[]),
      asset('backgrounds','bg_start_solar_system.png'),asset('backgrounds','bg_question_space.png'),asset('backgrounds','bg_finish_space.png'),
      asset('heroes','hero_start_solar_system.png'),asset('heroes','hero_finish_success.png')]
    urls.forEach(url=>{const image=new Image();image.decoding='async';image.src=url})
  },[])

  const initialAnswer=useMemo(()=>q?.type==='sorting'?{}:q?.type==='ranking'?Array(q.options?.length??0).fill(''):undefined,[q])
  const current=answer??initialAnswer
  const isCorrect=()=>q.type==='sorting' ? q.options!.every(id=>(current as Record<string,string>)[id]===q.assignments![id])
    : q.type==='ranking' ? (current as string[]).join(',')===q.correct : current===q.correct
  const canCheck=current!==undefined
  const submit=()=>{if(!canCheck)return;setChecked(true);if(isCorrect())setScore(s=>s+1)}
  const completeInteractive=(right:boolean)=>{if(checked)return;setChecked(true);if(right)setScore(s=>s+1)}
  const next=()=>{if(index===sessionQuestions.length-1){setScreen('finish');return}setIndex(i=>i+1);setAnswer(undefined);setChecked(false)}
  const startQuiz=()=>{setSessionQuestions(createQuizForDifficulty(difficulty));setIndex(0);setAnswer(undefined);setChecked(false);setScore(0);setScreen('quiz')}
  const restart=()=>{setSessionQuestions(createQuizForDifficulty(difficulty));setScreen('quiz');setIndex(0);setAnswer(undefined);setChecked(false);setScore(0)}

  if(screen==='start') return <main className="screen start"><div className="start-content">
    <p className="eyebrow">Космическая викторина</p><h1>Солнечная<br/>система</h1>
    <p className="difficulty-title">Выбери уровень сложности</p>
    <div className="difficulty-picker" role="group" aria-label="Уровень сложности">{([1,2,3] as Difficulty[]).map(level=>{
      const info=difficultyInfo[level]
      return <button key={level} className={`difficulty-option ${difficulty===level?'selected':''}`} onClick={()=>setDifficulty(level)} aria-pressed={difficulty===level}>
        <b>{info.title}</b><span>{info.age}</span><small>{info.description}</small>
      </button>
    })}</div>
    <p className="subtitle">12 вопросов · 6 игр</p><img className="hero" src={asset('heroes','hero_start_solar_system.png')} alt="Космический герой"/>
    <button className="primary" onClick={startQuiz}>Начать <span>→</span></button>
  </div></main>

  if(screen==='finish') return <main className="screen finish"><div className="finish-card">
    <img src={asset('heroes','hero_finish_success.png')} alt="Победа"/><p className="eyebrow">Миссия выполнена!</p>
    <h1>{score} из {sessionQuestions.length}</h1><p>{score>=10?'Ты настоящий знаток космоса!':score>=7?'Отличный полёт!':'Хорошее начало, исследователь!'}</p>
    <button className="primary" onClick={restart}>Пройти ещё раз ↻</button>
  </div></main>

  return <main className="screen quiz"><div className="quiz-shell"><header>
    <button className="home" aria-label="На главную" onClick={()=>setScreen('start')}>⌂</button>
    <div className="progress-wrap"><div className="progress-meta"><span>Вопрос {index+1}<span className="difficulty-current">· {difficultyInfo[difficulty].title}</span></span><b>{index+1} из {sessionQuestions.length}</b></div>
      <div className="progress"><i style={{width:`${(index+1)/sessionQuestions.length*100}%`}}/></div></div>
  </header><section className="question-card">
    <span className="mechanic">{({multiple_choice:'Выбери ответ',odd_one_out:'Найди лишнее',missing_item:'Продолжи ряд',sorting:'Разложи по группам',ranking:'Выстрой порядок',true_false:'Правда или ложь'})[q.type]}</span>
    <h2>{q.prompt}</h2>
    {(q.type==='multiple_choice'||q.type==='odd_one_out')&&<Choice q={q} value={current as string} checked={checked} setValue={setAnswer}/>} 
    {q.type==='missing_item'&&<Missing q={q} value={current as string} checked={checked} setValue={setAnswer} onComplete={completeInteractive}/>} 
    {q.type==='sorting'&&<Sorting q={q} value={current as Record<string,string>} checked={checked} setValue={setAnswer} onComplete={completeInteractive}/>} 
    {q.type==='ranking'&&<Ranking q={q} value={current as string[]} checked={checked} setValue={setAnswer} onComplete={completeInteractive}/>} 
    {q.type==='true_false'&&<div className="truth-grid"><button className={`truth yes ${checked?(q.correct===true?'right':current===true?'wrong':''):''} ${current===true?'selected':''}`} disabled={checked} onClick={()=>setAnswer(true)}>✓<span>Правда</span></button>
      <button className={`truth no ${checked?(q.correct===false?'right':current===false?'wrong':''):''} ${current===false?'selected':''}`} disabled={checked} onClick={()=>setAnswer(false)}>×<span>Ложь</span></button></div>}
    {checked&&<div className={`feedback ${isCorrect()?'success':'error'}`}><b>{isCorrect()?'Верно!':'Почти!'}</b><span>{q.explanation}</span></div>}
    {(checked||(q.type!=='sorting'&&q.type!=='ranking'&&q.type!=='missing_item'))&&<button className="primary action" disabled={!checked&&!canCheck} onClick={checked?next:submit}>{checked?(index===sessionQuestions.length-1?'Узнать результат':'Дальше →'):'Проверить'}</button>}
  </section></div></main>
}
