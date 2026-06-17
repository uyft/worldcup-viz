import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/',
  server: {
    proxy: {
      '/api/deepseek': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/deepseek/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.headers['authorization']) {
              proxyReq.setHeader('authorization', req.headers['authorization'])
            }
          })
        },
      },
      '/api/ai': {
        target: 'https://api.deepseek.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/ai/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq, req) => {
            if (req.headers['x-forward-authorization']) {
              proxyReq.setHeader('authorization', req.headers['x-forward-authorization'])
            }
          })
        },
      },
      '/api/chat': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
      '/api/news': {
        target: 'http://localhost:5001',
        changeOrigin: true,
      },
    },
  },
})
