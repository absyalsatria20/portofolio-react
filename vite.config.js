import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react-vendor', test: /[\\/]node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
            { name: 'motion-vendor', test: /[\\/]node_modules[\\/]framer-motion[\\/]/ },
            { name: 'supabase-vendor', test: /[\\/]node_modules[\\/]@supabase[\\/]/ },
          ],
        },
      },
    },
  },
})
