import {version} from '@brandingbrand/code-cli-kit';

import {transforms072} from './0.72';
import {transforms073} from './0.73';
import {transforms075} from './0.75';
import {transforms077} from './0.77';
import {transforms079} from './0.79';

/**
 * Export version-specific transforms object that selects correct transforms based on version
 */
export const transforms = version.select({
  '0.72': transforms072,
  '0.73': transforms073,
  '0.75': transforms075,
  '0.77': transforms077,
  '0.79': transforms079,
});
