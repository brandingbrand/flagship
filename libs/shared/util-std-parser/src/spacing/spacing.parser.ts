import { SPACE, parseCharacter } from '../character';
import { parseFail, parseOk } from '../parser';

import type { SpaceParser, SpacesParser } from './spacing.types';

export const parseSpace: SpaceParser = parseCharacter(SPACE);

export const parseSpaces: SpacesParser = ({ cursor = 0, input }) => {
  if (input.slice(cursor).length === 0) {
    return parseFail({ cursor, input, fatal: 'Unexpected end of input' });
  }

  if (input.charAt(cursor) !== ' ') {
    return parseFail({ cursor, input });
  }

  const nonSpaceIndex = [...input].slice(cursor).findIndex((character) => character !== ' ');

  if (nonSpaceIndex === 0) {
    return parseFail({ cursor, input });
  }

  const cursorEnd = nonSpaceIndex === -1 ? input.length : cursor + nonSpaceIndex;

  return parseOk({
    cursor,
    cursorEnd,
    input,
    value: input.slice(cursor, cursorEnd),
  });
};
