/**
 * List Command
 *
 * Lists available styles and shows which ones the user has access to.
 */

import { getApiKey, validateApiKey, isAuthRequired } from '../lib/auth.js';
import { fetchAllStyleInfo, type StyleInfo } from '../lib/fetch.js';
import * as ui from '../lib/ui.js';

export async function listCommand(): Promise<void> {
  ui.banner();
  ui.header('Available Styles');

  const spinner = ui.createSpinner('Fetching styles...');
  spinner.start();

  let styles: StyleInfo[];
  let accessibleStyles: string[] = [];

  try {
    styles = await fetchAllStyleInfo();
  } catch (error) {
    spinner.fail('Failed to fetch styles');
    ui.error(error instanceof Error ? error.message : 'Unknown error');
    return;
  }

  // Check user's access
  if (isAuthRequired()) {
    const apiKey = await getApiKey();
    if (apiKey) {
      const result = await validateApiKey(apiKey);
      if (result.valid) {
        accessibleStyles = result.styles;
      }
    }
  } else {
    // Auth disabled, all styles accessible
    accessibleStyles = styles.map(s => s.name);
  }

  spinner.stop();

  // Display styles
  for (const style of styles) {
    const hasAccess = accessibleStyles.includes(style.name);
    const accessIcon = hasAccess ? ui.chalk.green('✓') : ui.chalk.gray('○');
    const priceText = style.price
      ? ui.formatPrice(style.price.single, style.price.currency)
      : 'Free';

    console.log();
    console.log(
      `${accessIcon} ${ui.chalk.bold(style.title)} ${ui.chalk.gray(`(${style.name})`)}`
    );
    console.log(`  ${ui.chalk.gray(style.description)}`);
    console.log(
      `  ${ui.formatAccess(style.access)} • ${priceText}`
    );
  }

  console.log();

  // Show auth status
  if (isAuthRequired()) {
    const apiKey = await getApiKey();
    if (apiKey) {
      ui.info(
        `You have access to ${accessibleStyles.length} of ${styles.length} styles`
      );
    } else {
      ui.info('Run `token-atelier auth` to authenticate and access premium styles');
    }
  } else {
    ui.info('Authentication disabled - all styles accessible');
  }

  console.log();
}
