import { readFile, writeFile, mkdir, access, mkdtemp } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { fileURLToPath } from 'node:url'
const exec = promisify(execFile)
const root = new URL('../', import.meta.url)
process.chdir(fileURLToPath(root))
const directory = 'offline-public/offline-assets'
const manifestPath = 'offline-assets.lock.json'
const command = process.argv[2]
const lock = process.argv.includes('--lock')
const sourceArg = process.argv.indexOf('--audio-source')
const audioSource = sourceArg < 0 ? undefined : process.argv[sourceArg + 1]
const s3 = 'https://appkids.s3.regru.cloud/prototype/solar-system/v1'
const fontPackage = 'https://registry.npmjs.org/@fontsource-variable/manrope/-/manrope-5.3.0.tgz'
const hash = bytes => createHash('sha256').update(bytes).digest('hex')
const parseData = async path => JSON.parse((await readFile(path, 'utf8')).match(/=\s*(\[[\s\S]*?^\])/m)[1])
const questions = await parseData('src/data/questions.ts')
const objects = await parseData('src/data/objects.ts')
const pad = n => String(n).padStart(3, '0')
const paths = [
  ...objects.filter(o => o.file).map(o => `objects/${o.file}`),
  ...['bg_start_solar_system', 'bg_question_space', 'bg_finish_space'].map(n => `backgrounds/${n}.png`),
  ...['hero_start_solar_system', 'hero_finish_success'].map(n => `heroes/${n}.png`),
  ...['check', 'cross', 'drag', 'home', 'question', 'restart'].map(n => `icons/icon_${n}.svg`),
  ...questions.map(q => `audio/questions/q${pad(q.id)}.mp3`),
  ...questions.filter(q => q.explanation).map(q => `audio/explanations/e${pad(q.id)}.mp3`),
  ...objects.map(o => `audio/objects/${o.id}.mp3`),
  ...Object.entries({ greeting: 4, praise: 8, encourage: 4, finish: 4 }).flatMap(([kind, count]) =>
    Array.from({ length: count }, (_, i) => `audio/ui/${kind}_${String(i + 1).padStart(2, '0')}.mp3`)),
  ...['cyrillic-ext', 'cyrillic', 'greek', 'vietnamese', 'latin-ext', 'latin'].map(n => `fonts/manrope-${n}-wght-normal.woff2`),
  'fonts/manrope.css', 'fonts/OFL.txt',
].sort()
let manifest
try { manifest = JSON.parse(await readFile(manifestPath, 'utf8')) } catch (e) { if (!lock) throw e }
if (manifest && JSON.stringify(manifest.files.map(f => f.path)) !== JSON.stringify(paths)) throw Error('Asset list differs from lock; review content and explicitly regenerate lock')
const download = async url => (await exec('curl', ['--fail', '--location', '--silent', '--show-error', '--max-time', '60', url], { encoding: 'buffer', maxBuffer: 20 * 1024 * 1024 })).stdout
if (!['prepare', 'verify'].includes(command)) throw Error('Use prepare or verify')
let fontArchive
async function loadFont(path) {
  if (!fontArchive) {
    fontArchive = (async () => {
      const bytes = await download(fontPackage)
      if (manifest && hash(bytes) !== manifest.fontArchiveSha256) throw Error('Font package checksum mismatch')
      const temporary = await mkdtemp(join(tmpdir(), 'appkids-font-'))
      const archive = join(temporary, 'manrope.tgz')
      await writeFile(archive, bytes)
      return { archive, sha256: hash(bytes) }
    })()
  }
  const { archive } = await fontArchive
  const entry = path.endsWith('OFL.txt') ? 'package/LICENSE' : path.endsWith('.css') ? 'package/wght.css' : `package/files/${path.split('/').pop()}`
  const { stdout } = await exec('tar', ['-xOzf', archive, entry], { encoding: 'buffer', maxBuffer: 2 * 1024 * 1024 })
  return path.endsWith('.css') ? Buffer.from(stdout.toString().replaceAll('Manrope Variable', 'Manrope').replaceAll('./files/', '/offline-assets/fonts/')) : stdout
}
const results = []
let cursor = 0
await Promise.all(Array.from({ length: 6 }, async () => {
  while (cursor < paths.length) {
    const path = paths[cursor++]
    const target = join(directory, path)
    const expected = manifest?.files.find(f => f.path === path)
    let bytes
    try { await access(target); bytes = await readFile(target) } catch {
      if (command === 'verify') throw Error(`Missing offline asset: ${path}; run npm run assets:prepare first`)
      bytes = path.startsWith('fonts/') ? await loadFont(path)
        : audioSource && path.startsWith('audio/') ? await readFile(join(audioSource, path.slice(6)))
        : await download(`${s3}/${path}`)
      if (expected && hash(bytes) !== expected.sha256) throw Error(`Checksum mismatch: ${path}`)
      await mkdir(dirname(target), { recursive: true })
      await writeFile(target, bytes)
    }
    const sha256 = hash(bytes)
    if (expected && (sha256 !== expected.sha256 || bytes.length !== expected.bytes)) throw Error(`Invalid offline asset: ${path}`)
    results.push({ path, bytes: bytes.length, sha256 })
  }
}))
results.sort((a, b) => a.path < b.path ? -1 : a.path > b.path ? 1 : 0)
if (lock) {
  const fontArchiveSha256 = fontArchive ? (await fontArchive).sha256 : manifest?.fontArchiveSha256
  if (!fontArchiveSha256) throw Error('Cannot create lock without font provenance')
  await writeFile(manifestPath, JSON.stringify({ version: 1, fontPackage, fontArchiveSha256, files: results }, null, 2) + '\n')
}
console.log(`Verified ${results.length} offline assets; ${(results.reduce((n, f) => n + f.bytes, 0) / 1024 / 1024).toFixed(1)} MiB`)
