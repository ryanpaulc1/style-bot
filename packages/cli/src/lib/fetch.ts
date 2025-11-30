/**
 * File Fetching Module
 *
 * Fetches style files from GitHub or the Token Atelier API.
 * For testing: set TOKEN_ATELIER_SOURCE to override the source URL.
 */

import type { TailwindVersion } from './detect.js';

// Base URL for fetching files (can be overridden for testing)
const SOURCE_BASE = process.env.TOKEN_ATELIER_SOURCE ||
  'https://raw.githubusercontent.com/ryanpaulc1/style-bot/staging';

export interface StyleFiles {
  manifest: string;
  utils: string;
  baseCss: string;
  tokens: string;
  fonts: string;
  components: Map<string, string>;
  readme: string;
  tailwindConfigPatch: string | null;
}

// List of all component files to fetch
const COMPONENT_FILES = [
  'accordion.tsx',
  'alert.tsx',
  'avatar.tsx',
  'badge.tsx',
  'button.tsx',
  'card.tsx',
  'checkbox.tsx',
  'dialog.tsx',
  'dropdown-menu.tsx',
  'index.ts',
  'input.tsx',
  'label.tsx',
  'progress.tsx',
  'radio-group.tsx',
  'select.tsx',
  'separator.tsx',
  'showcase.tsx',
  'skeleton.tsx',
  'switch.tsx',
  'tabs.tsx',
  'toast.tsx',
  'tooltip.tsx'
];

/**
 * Fetch a single file from the source
 */
async function fetchFile(url: string): Promise<string> {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${url}: ${response.status} ${response.statusText}`);
  }

  return response.text();
}

/**
 * Fetch all component files
 */
async function fetchComponents(baseUrl: string): Promise<Map<string, string>> {
  const components = new Map<string, string>();

  const results = await Promise.all(
    COMPONENT_FILES.map(async (file) => {
      const url = `${baseUrl}/shared/components/${file}`;
      try {
        const content = await fetchFile(url);
        return { file, content };
      } catch (error) {
        throw new Error(`Failed to fetch component ${file}: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    })
  );

  for (const { file, content } of results) {
    components.set(file, content);
  }

  return components;
}

/**
 * Fetch all files for a style
 */
export async function fetchStyleFiles(
  styleName: string,
  tailwindVersion: TailwindVersion
): Promise<StyleFiles> {
  const baseUrl = SOURCE_BASE;
  const version = tailwindVersion || '4'; // Default to v4 if not detected

  // Fetch all files in parallel
  const [
    manifest,
    utils,
    baseCss,
    tokens,
    fonts,
    components,
    readme,
    tailwindConfigPatch
  ] = await Promise.all([
    fetchFile(`${baseUrl}/styles/${styleName}/manifest.json`),
    fetchFile(`${baseUrl}/shared/lib/utils.ts`),
    fetchFile(`${baseUrl}/shared/base.v${version}.css`),
    fetchFile(`${baseUrl}/styles/${styleName}/tokens.v${version}.css`),
    fetchFile(`${baseUrl}/styles/${styleName}/fonts.css`).catch(() => ''),
    fetchComponents(baseUrl),
    fetchFile(`${baseUrl}/styles/${styleName}/STYLE.md`).catch(() => ''),
    version === '3'
      ? fetchFile(`${baseUrl}/styles/${styleName}/tailwind.config.patch.js`)
      : Promise.resolve(null)
  ]);

  return {
    manifest,
    utils,
    baseCss,
    tokens,
    fonts,
    components,
    readme,
    tailwindConfigPatch
  };
}

/**
 * Get the list of available styles
 */
export function getAvailableStyles(): string[] {
  return [
    'midnight-aurora',
    'flagship',
    'terminal',
    'warmth',
    'chromatic-glow'
  ];
}

/**
 * Get style info from manifest
 */
export interface StyleInfo {
  name: string;
  title: string;
  description: string;
  access: string;
  price?: { single: number; currency: string };
}

export async function fetchStyleInfo(styleName: string): Promise<StyleInfo> {
  const manifestUrl = `${SOURCE_BASE}/styles/${styleName}/manifest.json`;
  const content = await fetchFile(manifestUrl);
  const manifest = JSON.parse(content);

  return {
    name: manifest.name,
    title: manifest.title,
    description: manifest.description,
    access: manifest.access,
    price: manifest.price
  };
}

/**
 * Fetch info for all available styles
 */
export async function fetchAllStyleInfo(): Promise<StyleInfo[]> {
  const styles = getAvailableStyles();

  const results = await Promise.all(
    styles.map(async (name) => {
      try {
        return await fetchStyleInfo(name);
      } catch {
        return null;
      }
    })
  );

  return results.filter((info): info is StyleInfo => info !== null);
}
