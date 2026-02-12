import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      connectkit: path.resolve(__dirname, '../../packages/connectkit/src'),
      '@yourorg/cosmos-connect-react': path.resolve(
        __dirname,
        '../../../packages/react/src'
      ),
      '@yourorg/cosmos-connect-core': path.resolve(
        __dirname,
        '../../../packages/core/src'
      ),
    },
  },
  define: {
    global: 'globalThis',
  },
  server: {
    allowedHosts: true,
  },
});
