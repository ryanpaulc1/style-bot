/**
 * Installation Module
 *
 * Handles file operations: copying, composing, merging files.
 */
import type { ProjectInfo } from './detect.js';
import type { ConflictResolution, CssConflictResolution } from './conflicts.js';
export interface InstallOptions {
    force: boolean;
    skipDeps: boolean;
    componentResolution: ConflictResolution;
    cssResolution: CssConflictResolution;
}
/**
 * Install utils.ts file
 */
export declare function installUtils(info: ProjectInfo, utils: string, hasConflict: boolean, hasCn: boolean): Promise<void>;
/**
 * Compose and install globals.css
 */
export declare function installGlobalsCss(info: ProjectInfo, baseCss: string, tokens: string, resolution: CssConflictResolution): Promise<string>;
/**
 * Install component files
 */
export declare function installComponents(info: ProjectInfo, components: Map<string, string>, resolution: ConflictResolution): Promise<number>;
/**
 * Merge Tailwind config (v3 only)
 */
export declare function mergeTailwindConfig(info: ProjectInfo, configPatch: string): Promise<void>;
/**
 * Install npm dependencies
 */
export declare function installDependencies(info: ProjectInfo, tailwindVersion: '3' | '4'): Promise<void>;
/**
 * Install Tailwind CSS and set up configuration
 */
export declare function installTailwindCss(info: ProjectInfo, version: '3' | '4'): Promise<void>;
/**
 * Copy STYLE.md to project
 */
export declare function installStyleMd(info: ProjectInfo, readme: string, styleName: string): Promise<void>;
/**
 * Copy manifest.json to project for AI reference
 */
export declare function installManifest(info: ProjectInfo, manifest: string, styleName: string): Promise<void>;
//# sourceMappingURL=install.d.ts.map