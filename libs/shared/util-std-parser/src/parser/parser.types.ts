import type { Branded } from '@brandingbrand/standard-branded';
import type { Failure, Ok, Result } from '@brandingbrand/standard-result';

import type { PARSER_BRANDING } from './parser.constants';

export interface ParserArgs {
  input: string;
  cursor?: number;
}

/**
 * Result types
 */
export type ParserOk<T> = Ok<Branded<ParserOkFields<T>, typeof PARSER_BRANDING>>;
export interface ParserOkFields<T = unknown> extends Required<ParserArgs> {
  value: T;
  cursorEnd: number;
}

export type ParserFailure = Failure<Branded<ParserFailureFields, typeof PARSER_BRANDING>>;
export interface ParserFailureFields extends Required<ParserArgs> {
  fatal?: string;
}

export type ParserResult<T> = Result<ParserOk<T>['ok'], ParserFailure['failure']>;

/**
 * Parser types
 */
export type Parser<T, AggregateType = unknown> = (
  args: ParserArgs | ParserOkFields<AggregateType>
) => ParserResult<T>;
export type Parsers<T, InputType = T> = [Parser<T, InputType>, ...Array<Parser<T, InputType>>];

export type AnyParser = Parser<unknown>;
export type AnyParsers = Parsers<unknown>;

export type ParserConstructor<T, P extends unknown[] = unknown[], InputType = T> = (
  ...params: P
) => Parser<T, InputType>;
