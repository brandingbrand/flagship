import type { Parser, ParserOkFields, ParserResult, Parsers } from '@brandingbrand/standard-parser';
import type { Ok } from '@brandingbrand/standard-result';

/** Parser types */

export type CombinatorParserResults<T = unknown> =
  | [...Array<Ok<ParserOkFields<T>>>, ParserResult<T>]
  | [Ok<ParserOkFields<T>>];

/**
 * Combinator
 */

export type Combinator<T = unknown, P extends Parsers<T> = Parsers<T>, V = T> = (
  ...parameters: P
) => Parser<V>;

export type ManyCombinator<T = unknown> = Combinator<T, Parsers<T>, T[]>;
