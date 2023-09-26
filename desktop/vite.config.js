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
  // update the root directory to point to index.html in the ui folder
  root: './src/ui/',
  build: {
    outDir: '../electron/ui',
  }
})
