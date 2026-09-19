// @vitest-environment jsdom
import { act, StrictMode, useState } from 'react'
import { describe, expect, it, vi } from 'vitest'
import App from '../src/App'
import { AudioControls } from '../src/audio/AudioControls'
import { voice } from '../src/audio/player'
import { questionClip, objectClip } from '../src/audio/clips'
import { QuizSession } from '../src/components/QuizSession'
import { QuestionRenderer } from '../src/components/QuestionRenderer'
import { RankingQuestion } from '../src/components/mechanics/RankingQuestion'
import { ObjectCard } from '../src/components/ObjectCard'
import { questions } from '../src/data/questions'
import { createInitialAnswer, optionIds, resolveOptionOrder } from '../src/utils/quiz'
import type { Question, RankingQuestion as RankingData } from '../src/types/quiz'
import { setupDom, render, click, element, elements, advance, audioEvent, media } from './helpers/dom'

setupDom()
const q = (id: number) => questions.find(question => question.id === id)!
const noop = () => {}
const session = (bank: Question[], onFinish = noop) => <QuizSession questions={bank} headerLabel={question => String(question.id)} onHome={noop} onFinish={onFinish}/>
const card = (id: string, prefix = '') => `${prefix} .object-card[data-object-id="${id}"]`.trim()

describe('all question renderers', () => {
  it.each(questions)('renders question $id ($type) with the shared option order', async question => {
    const order = [...optionIds(question)].reverse()
    await render(<QuestionRenderer question={question} answer={createInitialAnswer(question)} checked={false} optionOrder={order} onChange={noop} onComplete={noop}/>)
    if (question.type === 'sorting') {
      expect(element('.sort-current .object-card').dataset.objectId).toBe(order[0])
      expect(element<HTMLImageElement>('.sort-current img').src).not.toContain('undefined')
    } else if (question.type !== 'true_false') {
      const selector = question.type === 'ranking' ? '.rank-pool .object-card' : '.choice-grid .object-card'
      expect(elements(selector).map(el => el.dataset.objectId)).toEqual(order)
    } else expect(elements('.truth')).toHaveLength(2)
  })
  it('recovers from an empty or malformed sorting order', async () => {
    const question = q(22)
    for (const order of [[], ['missing'], ['o-zemlya', 'o-zemlya', 'o-luna', 'o-evropa']]) {
      expect([...resolveOptionOrder(optionIds(question), order)].sort()).toEqual([...optionIds(question)].sort())
      await render(<QuestionRenderer question={question} answer={{}} checked={false} optionOrder={order} onChange={noop} onComplete={noop}/>)
      expect(optionIds(question)).toContain(element('.sort-current .object-card').dataset.objectId)
    }
  })
})

const answerCorrectly = async (question: Question) => {
  switch (question.type) {
    case 'multiple_choice':
    case 'odd_one_out':
      await click(card(question.correct))
      await click('.action')
      break
    case 'missing_item':
      await click(card(question.correct, '.missing-candidates'))
      break
    case 'true_false':
      await click(question.correct ? '.truth.yes' : '.truth.no')
      await click('.action')
      break
    case 'sorting':
      for (let i = 0; i < question.options.length; i++) {
        const id = element('.sort-current .object-card').dataset.objectId!
        expect(question.options).toContain(id)
        await click(`[data-drop-id="${question.assignments[id]}"]`)
        await advance(650)
      }
      break
    case 'ranking':
      for (const [i, id] of question.correct.split(',').entries()) {
        await click(card(id, '.rank-pool'))
        await click(`[data-drop-id="rank-${i}"]`)
      }
  }
}

describe('gameplay', () => {
  it('completes all 78 questions through actual controls and counts each point once', async () => {
    const finish = vi.fn()
    await render(session(questions, finish))
    for (const question of questions) {
      expect(element('h2').textContent).toBe(question.prompt)
      await answerCorrectly(question)
      expect(element('.feedback').classList.contains('success')).toBe(true)
      await click('.action')
    }
    expect(finish).toHaveBeenCalledExactlyOnceWith(78)
  })

  it.each([2, 14, 41, 51, 22])('does not award a point for an incorrect answer to question %s', async id => {
    const question = q(id)
    const finish = vi.fn()
    await render(session([question], finish))
    if (question.type === 'sorting') {
      for (let i = 0; i < question.options.length; i++) {
        const object = element('.sort-current .object-card').dataset.objectId!
        const category = question.assignments[object] === 'left' ? 'right' : 'left'
        await click(`[data-drop-id="${category}"]`)
        await advance(650)
      }
    } else if (question.type === 'true_false') {
      await click(question.correct ? '.truth.no' : '.truth.yes')
      await click('.action')
      expect(element('.feedback').textContent).toContain('Верный ответ: правда')
      expect(media.src).toBe(questionClip(41))
    } else if (question.type !== 'ranking') {
      const wrong = optionIds(question).find(value => value !== question.correct)!
      await click(card(wrong, question.type === 'missing_item' ? '.missing-candidates' : '.choice-grid'))
      if (question.type !== 'missing_item') await click('.action')
    }
    expect(element('.feedback').classList.contains('error')).toBe(true)
    await click('.action')
    expect(finish).toHaveBeenCalledExactlyOnceWith(0)
  })

  it('shows all four sorting images and narrates each visible object', async () => {
    await render(session([q(22)]))
    expect(media.src).toBe(questionClip(22))
    await audioEvent('onended')
    const seen: string[] = []
    for (let i = 0; i < 4; i++) {
      const object = element('.sort-current .object-card').dataset.objectId!
      seen.push(object)
      expect(element<HTMLImageElement>('.sort-current img').src).toMatch(/\.png$/)
      expect(media.src).toBe(objectClip(object))
      expect(elements('.spoken')).toHaveLength(0)
      await audioEvent('onplaying')
      expect(element('.sort-current .object-card').classList.contains('spoken')).toBe(true)
      await click('[data-drop-id="left"]')
      expect(elements('.spoken')).toHaveLength(0)
      await advance(650)
    }
    expect(new Set(seen).size).toBe(4)
    expect(elements('.action')).toHaveLength(1)
  })

  it('cleans up the pending sorting round when leaving the question', async () => {
    await render(session([q(22)]))
    await click('[data-drop-id="left"]')
    await render(<div>Home</div>)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not restart audio in the background when the next sorting object appears', async () => {
    await render(<><AudioControls/>{session([q(22)])}</>)
    await click('[data-drop-id="left"]')
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
    await act(async () => { document.dispatchEvent(new Event('visibilitychange')) })
    const calls = media.play.mock.calls.length
    await advance(650)
    expect(media.play).toHaveBeenCalledTimes(calls)
    expect(elements('.spoken')).toHaveLength(0)
  })

  it('handles touch placement and suppresses the click generated after a drag', async () => {
    await render(session([q(51)]))
    const source = element(card('o-mars', '.missing-candidates'))
    const target = element('.missing-slot')
    Object.defineProperty(source, 'setPointerCapture', { value: vi.fn(), configurable: true })
    Object.defineProperty(document, 'elementFromPoint', { value: () => target, configurable: true })
    const pointer = async (type: string, x: number, y: number) => {
      const event = new MouseEvent(type, { bubbles: true, clientX: x, clientY: y })
      Object.defineProperties(event, { pointerType: { value: 'touch' }, pointerId: { value: 1 } })
      await act(async () => { source.dispatchEvent(event) })
    }
    await pointer('pointerdown', 5, 5)
    await pointer('pointermove', 80, 80)
    expect(target.classList.contains('drag-over')).toBe(true)
    await pointer('pointerup', 80, 80)
    expect(target.classList.contains('drag-over')).toBe(false)
    expect(element('.feedback').classList.contains('success')).toBe(true)
    const calls = media.play.mock.calls.length
    await act(async () => source.click())
    expect(media.play).toHaveBeenCalledTimes(calls)
    delete (document as Partial<Document>).elementFromPoint
  })
})

describe('narration in the UI', () => {
  it('narrates options in DOM order and highlights only actual playback', async () => {
    await render(session([q(2)]))
    const order = elements('.choice-grid .object-card').map(el => el.dataset.objectId!)
    await audioEvent('onended')
    for (const id of order) {
      expect(media.src).toBe(objectClip(id))
      expect(elements('.spoken')).toHaveLength(0)
      await audioEvent('onplaying')
      expect(element('.spoken').dataset.objectId).toBe(id)
      await audioEvent('onended')
    }
    expect(elements('.spoken')).toHaveLength(0)
  })

  it.each(['mute', 'pagehide', 'hidden', 'manual'])('clears automatic highlight on %s', async action => {
    await render(<><AudioControls/>{session([q(2)])}</>)
    await audioEvent('onended')
    await audioEvent('onplaying')
    expect(elements('.spoken')).toHaveLength(1)
    if (action === 'mute') await click('.audio-controls button')
    if (action === 'manual') await click('.object-voice')
    if (action === 'pagehide') await act(async () => { window.dispatchEvent(new Event('pagehide')) })
    if (action === 'hidden') {
      vi.spyOn(document, 'hidden', 'get').mockReturnValue(true)
      await act(async () => { document.dispatchEvent(new Event('visibilitychange')) })
    }
    expect(elements('.spoken')).toHaveLength(0)
    if (action === 'manual') {
      await audioEvent('onplaying')
      expect(elements('.spoken')).toHaveLength(1)
      await audioEvent('onended')
      expect(elements('.spoken')).toHaveLength(0)
    }
  })

  it('does not restart ranking narration after placement and replays only remaining options', async () => {
    const question = q(31) as RankingData
    await render(session([question]))
    await audioEvent('onended')
    await audioEvent('onplaying')
    const first = question.correct.split(',')[0]
    await click(card(first, '.rank-pool'))
    expect(elements('.spoken')).toHaveLength(0)
    const calls = media.play.mock.calls.length
    await click('[data-drop-id="rank-0"]')
    expect(media.play).toHaveBeenCalledTimes(calls)
    const remaining = elements('.rank-pool .object-card').map(el => el.dataset.objectId!)
    await click('.voice-repeat')
    expect(media.src).toBe(questionClip(31))
    await audioEvent('onended')
    for (const id of remaining) {
      expect(media.src).toBe(objectClip(id))
      await audioEvent('onplaying')
      expect(element('.spoken').dataset.objectId).toBe(id)
      await audioEvent('onended')
    }
  })

  it('keeps the first question playing through screen changes in StrictMode', async () => {
    vi.spyOn(Math, 'random').mockReturnValue(0.999)
    await render(<StrictMode><AudioControls/><App/></StrictMode>)
    if (elements('.difficulty-card').length) await click('.difficulty-card.level-1')
    const calls = media.play.mock.calls.length
    await click('.start .primary')
    expect(media.src).toMatch(/questions\/q\d{3}\.mp3$/)
    expect(media.onended).not.toBeNull()
    // StrictMode may mount the question effect twice, but App must not start a third queue.
    expect(media.play.mock.calls.length - calls).toBeLessThanOrEqual(2)
    await audioEvent('onplaying')
    expect(voice.getSnapshot().status).toBe('playing')
    await click('.home')
    expect(media.src).toMatch(/ui\/greeting_\d{2}\.mp3$/)
    expect(media.onended).not.toBeNull()
  })
})

describe('ranking timers and cached images', () => {
  const Ranking = () => {
    const question = q(31) as RankingData
    const [value, setValue] = useState<string[]>(['', '', '', ''])
    return <RankingQuestion question={question} value={value} checked={false} onChange={setValue} onComplete={noop}/>
  }
  it('cancels obsolete ranking feedback timers and clears them on unmount', async () => {
    await render(<Ranking/>)
    await click(card('o-merkuriy', '.rank-pool'))
    await click('[data-drop-id="rank-1"]')
    expect(element('.instant-feedback').textContent).toContain('Попробуй')
    await advance(500)
    await click('[data-drop-id="rank-0"]')
    await advance(200)
    expect(element('.instant-feedback').textContent).toContain('На своём месте')
    expect(elements('.error')).toHaveLength(0)
    await render(<div/>)
    expect(vi.getTimerCount()).toBe(0)
  })
  it('marks a cached image ready without waiting for another load event', async () => {
    vi.spyOn(HTMLImageElement.prototype, 'complete', 'get').mockReturnValue(true)
    vi.spyOn(HTMLImageElement.prototype, 'naturalWidth', 'get').mockReturnValue(256)
    await render(<ObjectCard id="o-zemlya"/>)
    expect(element('.object-card').classList.contains('image-ready')).toBe(true)
  })
  it('uses a fallback for a failed image', async () => {
    await render(<ObjectCard id="o-zemlya"/>)
    await act(async () => element('img').dispatchEvent(new Event('error')))
    expect(element('.object-card').classList.contains('image-error')).toBe(true)
    expect(elements('img')).toHaveLength(0)
  })
})
