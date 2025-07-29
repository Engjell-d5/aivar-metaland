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
    sourcemap: false, // Disable sourcemaps in production for better performance
    emptyOutDir: true,
    minify: 'terser', // Use terser for better minification
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
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
          'spline': ['@splinetool/react-spline', '@splinetool/runtime'],
          'chat': ['@11labs/react'],
          'utils': ['axios', 'react-responsive', 'react-icons']
        }
      }
    },
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'framer-motion',
      '@splinetool/react-spline',
      '@11labs/react',
      'axios',
      'react-responsive',
      'react-icons'
    ],
    exclude: ['@splinetool/runtime'] // Exclude heavy runtime from pre-bundling
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
