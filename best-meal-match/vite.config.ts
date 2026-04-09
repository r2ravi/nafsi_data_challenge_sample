import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/nafsi_data_challenge_sample/',  // Change to your repo name if different, e.g. '/my-repo-name/'
})
