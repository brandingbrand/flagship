import type {AppEnvironment} from '@brandingbrand/code-app-env';
import {defineEnv} from '@brandingbrand/code-cli-kit';

export default defineEnv<AppEnvironment>({
  id: 'xyz67890',
  domain: 'https://myexampledomain.com',
});
