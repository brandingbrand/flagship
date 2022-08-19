import { parseFail, parseOk } from '../parser';

import type { BooleanParserConstructor } from './boolean.types';

const parseBoolean: BooleanParserConstructor =
  (...acceptedValues) =>
  ({ cursor = 0, input }) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention -- Boolean represents an absolute value
    for (const acceptedValue of acceptedValues) {
      const value = acceptedValue ? 'true' : 'false';
      const cursorEnd = cursor + value.length;

      if (input.slice(cursor, cursorEnd) === value) {
        return parseOk({
          cursor,
          cursorEnd,
          input,
          value: acceptedValue,
        });
      }
    }

    return parseFail({
      cursor,
      input,
    });
  };

export const parseTrue = parseBoolean(true);
export const parseFalse = parseBoolean(false);
export const parseAnyBoolean = parseBoolean(true, false);
