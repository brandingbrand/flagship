import {version} from '@brandingbrand/code-cli-kit';

import {transforms072} from './0.72';
import {transforms073} from './0.73';

export const transforms = version.select({
  '0.72': transforms072,
  '0.73': transforms073,
});
