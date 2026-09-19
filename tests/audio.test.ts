import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { VoicePlayer } from '../src/audio/player'
import { feedbackClips, questionClip, explanationClip, objectClip } from '../src/audio/clips'
import { questions } from '../src/data/questions'
import { objects } from '../src/data/objects'

class FakeAudio {
  src = ''
  preload = ''
  duration = 3
  onended: (() => void) | null = null
  onerror: (() => void) | null = null
  onplaying: (() => void) | null = null
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
})
