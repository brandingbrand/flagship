import {Config, summary} from '@brandingbrand/code-core';

import {CodePluginLocal} from './types';

const ios = summary.withSummary(
  async (config: Config & CodePluginLocal) => {
    //
  },
  'plugin-local',
  'platform::ios',
);

const android = summary.withSummary(
  async (config: Config & CodePluginLocal) => {
    //
  },
  'plugin-local',
  'platform::android',
);

export * from './types';

export {ios, android};
