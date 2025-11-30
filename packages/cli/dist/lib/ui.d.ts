/**
 * UI Module
 *
 * Terminal output utilities: colors, spinners, formatting.
 */
import chalk from 'chalk';
import { type Ora } from 'ora';
export { chalk };
/**
 * Create a spinner
 */
export declare function createSpinner(text: string): Ora;
/**
 * Print a success message
 */
export declare function success(message: string): void;
/**
 * Print an error message
 */
export declare function error(message: string): void;
/**
 * Print a warning message
 */
export declare function warning(message: string): void;
/**
 * Print an info message
 */
export declare function info(message: string): void;
/**
 * Print a header/title
 */
export declare function header(message: string): void;
/**
 * Print a section title
 */
export declare function section(message: string): void;
/**
 * Print a key-value pair
 */
export declare function keyValue(key: string, value: string): void;
/**
 * Print a list item
 */
export declare function listItem(item: string, indent?: number): void;
/**
 * Print a divider
 */
export declare function divider(): void;
/**
 * Print the Token Atelier banner
 */
export declare function banner(): void;
/**
 * Format a price
 */
export declare function formatPrice(amount: number, currency: string): string;
/**
 * Format style access level
 */
export declare function formatAccess(access: string): string;
//# sourceMappingURL=ui.d.ts.map