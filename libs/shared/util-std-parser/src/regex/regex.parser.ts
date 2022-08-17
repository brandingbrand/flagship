import { parseFail, parseOk } from '../parser';

import type { RegExParserConstructor } from './regex.types';

export const parseRegExp: RegExParserConstructor =
  (exp) =>
  ({ cursor = 0, input }) => {
    const value = exp.exec(input.slice(cursor));

    if (value === null) {
      return parseFail({
        cursor,
        input,
      });
    }

    const cursorEnd = value.index + (value[0] ?? '').length;

    return parseOk({
      cursor,
      cursorEnd,
      input,
      value,
    });
  };
