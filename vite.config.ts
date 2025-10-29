import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      build: {
        // Optimize build output
        minify: 'esbuild',
        cssMinify: true,
        sourcemap: false,
        // Code splitting
        rollupOptions: {
          output: {
            manualChunks: {
              'react-vendor': ['react', 'react-dom'],
              'meta-pixel': ['@jussimirvfx/meta-pixel-tracking'],
            },
            // Optimize chunk sizes
            chunkFileNames: 'assets/js/[name]-[hash].js',
            entryFileNames: 'assets/js/[name]-[hash].js',
            assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
          },
        },
        // Increase chunk size warning limit
        chunkSizeWarningLimit: 1000,
        // Optimize for production
        target: 'es2015',
      },
      // Optimize dependencies
      optimizeDeps: {
        include: ['react', 'react-dom', '@jussimirvfx/meta-pixel-tracking'],
        exclude: [],
      },
    };
});
