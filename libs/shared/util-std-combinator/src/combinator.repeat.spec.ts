import { pipe } from '@brandingbrand/standard-compose';
import { parseFail, parseOk, parseString } from '@brandingbrand/standard-parser';

import { repeat, repeatUntilTerminator } from './combinator.repeat';
import { combinateFail, combinateOk } from './combinator.result';

describe('repeat', () => {
  it('correctly constructs a `CombinatorFail` object', () => {
    expect(repeat(parseString('bar'))({ input: 'foofoofoo' })).toStrictEqual(
      combinateFail({
        cursor: 0,
        input: 'foofoofoo',
        results: [parseFail({ input: 'foofoofoo' })],
      })
    );

    expect(repeat(parseString('foo'))({ input: 'foo' })).toStrictEqual(
      combinateOk({
        cursor: 0,
        cursorEnd: 3,
        input: 'foo',
        results: [parseOk({ cursor: 0, cursorEnd: 3, input: 'foo', value: 'foo' })],
        value: ['foo'],
      })
    );

    expect(repeat(parseString('foo'))({ input: 'foofoobarfoo' })).toStrictEqual(
      combinateOk({
        cursor: 0,
        cursorEnd: 6,
        input: 'foofoobarfoo',
        results: [
          parseOk({ cursor: 0, cursorEnd: 3, input: 'foofoobarfoo', value: 'foo' }),
          parseOk({ cursor: 3, cursorEnd: 6, input: 'foofoobarfoo', value: 'foo' }),
        ],
        value: ['foo', 'foo'],
      })
    );

    expect(repeat(parseString('foo'))({ input: 'foofoofoo' })).toStrictEqual(
      combinateOk({
        cursor: 0,
        cursorEnd: 9,
        input: 'foofoofoo',
        results: [
          parseOk({ cursor: 0, cursorEnd: 3, input: 'foofoofoo', value: 'foo' }),
          parseOk({ cursor: 3, cursorEnd: 6, input: 'foofoofoo', value: 'foo' }),
          parseOk({ cursor: 6, cursorEnd: 9, input: 'foofoofoo', value: 'foo' }),
        ],
        value: ['foo', 'foo', 'foo'],
      })
    );
  });
});

describe('repeatUntilTerminator', () => {
  it('does', () => {
    const combinator = pipe(parseString('foo'), repeatUntilTerminator(parseString('bar')));

    expect(combinator({ input: 'barfoo' })).toStrictEqual(
      combinateFail({
        cursor: 0,
        input: 'barfoo',
        results: [parseFail({ cursor: 0, input: 'barfoo' })],
      })
    );

    expect(combinator({ input: 'foobar' })).toStrictEqual(
      combinateOk({
        cursor: 0,
        cursorEnd: 3,
        input: 'foobar',
        results: [parseOk({ cursor: 0, cursorEnd: 3, input: 'foobar', value: 'foo' })],
        value: ['foo'],
      })
    );

    expect(combinator({ input: 'foofoobar' })).toStrictEqual(
      combinateOk({
        cursor: 0,
        cursorEnd: 6,
        input: 'foofoobar',
        results: [
          parseOk({ cursor: 0, cursorEnd: 3, input: 'foofoobar', value: 'foo' }),
          parseOk({ cursor: 3, cursorEnd: 6, input: 'foofoobar', value: 'foo' }),
        ],
        value: ['foo', 'foo'],
      })
    );

    expect(combinator({ input: 'foofoofoobar' })).toStrictEqual(
      combinateOk({
        cursor: 0,
        cursorEnd: 9,
        input: 'foofoofoobar',
        results: [
          parseOk({ cursor: 0, cursorEnd: 3, input: 'foofoofoobar', value: 'foo' }),
          parseOk({ cursor: 3, cursorEnd: 6, input: 'foofoofoobar', value: 'foo' }),
          parseOk({ cursor: 6, cursorEnd: 9, input: 'foofoofoobar', value: 'foo' }),
        ],
        value: ['foo', 'foo', 'foo'],
      })
    );
  });
});
