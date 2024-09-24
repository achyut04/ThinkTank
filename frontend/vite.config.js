import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: './postcss.config.js',  // Ensure this points to PostCSS config
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',  // Your backend server
        changeOrigin: true,  // This ensures the host header of the request is changed to the target URL
        secure: false,  // Set to false if your backend is using http
      },
    },
  },
});
