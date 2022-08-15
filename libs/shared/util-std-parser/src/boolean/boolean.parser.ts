import { parseFail, parseOk } from '../parser';

import type { BooleanParserConstructor } from './boolean.types';

export const parseBoolean: BooleanParserConstructor =
  (bool) =>
  ({ cursor = 0, input }) => {
    const value = bool ? 'true' : 'false';
    const cursorEnd = cursor + value.length;

    if (input.slice(cursor, cursorEnd) === value) {
      return parseOk({
        cursor,
        cursorEnd,
        input,
        value: bool,
      });
    }

    return parseFail({
      cursor,
      input,
    });
  };
