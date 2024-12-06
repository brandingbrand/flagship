import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

import {cosmiconfigSync} from 'cosmiconfig';

const MODULE_NAME = 'flagshipappenvrc';

function getCacheVersion() {
  const explorerSync = cosmiconfigSync(MODULE_NAME);
  const result = explorerSync.load(
    path.resolve(process.cwd(), '.' + MODULE_NAME),
  );

  if (result === null || result.isEmpty) {
    throw new Error('Unable to find .flagshipappenvrc configuration file');
  }

  const {
    dir,
    hiddenEnvs = [],
    singleEnv,
  } = result.config as {
    dir: string;
    singleEnv?: string;
    hiddenEnvs?: string[];
  };

  const cacheVersionHash = fs
    .readdirSync(path.resolve(process.cwd(), dir))

    // Filter to only include files that match the pattern `env.<envName>.ts`
    .filter(it => /^env\.\w+\.ts/gm.test(it))

    // Filter out any environments that are hidden or don't match the single environment (if specified)
    .filter(it => {
      const regex = new RegExp(/^env\.(\w+)\.ts/gm);
      const match = regex.exec(it);

      if (!match || !match[1]) {
        return false;
      }

      // Exclude hidden environments
      return !hiddenEnvs.includes(match[1]);
    })

    // If `singleEnv` is specified, filter to only include that specific environment
    .filter(it => {
      if (!singleEnv) return true;

      const regex = new RegExp(/^env\.(\w+)\.ts/gm);
      const match = regex.exec(it);

      if (!match || !match[1]) {
        return false;
      }

      return singleEnv === match[1];
    })

    // Convert each environment file path to an absolute path
    .map(file => {
      return path.resolve(process.cwd(), dir, file);
    })
    .reduce((acc, curr) => {
      if (fs.existsSync(curr)) {
        const stats = fs.statSync(curr);
        acc.update(String(stats.mtimeMs));
      }

      return acc;
    }, crypto.createHash('md5'));

  return cacheVersionHash.digest('hex');
}

export {getCacheVersion};
