/**
 * Project Detection Module
 *
 * Detects project configuration: framework, Tailwind version, directory structure.
 */
import fs from 'fs-extra';
import path from 'path';
/**
 * Read and parse package.json
 */
async function readPackageJson(targetDir) {
    const pkgPath = path.join(targetDir, 'package.json');
    try {
        if (await fs.pathExists(pkgPath)) {
            return await fs.readJson(pkgPath);
        }
    }
    catch {
        // Ignore errors
    }
    return null;
}
/**
 * Detect the Tailwind CSS version
 */
async function detectTailwindVersion(targetDir) {
    const pkg = await readPackageJson(targetDir);
    if (!pkg)
        return null;
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
    const twVersion = deps['tailwindcss'];
    if (!twVersion)
        return null;
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
async function detectFramework(targetDir) {
    const pkg = await readPackageJson(targetDir);
    if (!pkg)
        return 'unknown';
    const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
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
async function detectPackageManager(targetDir) {
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
async function findTailwindConfig(targetDir) {
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
async function findGlobalCss(targetDir, framework) {
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
async function findEntryPoint(targetDir, framework) {
    const entryPoints = {
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
function determinePaths(targetDir, framework) {
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
async function checkExistingUI(targetDir, componentsPath) {
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
async function checkExistingUtils(targetDir, utilsPath) {
    return fs.pathExists(path.join(targetDir, utilsPath));
}
/**
 * Detect project configuration
 */
export async function detectProject(targetDir) {
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
export async function validateProject(info) {
    const errors = [];
    const warnings = [];
    // Check for Tailwind
    if (!info.tailwindVersion) {
        errors.push('Tailwind CSS not detected. Please install Tailwind CSS first.');
    }
    // Check for React (via package.json)
    const pkg = await readPackageJson(info.paths.root);
    if (pkg) {
        const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
        if (!deps['react']) {
            errors.push('React not detected. Token Atelier requires a React project.');
        }
    }
    else {
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
//# sourceMappingURL=detect.js.map