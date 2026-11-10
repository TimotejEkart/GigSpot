import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // zahtevki na /api gredo na backend, da ni težav s piškotki
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
