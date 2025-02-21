import chalk from 'chalk';

import pkg from '../../../package.json';

/**
 * ASCII art logo for Flagship Code rendered in blue.
 * Used as the primary visual identifier in the CLI interface.
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
 * Title text for Flagship Code CLI including version number.
 * Renders in blue with the version number in white.
 */
export const FLAGSHIP_CODE_TITLE = chalk.bold
  .blue`Flagship Code ${chalk.bold.white`v${pkg.version}`}`;

/**
 * Description tagline highlighting key features of Flagship Code.
 * Rendered in dimmed text for visual hierarchy.
 */
export const FLAGSHIP_CODE_DESCRIPTION = chalk.dim`Configurable - Extensible - Toolkit`;

/**
 * CLI prompt label used to identify Flagship Code commands.
 * Rendered with a blue background and white text for visibility.
 */
export const FLAGSHIP_CODE_LABEL = chalk.bgBlueBright.white` ▸ flagship-code `;
