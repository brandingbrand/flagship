import {
  DOUBLE_QUOTE,
  ESCAPED_DOUBLE_QUOTE,
  ESCAPED_SINGLE_QUOTE,
  SINGLE_QUOTE,
  parseCharacter,
} from '../character';
import { parseFail, parseOk } from '../parser';

import type {
  BetweenDoubleQuoteParser,
  BetweenQuoteParser,
  BetweenSingleQuoteParser,
  DoubleQuoteParser,
  SingleQuoteParser,
} from './quote.types';

export const singleQuote: SingleQuoteParser = parseCharacter(SINGLE_QUOTE);
export const doubleQuote: DoubleQuoteParser = parseCharacter(DOUBLE_QUOTE);

const parseBetweenQuote =
  (quote: string): BetweenQuoteParser =>
  ({ cursor = 0, input }) => {
    if (input.slice(cursor).length === 0) {
      return parseFail({ cursor, input });
    }

    if (input.charAt(cursor) !== quote) {
      return parseFail({ cursor, input });
    }

    const nonEscapedQuoteIndex = [...input]
      .slice(cursor + 1)
      .findIndex((character, index, characters) => {
        const previousCharacter = characters[index - 1];

        // Escaped
        if (previousCharacter === '\\') {
          return false;
        }

        return character === quote;
      });

    if (nonEscapedQuoteIndex === -1) {
      return parseFail({ cursor, input, fatal: 'Non terminated quote' });
    }

    const cursorEnd = cursor + nonEscapedQuoteIndex;

    return parseOk({
      cursor,
      cursorEnd,
      input,
      value: input
        .slice(cursor + 1, cursorEnd + 1)
        .replace(quote === DOUBLE_QUOTE ? ESCAPED_DOUBLE_QUOTE : ESCAPED_SINGLE_QUOTE, quote),
    });
  };

export const parseBetweenDoubleQuote: BetweenDoubleQuoteParser = parseBetweenQuote(DOUBLE_QUOTE);
export const parseBetweenSingleQuote: BetweenSingleQuoteParser = parseBetweenQuote(SINGLE_QUOTE);
