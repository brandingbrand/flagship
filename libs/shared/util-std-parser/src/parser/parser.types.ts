import type { Branded } from '@brandingbrand/standard-branded';
import type { Failure, Ok, Result } from '@brandingbrand/standard-result';

import type {
  CURSOR_END_KEY,
  CURSOR_KEY,
  FATAL_ERROR_KEY,
  INPUT_KEY,
  PARSER_BRANDING,
  VALUE_KEY,
} from './parser.constants';

export type ParserArgs = Partial<WithCursor> & WithInput;

// export type ParserBase = Branded<Required<ParserArgs>, typeof PARSER_BRANDING>;

/**
 * Utility types for composition
 */
export type WithCursor = Record<typeof CURSOR_KEY, number>;

export type WithCursorEnd = Record<typeof CURSOR_END_KEY, number>;

export type WithFatalError = Record<typeof FATAL_ERROR_KEY, string>;

export type WithInput = Record<typeof INPUT_KEY, string>;

export type WithValue<T> = Record<typeof VALUE_KEY, T>;

/**
 * Result types
 */
export type ParserOkFields<T = unknown> = Required<ParserArgs> & WithCursorEnd & WithValue<T>;

export type ParserOk<T> = Ok<Branded<ParserOkFields<T>, typeof PARSER_BRANDING>>;

export type ParserFailureFields = Partial<WithFatalError> & Required<ParserArgs>;

export type ParserFailure = Failure<Branded<ParserFailureFields, typeof PARSER_BRANDING>>;

export type ParserResult<T> = Result<ParserOk<T>['ok'], ParserFailure['failure']>;

/**
 * Parser types
 */
export type Parser<T> = (args: ParserArgs) => ParserResult<T>;

export type Parsers<T> = [Parser<T>, ...Array<Parser<T>>];

export type AnyParser = Parser<unknown>;

export type AnyParsers = Parsers<unknown>;

export type ParserConstructor<T, P extends unknown[] = unknown[]> = (...params: P) => Parser<T>;
