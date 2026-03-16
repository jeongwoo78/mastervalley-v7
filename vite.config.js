import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: ['@revenuecat/purchases-capacitor'],
      output: {
        manualChunks: {
          'vendor-react':    ['react', 'react-dom'],
          'vendor-firebase': ['firebase/app', 'firebase/auth', 'firebase/firestore'],
          'vendor-misc':     ['react-zoom-pan-pinch'],
        }
      }
    }
  },
  resolve: {
    alias: {
      '@revenuecat/purchases-capacitor': '/src/utils/revenueCatStub.js'
    }
  },
  server: {
    port: 3000
  }
})
