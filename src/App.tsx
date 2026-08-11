import { useMemo, useState } from 'react'
import { asset } from './constants/assets'
import { objects } from './data/objects'
import { questions } from './data/questions'
import type { Question } from './types/quiz'

type Answer = string | boolean | Record<string, string> | string[]

const ObjectCard = ({ id, selected, state, onClick, compact = false }: { id: string; selected?: boolean; state?: 'right'|'wrong'; onClick?: () => void; compact?: boolean }) => {
  const item = objects[id]
  return <button className={`object-card ${selected ? 'selected' : ''} ${state ?? ''} ${compact ? 'compact' : ''}`} onClick={onClick} disabled={!onClick}>
    <img src={asset('objects', item.file)} alt="" draggable={false} />
    <span>{item.label}</span>
  </button>
}

function Choice({ q, value, checked, setValue }: { q: Question; value?: string; checked: boolean; setValue: (v:string)=>void }) {
  return <div className="choice-grid">{q.options!.map(id => <ObjectCard key={id} id={id} selected={value===id}
    state={checked ? id===q.correct ? 'right' : value===id ? 'wrong' : undefined : undefined}
    onClick={checked ? undefined : () => setValue(id)} />)}</div>
}

function Missing({ q, value, checked, setValue }: { q: Question; value?: string; checked: boolean; setValue:(v:string)=>void }) {
  return <><div className="sequence">{q.sequence!.map(id=><ObjectCard key={id} id={id} compact />)}<div className="missing-slot">{checked && value===q.correct ? <ObjectCard id={value!} compact /> : '?'}</div></div>
    <div className="choice-grid three">{q.candidates!.map(id=><ObjectCard key={id} id={id} selected={value===id} state={checked?id===q.correct?'right':value===id?'wrong':undefined:undefined} onClick={checked?undefined:()=>setValue(id)} />)}</div></>
}

function Sorting({ q, value, checked, setValue }: { q:Question; value:Record<string,string>; checked:boolean; setValue:(v:Record<string,string>)=>void }) {
  const unplaced=q.options!.filter(id=>!value[id])
  return <><p className="hint">Нажми карточку, затем выбери для неё группу</p>
    <div className="sort-source">{unplaced.map(id=><ObjectCard key={id} id={id} compact onClick={()=>setValue({...value,[id]:q.categories![0].id})}/>)}</div>
    <div className="sort-zones">{q.categories!.map(c=><section key={c.id} className="sort-zone"><h3>{c.label}</h3>{q.options!.filter(id=>value[id]===c.id).map(id=><ObjectCard key={id} id={id} compact state={checked?(q.assignments![id]===c.id?'right':'wrong'):undefined} onClick={checked?undefined:()=>setValue({...value,[id]:q.categories!.find(x=>x.id!==c.id)!.id})}/>)}</section>)}</div></>
}

function Ranking({ q, value, checked, setValue }: { q:Question; value:string[]; checked:boolean; setValue:(v:string[])=>void }) {
  const move=(i:number,delta:number)=>{const next=[...value];const target=i+delta;if(target<0||target>=next.length)return;[next[i],next[target]]=[next[target],next[i]];setValue(next)}
  const correct=(q.correct as string).split(',')
  return <><p className="hint">Меняй порядок стрелками</p><div className="ranking">{value.map((id,i)=><div className={`rank-row ${checked?(correct[i]===id?'right':'wrong'):''}`} key={id}><b>{i+1}</b><ObjectCard id={id} compact/><div><button aria-label="Выше" disabled={checked||i===0} onClick={()=>move(i,-1)}>↑</button><button aria-label="Ниже" disabled={checked||i===value.length-1} onClick={()=>move(i,1)}>↓</button></div></div>)}</div></>
}

export default function App() {
  const [screen,setScreen]=useState<'start'|'quiz'|'finish'>('start')
  const [index,setIndex]=useState(0)
  const [answer,setAnswer]=useState<Answer | undefined>()
  const [checked,setChecked]=useState(false)
  const [score,setScore]=useState(0)
  const q=questions[index]
  const initialAnswer=useMemo(()=>q?.type==='sorting'?{}:q?.type==='ranking'?[...(q.options??[])]:undefined,[q])
  const current=answer ?? initialAnswer
  const isCorrect=()=> q.type==='sorting' ? q.options!.every(id=>(current as Record<string,string>)[id]===q.assignments![id]) : q.type==='ranking' ? (current as string[]).join(',')===q.correct : current===q.correct
  const canCheck= q.type==='sorting' ? Object.keys(current as object).length===q.options!.length : q.type==='ranking' ? true : current!==undefined
  const submit=()=>{if(!canCheck)return;setChecked(true);if(isCorrect())setScore(s=>s+1)}
  const next=()=>{if(index===questions.length-1){setScreen('finish');return}setIndex(i=>i+1);setAnswer(undefined);setChecked(false)}
  const restart=()=>{setScreen('quiz');setIndex(0);setAnswer(undefined);setChecked(false);setScore(0)}

  if(screen==='start') return <main className="screen start"><div className="start-content"><p className="eyebrow">Космическая викторина</p><h1>Солнечная<br/>система</h1><p className="subtitle">12 вопросов · 6 игр</p><img className="hero" src={asset('heroes','hero_start_solar_system.png')} alt="Космический герой"/><button className="primary" onClick={()=>setScreen('quiz')}>Начать <span>→</span></button></div></main>
  if(screen==='finish') return <main className="screen finish"><div className="finish-card"><img src={asset('heroes','hero_finish_success.png')} alt="Победа"/><p className="eyebrow">Миссия выполнена!</p><h1>{score} из {questions.length}</h1><p>{score>=10?'Ты настоящий знаток космоса!':score>=7?'Отличный полёт!':'Хорошее начало, исследователь!'}</p><button className="primary" onClick={restart}>Пройти ещё раз ↻</button></div></main>

  return <main className="screen quiz"><div className="quiz-shell"><header><button className="home" aria-label="На главную" onClick={()=>setScreen('start')}>⌂</button><div className="progress-wrap"><div className="progress-meta"><span>Вопрос {index+1}</span><b>{index+1} из {questions.length}</b></div><div className="progress"><i style={{width:`${(index+1)/questions.length*100}%`}}/></div></div></header>
    <section className="question-card"><span className="mechanic">{({multiple_choice:'Выбери ответ',odd_one_out:'Найди лишнее',missing_item:'Продолжи ряд',sorting:'Разложи по группам',ranking:'Выстрой порядок',true_false:'Правда или нет'})[q.type]}</span><h2>{q.prompt}</h2>
      {(q.type==='multiple_choice'||q.type==='odd_one_out')&&<Choice q={q} value={current as string} checked={checked} setValue={setAnswer}/>} 
      {q.type==='missing_item'&&<Missing q={q} value={current as string} checked={checked} setValue={setAnswer}/>} 
      {q.type==='sorting'&&<Sorting q={q} value={current as Record<string,string>} checked={checked} setValue={setAnswer}/>} 
      {q.type==='ranking'&&<Ranking q={q} value={current as string[]} checked={checked} setValue={setAnswer}/>} 
      {q.type==='true_false'&&<div className="truth-grid"><button className={`truth yes ${checked?(q.correct===true?'right':current===true?'wrong':''):''} ${current===true?'selected':''}`} disabled={checked} onClick={()=>setAnswer(true)}>✓<span>Правда</span></button><button className={`truth no ${checked?(q.correct===false?'right':current===false?'wrong':''):''} ${current===false?'selected':''}`} disabled={checked} onClick={()=>setAnswer(false)}>×<span>Неправда</span></button></div>}
      {checked&&<div className={`feedback ${isCorrect()?'success':'error'}`}><b>{isCorrect()?'Верно!':'Почти!'}</b><span>{q.explanation}</span></div>}
      <button className="primary action" disabled={!canCheck} onClick={checked?next:submit}>{checked?(index===questions.length-1?'Узнать результат':'Дальше →'):(q.type==='sorting'||q.type==='ranking'?'Готово':'Проверить')}</button>
    </section></div></main>
}
