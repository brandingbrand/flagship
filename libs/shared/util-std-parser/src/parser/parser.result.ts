import { fail, ok } from '@brandingbrand/standard-result';
import type { Optional } from '@brandingbrand/standard-types';

import { brandParser } from './parser.brand';
import type { ParserFailure, ParserFailureFields, ParserOk, ParserOkFields } from './parser.types';

export const parseFail = ({
  cursor = 0,
  fatal,
  input,
}: Optional<ParserFailureFields, 'cursor'>): ParserFailure =>
  typeof fatal === 'string'
    ? fail(brandParser({ cursor, fatal, input }))
    : fail(brandParser({ cursor, input }));

export const parseOk = <T = unknown>({
  cursor = 0,
  cursorEnd,
  input,
  value,
}: Optional<ParserOkFields<T>, 'cursor'>): ParserOk<T> =>
  ok(brandParser({ cursor, cursorEnd, input, value }));
