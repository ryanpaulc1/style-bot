/**
 * Conflict Detection & Resolution Module
 *
 * Handles detection of existing files and prompts user for resolution.
 */

import fs from 'fs-extra';
import path from 'path';
import { glob } from 'glob';
import inquirer from 'inquirer';
import type { ProjectInfo } from './detect.js';

export type ConflictResolution = 'overwrite' | 'skip' | 'backup' | 'cancel';
export type CssConflictResolution = 'replace' | 'append' | 'separate' | 'cancel';

export interface ConflictCheck {
  hasComponentConflicts: boolean;
  conflictingComponents: string[];
  hasCssConflicts: boolean;
  hasUtilsConflict: boolean;
  utilsHasCn: boolean;
}

/**
 * Check for conflicts with existing files
 */
export async function checkConflicts(info: ProjectInfo): Promise<ConflictCheck> {
  const result: ConflictCheck = {
    hasComponentConflicts: false,
    conflictingComponents: [],
    hasCssConflicts: false,
    hasUtilsConflict: false,
    utilsHasCn: false
  };

  // Check for existing components
  const componentsDir = path.join(info.paths.root, info.paths.components);
  if (await fs.pathExists(componentsDir)) {
    const files = await glob('*.tsx', { cwd: componentsDir });
    if (files.length > 0) {
      result.hasComponentConflicts = true;
      result.conflictingComponents = files;
    }
  }

  // Check for CSS variable conflicts
  if (info.paths.globalCss && await fs.pathExists(info.paths.globalCss)) {
    const content = await fs.readFile(info.paths.globalCss, 'utf-8');
    const conflictingVars = ['--background', '--foreground', '--primary', '--secondary', '--accent'];
    result.hasCssConflicts = conflictingVars.some(v => content.includes(v));
  }

  // Check for utils.ts conflicts
  const utilsPath = path.join(info.paths.root, info.paths.utils);
  if (await fs.pathExists(utilsPath)) {
    result.hasUtilsConflict = true;
    const content = await fs.readFile(utilsPath, 'utf-8');
    result.utilsHasCn = content.includes('export function cn');
  }

  return result;
}

/**
 * Prompt user for component conflict resolution
 */
export async function promptComponentConflict(
  conflictingFiles: string[],
  force: boolean
): Promise<ConflictResolution> {
  if (force) {
    return 'overwrite';
  }

  const { resolution } = await inquirer.prompt<{ resolution: ConflictResolution }>([
    {
      type: 'list',
      name: 'resolution',
      message: `Found ${conflictingFiles.length} existing files in components/ui/. How to proceed?`,
      choices: [
        {
          name: 'Overwrite all (backup to components/ui.backup/)',
          value: 'backup'
        },
        {
          name: 'Overwrite all (no backup)',
          value: 'overwrite'
        },
        {
          name: 'Skip existing files (only add new ones)',
          value: 'skip'
        },
        {
          name: 'Cancel installation',
          value: 'cancel'
        }
      ]
    }
  ]);

  return resolution;
}

/**
 * Prompt user for CSS conflict resolution
 */
export async function promptCssConflict(
  force: boolean
): Promise<CssConflictResolution> {
  if (force) {
    return 'replace';
  }

  const { resolution } = await inquirer.prompt<{ resolution: CssConflictResolution }>([
    {
      type: 'list',
      name: 'resolution',
      message: 'Your globals.css already has CSS variables that may conflict. How to proceed?',
      choices: [
        {
          name: 'Replace existing variables (backup current file)',
          value: 'replace'
        },
        {
          name: 'Append Token Atelier styles (may cause conflicts)',
          value: 'append'
        },
        {
          name: 'Create separate file (globals-token-atelier.css)',
          value: 'separate'
        },
        {
          name: 'Cancel installation',
          value: 'cancel'
        }
      ]
    }
  ]);

  return resolution;
}

/**
 * Create a backup of a directory
 */
export async function backupDirectory(dirPath: string): Promise<string> {
  const backupPath = `${dirPath}.backup`;

  // Remove existing backup if present
  if (await fs.pathExists(backupPath)) {
    await fs.remove(backupPath);
  }

  await fs.copy(dirPath, backupPath);
  return backupPath;
}

/**
 * Create a backup of a file
 */
export async function backupFile(filePath: string): Promise<string> {
  const backupPath = `${filePath}.backup`;
  await fs.copy(filePath, backupPath);
  return backupPath;
}
