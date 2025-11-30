/**
 * Add Command
 *
 * Main installation command for adding a style to a project.
 */
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
export declare function addCommand(styleName: string, options: AddOptions): Promise<void>;
//# sourceMappingURL=add.d.ts.map