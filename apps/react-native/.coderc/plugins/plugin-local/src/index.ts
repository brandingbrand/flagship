import {Config, logger} from '@brandingbrand/code-core';

import {KernelPluginLocal} from './types';

const ios = (config: Config & KernelPluginLocal) => {
  logger.logInfo('Executing @brandingbrand/code-plugin-local::ios');
};

const android = (config: Config & KernelPluginLocal) => {
  logger.logInfo('Executing @brandingbrand/code-plugin-local::android');
};

export * from './types';

export {ios, android};
