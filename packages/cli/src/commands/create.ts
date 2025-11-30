/**
 * Create Command
 *
 * Scaffolds a new project with a Token Atelier style pre-installed.
 */

import fs from 'fs-extra';
import path from 'path';
import { spawn } from 'child_process';
import inquirer from 'inquirer';
import { getAvailableStyles, fetchStyleInfo } from '../lib/fetch.js';
import { getApiKey, validateApiKey, isAuthRequired } from '../lib/auth.js';
import { scaffoldProject, isValidProjectName } from '../lib/scaffold.js';
import * as ui from '../lib/ui.js';

export interface CreateOptions {
  style?: string;
  skipInstall: boolean;
  yes: boolean;
}

/**
 * Run a command in a directory
 */
async function runCommand(
  command: string,
  args: string[],
  cwd: string
): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd,
      stdio: 'inherit',
      shell: true
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', reject);
  });
}

/**
 * Main create command
 */
export async function createCommand(
  projectName: string,
  options: CreateOptions
): Promise<void> {
  ui.banner();
  ui.header(`Creating ${projectName}`);

  // Validate project name
  if (!isValidProjectName(projectName)) {
    ui.error('Invalid project name');
    ui.info('Project name must be lowercase, no spaces or special characters.');
    process.exit(1);
  }

  // Check directory doesn't exist
  const targetDir = path.resolve(process.cwd(), projectName);
  if (await fs.pathExists(targetDir)) {
    ui.error(`Directory "${projectName}" already exists`);
    process.exit(1);
  }

  // Get available styles
  const availableStyles = getAvailableStyles();

  // Prompt for style (unless --style provided)
  let styleName = options.style;
  if (!styleName) {
    const { style } = await inquirer.prompt<{ style: string }>([
      {
        type: 'list',
        name: 'style',
        message: 'Choose a style:',
        choices: availableStyles.map((s) => ({ name: formatStyleName(s), value: s }))
      }
    ]);
    styleName = style;
  }

  // Validate style name
  if (!availableStyles.includes(styleName)) {
    ui.error(`Unknown style: ${styleName}`);
    console.log();
    ui.info('Available styles:');
    for (const style of availableStyles) {
      ui.listItem(style);
    }
    process.exit(1);
  }

  // Auth check (if required)
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

  // Show what we're about to do
  ui.section('Project Details');
  ui.keyValue('Name', projectName);
  ui.keyValue('Style', styleName);
  ui.keyValue('Framework', 'Vite + React');
  ui.keyValue('Tailwind', 'v4');

  // Confirm if not --yes
  if (!options.yes) {
    console.log();
    const { confirm } = await inquirer.prompt<{ confirm: boolean }>([
      {
        type: 'confirm',
        name: 'confirm',
        message: 'Create project?',
        default: true
      }
    ]);

    if (!confirm) {
      ui.info('Cancelled');
      process.exit(0);
    }
  }

  // Scaffold project
  console.log();
  const spinner = ui.createSpinner('Creating project...');
  spinner.start();

  try {
    await scaffoldProject(targetDir, styleName, spinner);
    spinner.succeed('Project created');
  } catch (error) {
    spinner.fail('Failed to create project');
    ui.error(error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }

  // Install dependencies
  if (!options.skipInstall) {
    const installSpinner = ui.createSpinner('Installing dependencies...');
    installSpinner.start();

    try {
      await runCommand('npm', ['install'], targetDir);
      installSpinner.succeed('Dependencies installed');
    } catch (error) {
      installSpinner.fail('Failed to install dependencies');
      ui.error(error instanceof Error ? error.message : 'Unknown error');
      ui.info('You can install dependencies manually with: npm install');
    }
  }

  // Success message
  console.log();
  ui.divider();
  console.log();
  ui.success(`${projectName} created with ${styleName} style!`);
  console.log();

  ui.section('Next Steps');
  console.log();
  ui.listItem(`cd ${projectName}`);
  if (options.skipInstall) {
    ui.listItem('npm install');
  }
  ui.listItem('npm run dev');
  console.log();

  ui.info('Open http://localhost:5173 to see your style in action');
  console.log();
}

/**
 * Format style name for display
 */
function formatStyleName(name: string): string {
  // Convert kebab-case to Title Case
  return name
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
