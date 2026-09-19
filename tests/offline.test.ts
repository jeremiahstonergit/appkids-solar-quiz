import { afterEach, expect, it, vi } from 'vitest'
import manifest from '../offline-assets.lock.json'

afterEach(() => { vi.unstubAllEnvs(); vi.resetModules() })

it.each(['production', 'offline'])('uses the correct resource origin in %s', async mode => {
  vi.stubEnv('MODE', mode)
  vi.resetModules()
  const { ASSET_BASE } = await import('../src/constants/assets')
  const { questionClip, explanationClip, objectClip, uiClip } = await import('../src/audio/clips')
  const base = mode === 'offline' ? '/offline-assets' : 'https://appkids.s3.regru.cloud/prototype/solar-system/v1'
  expect(ASSET_BASE).toBe(base)
  expect(questionClip(1)).toBe(`${base}/audio/questions/q001.mp3`)
  expect(explanationClip(2)).toBe(`${base}/audio/explanations/e002.mp3`)
  expect(objectClip('o-6')).toBe(`${base}/audio/objects/o-6.mp3`)
  expect(uiClip('praise')).toMatch(new RegExp(`^${base}/audio/ui/praise_0[1-8]\\.mp3$`))
})

it('locks the complete agreed resource pack without duplicate or unsafe paths', () => {
  const paths: string[] = manifest.files.map((f: { path: string }) => f.path)
  expect(paths).toHaveLength(266)
  expect(new Set(paths).size).toBe(paths.length)
  expect(paths.filter(p => p.endsWith('.mp3'))).toHaveLength(203)
  expect(paths.filter(p => /\.(png|svg)$/.test(p))).toHaveLength(55)
  expect(paths.filter(p => p.endsWith('.woff2'))).toHaveLength(6)
  for (const file of manifest.files) {
    expect(file.path).not.toMatch(/(^\/|\.\.|https?:)/)
    expect(file.sha256).toMatch(/^[a-f0-9]{64}$/)
    expect(file.bytes).toBeGreaterThan(0)
  }
})
