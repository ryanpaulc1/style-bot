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

  for (const [filename, content] of components) {
    const filePath = path.join(componentsDir, filename);

    if (resolution === 'skip' && await fs.pathExists(filePath)) {
      continue;
    }

    await fs.writeFile(filePath, content);
    installedCount++;
  }

  return installedCount;
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
function getInstallCommand(pm: PackageManager, packages: string[]): string {
  const pkgList = packages.join(' ');

  switch (pm) {
    case 'yarn':
      return `yarn add ${pkgList}`;
    case 'pnpm':
      return `pnpm add ${pkgList}`;
    case 'bun':
      return `bun add ${pkgList}`;
    case 'npm':
    default:
      return `npm install ${pkgList}`;
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
