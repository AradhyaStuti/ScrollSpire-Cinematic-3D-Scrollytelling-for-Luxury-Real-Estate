import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: { port: 5173, open: true },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        manualChunks: {
          three: [
            'three',
            '@react-three/fiber',
            '@react-three/drei',
            '@react-three/postprocessing',
            'postprocessing'
          ],
          gsap: ['gsap'],
          lenis: ['lenis']
        }
      }
    }
  }
})
