import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@calendar-css': path.resolve(__dirname, 'node_modules/@toast-ui/calendar/dist/toastui-calendar.min.css'),
      // Add aliases for leaflet and react-leaflet
      'react-leaflet': 'react-leaflet/dist/leaflet',
      leaflet: 'leaflet/dist/leaflet.js',
    },
  },
  optimizeDeps: {
    include: ['@toast-ui/calendar', 'react-leaflet', 'leaflet'],
  },
  server: {
    host: '0.0.0.0',
    port: 80,
    strictPort: true,
    hmr: {
      clientPort: 80,
    },
    watch: {
      usePolling: true,
    },
  },
});
