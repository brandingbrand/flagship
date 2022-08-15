import { makeBranding } from '@brandingbrand/standard-branded';
import { fail, ok } from '@brandingbrand/standard-result';

import { PARSER_BRANDING } from './parser.constants';
import type {
  ParserFailure,
  ParserOk,
  WithCursor,
  WithCursorEnd,
  WithFatalError,
  WithInput,
  WithValue,
} from './parser.types';

export const { brand: brandParser, isBrand: isParser } = makeBranding(PARSER_BRANDING);

export const parseFail: (
  value: Partial<WithCursor & WithFatalError> & WithInput
) => ParserFailure = ({ cursor = 0, input, ...value }) =>
  fail(brandParser({ ...value, cursor, input }));

export const parseOk: <T>(
  args: Partial<WithCursor> & WithCursorEnd & WithInput & WithValue<T>
) => ParserOk<T> = ({ cursor = 0, cursorEnd, input, value }) =>
  ok(brandParser({ cursor, cursorEnd, input, value }));
