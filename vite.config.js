import path from 'node:path'
import svgr from 'vite-plugin-svgr'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  build: {
    outDir: 'build',
    minify: false,
    sourcemap: false,
    target: 'esnext',
  },
  server: {
    host: '0.0.0.0',
    port: 80,
  },
  resolve: {
    alias: {
      '@/': `${path.resolve(__dirname, 'src')}/`,
    },
  },
  assetsInclude: 'src/icons/**/*.svg',
  plugins: [
    svgr({
      svgrOptions: {
        plugins: ['@svgr/plugin-svgo', '@svgr/plugin-jsx'],
      },
    }),
    react(),
  ],
  define: {
    global: {},
  },
})
