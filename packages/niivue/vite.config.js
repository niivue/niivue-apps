import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5184
  },
  // make all paths relative
  base: './',
  build: {
    outDir: '../desktop/src/packaged_ui',
  }
})
