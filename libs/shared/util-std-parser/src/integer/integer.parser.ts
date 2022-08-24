import { parseFail, parseOk } from '../parser';

import type { IntegerParser, IntegerParserConstructor } from './integer.types';

export const parseInteger: IntegerParserConstructor = (integer) => {
  if (!Number.isInteger(integer)) {
    return ({ cursor, input }) =>
      parseFail({
        cursor,
        fatal: `parseInteger called with a numeric value that was not an integer: \`${integer}\``,
        input,
      });
  }

  return ({ cursor = 0, input }) => {
    const value = `${integer}`;
    const cursorEnd = cursor + value.length;

    if (input.slice(cursor, cursorEnd) === value) {
      return parseOk({
        cursor,
        cursorEnd,
        input,
        value: integer,
      });
    }

    return parseFail({
      cursor,
      input,
    });
  };
};

export const parseAnyInteger: IntegerParser = ({ cursor = 0, input }) => {
  if (input.slice(cursor).length === 0) {
    return parseFail({ cursor, input });
  }

  const nonIntegerIndex = [...input].slice(cursor).findIndex((character, index) => {
    if (character === '-' && index === 0) {
      return false;
    }

    return Number.isNaN(Number.parseInt(character, 10));
  });

  if (nonIntegerIndex <= 0) {
    return parseFail({ cursor, input });
  }

  const cursorEnd = cursor + nonIntegerIndex;

  return parseOk({
    cursor,
    cursorEnd,
    input,
    value: Number.parseInt(input.slice(cursor, cursorEnd), 10),
  });
};
