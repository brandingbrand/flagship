import type { Parser, ParserConstructor } from '../parser';

export type StringParser = Parser<string>;

export type StringParserConstructor = ParserConstructor<string, [string]>;
