import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 9001,
    host: true,
    allowedHosts: ['.devtunnels.ms'],
  },
  resolve: {
    alias: {
      'spruce-react': path.resolve(__dirname, '../src'),
    },
  },
})
