import { summary } from '@brandingbrand/code-core';

const ios = summary.withSummary(async config => {
  //
}, 'plugin-local', 'platform::ios');
const android = summary.withSummary(async config => {
  //
}, 'plugin-local', 'platform::android');

export { android, ios };
