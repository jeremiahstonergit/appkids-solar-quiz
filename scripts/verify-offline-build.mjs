import { readFile, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
process.chdir(fileURLToPath(new URL('../', import.meta.url)))
const manifest = JSON.parse(await readFile('offline-assets.lock.json', 'utf8'))
for (const f of manifest.files) {
  const bytes = await readFile(`dist-offline/offline-assets/${f.path}`)
  assert.equal(createHash('sha256').update(bytes).digest('hex'), f.sha256, f.path)
}
const html = await readFile('dist-offline/index.html', 'utf8')
assert.match(html, /Content-Security-Policy/)
assert.match(html, /connect-src 'none'/)
for (const name of await readdir('dist-offline/assets')) {
  if (!/\.(css|js)$/.test(name)) continue
  const text = await readFile(`dist-offline/assets/${name}`, 'utf8')
  assert.doesNotMatch(text, /s3\.regru\.cloud|fonts\.googleapis\.com|fonts\.gstatic\.com/, name)
  if (name.endsWith('.css')) assert.doesNotMatch(text, /@import|url\(["']?(?:https?:)?\/\//, name)
  for (const match of text.matchAll(/\/offline-assets\/[a-zA-Z0-9_./-]+\.(?:png|svg|woff2)/g)) {
    assert(manifest.files.some(f => `/offline-assets/${f.path}` === match[0]), `Unlisted resource: ${match[0]}`)
  }
}
assert.doesNotMatch(html, /(?:src|href)=["'](?:https?:)?\/\//)
console.log('Offline build verified: asset checksums, local references and restrictive CSP')
