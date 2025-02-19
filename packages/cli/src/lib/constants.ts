import chalk from 'chalk';

import pkg from '../../package.json';

/**
 * ASCII art logo for Flagship Code rendered in blue
 */
export const FLAGSHIP_CODE_LOGO = chalk.blue`
          ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
          ▒▒                   ▒▒▒
          ▒▒                 ▒▒▒
          ▒▒               ▒▒▒
          ▒▒             ▒▒▒
          ▒▒           ▒▒▒
          ▒▒         ▒▒▒
          ▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒▒
          ▒▒     ▒▒▒           ▒▒▒
          ▒▒   ▒▒▒           ▒▒▒
          ▒▒ ▒▒▒           ▒▒▒
          ▒▒▒▒           ▒▒▒
          ▒▒           ▒▒▒
          ▒▒         ▒▒▒
          ▒▒       ▒▒▒
          ▒▒     ▒▒▒
          ▒▒   ▒▒▒
          ▒▒ ▒▒▒
          ▒▒▒▒
`;

/**
 * Title text for Flagship Code including version number
 */
export const FLAGSHIP_CODE_TITLE = chalk.bold
  .blue`Flagship Code ${chalk.bold.white`v${pkg.version}`}`;

/**
 * Description tagline for Flagship Code capabilities
 */
export const FLAGSHIP_CODE_DESCRIPTION = chalk.dim`Configurable - Extensible - Toolkit`;

/**
 * CLI label/prompt prefix for Flagship Code
 */
export const FLAGSHIP_CODE_LABEL = chalk.bgBlueBright.white` ▸ flagship-code `;
