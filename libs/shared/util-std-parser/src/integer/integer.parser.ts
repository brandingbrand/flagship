import { parseFail, parseOk } from '../parser';

import type { IntegerParserConstructor } from './integer.types';

export const parseInteger: IntegerParserConstructor =
  (int) =>
  ({ cursor = 0, input }) => {
    if (!Number.isInteger(int)) {
      return parseFail({
        cursor,
        fatal: `parseInteger called with a numeric value that was not an integer: \`${int}\``,
        input,
      });
    }

    const value = `${int}`;
    const cursorEnd = cursor + value.length;

    if (input.slice(cursor, cursorEnd) === value) {
      return parseOk({
        cursor,
        cursorEnd,
        input,
        value: int,
      });
    }

    return parseFail({
      cursor,
      input,
    });
  };
