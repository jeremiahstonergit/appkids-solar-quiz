import { readFile, readdir } from 'node:fs/promises'
import { createHash } from 'node:crypto'
import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { join, resolve } from 'node:path'
import assert from 'node:assert/strict'
import { fileURLToPath } from 'node:url'
process.chdir(fileURLToPath(new URL('../', import.meta.url)))
const exec = promisify(execFile)
const apk = resolve(process.argv[2] || 'android/app/build/outputs/apk/debug/app-debug.apk')
const sdk = process.env.ANDROID_HOME || process.env.ANDROID_SDK_ROOT
assert(sdk, 'Set ANDROID_HOME to your Android SDK directory')
const versions = (await readdir(join(sdk, 'build-tools'))).sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
const tools = join(sdk, 'build-tools', versions.at(-1))
const { stdout: permissions } = await exec(join(tools, 'aapt'), ['dump', 'permissions', apk])
assert.doesNotMatch(permissions, /android\.permission\.(INTERNET|ACCESS_NETWORK_STATE)/)
await exec(join(tools, 'apksigner'), ['verify', '--verbose', apk])
const unpack = async path => (await exec('unzip', ['-p', apk, `assets/${path}`], { encoding: 'buffer', maxBuffer: 10 * 1024 * 1024 })).stdout
const manifest = JSON.parse(await readFile('offline-assets.lock.json', 'utf8'))
for (const f of manifest.files) {
  const bytes = await unpack(`public/offline-assets/${f.path}`)
  assert.equal(createHash('sha256').update(bytes).digest('hex'), f.sha256, f.path)
}
const config = JSON.parse((await unpack('capacitor.config.json')).toString())
assert.equal(config.server.url, undefined)
assert.equal(config.webDir, 'dist-offline')
assert.match((await unpack('public/index.html')).toString(), /connect-src 'none'/)
const bytes = await readFile(apk)
console.log(`APK verified: signature valid, no network permission, ${manifest.files.length} resource hashes match`)
console.log(`Size: ${(bytes.length / 1024 / 1024).toFixed(1)} MiB; SHA-256: ${createHash('sha256').update(bytes).digest('hex')}`)
