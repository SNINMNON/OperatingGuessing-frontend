import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

import pxtorem from 'postcss-pxtorem'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

// https://vite.dev/config/
export default defineConfig({
  server: {
    //host: '0.0.0.0',
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

    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': [
            'useDialog',
            'useMessage',
            'useNotification',
            'useLoadingBar'
          ]
        }
      ]
    }),

    Components({
      resolvers: [
        NaiveUiResolver({
          importStyle: false, // Don't auto-import styles
          resolveIcons: false // Don't auto-resolve icons
        })
      ]
    })
  ],
  css: {
    postcss: {
      plugins: [
        // pxtorem({
        //   rootValue: 14, // 改为标准的16px
        //   propList: ['*'],
        //   selectorBlackList: ['.ignore', '.hairlines'],
        //   minPixelValue: 0,
        //   mediaQuery: true, // 改为true，允许媒体查询转换
        // })
      ]
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'naive-ui': ['naive-ui'],
          'vue-vendor': ['vue', 'pinia']
        }
      }
    }
  }
})




