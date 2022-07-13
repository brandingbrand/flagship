import { either } from '../combinator';
import type { ParserConstructor } from '../parser';
import { string } from '../string';

import { DOUBLE_QUOTE, SINGLE_QUOTE, SPACE } from './constants';

export const character: ParserConstructor<[string]> = (value) => string(value[0] ?? '');

export const escapedCharacter: ParserConstructor<[string, ...[string]]> = (
  value,
  escapeChar = '\\'
) => either(character(value), string(`${escapeChar}${value[0]}`));

export const doubleQuote = character(DOUBLE_QUOTE);

export const singleQuote = character(SINGLE_QUOTE);

export const space = character(SPACE);

export const quote = either(doubleQuote, singleQuote);
