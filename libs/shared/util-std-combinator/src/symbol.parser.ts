import { DOUBLE_QUOTE, SINGLE_QUOTE, SPACE, parseCharacter } from '@brandingbrand/standard-parser';

import { repeat } from './combinator.repeat';

export const space = parseCharacter(SPACE);
export const spaces = repeat(space);

export const doubleQuote = parseCharacter(DOUBLE_QUOTE);
export const singleQuote = parseCharacter(SINGLE_QUOTE);
