/**
 * File Fetching Module
 *
 * Fetches style files from GitHub or the Token Atelier API.
 * For testing: set TOKEN_ATELIER_SOURCE to override the source URL.
 */
import type { TailwindVersion } from './detect.js';
export interface StyleFiles {
    manifest: string;
    utils: string;
    baseCss: string;
    tokens: string;
    components: Map<string, string>;
    readme: string;
    tailwindConfigPatch: string | null;
}
/**
 * Fetch all files for a style
 */
export declare function fetchStyleFiles(styleName: string, tailwindVersion: TailwindVersion): Promise<StyleFiles>;
/**
 * Get the list of available styles
 */
export declare function getAvailableStyles(): string[];
/**
 * Get style info from manifest
 */
export interface StyleInfo {
    name: string;
    title: string;
    description: string;
    access: string;
    price?: {
        single: number;
        currency: string;
    };
}
export declare function fetchStyleInfo(styleName: string): Promise<StyleInfo>;
/**
 * Fetch info for all available styles
 */
export declare function fetchAllStyleInfo(): Promise<StyleInfo[]>;
//# sourceMappingURL=fetch.d.ts.map