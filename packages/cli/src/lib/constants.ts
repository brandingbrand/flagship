import chalk from 'chalk';

import pkg from '../../package.json';

/**
 * Semantic version range for the minimum supported React Native version. Supported versions are
 * 0.72.0 to 0.73.0 not including 0.74.0.
 * @example "~0.72.0" indicates any version of React Native from 0.72.0 up to, but not including, 0.73.0.
 *
 * TODO: remove - likely does not need to be used anymore, we should lean on align-deps.
 */
export const REACT_NATIVE_VERSION_RANGE = '^0.72.0 || ^0.73.0';

/**
 * Semantic version range for the minimum supported React version.
 * @example "^18.0.0" indicates any version of React from 18.0.0 up to, but not including, 19.0.0.
 *
 * TODO: remove - likely does not need to be used anymore, we should lean on align-deps.
 */
export const REACT_VERSION_RANGE = '^18.0.0';

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

export const FLAGSHIP_CODE_TITLE = chalk.bold
  .blue`Flagship Code ${chalk.bold.white`v${pkg.version}`}`;

export const FLAGSHIP_CODE_DESCRIPTION = chalk.dim`Configurable - Extensible - Toolkit`;

export const FLAGSHIP_CODE_LABEL = chalk.bgBlueBright.white` ▸ flagship-code `;
