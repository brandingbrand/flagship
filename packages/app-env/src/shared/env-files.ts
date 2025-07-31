import fs from 'fs';
import path from 'path';

import {ENV_FILE_REGEX} from './constants';
import {FlagshipAppEnvRC} from './load-config';

/**
 * extracts the environment name from an environment file path.
 */
export const extractEnvName = (filePath: string): string | undefined =>
  ENV_FILE_REGEX.exec(path.basename(filePath))?.[1];

/**
 * Retrieves and filters the list of environment files based on the configuration in `.flagshipappenvrc`.
 *
 * If `singleEnv` is specified, it will only include that specific environment file.
 *
 * If `hiddenEnvs` is specified, but not `singleEnv`, it will exclude those environments from the list.
 *
 * @param {FlagshipAppEnvRC} config - The configuration object loaded from `.flagshipappenvrc`.
 * @returns An array of absolute paths to the environment files.
 */
export const getEnvFileList = ({
  dir,
  singleEnv,
  hiddenEnvs = [],
}: FlagshipAppEnvRC): string[] => {
  const envDir = path.resolve(process.cwd(), dir);

  if (singleEnv) {
    // If `singleEnv` is specified, return only that specific environment file
    const singleEnvPath = path.resolve(envDir, `env.${singleEnv}.ts`);

    if (!fs.existsSync(singleEnvPath)) {
      throw new Error(
        `Environment file for '${singleEnv}' does not exist at ${singleEnvPath}`,
      );
    }

    return [singleEnvPath];
  }

  return fs
    .readdirSync(path.resolve(process.cwd(), dir))
    .filter(it => {
      const envName = extractEnvName(it);
      // Filter out any files that do not match to a environment name, or environments that are hidden
      return !!envName && !hiddenEnvs.includes(envName);
    })
    .map(it => path.resolve(process.cwd(), dir, it));
};
