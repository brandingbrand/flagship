import { parseFail, parseOk } from '../parser';

import type { FloatParserConstructor } from './float.types';

export const parseFloat: FloatParserConstructor =
  (flt) =>
  ({ cursor = 0, input }) => {
    if (Number.isInteger(flt) || Number.isNaN(flt)) {
      return parseFail({
        cursor,
        fatal: `parseFloat called with a numeric value that was not an float: \`${flt}\``,
        input,
      });
    }

    const value = `${flt}`;
    const cursorEnd = cursor + value.length;

    if (input.slice(cursor, cursorEnd) === value) {
      return parseOk({
        cursor,
        cursorEnd,
        input,
        value: flt,
      });
    }

    return parseFail({
      cursor,
      input,
    });
  };
