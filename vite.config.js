import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import pxtorem from 'postcss-pxtorem'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 3000,
    open: true, // auto open browser
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
      '/multiplayer': {
        target: 'ws://localhost:8080',
        changeOrigin: true,
        //rewrite: (path) => path.replace(/^\/multiplayer/, '/multiplayer'),
      },
    },
  },
  plugins: [
    vue(),
    vueDevTools(),
  ],
  css: {
    postcss: {
      plugins: [
        pxtorem({
          rootValue: 16, // 改为标准的16px
          propList: ['*'],
          selectorBlackList: ['.ignore', '.hairlines'],
          minPixelValue: 1,
          mediaQuery: true, // 改为true，允许媒体查询转换
        })
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})


