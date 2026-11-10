import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    target: 'es2022',
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : []
  },
  build: {
    target: 'es2022',
    cssMinify: true
  }
});
