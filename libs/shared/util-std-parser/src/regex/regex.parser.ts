import { parseFail, parseOk } from '../parser';

import type { AnyRegExParser, RegExParserConstructor } from './regex.types';

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
      value: [...value],
    });
  };

export const parseAnyRegExp: AnyRegExParser = ({ cursor = 0, input }) => {
  if (input.slice(cursor).length === 0) {
    return parseFail({ cursor, input });
  }

  if (input.charAt(cursor) !== '/') {
    return parseFail({ cursor, input });
  }

  const nonEscapedSlashIndex = [...input]
    .slice(cursor + 1)
    .findIndex((character, index, characters) => {
      const previousCharacter = characters[index - 1];

      // Escaped
      if (previousCharacter === '\\') {
        return false;
      }

      return character === '/';
    });

  if (nonEscapedSlashIndex === -1) {
    return parseFail({ cursor, input, fatal: 'Non terminated RegExp' });
  }

  const patternEndAbsoluteIndex = cursor + nonEscapedSlashIndex + 1;
  let regexEndIndex = [...input].slice(patternEndAbsoluteIndex).indexOf(' ');
  if (regexEndIndex === -1) {
    regexEndIndex = input.length - patternEndAbsoluteIndex;
  }

  const cursorEnd = cursor + nonEscapedSlashIndex + regexEndIndex;

  const regExpString = input.slice(cursor + 1, cursorEnd - regexEndIndex + 1).replace(/\//g, '/');
  const regExpFlags = input.slice(cursorEnd - regexEndIndex + 2, cursorEnd + 1).replace(/\//g, '/');

  try {
    return parseOk({
      cursor,
      cursorEnd,
      input,
      // eslint-disable-next-line security/detect-non-literal-regexp -- Intended behavior
      value: new RegExp(regExpString, regExpFlags),
    });
  } catch (error) {
    return parseFail({
      cursor,
      input,
      fatal:
        error instanceof Error ? error.message : 'An unknown error occurred when creating RegExp',
    });
  }
};
