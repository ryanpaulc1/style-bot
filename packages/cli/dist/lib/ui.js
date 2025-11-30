/**
 * UI Module
 *
 * Terminal output utilities: colors, spinners, formatting.
 */
import chalk from 'chalk';
import ora from 'ora';
// Re-export chalk for convenience
export { chalk };
/**
 * Create a spinner
 */
export function createSpinner(text) {
    return ora({
        text,
        color: 'cyan'
    });
}
/**
 * Print a success message
 */
export function success(message) {
    console.log(chalk.green('✓'), message);
}
/**
 * Print an error message
 */
export function error(message) {
    console.log(chalk.red('✗'), message);
}
/**
 * Print a warning message
 */
export function warning(message) {
    console.log(chalk.yellow('⚠'), message);
}
/**
 * Print an info message
 */
export function info(message) {
    console.log(chalk.blue('ℹ'), message);
}
/**
 * Print a header/title
 */
export function header(message) {
    console.log();
    console.log(chalk.bold.cyan(message));
    console.log();
}
/**
 * Print a section title
 */
export function section(message) {
    console.log();
    console.log(chalk.bold(message));
}
/**
 * Print a key-value pair
 */
export function keyValue(key, value) {
    console.log(`  ${chalk.gray(key + ':')} ${value}`);
}
/**
 * Print a list item
 */
export function listItem(item, indent = 2) {
    console.log(' '.repeat(indent) + chalk.gray('•') + ' ' + item);
}
/**
 * Print a divider
 */
export function divider() {
    console.log(chalk.gray('─'.repeat(50)));
}
/**
 * Print the Token Atelier banner
 */
export function banner() {
    console.log();
    console.log(chalk.cyan.bold('  Token Atelier'));
    console.log(chalk.gray('  Premium style guides for React + Tailwind'));
    console.log();
}
/**
 * Format a price
 */
export function formatPrice(amount, currency) {
    if (currency === 'USD') {
        return `$${amount}`;
    }
    return `${amount} ${currency}`;
}
/**
 * Format style access level
 */
export function formatAccess(access) {
    switch (access) {
        case 'premium':
            return chalk.yellow('Premium');
        case 'free':
            return chalk.green('Free');
        default:
            return access;
    }
}
//# sourceMappingURL=ui.js.map