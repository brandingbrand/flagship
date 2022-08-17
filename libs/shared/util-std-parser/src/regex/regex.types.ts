import type { Parser, ParserConstructor } from '../parser';

export type RegExParser = Parser<RegExpExecArray>;

export type RegExParserConstructor = ParserConstructor<RegExpExecArray, [RegExp]>;
