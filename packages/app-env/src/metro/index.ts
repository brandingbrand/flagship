import fs from 'fs';
import crypto from 'crypto';

import {getEnvFileList, loadFlagshipAppEnvRC} from '../shared';

function getCacheVersion() {
  const config = loadFlagshipAppEnvRC();

  const cacheVersionHash = getEnvFileList(config).reduce((acc, file) => {
    // If the file exists, update the hash with a string representation of the file's last modified time.
    if (fs.existsSync(file)) {
      const stats = fs.statSync(file);
      acc.update(String(stats.mtimeMs));
    }

    return acc;
  }, crypto.createHash('md5'));

  return cacheVersionHash.digest('hex');
}

export {getCacheVersion};
