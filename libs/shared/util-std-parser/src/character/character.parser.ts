import { parseFail, parseOk } from '../parser';

import type { CharacterParserConstructor } from './character.types';

export const parseCharacter: CharacterParserConstructor =
  (value) =>
  ({ cursor = 0, input }) => {
    if (value.length !== 1) {
      return parseFail({
        cursor,
        fatal: `parseCharacter called with a string value that was not a single character: \`${value}\``,
        input,
      });
    }

    const cursorEnd = cursor + 1;

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
