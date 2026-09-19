import { act, type ReactNode } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, beforeEach, expect, vi } from 'vitest'
import { voice } from '../../src/audio/player'

export const media = {
  src: '', preload: '', duration: 3, readyState: 4,
  onended: null as (() => void) | null,
  onplaying: null as (() => void) | null,
  onwaiting: null as (() => void) | null,
  onstalled: null as (() => void) | null,
  onerror: null as (() => void) | null,
  play: vi.fn(() => Promise.resolve()), pause: vi.fn(),
}
let container: HTMLDivElement
let root: Root
export const setupDom = () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.stubGlobal('IS_REACT_ACT_ENVIRONMENT', true)
    vi.stubGlobal('Audio', function () { return media })
    window.history.replaceState(null, '', '/')
    localStorage.clear()
    voice.setEnabled(true, false)
    media.play.mockClear()
    media.pause.mockClear()
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
  })
  afterEach(async () => {
    await act(async () => root.unmount())
    voice.stop()
    container.remove()
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
    vi.useRealTimers()
  })
}
export const render = async (node: ReactNode) => { await act(async () => root.render(node)) }
export const element = <T extends HTMLElement = HTMLElement,>(selector: string): T => {
  const result = container.querySelector<T>(selector)
  expect(result, selector).not.toBeNull()
  return result!
}
export const elements = (selector: string) => [...container.querySelectorAll<HTMLElement>(selector)]
export const click = async (selector: string) => { await act(async () => element(selector).click()) }
export const advance = async (ms: number) => { await act(async () => vi.advanceTimersByTime(ms)) }
export const audioEvent = async (event: 'onplaying' | 'onended' | 'onwaiting' | 'onerror') => {
  expect(media[event], event).not.toBeNull()
  await act(async () => media[event]?.())
}
