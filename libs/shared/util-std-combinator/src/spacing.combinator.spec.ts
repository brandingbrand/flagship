import { parseAlphaNumeric, parseOk } from '@brandingbrand/standard-parser';

import { surroundedBySpaces } from './spacing.combinator';

describe('surroundedBySpaces', () => {
  it('should extract values between spaces', () => {
    const parseToken = surroundedBySpaces(parseAlphaNumeric);
    const result = parseToken({ input: '     sakjdsijdsajdldwqhbzxc23mz1m    ' });

    expect(result).toStrictEqual(
      parseOk({
        input: '     sakjdsijdsajdldwqhbzxc23mz1m    ',
        cursor: 0,
        cursorEnd: 37,
        value: 'sakjdsijdsajdldwqhbzxc23mz1m',
      })
    );
  });

  it('should not fail', () => {
    const parseToken = surroundedBySpaces(parseAlphaNumeric);
    const result = parseToken({ input: 'sakjdsijdsajdldwqhbzxc23mz1m    ' });

    expect(result).toStrictEqual(
      parseOk({
        input: 'sakjdsijdsajdldwqhbzxc23mz1m    ',
        cursor: 0,
        cursorEnd: 32,
        value: 'sakjdsijdsajdldwqhbzxc23mz1m',
      })
    );
  });
});
