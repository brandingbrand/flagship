import { parseFail, parseOk } from '../parser';

import type { StringParserConstructor } from './string.types';

export const parseString: StringParserConstructor =
  (value) =>
  ({ cursor = 0, input }) => {
    const cursorEnd = cursor + value.length;

    if (input.slice(cursor, cursorEnd) === value) {
      return parseOk({
        cursor,
        cursorEnd,
        input,
        value,
      });
    }

    return parseFail({
      cursor,
      input,
    });
  };
