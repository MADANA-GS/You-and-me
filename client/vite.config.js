import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Allows access from any network
    port: 5173, // Change if needed
    allowedHosts: ['.ngrok-free.app'], // Allows all subdomains of ngrok-free.app
  },
})
