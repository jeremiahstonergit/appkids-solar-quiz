import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'node:fs'

export default defineConfig(({ mode }) => {
  const offline = mode === 'offline'
  return {
    publicDir: offline ? 'offline-public' : 'public',
    build: { outDir: offline ? 'dist-offline' : 'dist' },
    plugins: [react(), ...(offline ? [{
      name: 'appkids-offline-resources',
      enforce: 'pre' as const,
      transform(code: string, id: string) {
        if (!id.endsWith('/src/styles.css')) return
        return code
          .replace(/@import url\('https:\/\/fonts\.googleapis\.com[^']+'\);/, readFileSync('offline-public/offline-assets/fonts/manrope.css', 'utf8'))
          .replaceAll('https://appkids.s3.regru.cloud/prototype/solar-system/v1', '/offline-assets')
      },
      transformIndexHtml(html: string) {
        // Same-origin files only; no fetch/XHR, frames or remote fallbacks.
        const policy = "default-src 'none'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; media-src 'self'; font-src 'self'; connect-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'"
        return html.replace('<head>', `<head><meta http-equiv="Content-Security-Policy" content="${policy}">`)
      },
    }] : [])],
  }
})
