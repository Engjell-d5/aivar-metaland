import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
  // Use relative paths (base: '') instead of absolute paths (base: '/')
  base: '',
  plugins: [
    react(), 
    tailwindcss(),
    viteStaticCopy({
      targets: [
        {
          src: 'public/.htaccess',
          dest: ''
        }
      ]
    }),
  ],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    emptyOutDir: true,
    rollupOptions: {
      output: {
        // Ensure proper MIME types by using standard file extensions
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        // Improve chunking for better performance
        manualChunks: {
          'vendor': [
            'react', 
            'react-dom', 
            'react-router-dom',
            'framer-motion'
          ],
          'spline': ['@splinetool/react-spline', '@splinetool/runtime']
        }
      }
    }
  },
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    port: 4173,
    host: true,
    strictPort: true,
    open: true
  }
})
