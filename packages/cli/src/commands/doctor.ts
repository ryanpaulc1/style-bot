/**
 * Doctor Command
 *
 * Checks if the current project is compatible with Token Atelier.
 */

import { detectProject, validateProject } from '../lib/detect.js';
import * as ui from '../lib/ui.js';

export interface DoctorOptions {
  target: string;
}

export async function doctorCommand(options: DoctorOptions): Promise<void> {
  ui.banner();
  ui.header('Project Compatibility Check');

  const spinner = ui.createSpinner('Analyzing project...');
  spinner.start();

  const info = await detectProject(options.target);
  const validation = await validateProject(info);

  spinner.stop();

  // Display detected configuration
  ui.section('Detected Configuration');

  ui.keyValue('Framework', formatFramework(info.framework));
  ui.keyValue('Tailwind', info.tailwindVersion ? `v${info.tailwindVersion}` : 'Not detected');
  ui.keyValue('Package Manager', info.packageManager);
  ui.keyValue('Source Directory', info.paths.src);

  ui.section('Paths');

  ui.keyValue('Components', info.paths.components);
  ui.keyValue('Styles', info.paths.styles);
  ui.keyValue('Utils', info.paths.utils);
  ui.keyValue('Entry Point', info.paths.entryPoint || 'Not found');
  ui.keyValue('Tailwind Config', info.paths.tailwindConfig || 'Not found');
  ui.keyValue('Global CSS', info.paths.globalCss || 'Not found');

  ui.section('Existing Files');

  ui.keyValue('UI Components', info.hasExistingUI ? 'Found' : 'None');
  ui.keyValue('Utils', info.hasExistingUtils ? 'Found' : 'None');
  ui.keyValue('Global CSS', info.hasExistingGlobalCss ? 'Found' : 'None');

  // Display validation results
  if (validation.errors.length > 0) {
    ui.section('Errors');
    for (const err of validation.errors) {
      ui.error(err);
    }
  }

  if (validation.warnings.length > 0) {
    ui.section('Warnings');
    for (const warn of validation.warnings) {
      ui.warning(warn);
    }
  }

  console.log();

  if (validation.valid) {
    ui.success('Project is compatible with Token Atelier!');
    console.log();
    console.log(ui.chalk.gray('Run `token-atelier add <style>` to install a style.'));
  } else {
    ui.error('Project has compatibility issues that need to be resolved.');
  }

  console.log();
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
