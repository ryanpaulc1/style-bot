import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// Plugin to serve styles directory at /styles/*
function serveStylesPlugin() {
  return {
    name: 'serve-styles',
    configureServer(server: any) {
      server.middlewares.use('/styles', (req: any, res: any, next: any) => {
        const filePath = path.join(__dirname, '../styles', req.url)
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const content = fs.readFileSync(filePath, 'utf-8')
          res.setHeader('Content-Type', 'text/css')
          res.end(content)
        } else {
          next()
        }
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), serveStylesPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '../shared'),  // Components use @/lib/utils, point to shared/
      '@shared': path.resolve(__dirname, '../shared'),
      '@styles': path.resolve(__dirname, '../styles'),
      // Ensure shared components resolve packages from preview's node_modules
      '@radix-ui/react-slot': path.resolve(__dirname, 'node_modules/@radix-ui/react-slot'),
      '@radix-ui/react-dialog': path.resolve(__dirname, 'node_modules/@radix-ui/react-dialog'),
      '@radix-ui/react-dropdown-menu': path.resolve(__dirname, 'node_modules/@radix-ui/react-dropdown-menu'),
      '@radix-ui/react-select': path.resolve(__dirname, 'node_modules/@radix-ui/react-select'),
      '@radix-ui/react-checkbox': path.resolve(__dirname, 'node_modules/@radix-ui/react-checkbox'),
      '@radix-ui/react-radio-group': path.resolve(__dirname, 'node_modules/@radix-ui/react-radio-group'),
      '@radix-ui/react-switch': path.resolve(__dirname, 'node_modules/@radix-ui/react-switch'),
      '@radix-ui/react-tabs': path.resolve(__dirname, 'node_modules/@radix-ui/react-tabs'),
      '@radix-ui/react-accordion': path.resolve(__dirname, 'node_modules/@radix-ui/react-accordion'),
      '@radix-ui/react-avatar': path.resolve(__dirname, 'node_modules/@radix-ui/react-avatar'),
      '@radix-ui/react-tooltip': path.resolve(__dirname, 'node_modules/@radix-ui/react-tooltip'),
      '@radix-ui/react-progress': path.resolve(__dirname, 'node_modules/@radix-ui/react-progress'),
      '@radix-ui/react-label': path.resolve(__dirname, 'node_modules/@radix-ui/react-label'),
      '@radix-ui/react-separator': path.resolve(__dirname, 'node_modules/@radix-ui/react-separator'),
      'class-variance-authority': path.resolve(__dirname, 'node_modules/class-variance-authority'),
      'clsx': path.resolve(__dirname, 'node_modules/clsx'),
      'tailwind-merge': path.resolve(__dirname, 'node_modules/tailwind-merge'),
      'lucide-react': path.resolve(__dirname, 'node_modules/lucide-react'),
    },
  },
  optimizeDeps: {
    include: [
      '@radix-ui/react-slot',
      '@radix-ui/react-dialog',
      '@radix-ui/react-dropdown-menu',
      '@radix-ui/react-select',
      '@radix-ui/react-checkbox',
      '@radix-ui/react-radio-group',
      '@radix-ui/react-switch',
      '@radix-ui/react-tabs',
      '@radix-ui/react-accordion',
      '@radix-ui/react-avatar',
      '@radix-ui/react-tooltip',
      '@radix-ui/react-progress',
      '@radix-ui/react-label',
      '@radix-ui/react-separator',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-react',
    ],
  },
})
