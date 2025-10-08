
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // Используем относительные пути для GitHub Pages
  build: {
    outDir: 'docs', // Меняем папку сборки на docs
    assetsDir: 'assets',
  }
})
