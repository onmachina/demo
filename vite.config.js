import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 3000,
  },
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  build: {
    commonjsOptions: { include: [] },
  },
  optimizeDeps: {
    disabled: false,
  },
});
