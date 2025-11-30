/**
 * Project Detection Module
 *
 * Detects project configuration: framework, Tailwind version, directory structure.
 */

import fs from 'fs-extra';
import path from 'path';

export type Framework = 'nextjs-app' | 'nextjs-pages' | 'vite' | 'remix' | 'cra' | 'unknown';
export type TailwindVersion = '3' | '4' | null;
export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';

export interface ProjectInfo {
  framework: Framework;
  tailwindVersion: TailwindVersion;
  packageManager: PackageManager;
  paths: {
    root: string;
    src: string;
    components: string;
    styles: string;
    utils: string;
    entryPoint: string | null;
    tailwindConfig: string | null;
    globalCss: string | null;
  };
  hasExistingUI: boolean;
  hasExistingUtils: boolean;
  hasExistingGlobalCss: boolean;
}

/**
 * Read and parse package.json
 */
async function readPackageJson(targetDir: string): Promise<Record<string, unknown> | null> {
  const pkgPath = path.join(targetDir, 'package.json');
  try {
    if (await fs.pathExists(pkgPath)) {
      return await fs.readJson(pkgPath);
    }
  } catch {
    // Ignore errors
  }
  return null;
}

/**
 * Detect the Tailwind CSS version
 */
async function detectTailwindVersion(targetDir: string): Promise<TailwindVersion> {
  const pkg = await readPackageJson(targetDir);
  if (!pkg) return null;

  const deps = { ...(pkg.dependencies as Record<string, string> || {}), ...(pkg.devDependencies as Record<string, string> || {}) };

  const twVersion = deps['tailwindcss'];
  if (!twVersion) return null;

  // Direct version check
  if (twVersion.startsWith('4') || twVersion.startsWith('^4') || twVersion.startsWith('~4')) {
    return '4';
  }
  if (twVersion.startsWith('3') || twVersion.startsWith('^3') || twVersion.startsWith('~3')) {
    return '3';
  }

  // Check for v4 indicators
  if (deps['@tailwindcss/postcss']) {
    return '4';
  }

  // Check postcss.config for hints
  const postcssFiles = ['postcss.config.js', 'postcss.config.mjs', 'postcss.config.cjs'];
  for (const file of postcssFiles) {
    const filePath = path.join(targetDir, file);
    if (await fs.pathExists(filePath)) {
      const content = await fs.readFile(filePath, 'utf-8');
      if (content.includes('@tailwindcss/postcss')) {
        return '4';
      }
      if (content.includes("'tailwindcss'") || content.includes('"tailwindcss"')) {
        return '3';
      }
    }
  }

  // Check for tailwind.config existence (v3 indicator)
  const configFiles = ['tailwind.config.js', 'tailwind.config.ts', 'tailwind.config.mjs'];
  for (const file of configFiles) {
    if (await fs.pathExists(path.join(targetDir, file))) {
      return '3';
    }
  }

  return null;
}

/**
 * Detect the framework being used
 */
async function detectFramework(targetDir: string): Promise<Framework> {
  const pkg = await readPackageJson(targetDir);
  if (!pkg) return 'unknown';

  const deps = { ...(pkg.dependencies as Record<string, string> || {}), ...(pkg.devDependencies as Record<string, string> || {}) };

  // Check for Next.js
  if (deps['next']) {
    // Check for App Router vs Pages Router
    if (await fs.pathExists(path.join(targetDir, 'app', 'layout.tsx')) ||
        await fs.pathExists(path.join(targetDir, 'app', 'layout.js')) ||
        await fs.pathExists(path.join(targetDir, 'src', 'app', 'layout.tsx'))) {
      return 'nextjs-app';
    }
    if (await fs.pathExists(path.join(targetDir, 'pages', '_app.tsx')) ||
        await fs.pathExists(path.join(targetDir, 'pages', '_app.js')) ||
        await fs.pathExists(path.join(targetDir, 'src', 'pages', '_app.tsx'))) {
      return 'nextjs-pages';
    }
    return 'nextjs-app'; // Default to App Router for new Next.js projects
  }

  // Check for Remix
  if (deps['@remix-run/react']) {
    return 'remix';
  }

  // Check for Vite
  if (deps['vite'] || await fs.pathExists(path.join(targetDir, 'vite.config.ts')) ||
      await fs.pathExists(path.join(targetDir, 'vite.config.js'))) {
    return 'vite';
  }

  // Check for Create React App
  if (deps['react-scripts']) {
    return 'cra';
  }

  return 'unknown';
}

/**
 * Detect the package manager being used
 */
async function detectPackageManager(targetDir: string): Promise<PackageManager> {
  if (await fs.pathExists(path.join(targetDir, 'bun.lockb'))) {
    return 'bun';
  }
  if (await fs.pathExists(path.join(targetDir, 'pnpm-lock.yaml'))) {
    return 'pnpm';
  }
  if (await fs.pathExists(path.join(targetDir, 'yarn.lock'))) {
    return 'yarn';
  }
  return 'npm';
}

/**
 * Find the tailwind config file path
 */
async function findTailwindConfig(targetDir: string): Promise<string | null> {
  const configFiles = [
    'tailwind.config.ts',
    'tailwind.config.js',
    'tailwind.config.mjs',
    'tailwind.config.cjs'
  ];

  for (const file of configFiles) {
    const filePath = path.join(targetDir, file);
    if (await fs.pathExists(filePath)) {
      return filePath;
    }
  }

  return null;
}

/**
 * Find the global CSS file path
 */
async function findGlobalCss(targetDir: string, framework: Framework): Promise<string | null> {
  const possiblePaths = [
    // Next.js App Router
    'app/globals.css',
    'src/app/globals.css',
    // Next.js Pages Router
    'styles/globals.css',
    'src/styles/globals.css',
    // Vite / CRA
    'src/index.css',
    'src/styles/globals.css',
    'src/styles/global.css',
    // Remix
    'app/styles/global.css',
    'app/root.css'
  ];

  for (const relativePath of possiblePaths) {
    const fullPath = path.join(targetDir, relativePath);
    if (await fs.pathExists(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

/**
 * Find the app entry point file
 */
async function findEntryPoint(targetDir: string, framework: Framework): Promise<string | null> {
  const entryPoints: Record<Framework, string[]> = {
    'nextjs-app': ['app/layout.tsx', 'app/layout.js', 'src/app/layout.tsx'],
    'nextjs-pages': ['pages/_app.tsx', 'pages/_app.js', 'src/pages/_app.tsx'],
    'vite': ['src/main.tsx', 'src/main.jsx', 'src/index.tsx'],
    'cra': ['src/index.tsx', 'src/index.js'],
    'remix': ['app/root.tsx', 'app/root.jsx'],
    'unknown': ['src/main.tsx', 'src/index.tsx', 'app/layout.tsx']
  };

  for (const relativePath of entryPoints[framework]) {
    const fullPath = path.join(targetDir, relativePath);
    if (await fs.pathExists(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

/**
 * Determine paths based on framework
 */
function determinePaths(
  targetDir: string,
  framework: Framework
): { src: string; components: string; styles: string; utils: string } {
  // Check if src directory exists
  const hasSrcDir = fs.pathExistsSync(path.join(targetDir, 'src'));

  switch (framework) {
    case 'nextjs-app':
      return {
        src: hasSrcDir ? 'src' : '.',
        components: hasSrcDir ? 'src/components/ui' : 'components/ui',
        styles: hasSrcDir ? 'src/styles' : 'app',
        utils: hasSrcDir ? 'src/lib/utils.ts' : 'lib/utils.ts'
      };
    case 'nextjs-pages':
      return {
        src: hasSrcDir ? 'src' : '.',
        components: hasSrcDir ? 'src/components/ui' : 'components/ui',
        styles: hasSrcDir ? 'src/styles' : 'styles',
        utils: hasSrcDir ? 'src/lib/utils.ts' : 'lib/utils.ts'
      };
    case 'remix':
      return {
        src: 'app',
        components: 'app/components/ui',
        styles: 'app/styles',
        utils: 'app/lib/utils.ts'
      };
    case 'vite':
    case 'cra':
    default:
      return {
        src: 'src',
        components: 'src/components/ui',
        styles: 'src/styles',
        utils: 'src/lib/utils.ts'
      };
  }
}

/**
 * Check if existing UI components exist
 */
async function checkExistingUI(targetDir: string, componentsPath: string): Promise<boolean> {
  const fullPath = path.join(targetDir, componentsPath);
  if (!await fs.pathExists(fullPath)) {
    return false;
  }

  const files = await fs.readdir(fullPath);
  return files.some(f => f.endsWith('.tsx') || f.endsWith('.jsx'));
}

/**
 * Check if utils.ts exists
 */
async function checkExistingUtils(targetDir: string, utilsPath: string): Promise<boolean> {
  return fs.pathExists(path.join(targetDir, utilsPath));
}

/**
 * Detect project configuration
 */
export async function detectProject(targetDir: string): Promise<ProjectInfo> {
  const framework = await detectFramework(targetDir);
  const tailwindVersion = await detectTailwindVersion(targetDir);
  const packageManager = await detectPackageManager(targetDir);
  const basePaths = determinePaths(targetDir, framework);

  const tailwindConfig = await findTailwindConfig(targetDir);
  const globalCss = await findGlobalCss(targetDir, framework);
  const entryPoint = await findEntryPoint(targetDir, framework);

  const hasExistingUI = await checkExistingUI(targetDir, basePaths.components);
  const hasExistingUtils = await checkExistingUtils(targetDir, basePaths.utils);
  const hasExistingGlobalCss = globalCss !== null;

  return {
    framework,
    tailwindVersion,
    packageManager,
    paths: {
      root: targetDir,
      ...basePaths,
      entryPoint,
      tailwindConfig,
      globalCss
    },
    hasExistingUI,
    hasExistingUtils,
    hasExistingGlobalCss
  };
}

/**
 * Validate that the project is suitable for Token Atelier
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

export async function validateProject(info: ProjectInfo): Promise<ValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check for Tailwind
  if (!info.tailwindVersion) {
    errors.push('Tailwind CSS not detected. Please install Tailwind CSS first.');
  }

  // Check for React (via package.json)
  const pkg = await readPackageJson(info.paths.root);
  if (pkg) {
    const deps = { ...(pkg.dependencies as Record<string, string> || {}), ...(pkg.devDependencies as Record<string, string> || {}) };
    if (!deps['react']) {
      errors.push('React not detected. Token Atelier requires a React project.');
    }
  } else {
    errors.push('No package.json found. Please run this command in a Node.js project.');
  }

  // Warnings
  if (info.hasExistingUI) {
    warnings.push('Existing files found in components/ui directory. These may be overwritten.');
  }

  if (info.hasExistingUtils) {
    warnings.push('Existing utils.ts file found. The cn() function will be merged if not present.');
  }

  if (info.tailwindVersion === '3' && !info.paths.tailwindConfig) {
    warnings.push('No tailwind.config.js found. One will need to be created for Tailwind v3.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings
  };
}
