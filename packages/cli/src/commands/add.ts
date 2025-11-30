/**
 * Add Command
 *
 * Main installation command for adding a style to a project.
 */

import inquirer from 'inquirer';
import { detectProject, validateProject, type TailwindVersion } from '../lib/detect.js';
import { getApiKey, validateApiKey, isAuthRequired } from '../lib/auth.js';
import { fetchStyleFiles, getAvailableStyles, fetchStyleInfo } from '../lib/fetch.js';
import {
  checkConflicts,
  promptComponentConflict,
  promptCssConflict,
  type ConflictResolution,
  type CssConflictResolution
} from '../lib/conflicts.js';
import {
  installUtils,
  installGlobalsCss,
  installComponents,
  mergeTailwindConfig,
  installDependencies,
  installStyleMd,
  installManifest,
  installTailwindCss
} from '../lib/install.js';
import * as ui from '../lib/ui.js';

export interface AddOptions {
  target: string;
  tailwind?: string;
  components?: string;
  styles?: string;
  skipDeps: boolean;
  dryRun: boolean;
  yes: boolean;
  force: boolean;
}

export async function addCommand(
  styleName: string,
  options: AddOptions
): Promise<void> {
  ui.banner();
  ui.header(`Installing ${styleName}`);

  // Validate style name
  const availableStyles = getAvailableStyles();
  if (!availableStyles.includes(styleName)) {
    ui.error(`Unknown style: ${styleName}`);
    console.log();
    ui.info('Available styles:');
    for (const style of availableStyles) {
      ui.listItem(style);
    }
    process.exit(1);
  }

  // Step 1: Check authentication
  if (isAuthRequired()) {
    const apiKey = await getApiKey();
    if (!apiKey) {
      ui.error('Authentication required');
      ui.info('Run `token-atelier auth` to authenticate first.');
      process.exit(1);
    }

    const authResult = await validateApiKey(apiKey, styleName);
    if (!authResult.valid) {
      ui.error('Authentication failed');
      ui.info(authResult.error || 'Please check your API key.');
      process.exit(1);
    }

    if (!authResult.styles.includes(styleName)) {
      ui.error(`You don't have access to the ${styleName} style`);
      const styleInfo = await fetchStyleInfo(styleName);
      if (styleInfo.price) {
        ui.info(
          `Purchase at https://tokenatelier.dev/styles/${styleName} (${ui.formatPrice(styleInfo.price.single, styleInfo.price.currency)})`
        );
      }
      process.exit(1);
    }

    ui.success('Authentication verified');
  }

  // Step 2: Detect project
  const spinner = ui.createSpinner('Detecting project configuration...');
  spinner.start();

  const info = await detectProject(options.target);
  const validation = await validateProject(info);

  spinner.stop();

  // Display detected configuration
  ui.section('Detected Project');
  ui.keyValue('Framework', formatFramework(info.framework));
  ui.keyValue('Tailwind', info.tailwindVersion ? `v${info.tailwindVersion}` : 'Not detected');
  ui.keyValue('Package Manager', info.packageManager);

  // Handle Tailwind version override
  let tailwindVersion: TailwindVersion = info.tailwindVersion;

  if (options.tailwind) {
    tailwindVersion = options.tailwind as TailwindVersion;
    ui.info(`Using Tailwind v${tailwindVersion} (override)`);
  } else if (!tailwindVersion) {
    // Tailwind not detected - offer to install it
    console.log();
    ui.warning('Tailwind CSS is not installed in this project.');
    console.log();

    const { installTailwind } = await inquirer.prompt<{ installTailwind: boolean }>([
      {
        type: 'confirm',
        name: 'installTailwind',
        message: 'Would you like to install Tailwind CSS?',
        default: true
      }
    ]);

    if (!installTailwind) {
      ui.error('Token Atelier requires Tailwind CSS. Installation cancelled.');
      process.exit(1);
    }

    // Ask which version to install
    const { version } = await inquirer.prompt<{ version: TailwindVersion }>([
      {
        type: 'list',
        name: 'version',
        message: 'Which Tailwind version would you like to install?',
        choices: [
          { name: 'Tailwind v3 (stable)', value: '3' },
          { name: 'Tailwind v4 (latest)', value: '4' }
        ]
      }
    ]);
    tailwindVersion = version;

    // Install Tailwind
    const tailwindSpinner = ui.createSpinner('Installing Tailwind CSS...');
    tailwindSpinner.start();

    try {
      await installTailwindCss(info, tailwindVersion!);
      tailwindSpinner.succeed('Tailwind CSS installed');
    } catch (error) {
      tailwindSpinner.fail('Failed to install Tailwind CSS');
      ui.error(error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  }

  // Check validation errors
  if (!validation.valid) {
    ui.section('Errors');
    for (const err of validation.errors) {
      ui.error(err);
    }
    process.exit(1);
  }

  // Show warnings
  if (validation.warnings.length > 0 && !options.yes) {
    ui.section('Warnings');
    for (const warn of validation.warnings) {
      ui.warning(warn);
    }

    const { proceed } = await inquirer.prompt<{ proceed: boolean }>([
      {
        type: 'confirm',
        name: 'proceed',
        message: 'Continue with installation?',
        default: true
      }
    ]);

    if (!proceed) {
      ui.info('Installation cancelled');
      process.exit(0);
    }
  }

  // Step 3: Check for conflicts
  const conflicts = await checkConflicts(info);
  let componentResolution: ConflictResolution = 'overwrite';
  let cssResolution: CssConflictResolution = 'replace';

  if (conflicts.hasComponentConflicts && !options.force) {
    componentResolution = await promptComponentConflict(
      conflicts.conflictingComponents,
      options.force
    );
    if (componentResolution === 'cancel') {
      ui.info('Installation cancelled');
      process.exit(0);
    }
  }

  if (conflicts.hasCssConflicts && !options.force) {
    cssResolution = await promptCssConflict(options.force);
    if (cssResolution === 'cancel') {
      ui.info('Installation cancelled');
      process.exit(0);
    }
  }

  // Step 4: Show installation plan
  ui.section('Installation Plan');
  ui.listItem(`Copy 22 components to ${info.paths.components}`);
  ui.listItem(`Copy utils.ts to ${info.paths.utils}`);
  ui.listItem(
    cssResolution === 'separate'
      ? 'Create globals-token-atelier.css'
      : `${cssResolution === 'append' ? 'Append to' : 'Create'} globals.css`
  );
  if (tailwindVersion === '3') {
    ui.listItem('Merge tailwind.config.js');
  }
  if (!options.skipDeps) {
    ui.listItem(`Install ${tailwindVersion === '4' ? '19' : '18'} npm dependencies`);
  }
  ui.listItem('Copy STYLE.md and manifest.json for reference');

  // Dry run - stop here
  if (options.dryRun) {
    console.log();
    ui.info('Dry run complete. No files were modified.');
    process.exit(0);
  }

  // Confirm if not --yes
  if (!options.yes) {
    console.log();
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Proceed with installation?',
        default: true
      }
    ]);

    if (!confirm) {
      ui.info('Installation cancelled');
      process.exit(0);
    }
  }

  // Step 5: Fetch files
  console.log();
  const fetchSpinner = ui.createSpinner('Fetching style files...');
  fetchSpinner.start();

  let files;
  try {
    files = await fetchStyleFiles(styleName, tailwindVersion);
    fetchSpinner.succeed('Files fetched');
  } catch (error) {
    fetchSpinner.fail('Failed to fetch files');
    ui.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }

  // Step 6: Install files
  const installSpinner = ui.createSpinner('Installing files...');
  installSpinner.start();

  try {
    // Install utils
    installSpinner.text = 'Installing utils.ts...';
    await installUtils(
      info,
      files.utils,
      conflicts.hasUtilsConflict,
      conflicts.utilsHasCn
    );

    // Install CSS
    installSpinner.text = 'Installing globals.css...';
    await installGlobalsCss(info, files.baseCss, files.tokens, cssResolution);

    // Install components
    installSpinner.text = 'Installing components...';
    const componentCount = await installComponents(
      info,
      files.components,
      componentResolution
    );

    // Merge Tailwind config (v3 only)
    if (tailwindVersion === '3' && files.tailwindConfigPatch) {
      installSpinner.text = 'Updating tailwind.config...';
      await mergeTailwindConfig(info, files.tailwindConfigPatch);
    }

    // Install docs
    installSpinner.text = 'Installing documentation...';
    await installStyleMd(info, files.readme, styleName);
    await installManifest(info, files.manifest, styleName);

    installSpinner.succeed(`Installed ${componentCount} components`);
  } catch (error) {
    installSpinner.fail('Installation failed');
    ui.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }

  // Step 7: Install dependencies
  if (!options.skipDeps) {
    const depsSpinner = ui.createSpinner('Installing npm dependencies...');
    depsSpinner.start();

    try {
      await installDependencies(info, tailwindVersion!);
      depsSpinner.succeed('Dependencies installed');
    } catch (error) {
      depsSpinner.fail('Failed to install dependencies');
      ui.error(error instanceof Error ? error.message : 'Unknown error');
      ui.info('You may need to install dependencies manually.');
    }
  }

  // Success!
  console.log();
  ui.divider();
  console.log();
  ui.success(`${styleName} has been installed!`);
  console.log();

  ui.section('Next Step');
  console.log();
  ui.info('Paste this prompt into Cursor, Claude Code, or your AI assistant:');
  console.log();
  console.log(ui.chalk.cyan('─'.repeat(60)));
  console.log();

  // Framework-specific prompt
  const prompt = getPostInstallPrompt(info.framework, styleName);
  console.log(ui.chalk.white(prompt));
  console.log();
  console.log(ui.chalk.cyan('─'.repeat(60)));
  console.log();
}

function getPostInstallPrompt(framework: string, styleName: string): string {
  const isNextJs = framework.startsWith('nextjs');

  if (isNextJs) {
    return `Read the .tokenatelier-${styleName}.json manifest file. Complete the post-installation:

1. Import the CSS in app/layout.tsx (or pages/_app.tsx):
   import '@/styles/globals.css'

2. Show me a preview by rendering the Showcase component:
   import { Showcase } from '@/components/ui/showcase'`;
  }

  // Vite, CRA, Remix, or unknown - use relative paths
  return `Read the .tokenatelier-${styleName}.json manifest file. Complete the post-installation:

1. Import the CSS in src/main.tsx:
   import './styles/globals.css'

2. Show me a preview by rendering the Showcase component in App.tsx:
   import { Showcase } from './components/ui/showcase'

IMPORTANT: This is a Vite project - use relative imports (./), NOT @/ aliases.`;
}

function formatFramework(framework: string): string {
  const names: Record<string, string> = {
    'nextjs-app': 'Next.js (App Router)',
    'nextjs-pages': 'Next.js (Pages Router)',
    'vite': 'Vite',
    'remix': 'Remix',
    'cra': 'Create React App',
    'unknown': 'Unknown'
  };
  return names[framework] || framework;
}

