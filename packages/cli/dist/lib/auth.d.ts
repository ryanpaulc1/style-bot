/**
 * Authentication module for Token Atelier CLI
 *
 * Handles API key storage, validation, and retrieval.
 * For testing: set TOKEN_ATELIER_SKIP_AUTH=true to bypass authentication.
 */
export interface AuthConfig {
    apiKey?: string;
    email?: string;
}
export interface ValidateResponse {
    valid: boolean;
    styles: string[];
    email?: string;
    error?: string;
}
/**
 * Load the stored configuration
 */
export declare function loadConfig(): Promise<AuthConfig>;
/**
 * Save configuration to disk
 */
export declare function saveConfig(config: AuthConfig): Promise<void>;
/**
 * Get the stored API key
 */
export declare function getApiKey(): Promise<string | undefined>;
/**
 * Store an API key
 */
export declare function setApiKey(apiKey: string, email?: string): Promise<void>;
/**
 * Remove stored API key (logout)
 */
export declare function clearApiKey(): Promise<void>;
/**
 * Validate an API key against the Token Atelier API
 *
 * @param apiKey - The API key to validate
 * @param style - Optional style to check access for
 * @returns Validation result
 */
export declare function validateApiKey(apiKey: string, style?: string): Promise<ValidateResponse>;
/**
 * Check if user has access to a specific style
 */
export declare function hasStyleAccess(style: string): Promise<boolean>;
/**
 * Check if authentication is required (i.e., not skipped for testing)
 */
export declare function isAuthRequired(): boolean;
//# sourceMappingURL=auth.d.ts.map