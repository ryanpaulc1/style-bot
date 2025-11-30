/**
 * Scaffold Module
 *
 * Creates a new project directory with all necessary files.
 */

import fs from 'fs-extra';
import path from 'path';
import type { Ora } from 'ora';
import { fetchStyleFiles, type StyleFiles } from './fetch.js';
import {
  getPackageJsonTemplate,
  getIndexHtmlTemplate,
  getAppTsxTemplate,
  VITE_CONFIG_TEMPLATE,
  TSCONFIG_TEMPLATE,
  TSCONFIG_NODE_TEMPLATE,
  POSTCSS_CONFIG_TEMPLATE,
  MAIN_TSX_TEMPLATE,
  UTILS_TEMPLATE,
  GITIGNORE_TEMPLATE
} from './templates.js';

/**
 * Font configuration extracted from manifest
 */
interface FontConfig {
  sans: string;
  heading: string;
  mono: string;
}

/**
 * Rewrite @/ imports to relative imports for standalone projects
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
 * Extract font names from manifest typography section
 */
function extractFonts(manifest: string): FontConfig {
  try {
    const parsed = JSON.parse(manifest);
    const fonts = parsed.tokens?.typography?.fontFamily || {};

    // Extract first font name from font stack (e.g., "Nunito, ui-sans-serif" -> "Nunito")
    const extractFirstFont = (fontStack: string): string => {
      if (!fontStack) return 'Inter';
      const first = fontStack.split(',')[0].trim();
      // Remove quotes if present
      return first.replace(/["']/g, '');
    };

    return {
      sans: extractFirstFont(fonts.sans || 'Inter, ui-sans-serif'),
      heading: extractFirstFont(fonts.heading || fonts.sans || 'Inter, ui-sans-serif'),
      mono: extractFirstFont(fonts.mono || 'JetBrains Mono, monospace')
    };
  } catch {
    return {
      sans: 'Inter',
      heading: 'Inter',
      mono: 'JetBrains Mono'
    };
  }
}

/**
 * Compose CSS from base + tokens + fonts
 */
function composeCss(baseCss: string, tokens: string, fonts: string): string {
  // Extract @import statements from tokens (fonts are often embedded there)
  const importRegex = /@import\s+url\([^)]+\);?/g;
  const tokenImports = tokens.match(importRegex) || [];
  const tokensWithoutImports = tokens.replace(importRegex, '').trim();

  // Combine fonts from fonts.css and any found in tokens
  let allFontImports = '';
  if (fonts) {
    allFontImports = fonts.trim();
  }
  if (tokenImports.length > 0) {
    if (allFontImports) {
      allFontImports += '\n' + tokenImports.join('\n');
    } else {
      allFontImports = tokenImports.join('\n');
    }
  }

  // Replace the font imports placeholder with actual font imports
  let processedBaseCss = baseCss;
  if (allFontImports) {
    processedBaseCss = baseCss.replace('/* STYLE_FONT_IMPORTS */', allFontImports);
  } else {
    processedBaseCss = baseCss.replace('/* STYLE_FONT_IMPORTS */\n\n', '');
    processedBaseCss = processedBaseCss.replace('/* STYLE_FONT_IMPORTS */\n', '');
    processedBaseCss = processedBaseCss.replace('/* STYLE_FONT_IMPORTS */', '');
  }

  return `${processedBaseCss}

/* ===== Token Atelier - Style Tokens ===== */

${tokensWithoutImports}`;
}

/**
 * Scaffold a new project
 */
export async function scaffoldProject(
  targetDir: string,
  styleName: string,
  spinner: Ora
): Promise<void> {
  const projectName = path.basename(targetDir);

  // Create directory structure
  spinner.text = 'Creating directories...';
  await fs.ensureDir(path.join(targetDir, 'src/components/ui'));
  await fs.ensureDir(path.join(targetDir, 'src/lib'));

  // Fetch style files
  spinner.text = 'Fetching style files...';
  const files = await fetchStyleFiles(styleName, '4');

  // Extract font configuration from manifest
  const fonts = extractFonts(files.manifest);

  // Write configuration files
  spinner.text = 'Writing configuration files...';
  await Promise.all([
    fs.writeFile(path.join(targetDir, 'package.json'), getPackageJsonTemplate(projectName)),
    fs.writeFile(path.join(targetDir, 'vite.config.ts'), VITE_CONFIG_TEMPLATE),
    fs.writeFile(path.join(targetDir, 'tsconfig.json'), TSCONFIG_TEMPLATE),
    fs.writeFile(path.join(targetDir, 'tsconfig.node.json'), TSCONFIG_NODE_TEMPLATE),
    fs.writeFile(path.join(targetDir, 'postcss.config.js'), POSTCSS_CONFIG_TEMPLATE),
    fs.writeFile(path.join(targetDir, 'index.html'), getIndexHtmlTemplate(projectName)),
    fs.writeFile(path.join(targetDir, '.gitignore'), GITIGNORE_TEMPLATE),
  ]);

  // Write source files
  spinner.text = 'Writing source files...';
  await Promise.all([
    fs.writeFile(path.join(targetDir, 'src/main.tsx'), MAIN_TSX_TEMPLATE),
    fs.writeFile(path.join(targetDir, 'src/App.tsx'), getAppTsxTemplate(styleName, fonts)),
    fs.writeFile(path.join(targetDir, 'src/lib/utils.ts'), UTILS_TEMPLATE),
  ]);

  // Compose and write CSS
  spinner.text = 'Writing styles...';
  const css = composeCss(files.baseCss, files.tokens, files.fonts);
  await fs.writeFile(path.join(targetDir, 'src/index.css'), css);

  // Write components with import rewriting
  spinner.text = 'Writing components...';
  const componentsDir = path.join(targetDir, 'src/components/ui');

  for (const [filename, content] of files.components) {
    const rewritten = rewriteImports(content);
    await fs.writeFile(path.join(componentsDir, filename), rewritten);
  }

  // Write manifest for AI reference
  spinner.text = 'Writing manifest...';
  await fs.writeFile(
    path.join(targetDir, `.tokenatelier-${styleName}.json`),
    files.manifest
  );

  // Write style documentation if available
  if (files.readme) {
    await fs.writeFile(
      path.join(targetDir, `STYLE-${styleName}.md`),
      files.readme
    );
  }
}

/**
 * Validate project name for npm
 */
export function isValidProjectName(name: string): boolean {
  // npm package name rules (simplified)
  if (!name || name.length === 0) return false;
  if (name.length > 214) return false;
  if (name.startsWith('.') || name.startsWith('_')) return false;
  if (name !== name.toLowerCase()) return false;
  if (/[~'!()*]/.test(name)) return false;
  if (encodeURIComponent(name) !== name) {
    // Has special characters that need encoding (except @ and /)
    if (!/^@[^/]+\/[^/]+$/.test(name)) return false;
  }
  return true;
}
