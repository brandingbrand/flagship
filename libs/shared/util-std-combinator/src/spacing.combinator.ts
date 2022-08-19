import { parseSpace, parseSpaces } from '@brandingbrand/standard-parser';

import { optional, surroundedBy } from './combinator';

/**
 * Makes sure that spaces do not break the parser.
 */
export const surroundedBySpaces = surroundedBy(optional(parseSpaces));

/**
 * Requires that at least one space is around the parser's input.
 */
export const surroundedByAtLeastOneSpace = surroundedBy(parseSpace);
