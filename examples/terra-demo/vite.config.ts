import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: '/luncconnect/',
  plugins: [react()],
  resolve: {
    dedupe: ['react', 'react-dom', 'styled-components'],
  },
  define: {
    global: 'globalThis',
  },
  server: {
    allowedHosts: true,
  },
});
