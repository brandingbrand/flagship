import {cosmiconfigSync} from 'cosmiconfig';

import {COSMIC_MODULE_NAME} from './constants';

export type FlagshipAppEnvRC = {
  dir: string;
  singleEnv?: string;
  hiddenEnvs?: string[];
};

let appEnvConfig: FlagshipAppEnvRC | undefined;
/**
 * Loads the Flagship App Environment configuration from the `.flagshipappenvrc` file.
 */
export const loadFlagshipAppEnvRC = (): FlagshipAppEnvRC => {
  if (!appEnvConfig) {
    const explorerSync = cosmiconfigSync(COSMIC_MODULE_NAME);
    const result = explorerSync.search();

    if (result === null || result.isEmpty) {
      throw new Error('Unable to find .flagshipappenvrc configuration file');
    }

    if (!result.config.dir) {
      throw new Error(
        "The .flagshipappenvrc configuration file is missing required property: 'dir'",
      );
    }

    appEnvConfig = result.config as FlagshipAppEnvRC;
  }

  return appEnvConfig;
};
