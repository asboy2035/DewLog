import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'pwa-icon.png', 'apple-touch-icon.png', 'PageBackground.svg'],
      manifest: {
        name: 'DewLog',
        short_name: 'DewLog',
        start_url: '/',
        display: 'standalone',
        background_color: '#121212',
        theme_color: '#121212',
        icons: [
          {
            src: '/pwa-icon.png',
            sizes: '1024x1024',
            type: 'image/png'
          },
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
