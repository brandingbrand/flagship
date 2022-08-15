import type { Parser, ParserConstructor } from '../parser';

export type IntegerParser = Parser<number>;

export type IntegerParserConstructor = ParserConstructor<number, [number]>;
