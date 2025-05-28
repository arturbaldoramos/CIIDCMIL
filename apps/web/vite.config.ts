import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    host: '0.0.0.0', // Permite acesso de qualquer interface de rede (incluindo IP local)
    port: 5173, // Porta padrão do Vite
    proxy: {
      '/api': 'http://localhost:3000',
    },
  },
})
