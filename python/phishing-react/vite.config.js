import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    outDir: resolve(__dirname, '../phishing-python/dist'), // send build into backend
    emptyOutDir: true, // clear before building
  },
  server: {
    port: 5173, // dev server port
    proxy: {
      '/predict': 'http://127.0.0.1:5000', // forward API calls to Flask
    }
  }
})
