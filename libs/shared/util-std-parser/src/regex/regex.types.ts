import type { Parser, ParserConstructor } from '../parser';

export type RegExParser = Parser<string[]>;

export type RegExParserConstructor = ParserConstructor<string[], [RegExp]>;

export type AnyRegExParser = Parser<RegExp>;
