import { fail, ok } from '@brandingbrand/standard-result';

import { brandParser } from './parser.brand';
import type {
  ParserFailure,
  ParserFailureFields,
  ParserOk,
  ParserOkFields,
  WithCursor,
} from './parser.types';

export const parseFail = ({
  cursor = 0,
  fatal,
  input,
}: Omit<ParserFailureFields, 'cursor'> & Partial<WithCursor>): ParserFailure =>
  typeof fatal === 'string'
    ? fail(brandParser({ cursor, fatal, input }))
    : fail(brandParser({ cursor, input }));

export const parseOk = <T = unknown>({
  cursor = 0,
  cursorEnd,
  input,
  value,
}: Omit<ParserOkFields<T>, 'cursor'> & Partial<WithCursor>): ParserOk<T> =>
  ok(brandParser({ cursor, cursorEnd, input, value }));
