import {Config, logger} from '@brandingbrand/kernel-core';

import {KernelPluginLocal} from './types';

const ios = (config: Config & KernelPluginLocal) => {
  logger.logInfo('Executing @brandingbrand/kernel-plugin-local::ios');
};

const android = (config: Config & KernelPluginLocal) => {
  logger.logInfo('Executing @brandingbrand/kernel-plugin-local::android');
};

export * from './types';

export {ios, android};
