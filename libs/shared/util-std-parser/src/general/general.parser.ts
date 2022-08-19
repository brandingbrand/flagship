import {
  CHAR_CODE_0,
  CHAR_CODE_9,
  CHAR_CODE_A,
  CHAR_CODE_AS,
  CHAR_CODE_Z,
  CHAR_CODE_ZS,
} from '../constants';
import { parseFail, parseOk } from '../parser';

import type { AlphaNumericParser, AnythingParser } from './general.types';

export const parseAnything: AnythingParser = ({ cursor = 0, input }) => {
  const cursorEnd = input.length;

  return parseOk({
    cursor,
    cursorEnd,
    input,
    value: input.slice(cursor, cursorEnd),
  });
};

const isAlphaNumeric = (character: string): boolean => {
  const code = character.codePointAt(0);

  return (
    code !== undefined &&
    ((code >= CHAR_CODE_A && code <= CHAR_CODE_Z) ||
      (code >= CHAR_CODE_AS && code <= CHAR_CODE_ZS) ||
      (code >= CHAR_CODE_0 && code <= CHAR_CODE_9))
  );
};

export const parseAlphaNumeric: AlphaNumericParser = ({ cursor = 0, input }) => {
  if (input.slice(cursor).length === 0) {
    return parseFail({ cursor, input });
  }

  const nonAlphaNumericIndex = [...input]
    .slice(cursor)
    .findIndex((character) => !isAlphaNumeric(character));

  if (nonAlphaNumericIndex <= 0) {
    return parseFail({ cursor, input });
  }

  const cursorEnd = cursor + nonAlphaNumericIndex;

  return parseOk({
    cursor,
    cursorEnd,
    input,
    value: input.slice(cursor, cursorEnd),
  });
};
