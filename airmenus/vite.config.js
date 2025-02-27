import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'


// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  server: {
    port: 5173,
    host: '0.0.0.0',
    strictPort: true,
    cors: true,
    allowedHosts: ['localhost', '127.0.0.1', '0.0.0.0', "de7b-49-204-143-24.ngrok-free.app"],
  },
})

