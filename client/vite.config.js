import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // This is the proxy section for local development
  server: {
    proxy: {
      // Any request that starts with /api
      // (e.g., /api/auth/login, /api/products)
      '/api': {
        // Will be forwarded to your backend server
        target: 'http://localhost:5000',
        // This is necessary to prevent CORS errors
        changeOrigin: true,
      },
    },
  },
});
