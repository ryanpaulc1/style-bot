/**
 * Templates Module
 *
 * Template strings for scaffolding new projects.
 */

/**
 * Generate package.json for a new project
 */
export function getPackageJsonTemplate(projectName: string): string {
  const pkg = {
    name: projectName,
    private: true,
    version: "0.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "tsc && vite build",
      preview: "vite preview"
    },
    dependencies: {
      "react": "^18.2.0",
      "react-dom": "^18.2.0",
      "@radix-ui/react-slot": "^1.0.2",
      "@radix-ui/react-dialog": "^1.0.5",
      "@radix-ui/react-dropdown-menu": "^2.0.6",
      "@radix-ui/react-select": "^2.0.0",
      "@radix-ui/react-checkbox": "^1.0.4",
      "@radix-ui/react-radio-group": "^1.1.3",
      "@radix-ui/react-switch": "^1.0.3",
      "@radix-ui/react-tabs": "^1.0.4",
      "@radix-ui/react-accordion": "^1.1.2",
      "@radix-ui/react-avatar": "^1.0.4",
      "@radix-ui/react-tooltip": "^1.0.7",
      "@radix-ui/react-progress": "^1.0.3",
      "@radix-ui/react-label": "^2.0.2",
      "@radix-ui/react-separator": "^1.0.3",
      "class-variance-authority": "^0.7.0",
      "clsx": "^2.0.0",
      "tailwind-merge": "^2.0.0",
      "lucide-react": "^0.294.0"
    },
    devDependencies: {
      "@types/react": "^18.2.43",
      "@types/react-dom": "^18.2.17",
      "@vitejs/plugin-react": "^4.2.1",
      "typescript": "^5.3.2",
      "vite": "^5.0.8",
      "@tailwindcss/postcss": "^4.0.0",
      "tailwindcss": "^4.0.0"
    }
  };

  return JSON.stringify(pkg, null, 2);
}

/**
 * Vite configuration for standalone project
 */
export const VITE_CONFIG_TEMPLATE = `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
`;

/**
 * TypeScript configuration
 */
export const TSCONFIG_TEMPLATE = `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
`;

/**
 * TypeScript node configuration
 */
export const TSCONFIG_NODE_TEMPLATE = `{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true,
    "strict": true
  },
  "include": ["vite.config.ts"]
}
`;

/**
 * PostCSS configuration for Tailwind v4
 */
export const POSTCSS_CONFIG_TEMPLATE = `import tailwindcss from '@tailwindcss/postcss'

export default {
  plugins: [tailwindcss()],
}
`;

/**
 * HTML template
 */
export function getIndexHtmlTemplate(projectName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${projectName}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;
}

/**
 * Main entry point
 */
export const MAIN_TSX_TEMPLATE = `import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`;

/**
 * App component template
 */
export function getAppTsxTemplate(styleName: string, fonts: { sans: string; heading: string; mono: string }): string {
  return `import { Showcase } from './components/ui/showcase'

function App() {
  return (
    <Showcase
      styleName="${styleName}"
      styleDescription="Your new project with the ${styleName} design system"
      themeMode="light"
      fonts={{
        sans: { name: '${fonts.sans}', family: 'font-sans' },
        heading: { name: '${fonts.heading}', family: 'font-heading' },
        mono: { name: '${fonts.mono}', family: 'font-mono' },
      }}
    />
  )
}

export default App
`;
}

/**
 * Utils file with cn() function
 */
export const UTILS_TEMPLATE = `import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;

/**
 * Gitignore template
 */
export const GITIGNORE_TEMPLATE = `# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?
`;
