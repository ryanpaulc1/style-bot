/**
 * Auth Command
 *
 * Handles API key authentication.
 */
import inquirer from 'inquirer';
import { getApiKey, setApiKey, clearApiKey, validateApiKey, isAuthRequired } from '../lib/auth.js';
import * as ui from '../lib/ui.js';
/**
 * Login command - store API key
 */
export async function authCommand() {
    ui.banner();
    ui.header('Authentication');
    if (!isAuthRequired()) {
        ui.info('Authentication is disabled (TOKEN_ATELIER_SKIP_AUTH=true)');
        return;
    }
    // Check if already authenticated
    const existingKey = await getApiKey();
    if (existingKey) {
        const { action } = await inquirer.prompt([
            {
                type: 'list',
                name: 'action',
                message: 'You are already authenticated. What would you like to do?',
                choices: [
                    { name: 'Keep current API key', value: 'keep' },
                    { name: 'Replace with new API key', value: 'replace' },
                    { name: 'Log out (remove API key)', value: 'logout' }
                ]
            }
        ]);
        if (action === 'keep') {
            ui.success('Keeping current API key');
            return;
        }
        if (action === 'logout') {
            await clearApiKey();
            ui.success('Logged out successfully');
            return;
        }
    }
    // Prompt for API key
    const { apiKey } = await inquirer.prompt([
        {
            type: 'password',
            name: 'apiKey',
            message: 'Enter your Token Atelier API key:',
            mask: '*',
            validate: (input) => {
                if (!input || input.trim().length === 0) {
                    return 'API key is required';
                }
                if (!input.startsWith('ta_')) {
                    return 'Invalid API key format (should start with ta_)';
                }
                return true;
            }
        }
    ]);
    // Validate the key
    const spinner = ui.createSpinner('Validating API key...');
    spinner.start();
    const result = await validateApiKey(apiKey.trim());
    if (!result.valid) {
        spinner.fail('Invalid API key');
        ui.error(result.error || 'The API key could not be validated');
        return;
    }
    // Save the key
    await setApiKey(apiKey.trim(), result.email);
    spinner.succeed('API key validated and saved');
    console.log();
    ui.success(`Authenticated${result.email ? ` as ${result.email}` : ''}`);
    if (result.styles.length > 0) {
        ui.info(`You have access to ${result.styles.length} style(s):`);
        for (const style of result.styles) {
            ui.listItem(style);
        }
    }
}
/**
 * Logout command - remove stored API key
 */
export async function logoutCommand() {
    await clearApiKey();
    ui.success('Logged out successfully');
}
//# sourceMappingURL=auth.js.map