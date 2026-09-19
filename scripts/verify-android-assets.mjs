import { readFile } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
process.chdir(fileURLToPath(new URL('../', import.meta.url)))
const directory = 'android/app/src/main/assets'
const config = JSON.parse(await readFile(`${directory}/capacitor.config.json`, 'utf8'))
assert.equal(config.webDir, 'dist-offline')
assert.equal(config.server.url, undefined)
assert.equal(config.server.cleartext, false)
const index = await readFile(`${directory}/public/index.html`)
assert(index.equals(await readFile('dist-offline/index.html')), 'Android contains stale web assets')
const manifest = JSON.parse(await readFile('offline-assets.lock.json', 'utf8'))
for (const f of manifest.files) {
  const bytes = await readFile(`${directory}/public/offline-assets/${f.path}`)
  assert.equal(createHash('sha256').update(bytes).digest('hex'), f.sha256, f.path)
}
console.log(`Android bundle verified: ${manifest.files.length} local resources, no remote server`)
