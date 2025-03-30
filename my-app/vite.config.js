import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 80,
    strictPort: true,
    hmr: {
      clientPort: 80, // Ensures WebSocket connects to the correct port
    },
    watch: {
      usePolling: true, // Helps with file change detection in Docker
    },
  },
})
