import type { Parser, ParserConstructor } from '../parser';

export type FloatParser = Parser<number>;

export type FloatParserConstructor = ParserConstructor<number, [number]>;
