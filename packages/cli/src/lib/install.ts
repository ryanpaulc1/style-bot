/**
 * Installation Module
 *
 * Handles file operations: copying, composing, merging files.
 */

import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import type { ProjectInfo, PackageManager } from './detect.js';
import type { StyleFiles } from './fetch.js';
import type { ConflictResolution, CssConflictResolution } from './conflicts.js';
import { backupDirectory, backupFile } from './conflicts.js';

export interface InstallOptions {
  force: boolean;
  skipDeps: boolean;
  componentResolution: ConflictResolution;
  cssResolution: CssConflictResolution;
}

/**
 * Install utils.ts file
 */
export async function installUtils(
  info: ProjectInfo,
  utils: string,
  hasConflict: boolean,
  hasCn: boolean
): Promise<void> {
  const utilsPath = path.join(info.paths.root, info.paths.utils);

  // Ensure lib directory exists
  await fs.ensureDir(path.dirname(utilsPath));

  if (!hasConflict) {
    // No existing file, just write
    await fs.writeFile(utilsPath, utils);
    return;
  }

  if (hasCn) {
    // Already has cn(), skip
    return;
  }

  // Merge cn() function into existing file
  const existing = await fs.readFile(utilsPath, 'utf-8');

  // Check for required imports
  let merged = existing;
  const imports: string[] = [];

  if (!existing.includes('from "clsx"') && !existing.includes("from 'clsx'")) {
    imports.push('import { clsx, type ClassValue } from "clsx"');
  }
  if (!existing.includes('from "tailwind-merge"') && !existing.includes("from 'tailwind-merge'")) {
    imports.push('import { twMerge } from "tailwind-merge"');
  }

  if (imports.length > 0) {
    merged = imports.join('\n') + '\n' + merged;
  }

  // Add cn function
  merged += `

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
`;

  await fs.writeFile(utilsPath, merged);
}

/**
 * Compose and install globals.css
 */
export async function installGlobalsCss(
  info: ProjectInfo,
  baseCss: string,
  tokens: string,
  resolution: CssConflictResolution
): Promise<string> {
  // Compose the CSS
  const composedCss = `${baseCss}

/* ===== Token Atelier - Style Tokens ===== */

${tokens}`;

  let targetPath: string;

  if (resolution === 'separate') {
    // Create separate file
    targetPath = path.join(info.paths.root, info.paths.styles, 'globals-token-atelier.css');
  } else if (info.paths.globalCss) {
    targetPath = info.paths.globalCss;
  } else {
    // Create new globals.css
    targetPath = path.join(info.paths.root, info.paths.styles, 'globals.css');
  }

  // Ensure styles directory exists
  await fs.ensureDir(path.dirname(targetPath));

  if (resolution === 'replace' && await fs.pathExists(targetPath)) {
    // Backup existing file
    await backupFile(targetPath);
    await fs.writeFile(targetPath, composedCss);
  } else if (resolution === 'append' && await fs.pathExists(targetPath)) {
    // Append to existing
    const existing = await fs.readFile(targetPath, 'utf-8');
    await fs.writeFile(targetPath, existing + '\n\n' + composedCss);
  } else {
    // Write new file
    await fs.writeFile(targetPath, composedCss);
  }

  return targetPath;
}

/**
 * Install component files
 */
export async function installComponents(
  info: ProjectInfo,
  components: Map<string, string>,
  resolution: ConflictResolution
): Promise<number> {
  const componentsDir = path.join(info.paths.root, info.paths.components);

  // Ensure directory exists
  await fs.ensureDir(componentsDir);

  // Handle backup if needed
  if (resolution === 'backup' && await fs.pathExists(componentsDir)) {
    const files = await fs.readdir(componentsDir);
    if (files.length > 0) {
      await backupDirectory(componentsDir);
    }
  }

  let installedCount = 0;

  // Determine if we need to rewrite imports (non-Next.js projects)
  const needsImportRewrite = !['nextjs-app', 'nextjs-pages'].includes(info.framework);

  for (const [filename, content] of components) {
    const filePath = path.join(componentsDir, filename);

    if (resolution === 'skip' && await fs.pathExists(filePath)) {
      continue;
    }

    // Rewrite imports for non-Next.js projects
    let finalContent = content;
    if (needsImportRewrite) {
      finalContent = rewriteImports(content);
    }

    await fs.writeFile(filePath, finalContent);
    installedCount++;
  }

  return installedCount;
}

/**
 * Rewrite @/ imports to relative imports for non-Next.js projects
 * Components are in src/components/ui/, utils is in src/lib/
 */
function rewriteImports(content: string): string {
  // Replace @/lib/utils with ../../lib/utils (from src/components/ui/ to src/lib/)
  let result = content.replace(
    /from\s+["']@\/lib\/utils["']/g,
    'from "../../lib/utils"'
  );

  // Replace ../lib/utils with ../../lib/utils (fix incorrect relative path)
  result = result.replace(
    /from\s+["']\.\.\/lib\/utils["']/g,
    'from "../../lib/utils"'
  );

  // Replace @/components/ui with relative ./ (same directory)
  result = result.replace(
    /from\s+["']@\/components\/ui\/([^"']+)["']/g,
    'from "./$1"'
  );

  return result;
}

/**
 * Merge Tailwind config (v3 only)
 */
export async function mergeTailwindConfig(
  info: ProjectInfo,
  configPatch: string
): Promise<void> {
  if (!info.paths.tailwindConfig) {
    // No existing config, create one
    const newConfigPath = path.join(info.paths.root, 'tailwind.config.js');
    await fs.writeFile(newConfigPath, configPatch);
    return;
  }

  // Read existing config
  const existingConfig = await fs.readFile(info.paths.tailwindConfig, 'utf-8');

  // This is a simple merge - in production you'd want to use AST manipulation
  // For now, we'll add a comment pointing to the patch file
  const mergeComment = `
// Token Atelier: Merge the following into your theme.extend:
// See: ${configPatch.substring(0, 200)}...
`;

  // Check if already merged
  if (existingConfig.includes('Token Atelier')) {
    return;
  }

  // Backup and append merge instructions
  await backupFile(info.paths.tailwindConfig);

  // For a proper implementation, we'd parse and merge the config
  // This simplified version just adds a note
  const updated = existingConfig + '\n' + mergeComment;
  await fs.writeFile(info.paths.tailwindConfig, updated);
}

/**
 * Install npm dependencies
 */
export async function installDependencies(
  info: ProjectInfo,
  tailwindVersion: '3' | '4'
): Promise<void> {
  const deps = [
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
    'lucide-react'
  ];

  if (tailwindVersion === '4') {
    deps.push('@tailwindcss/postcss');
  }

  const installCmd = getInstallCommand(info.packageManager, deps);
  execSync(installCmd, { cwd: info.paths.root, stdio: 'inherit' });
}

/**
 * Get the install command for a package manager
 */
function getInstallCommand(pm: PackageManager, packages: string[], dev = false): string {
  const pkgList = packages.join(' ');

  switch (pm) {
    case 'yarn':
      return `yarn add ${dev ? '-D ' : ''}${pkgList}`;
    case 'pnpm':
      return `pnpm add ${dev ? '-D ' : ''}${pkgList}`;
    case 'bun':
      return `bun add ${dev ? '-d ' : ''}${pkgList}`;
    case 'npm':
    default:
      return `npm install ${dev ? '-D ' : ''}${pkgList}`;
  }
}

/**
 * Install Tailwind CSS and set up configuration
 */
export async function installTailwindCss(
  info: ProjectInfo,
  version: '3' | '4'
): Promise<void> {
  if (version === '4') {
    // Install Tailwind v4 packages
    const deps = ['tailwindcss', '@tailwindcss/postcss', 'postcss'];
    const installCmd = getInstallCommand(info.packageManager, deps, true);
    execSync(installCmd, { cwd: info.paths.root, stdio: 'inherit' });

    // Create postcss.config.js
    const postcssConfig = `export default {
  plugins: ['@tailwindcss/postcss']
}
`;
    await fs.writeFile(path.join(info.paths.root, 'postcss.config.js'), postcssConfig);

    // Create or update main CSS file with Tailwind import
    const cssPath = path.join(info.paths.root, 'src', 'index.css');
    await fs.ensureDir(path.dirname(cssPath));

    if (await fs.pathExists(cssPath)) {
      const existing = await fs.readFile(cssPath, 'utf-8');
      if (!existing.includes('@import "tailwindcss"')) {
        await fs.writeFile(cssPath, `@import "tailwindcss";\n\n${existing}`);
      }
    } else {
      await fs.writeFile(cssPath, '@import "tailwindcss";\n');
    }

  } else {
    // Install Tailwind v3 packages
    const deps = ['tailwindcss', 'postcss', 'autoprefixer'];
    const installCmd = getInstallCommand(info.packageManager, deps, true);
    execSync(installCmd, { cwd: info.paths.root, stdio: 'inherit' });

    // Create tailwind.config.js
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
`;
    await fs.writeFile(path.join(info.paths.root, 'tailwind.config.js'), tailwindConfig);

    // Create postcss.config.js
    const postcssConfig = `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
`;
    await fs.writeFile(path.join(info.paths.root, 'postcss.config.js'), postcssConfig);

    // Create or update main CSS file with Tailwind directives
    const cssPath = path.join(info.paths.root, 'src', 'index.css');
    await fs.ensureDir(path.dirname(cssPath));

    if (await fs.pathExists(cssPath)) {
      const existing = await fs.readFile(cssPath, 'utf-8');
      if (!existing.includes('@tailwind')) {
        await fs.writeFile(cssPath, `@tailwind base;\n@tailwind components;\n@tailwind utilities;\n\n${existing}`);
      }
    } else {
      await fs.writeFile(cssPath, '@tailwind base;\n@tailwind components;\n@tailwind utilities;\n');
    }
  }
}

/**
 * Copy STYLE.md to project
 */
export async function installStyleMd(
  info: ProjectInfo,
  readme: string,
  styleName: string
): Promise<void> {
  if (!readme) return;

  const targetPath = path.join(info.paths.root, `STYLE-${styleName}.md`);
  await fs.writeFile(targetPath, readme);
}

/**
 * Copy manifest.json to project for AI reference
 */
export async function installManifest(
  info: ProjectInfo,
  manifest: string,
  styleName: string
): Promise<void> {
  const targetPath = path.join(info.paths.root, `.tokenatelier-${styleName}.json`);
  await fs.writeFile(targetPath, manifest);
}
