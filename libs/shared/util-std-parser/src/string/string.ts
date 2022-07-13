import { fail, ok } from '@brandingbrand/standard-result';

import { doubleQuote, singleQuote, space } from '../character';
import { either, repeat, surroundedBy } from '../combinator';
import type { ParserConstructor } from '../parser';

export const string: ParserConstructor<[string]> =
  (value) =>
  ({ cursor = 0, input }) => {
    const cursorEnd = cursor + value.length;

    if (input.slice(cursor, cursorEnd) === value) {
      return ok({
        cursor,
        cursorEnd,
        input,
      });
    }

    return fail({
      cursor,
      input,
    });
  };

// Boolean literals
export const booleanFalse = string('false');
export const booleanTrue = string('true');
export const boolean = either(booleanFalse, booleanTrue);

// Number literals
export const integer: ParserConstructor<[number | `${number}`]> = (value) => string(`${value}`);

export const spaces = repeat(space);

// Quoted strings
export const doubleQuotedString = surroundedBy(doubleQuote);
export const singleQuotedString = surroundedBy(singleQuote);
export const quotedString = surroundedBy(either(doubleQuote, singleQuote));
