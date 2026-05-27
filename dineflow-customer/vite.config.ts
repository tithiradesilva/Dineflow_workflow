import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],

  // Path alias: '@' maps to src/ — use in imports like '@/styles/...'
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  css: {
    preprocessorOptions: {
      scss: {
        // Auto-inject variables and mixins into EVERY .scss file.
        // This means you never need to manually @use these in components.
        additionalData: `
          @use "@/styles/_variables.scss" as *;
          @use "@/styles/_mixins.scss" as *;
        `
      }
    }
  }
})
