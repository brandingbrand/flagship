import type {AppEnvironment} from '@brandingbrand/code-app-env';
import {defineEnv} from '@brandingbrand/code-cli-kit';

export default defineEnv<AppEnvironment>({
  id: 'abc12345',
  domain: 'https://dev.myexampledomain.com',
});
