import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

// Load env variables
export default defineConfig(({ mode }) => {
  return {
    plugins: [tailwindcss(), react()],
    build: {
      outDir: resolve(__dirname, '../phishing-python/dist'), // build goes to backend
      emptyOutDir: true,
    },
    server: {
      port: 5173,
      proxy: {
        '/predict': mode === 'development'
          ? 'http://127.0.0.1:5000'   // local backend
          : 'https://phishing-deduction-042k.onrender.com', // Render backend
      }
    }
  }
})
