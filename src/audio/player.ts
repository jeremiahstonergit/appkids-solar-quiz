export type AudioStatus = 'idle' | 'playing' | 'blocked' | 'unavailable'
export type AudioSnapshot = { enabled: boolean; status: AudioStatus }

// One reusable media element: no overlapping voices, including delayed play() promises.
export class VoicePlayer {
  private media?: HTMLAudioElement
  private generation = 0
  private context: string[] = []
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
    this.update('idle')
  }
  setEnabled(enabled: boolean) {
    this.snapshot = { ...this.snapshot, enabled }
    try { localStorage.setItem('appkids-sound', enabled ? 'on' : 'off') } catch { /* optional storage */ }
    if (enabled) this.replay()
    else this.stop()
  }
  setContext(clips: string[], autoplay = true) {
    this.context = clips
    if (autoplay) this.play(clips)
  }
  replay = () => this.play(this.context)
  play = (clips: string[]) => {
    this.stop()
    if (!this.snapshot.enabled || !clips.length) return
    const generation = this.generation
    const media = this.media ??= this.factory()
    let failed = false
    const next = (index: number) => {
      if (generation !== this.generation) return
      if (index === clips.length) { this.update(failed ? 'unavailable' : 'idle'); return }
      let settled = false
      let timeout: ReturnType<typeof setTimeout>
      const cleanup = () => {
        clearTimeout(timeout)
        media.onended = null
        media.onerror = null
        media.onplaying = null
      }
      const finish = (error = false) => {
        if (settled || generation !== this.generation) return
        settled = true
        cleanup()
        media.pause()
        failed ||= error
        next(index + 1)
      }
      this.cancel = () => { settled = true; cleanup() }
      media.onended = () => finish()
      media.onerror = () => finish(true)
      media.onplaying = () => {
        clearTimeout(timeout)
        timeout = setTimeout(() => finish(true), (Number.isFinite(media.duration) ? media.duration + 10 : 60) * 1000)
      }
      media.src = clips[index]
      media.preload = 'auto'
      timeout = setTimeout(() => finish(true), 12000)
      this.update('playing')
      try {
        void media.play().catch(error => {
          if (settled || generation !== this.generation) return
          if (error?.name === 'NotAllowedError') {
            settled = true
            cleanup()
            this.update('blocked')
          } else finish(true)
        })
      } catch { finish(true) }
    }
    next(0)
  }
}
export const voice = new VoicePlayer()
