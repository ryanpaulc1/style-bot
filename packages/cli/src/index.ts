#!/usr/bin/env node

/**
 * Token Atelier CLI
 *
 * Install beautiful style guides for React + Tailwind projects.
 */

import { program } from 'commander';
import { addCommand } from './commands/add.js';
import { createCommand } from './commands/create.js';
import { listCommand } from './commands/list.js';
import { doctorCommand } from './commands/doctor.js';
import { authCommand, logoutCommand } from './commands/auth.js';

program
  .name('token-atelier')
  .description('Premium style guides for React + Tailwind projects')
  .version('1.0.0');

// Create command - scaffold new project with style
program
  .command('create <project-name>')
  .description('Create a new project with a Token Atelier style')
  .option('--style <name>', 'Style to install (skip prompt)')
  .option('--skip-install', 'Skip npm install', false)
  .option('-y, --yes', 'Skip confirmation prompts', false)
  .action(createCommand);

// Add command - install a style into existing project
program
  .command('add <style>')
  .description('Install a style into your project')
  .option('-t, --tailwind <version>', 'Force Tailwind version (3 or 4)')
  .option('--target <dir>', 'Target directory', process.cwd())
  .option('--components <path>', 'Components directory override')
  .option('--styles <path>', 'Styles directory override')
  .option('--skip-deps', 'Skip npm dependency installation', false)
  .option('--dry-run', 'Preview changes without writing', false)
  .option('-y, --yes', 'Skip confirmation prompts', false)
  .option('-f, --force', 'Overwrite existing files without prompting', false)
  .action(addCommand);

// List command - show available styles
program
  .command('list')
  .description('List available styles')
  .action(listCommand);

// Doctor command - check project compatibility
program
  .command('doctor')
  .description('Check if your project is compatible with Token Atelier')
  .option('--target <dir>', 'Target directory', process.cwd())
  .action(doctorCommand);

// Auth command - authenticate with API key
program
  .command('auth')
  .description('Authenticate with your Token Atelier API key')
  .action(authCommand);

// Logout command - remove stored API key
program
  .command('logout')
  .description('Remove stored API key')
  .action(logoutCommand);

program.parse();
