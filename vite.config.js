import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react(), tailwindcss()],
    server: {
      proxy: {
        '/api/github': {
          target: 'https://api.github.com',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/github/, ''),
          headers: {
            'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
          },
        },
      },
    },
  }
})
