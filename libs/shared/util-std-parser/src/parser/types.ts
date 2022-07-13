import type { Failure, Ok, Result } from '@brandingbrand/standard-result';

import type { CURSOR, CURSOR_END, INPUT } from './constants';

export type ParserOk = WithCursor & WithCursorEnd & WithInput;

export type ParserFailure = WithCursor & WithInput;

export type ParserResult = Result<ParserOk, ParserFailure>;

export type ParserResultSuccess = Ok<ParserOk>;

export type ParserResultFailure = Failure<ParserFailure>;

export type WithCursor = Record<typeof CURSOR, number>;

export type WithCursorEnd = Record<typeof CURSOR_END, number>;

export type WithInput = Record<typeof INPUT, string>;

export type ParserArgs = Partial<WithCursor> & WithInput;

export type Parser = (args: ParserArgs) => ParserResult;

export type Parsers = [Parser, ...Parser[]];

export type ParserConstructor<P extends unknown[] = unknown[]> = (...params: P) => Parser;
