// @vitest-environment jsdom
import { expect, it } from 'vitest'
import App from '../src/App'
import { setupDom, render, click, element } from './helpers/dom'

setupDom()
it('counts only the questions actually played after a direct ID start', async () => {
  window.history.replaceState(null, '', '/?id=78')
  await render(<App/>)
  expect(element('h2').textContent).toContain('космодромов')
  await click('.missing-candidates [data-object-id="o-kapustin-yar"]')
  await click('.action')
  expect(element('.finish h1').textContent).toBe('1 из 1')
  expect(element('.finish-card').textContent).toContain('Пройдены вопросы с ID 78 по ID 78.')
  expect(window.location.search).toBe('')
  await click('.finish .primary')
  expect(element('.progress-meta').textContent).toContain('1 из 78')
})

it('falls back to the start screen for an invalid question ID', async () => {
  window.history.replaceState(null, '', '/?id=999')
  await render(<App/>)
  expect(element('.start .primary').textContent).toContain('Начать')
})
