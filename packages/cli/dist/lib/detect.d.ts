/**
 * Project Detection Module
 *
 * Detects project configuration: framework, Tailwind version, directory structure.
 */
export type Framework = 'nextjs-app' | 'nextjs-pages' | 'vite' | 'remix' | 'cra' | 'unknown';
export type TailwindVersion = '3' | '4' | null;
export type PackageManager = 'npm' | 'yarn' | 'pnpm' | 'bun';
export interface ProjectInfo {
    framework: Framework;
    tailwindVersion: TailwindVersion;
    packageManager: PackageManager;
    paths: {
        root: string;
        src: string;
        components: string;
        styles: string;
        utils: string;
        entryPoint: string | null;
        tailwindConfig: string | null;
        globalCss: string | null;
    };
    hasExistingUI: boolean;
    hasExistingUtils: boolean;
    hasExistingGlobalCss: boolean;
}
/**
 * Detect project configuration
 */
export declare function detectProject(targetDir: string): Promise<ProjectInfo>;
/**
 * Validate that the project is suitable for Token Atelier
 */
export interface ValidationResult {
    valid: boolean;
    errors: string[];
    warnings: string[];
}
export declare function validateProject(info: ProjectInfo): Promise<ValidationResult>;
//# sourceMappingURL=detect.d.ts.map