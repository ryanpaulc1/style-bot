/**
 * Conflict Detection & Resolution Module
 *
 * Handles detection of existing files and prompts user for resolution.
 */
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
export declare function checkConflicts(info: ProjectInfo): Promise<ConflictCheck>;
/**
 * Prompt user for component conflict resolution
 */
export declare function promptComponentConflict(conflictingFiles: string[], force: boolean): Promise<ConflictResolution>;
/**
 * Prompt user for CSS conflict resolution
 */
export declare function promptCssConflict(force: boolean): Promise<CssConflictResolution>;
/**
 * Create a backup of a directory
 */
export declare function backupDirectory(dirPath: string): Promise<string>;
/**
 * Create a backup of a file
 */
export declare function backupFile(filePath: string): Promise<string>;
//# sourceMappingURL=conflicts.d.ts.map