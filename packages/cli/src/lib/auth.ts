/**
 * Authentication module for Token Atelier CLI
 *
 * Handles API key storage, validation, and retrieval.
 * For testing: set TOKEN_ATELIER_SKIP_AUTH=true to bypass authentication.
 */

import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.tokenatelier');
const CONFIG_FILE = path.join(CONFIG_DIR, 'config.json');

// API base URL (can be overridden for testing)
const API_BASE = process.env.TOKEN_ATELIER_API || 'https://api.tokenatelier.dev/v1';

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
export async function loadConfig(): Promise<AuthConfig> {
  try {
    if (await fs.pathExists(CONFIG_FILE)) {
      return await fs.readJson(CONFIG_FILE);
    }
  } catch {
    // Ignore errors, return empty config
  }
  return {};
}

/**
 * Save configuration to disk
 */
export async function saveConfig(config: AuthConfig): Promise<void> {
  await fs.ensureDir(CONFIG_DIR);
  await fs.writeJson(CONFIG_FILE, config, { spaces: 2 });
}

/**
 * Get the stored API key
 */
export async function getApiKey(): Promise<string | undefined> {
  // Check environment variable first
  if (process.env.TOKEN_ATELIER_KEY) {
    return process.env.TOKEN_ATELIER_KEY;
  }

  const config = await loadConfig();
  return config.apiKey;
}

/**
 * Store an API key
 */
export async function setApiKey(apiKey: string, email?: string): Promise<void> {
  const config = await loadConfig();
  config.apiKey = apiKey;
  if (email) {
    config.email = email;
  }
  await saveConfig(config);
}

/**
 * Remove stored API key (logout)
 */
export async function clearApiKey(): Promise<void> {
  const config = await loadConfig();
  delete config.apiKey;
  delete config.email;
  await saveConfig(config);
}

/**
 * Validate an API key against the Token Atelier API
 *
 * @param apiKey - The API key to validate
 * @param style - Optional style to check access for
 * @returns Validation result
 */
export async function validateApiKey(
  apiKey: string,
  style?: string
): Promise<ValidateResponse> {
  // STUB: Skip auth for testing
  if (process.env.TOKEN_ATELIER_SKIP_AUTH === 'true') {
    return {
      valid: true,
      styles: ['midnight-aurora', 'flagship', 'terminal', 'warmth', 'chromatic-glow'],
      email: 'test@example.com'
    };
  }

  try {
    const response = await fetch(`${API_BASE}/validate`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ style })
    });

    if (!response.ok) {
      return {
        valid: false,
        styles: [],
        error: `API returned ${response.status}: ${response.statusText}`
      };
    }

    const data = await response.json() as ValidateResponse;
    return data;
  } catch (error) {
    return {
      valid: false,
      styles: [],
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Check if user has access to a specific style
 */
export async function hasStyleAccess(style: string): Promise<boolean> {
  const apiKey = await getApiKey();

  if (!apiKey) {
    return false;
  }

  const result = await validateApiKey(apiKey, style);
  return result.valid && result.styles.includes(style);
}

/**
 * Check if authentication is required (i.e., not skipped for testing)
 */
export function isAuthRequired(): boolean {
  return process.env.TOKEN_ATELIER_SKIP_AUTH !== 'true';
}
