import { expect, it } from 'vitest'
import config from '../capacitor.config.json'
import manifest from '../android/app/src/main/AndroidManifest.xml?raw'
import activity from '../android/app/src/main/java/com/appkids/solarsystem/MainActivity.java?raw'

it('packages only the offline main build, without live reload or remote navigation', () => {
  expect(config.webDir).toBe('dist-offline')
  expect(config.appId).toBe('com.appkids.solarsystem')
  expect(config.server).toEqual({ hostname: 'localhost', androidScheme: 'https', cleartext: false })
  expect(config.android.allowMixedContent).toBe(false)
  expect(config.android.webContentsDebuggingEnabled).toBe(false)
})

it('removes network permissions during manifest merging and disables backup', () => {
  for (const name of ['INTERNET', 'ACCESS_NETWORK_STATE']) {
    expect(manifest).toContain(`android:name="android.permission.${name}" tools:node="remove"`)
  }
  expect(manifest).toContain('android:usesCleartextTraffic="false"')
  expect(manifest).toContain('android:allowBackup="false"')
  expect(activity).toContain('setBlockNetworkLoads(true)')
})
