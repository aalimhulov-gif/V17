
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/V15/', // Указываем базовый путь для GitHub Pages
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
