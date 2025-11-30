#!/usr/bin/env node

/**
 * Build Manifests Script
 *
 * Composes complete manifest.json files for each style by merging:
 * - shared/manifest.template.json (common AI instructions, components, dependencies)
 * - styles/{style}/style.meta.json (style-specific metadata, colors, fonts)
 *
 * Usage: node scripts/build-manifests.js
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..');
const SHARED_DIR = path.join(ROOT_DIR, 'shared');
const STYLES_DIR = path.join(ROOT_DIR, 'styles');

const STYLES = [
  'midnight-aurora',
  'flagship',
  'terminal',
  'warmth',
  'chromatic-glow'
];

/**
 * Deep merge two objects
 */
function deepMerge(target, source) {
  const result = { ...target };

  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object && key in target && target[key] instanceof Object) {
      result[key] = deepMerge(target[key], source[key]);
    } else {
      result[key] = source[key];
    }
  }

  return result;
}

/**
 * Replace template placeholders like {{title}} with actual values
 */
function replacePlaceholders(obj, meta) {
  if (typeof obj === 'string') {
    return obj
      .replace(/\{\{title\}\}/g, meta.title)
      .replace(/\{\{name\}\}/g, meta.name)
      .replace(/\{\{description\}\}/g, meta.description);
  }

  if (Array.isArray(obj)) {
    return obj.map(item => replacePlaceholders(item, meta));
  }

  if (obj !== null && typeof obj === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = replacePlaceholders(value, meta);
    }
    return result;
  }

  return obj;
}

/**
 * Build manifest for a single style
 */
function buildManifest(styleName, template) {
  const styleDir = path.join(STYLES_DIR, styleName);
  const metaPath = path.join(styleDir, 'style.meta.json');

  // Check if style.meta.json exists
  if (!fs.existsSync(metaPath)) {
    console.warn(`  ⚠️  Skipping ${styleName}: style.meta.json not found`);
    return null;
  }

  // Load style metadata
  const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8'));

  // Start with template and replace placeholders
  let manifest = replacePlaceholders(template, meta);

  // Merge style-specific fields
  manifest = {
    ...manifest,
    name: meta.name,
    version: meta.version,
    title: meta.title,
    description: meta.description,
    access: meta.access,
    price: meta.price,
    preview_url: meta.preview_url,
    tokens: meta.tokens
  };

  return manifest;
}

/**
 * Main build function
 */
function main() {
  console.log('🔨 Building manifests...\n');

  // Load template
  const templatePath = path.join(SHARED_DIR, 'manifest.template.json');

  if (!fs.existsSync(templatePath)) {
    console.error('❌ Error: shared/manifest.template.json not found');
    process.exit(1);
  }

  const template = JSON.parse(fs.readFileSync(templatePath, 'utf-8'));
  console.log('✓ Loaded manifest template\n');

  let successCount = 0;
  let skipCount = 0;

  for (const styleName of STYLES) {
    process.stdout.write(`  Building ${styleName}...`);

    const manifest = buildManifest(styleName, template);

    if (manifest) {
      const outputPath = path.join(STYLES_DIR, styleName, 'manifest.json');
      fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2) + '\n');
      console.log(' ✓');
      successCount++;
    } else {
      skipCount++;
    }
  }

  console.log(`\n✨ Done! Built ${successCount} manifests, skipped ${skipCount}\n`);
}

// Run
main();
