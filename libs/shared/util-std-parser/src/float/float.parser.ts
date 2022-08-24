import { CHAR_CODE_0, CHAR_CODE_9, CHAR_CODE_MINUS } from '../constants';
import { parseFail, parseOk } from '../parser';

import type { FloatParser, FloatParserConstructor } from './float.types';

export const parseFloat: FloatParserConstructor = (float) => {
  if (Number.isInteger(float) || Number.isNaN(float)) {
    return ({ cursor, input }) =>
      parseFail({
        cursor,
        fatal: `parseFloat called with a numeric value that was not an float: \`${float}\``,
        input,
      });
  }

  return ({ cursor = 0, input }) => {
    const value = `${float}`;
    const cursorEnd = cursor + value.length;

    if (input.slice(cursor, cursorEnd) === value) {
      return parseOk({
        cursor,
        cursorEnd,
        input,
        value: float,
      });
    }

    return parseFail({
      cursor,
      input,
    });
  };
};

const isFloatCharacter = (character: string, index: number): boolean => {
  const code = character.codePointAt(0);

  if (index === 0 && code === CHAR_CODE_MINUS) {
    return true;
  }

  return (code !== undefined && code >= CHAR_CODE_0 && code <= CHAR_CODE_9) || character === '.';
};

export const parseAnyFloat: FloatParser = ({ cursor = 0, input }) => {
  if (input.slice(cursor).length === 0) {
    return parseFail({ cursor, input });
  }

  const nonIntegerIndex = [...input]
    .slice(cursor)
    .findIndex((character, index) => !isFloatCharacter(character, index));

  if (nonIntegerIndex <= 0) {
    return parseFail({ cursor, input });
  }

  const cursorEnd = cursor + nonIntegerIndex;

  return parseOk({
    cursor,
    cursorEnd,
    input,
    value: Number.parseFloat(input.slice(cursor, cursorEnd)),
  });
};
