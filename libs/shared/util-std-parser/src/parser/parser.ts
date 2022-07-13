import type { Failure, Ok } from '@brandingbrand/standard-result';
import { fail, ok } from '@brandingbrand/standard-result';

import type { ParserFailure, ParserOk } from './types';

export const failure: (value: ParserFailure) => Failure<ParserFailure> = fail;

export const succeed: (value: ParserOk) => Ok<ParserOk> = ok;

export const value = ({ cursor, cursorEnd, input }: ParserOk): string =>
  input.slice(cursor, cursorEnd);
