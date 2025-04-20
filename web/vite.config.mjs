import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

const repoName = '/kube-i18n-status/';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './vitest.setup.mjs',
  },
  server: {
    fs: {
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      '@/data': path.resolve(__dirname, '../data'),
    },
  },
  base: process.env.NODE_ENV === 'production' ? repoName : '/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
