import { defineConfig } from 'vite';
import tailwindcss from 'tailwindcss'
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  envDir: path.resolve(__dirname, '../../'),

  css: {
    postcss: {
      plugins: [tailwindcss],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3500,
    host: true,
  },
});
