import { pipe } from '@brandingbrand/standard-compose';
import { parseFail, parseOk, parseString } from '@brandingbrand/standard-parser';

import { repeat, repeatUntilTerminator } from './combinator.repeat';

describe('repeat', () => {
  it('correctly constructs a `CombinatorFail` object', () => {
    expect(repeat(parseString('bar'))({ input: 'foofoofoo' })).toStrictEqual(
      parseFail({
        cursor: 0,
        input: 'foofoofoo',
      })
    );

    expect(repeat(parseString('foo'))({ input: 'foo' })).toStrictEqual(
      parseOk({
        cursor: 0,
        cursorEnd: 3,
        input: 'foo',
        value: ['foo'],
      })
    );

    expect(repeat(parseString('foo'))({ input: 'foofoobarfoo' })).toStrictEqual(
      parseOk({
        cursor: 0,
        cursorEnd: 6,
        input: 'foofoobarfoo',
        value: ['foo', 'foo'],
      })
    );

    expect(repeat(parseString('foo'))({ input: 'foofoofoo' })).toStrictEqual(
      parseOk({
        cursor: 0,
        cursorEnd: 9,
        input: 'foofoofoo',
        value: ['foo', 'foo', 'foo'],
      })
    );
  });
});

describe('repeatUntilTerminator', () => {
  it('does', () => {
    const combinator = pipe(parseString('foo'), repeatUntilTerminator(parseString('bar')));

    expect(combinator({ input: 'barfoo' })).toStrictEqual(
      parseFail({
        cursor: 0,
        input: 'barfoo',
      })
    );

    expect(combinator({ input: 'foobar' })).toStrictEqual(
      parseOk({
        cursor: 0,
        cursorEnd: 3,
        input: 'foobar',
        value: ['foo'],
      })
    );

    expect(combinator({ input: 'foofoobar' })).toStrictEqual(
      parseOk({
        cursor: 0,
        cursorEnd: 6,
        input: 'foofoobar',
        value: ['foo', 'foo'],
      })
    );

    expect(combinator({ input: 'foofoofoobar' })).toStrictEqual(
      parseOk({
        cursor: 0,
        cursorEnd: 9,
        input: 'foofoofoobar',
        value: ['foo', 'foo', 'foo'],
      })
    );
  });
});
