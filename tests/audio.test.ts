import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { VoicePlayer } from '../src/audio/player'
import { feedbackClips, questionClip, explanationClip, objectClip, optionIds } from '../src/audio/clips'
import { questions } from '../src/data/questions'
import { objects } from '../src/data/objects'

class FakeAudio {
  src = ''
  preload = ''
  duration = 3
  readyState = 4
  onended: (() => void) | null = null
  onerror: (() => void) | null = null
  onplaying: (() => void) | null = null
  onwaiting: (() => void) | null = null
  onstalled: (() => void) | null = null
  play = vi.fn(() => Promise.resolve())
  pause = vi.fn()
}
let media: FakeAudio
let player: VoicePlayer
beforeEach(() => { vi.useFakeTimers(); media = new FakeAudio(); player = new VoicePlayer(() => media as unknown as HTMLAudioElement) })
afterEach(() => { player.stop(); vi.useRealTimers(); vi.unstubAllGlobals() })
describe('voice playback lifecycle', () => {
  it('plays feedback and explanation sequentially on one element', () => {
    player.play(['praise', 'explanation'])
    expect(media.src).toBe('praise')
    media.onended!()
    expect(media.src).toBe('explanation')
    media.onended!()
    expect(player.getSnapshot().status).toBe('idle')
  })
  it('reports the active clip and clears the highlight after the queue', () => {
    const progress = vi.fn()
    player.play(['question', 'option'], progress)
    expect(progress).not.toHaveBeenCalledWith(0)
    media.onplaying!()
    expect(progress).toHaveBeenLastCalledWith(0)
    media.onended!()
    expect(progress).toHaveBeenLastCalledWith(null)
    media.onplaying!()
    expect(progress).toHaveBeenLastCalledWith(1)
    media.onended!()
    expect(progress).toHaveBeenLastCalledWith(null)
  })
  it('ignores an old ended event after navigating to another question', () => {
    player.play(['old', 'old-explanation'])
    const oldEnded = media.onended!
    player.play(['new'])
    oldEnded()
    expect(media.src).toBe('new')
    expect(media.play).toHaveBeenCalledTimes(2)
  })
  it('ignores a delayed rejection from the previous screen', async () => {
    let reject!: (error: Error) => void
    media.play.mockImplementationOnce(() => new Promise((_, r) => { reject = r }))
    player.play(['old'])
    player.play(['new'])
    media.onplaying!()
    reject(Object.assign(new Error(), { name: 'NotAllowedError' }))
    await Promise.resolve()
    expect(player.getSnapshot().status).toBe('playing')
    expect(media.src).toBe('new')
  })
  it('allows explicit retry after an autoplay rejection', async () => {
    media.play.mockRejectedValueOnce(Object.assign(new Error(), { name: 'NotAllowedError' }))
    player.setContext(['question'])
    await Promise.resolve()
    expect(player.getSnapshot().status).toBe('blocked')
    player.replay()
    expect(media.src).toBe('question')
    media.onplaying!()
    expect(player.getSnapshot().status).toBe('playing')
  })
  it('skips missing feedback and still plays the explanation', () => {
    player.play(['missing', 'explanation'])
    media.onerror!()
    expect(media.src).toBe('explanation')
    media.onended!()
    expect(player.getSnapshot().status).toBe('unavailable')
  })
  it('stops the entire queue when muted and remembers current question', () => {
    player.setContext(['question'])
    player.play(['object'])
    player.setEnabled(false)
    expect(media.onended).toBeNull()
    player.setEnabled(true)
    expect(media.src).toBe('question')
  })
  it('does not hang forever on a stalled request', () => {
    player.play(['stalled'])
    vi.advanceTimersByTime(12000)
    expect(player.getSnapshot().status).toBe('unavailable')
  })
  it('supports environments where persistent storage is blocked', () => {
    vi.stubGlobal('localStorage', { getItem() { throw Error() }, setItem() { throw Error() } })
    expect(() => { const p = new VoicePlayer(); p.setEnabled(false) }).not.toThrow()
  })

  it.each(['stop', 'mute', 'manual', 'context'] as const)('clears highlight on %s', action => {
    const progress = vi.fn()
    player.setContext(['question', 'option'], true, progress)
    media.onended!()
    media.onplaying!()
    expect(progress).toHaveBeenLastCalledWith(1)
    const oldPlaying = media.onplaying!
    if (action === 'stop') player.stop()
    if (action === 'mute') player.setEnabled(false)
    if (action === 'manual') player.play(['object'])
    if (action === 'context') player.setContext(['new'], false)
    oldPlaying()
    expect(progress).toHaveBeenLastCalledWith(null)
  })

  it('clears highlights while buffering and restores them on actual playback', () => {
    const progress = vi.fn()
    player.play(['option'], progress)
    expect(player.getSnapshot().status).toBe('loading')
    media.onplaying!()
    expect(progress).toHaveBeenLastCalledWith(0)
    media.onwaiting!()
    expect(progress).toHaveBeenLastCalledWith(null)
    media.onplaying!()
    expect(progress).toHaveBeenLastCalledWith(0)
    media.onended!()
    expect(progress).toHaveBeenLastCalledWith(null)
    expect(vi.getTimerCount()).toBe(0)
  })

  it('does not allow an old screen disposer to stop the new question', () => {
    const disposeStart = player.setContext(['greeting'])
    const disposeQuestion = player.setContext(['question'])
    disposeStart()
    expect(media.src).toBe('question')
    expect(media.onended).not.toBeNull()
    disposeQuestion()
    expect(media.onended).toBeNull()
    const calls = media.play.mock.calls.length
    player.replay()
    expect(media.play).toHaveBeenCalledTimes(calls)
  })

  it('does not allow an unmounted object to stop newer feedback', () => {
    const disposeObject = player.play(['object'])
    player.setContext(['feedback'])
    disposeObject()
    expect(media.onended).not.toBeNull()
    expect(media.src).toBe('feedback')
  })

  it('can start at the current sorting object, but replay includes the question', () => {
    const progress = vi.fn()
    player.setContext(['question', 'second-object'], true, progress, 1)
    expect(media.src).toBe('second-object')
    media.onplaying!()
    expect(progress).toHaveBeenLastCalledWith(1)
    player.replay()
    expect(media.src).toBe('question')
  })

  it('updates replay context without automatically restarting narration', () => {
    player.setContext(['question', 'old-option'])
    const calls = media.play.mock.calls.length
    player.setContext(['question', 'remaining-option'], false)
    expect(media.play).toHaveBeenCalledTimes(calls)
    expect(media.onended).toBeNull()
    player.replay()
    media.onended!()
    expect(media.src).toBe('remaining-option')
  })

  it('unmutes for manual audio without briefly replaying the question', () => {
    player.setContext(['question'])
    player.setEnabled(false)
    media.play.mockClear()
    player.setEnabled(true, false)
    player.play(['object'])
    expect(media.play).toHaveBeenCalledTimes(1)
    expect(media.src).toBe('object')
  })
})
describe('recording coverage', () => {
  it('maps the entire bank to the recorded 78 questions, 57 explanations and 48 objects', () => {
    expect(new Set(questions.map(q => questionClip(q.id))).size).toBe(78)
    expect(questions.filter(q => q.explanation).map(q => explanationClip(q.id))).toHaveLength(57)
    expect(Object.keys(objects).map(objectClip)).toHaveLength(48)
    expect(questionClip(1)).toMatch(/audio\/questions\/q001.mp3$/)
    expect(objectClip('o-6')).toMatch(/audio\/objects\/o-6.mp3$/)
  })
  it('never promises an explanation when no recording exists', () => {
    const q = questions.find(q => !q.explanation)!
    expect(feedbackClips(q, false)).toEqual([])
    expect(feedbackClips(q, true)).toHaveLength(1)
  })
  it('returns object-backed answer variants for the easy-mode narrator', () => {
    expect(optionIds(questions.find(question => question.id === 1)!)).toHaveLength(4)
    expect(optionIds(questions.find(question => question.id === 51)!)).toHaveLength(3)
    expect(optionIds(questions.find(question => question.id === 41)!)).toEqual([])
    for (const q of questions.filter(q => q.type === 'sorting')) expect(optionIds(q)).toEqual(q.options)
  })
  it('repeats the true fact after an incorrect response, without requesting a nonexistent explanation', () => {
    const q = questions.find(question => question.id === 41)!
    expect(feedbackClips(q, false)).toEqual([questionClip(41)])
  })
})
