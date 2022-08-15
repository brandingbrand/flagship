import type { Parser, ParserConstructor } from '../parser';

export type CharacterParser = Parser<string>;

export type CharacterParserConstructor = ParserConstructor<string, [string]>;
