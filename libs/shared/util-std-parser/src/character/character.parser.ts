import { parseFail, parseOk } from '../parser';

import type { CharacterParser, CharacterParserConstructor } from './character.types';

const makeParseCharacter =
  (
    predicate: (character: string, specifiedCharacter: string) => boolean
  ): CharacterParserConstructor =>
  (specifiedCharacter) =>
  ({ cursor = 0, input }) => {
    if (specifiedCharacter.length !== 1) {
      return parseFail({
        cursor,
        fatal: `parseCharacter called with a string value that was not a single character: \`${specifiedCharacter}\``,
        input,
      });
    }

    const cursorEnd = cursor + 1;
    const character = input.slice(cursor, cursorEnd);

    if (predicate(character, specifiedCharacter)) {
      return parseOk({
        cursor,
        cursorEnd,
        input,
        value: character,
      });
    }

    return parseFail({
      cursor,
      input,
    });
  };

export const parseCharacter: CharacterParserConstructor = makeParseCharacter(
  (character, specifiedCharacter) => character === specifiedCharacter
);

export const parseNotCharacter: CharacterParserConstructor = makeParseCharacter(
  (character, specifiedCharacter) => character !== specifiedCharacter
);

export const parseAnyCharacter: CharacterParser = makeParseCharacter(() => true)('.');
