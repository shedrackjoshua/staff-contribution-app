import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  // When deploying to GitHub Pages, set the base to the repository name
  // so assets are loaded from the correct path (e.g. https://<user>.github.io/<repo>/)
  base: '/staff-contribution-app/',
  plugins: [vue()],
})
