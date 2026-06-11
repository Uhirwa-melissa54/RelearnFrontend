import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
const apiProxy = {
  // All /api/* requests are forwarded to the API Gateway
  '/api': {
    target: 'http://127.0.0.1:8080',
    changeOrigin: true,
    secure: false,
    timeout: 120000,
  },
}

export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 5173,
    proxy: apiProxy,
  },
  preview: {
    host: 'localhost',
    port: 5173,
    proxy: apiProxy,
  },
})