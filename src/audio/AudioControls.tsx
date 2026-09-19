import { useEffect, useSyncExternalStore } from 'react'
import { voice } from './player'
import { uiClip } from './clips'

export function AudioControls() {
  const { enabled, status } = useSyncExternalStore(voice.subscribe, voice.getSnapshot)
  useEffect(() => {
    const hide = () => { if (document.hidden) voice.stop() }
    document.addEventListener('visibilitychange', hide)
    window.addEventListener('pagehide', voice.stop)
    return () => { document.removeEventListener('visibilitychange', hide); window.removeEventListener('pagehide', voice.stop) }
  }, [])
  return <div className="audio-controls">
    <button type="button" aria-pressed={enabled} onClick={() => status === 'blocked' ? voice.replay() : voice.setEnabled(!enabled)}>
      {status === 'blocked' ? '▶ Включить звук' : enabled ? '🔊 Звук включён' : '🔇 Звук выключен'}
    </button>
    <span role="status">{status === 'unavailable' ? 'Запись не загрузилась. Можно продолжать игру.' : ''}</span>
  </div>
}
export function useScreenVoice(screen: string) {
  useEffect(() => {
    if (screen === 'start') voice.setContext([uiClip('greeting')])
    if (screen === 'finish') voice.setContext([uiClip('finish')])
    return voice.stop
  }, [screen])
}
export function ReplayVoice({ label = 'Послушать ещё раз' }: { label?: string }) {
  const { enabled } = useSyncExternalStore(voice.subscribe, voice.getSnapshot)
  return <button className="voice-repeat" type="button" onClick={() => enabled ? voice.replay() : voice.setEnabled(true)}>🔊 {label}</button>
}
