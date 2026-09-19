export type AudioStatus = 'idle' | 'loading' | 'playing' | 'blocked' | 'unavailable'
export type AudioSnapshot = { enabled: boolean; status: AudioStatus }
export type ClipProgress = (index: number | null) => void

// A single media element and generation guards prevent overlapping/stale queues.
export class VoicePlayer {
  private media?: HTMLAudioElement
  private generation = 0
  private contextGeneration = 0
  private context: string[] = []
  private contextProgress?: ClipProgress
  private activeProgress?: ClipProgress
  private listeners = new Set<() => void>()
  private cancel?: () => void
  private snapshot: AudioSnapshot = { enabled: true, status: 'idle' }
  constructor(private factory: () => HTMLAudioElement = () => new Audio()) {
    try { this.snapshot.enabled = localStorage.getItem('appkids-sound') !== 'off' } catch { /* optional storage */ }
  }
  getSnapshot = () => this.snapshot
  subscribe = (listener: () => void) => { this.listeners.add(listener); return () => { this.listeners.delete(listener) } }
  private update(status: AudioStatus) {
    this.snapshot = { ...this.snapshot, status }
    this.listeners.forEach(listener => listener())
  }
  stop = () => {
    this.generation++
    this.cancel?.()
    this.cancel = undefined
    this.media?.pause()
    const progress = this.activeProgress
    this.activeProgress = undefined
    progress?.(null)
    this.update('idle')
  }
  setEnabled(enabled: boolean, replay = true) {
    this.snapshot = { ...this.snapshot, enabled }
    try { localStorage.setItem('appkids-sound', enabled ? 'on' : 'off') } catch { /* optional storage */ }
    if (enabled && replay) this.replay()
    else this.stop()
  }
  // An old screen's disposer must not stop a newer screen.
  // autoplayFrom lets sorting announce the next object without repeating the question.
  setContext(clips: string[], autoplay = true, progress?: ClipProgress, autoplayFrom = 0) {
    const owner = ++this.contextGeneration
    this.context = [...clips]
    this.contextProgress = progress
    if (autoplay) this.play(this.context, progress, autoplayFrom)
    else this.stop()
    return () => {
      if (owner !== this.contextGeneration) return
      this.contextGeneration++
      this.stop()
      this.context = []
      this.contextProgress = undefined
    }
  }
  replay = () => this.play(this.context, this.contextProgress)
  play = (clips: string[], progress?: ClipProgress, startIndex = 0): (() => void) => {
    this.stop()
    const generation = this.generation
    const dispose = () => { if (generation === this.generation) this.stop() }
    progress?.(null)
    if (!this.snapshot.enabled || startIndex < 0 || startIndex >= clips.length) return dispose
    // A delayed sorting timer must not restart sound after the page goes to background.
    if (typeof document !== 'undefined' && document.hidden) return dispose
    const media = this.media ??= this.factory()
    this.activeProgress = progress
    let failed = false
    const next = (index: number) => {
      if (generation !== this.generation) return
      if (index === clips.length) {
        this.cancel = undefined
        this.activeProgress = undefined
        this.update(failed ? 'unavailable' : 'idle')
        return
      }
      let settled = false
      let timeout: ReturnType<typeof setTimeout>
      const current = () => !settled && generation === this.generation
      const cleanup = () => {
        clearTimeout(timeout)
        media.onended = null
        media.onerror = null
        media.onplaying = null
        media.onwaiting = null
        media.onstalled = null
      }
      const finish = (error = false) => {
        if (!current()) return
        settled = true
        cleanup()
        media.pause()
        progress?.(null)
        failed ||= error
        next(index + 1)
      }
      const waiting = () => {
        if (!current()) return
        clearTimeout(timeout)
        progress?.(null)
        this.update('loading')
        timeout = setTimeout(() => finish(true), 12000)
      }
      this.cancel = () => { settled = true; cleanup() }
      media.onended = () => finish()
      media.onerror = () => finish(true)
      media.onwaiting = waiting
      media.onstalled = () => { if (media.readyState < 3) waiting() }
      media.onplaying = () => {
        if (!current()) return
        clearTimeout(timeout)
        progress?.(index)
        this.update('playing')
        timeout = setTimeout(() => finish(true), (Number.isFinite(media.duration) ? media.duration + 10 : 60) * 1000)
      }
      media.src = clips[index]
      media.preload = 'auto'
      waiting()
      try {
        void media.play().catch(error => {
          if (!current()) return
          if (error?.name === 'NotAllowedError') {
            settled = true
            cleanup()
            media.pause()
            progress?.(null)
            this.activeProgress = undefined
            this.cancel = undefined
            this.update('blocked')
          } else finish(true)
        })
      } catch { finish(true) }
    }
    next(startIndex)
    return dispose
  }
}
export const voice = new VoicePlayer()
