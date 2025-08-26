/// <reference types="vitest" />
import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    // Configuración de base path para diferentes entornos
    const base = mode === 'production' && process.env.VERCEL 
      ? '/' 
      : mode === 'production' 
      ? '/Medicion-del-Servicio/' 
      : '/';
    
    return {
      base,
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      build: {
        rollupOptions: {
          output: {
            manualChunks: {
              vendor: ['react', 'react-dom'],
              charts: ['recharts'],
              utils: ['papaparse', 'lucide-react'],
              dashboard: ['./src/features/dashboard'],
              analytics: ['./src/features/analytics'],
              reports: ['./src/features/reports']
            }
          }
        },
        chunkSizeWarningLimit: 1000
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, './src'),
          '@components': path.resolve(__dirname, './src/components'),
          '@pages': path.resolve(__dirname, './src/pages'),
          '@features': path.resolve(__dirname, './src/features'),
          '@services': path.resolve(__dirname, './src/services'),
          '@types': path.resolve(__dirname, './src/types'),
          '@utils': path.resolve(__dirname, './src/utils'),
          '@hooks': path.resolve(__dirname, './src/hooks'),
          '@assets': path.resolve(__dirname, './src/assets')
        }
      },
      test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./__tests__/setup.ts'],
        css: true,
        coverage: {
          provider: 'v8',
          reporter: ['text', 'json', 'html'],
          exclude: [
            'node_modules/',
            '__tests__/',
            'scripts/',
            'docs/',
            '**/*.d.ts',
            '**/*.config.*',
            'dist/'
          ],
          thresholds: {
            global: {
              branches: 85,
              functions: 85,
              lines: 85,
              statements: 85
            }
          }
        }
      }
    };
});
