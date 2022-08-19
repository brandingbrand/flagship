import type { Parser } from '../parser';

export type SingleQuoteParser = Parser<string>;
export type DoubleQuoteParser = Parser<string>;

export type BetweenQuoteParser = Parser<string>;
export type BetweenSingleQuoteParser = Parser<string>;
export type BetweenDoubleQuoteParser = Parser<string>;
