import { flow } from '@brandingbrand/standard-compose';
import { flatMap } from '@brandingbrand/standard-result';

import { parseOk } from '../parser';
import { parseString } from '../string';

import type { NullParser, UndefinedParser } from './literal.types';

/**
 * Matches a string undefined to the undefined value
 */
export const parseUndefined: UndefinedParser = flow(
  parseString('undefined'),
  flatMap((result) => parseOk({ ...result, value: undefined }))
);

/**
 * Matches a null string to the null value.
 */
export const parseNull: NullParser = flow(
  parseString('null'),
  flatMap((result) => parseOk({ ...result, value: null }))
);
