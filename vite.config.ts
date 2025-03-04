import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  server: {
    hmr: {
      overlay: false,
    },
    host: true,
    port: 8000,
    strictPort: true,
    // proxy: {
    //   '/api': {
    //     target: process.env.VITE_SERVER_URL,
    //     changeOrigin: true,
    //   },
    // },
  },
  plugins: [vue(), vueJsx(), vueDevTools()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
