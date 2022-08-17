import { parseFail, parseOk, parseString } from '@brandingbrand/standard-parser';

import { any, between } from './combinator';
import { combinateFail, combinateOk } from './combinator.result';

describe('any', () => {
  it('does', () => {
    expect(any(parseString('foo'), parseString('bar'))({ input: 'far' })).toStrictEqual(
      combinateFail({ cursor: 0, input: 'far', results: [parseFail({ input: 'far' })] })
    );

    expect(any(parseString('foo'), parseString('bar'))({ input: 'foo' })).toStrictEqual(
      combinateOk({
        cursor: 0,
        cursorEnd: 3,
        input: 'foo',
        results: [parseOk({ cursorEnd: 3, input: 'foo', value: 'foo' })],
        value: 'foo',
      })
    );

    expect(any(parseString('foo'), parseString('bar'))({ input: 'bar' })).toStrictEqual(
      combinateOk({
        cursor: 0,
        cursorEnd: 3,
        input: 'bar',
        results: [parseOk({ cursorEnd: 3, input: 'bar', value: 'bar' })],
        value: 'bar',
      })
    );

    expect(
      any(
        parseString('foo'),
        parseString('bar'),
        parseString('fantastic')
      )({ cursor: 3, input: 'foofantasticbar' })
    ).toStrictEqual(
      combinateOk({
        cursor: 3,
        cursorEnd: 12,
        input: 'foofantasticbar',
        results: [
          parseOk({ cursor: 3, cursorEnd: 12, input: 'foofantasticbar', value: 'fantastic' }),
        ],
        value: 'fantastic',
      })
    );
  });
});

describe('between', () => {
  it('does the hti', () => {
    expect(
      between(parseString('foo'), parseString('baz'))(parseString('bar'))({ input: 'foobarfoo' })
    ).toStrictEqual(
      combinateFail({
        cursor: 0,
        input: 'foobarfoo',
        results: [
          parseOk({ cursor: 0, cursorEnd: 3, input: 'foobarfoo', value: 'foo' }),
          parseOk({ cursor: 3, cursorEnd: 6, input: 'foobarfoo', value: 'bar' }),
          parseFail({ cursor: 6, input: 'foobarfoo' }),
        ],
      })
    );

    expect(
      between(parseString('foo'), parseString('baz'))(parseString('bar'))({ input: 'foobarbaz' })
    ).toStrictEqual(
      combinateOk({
        cursor: 0,
        cursorEnd: 9,
        input: 'foobarbaz',
        results: [
          parseOk({ cursor: 0, cursorEnd: 3, input: 'foobarbaz', value: 'foo' }),
          parseOk({ cursor: 3, cursorEnd: 6, input: 'foobarbaz', value: 'bar' }),
          parseOk({ cursor: 6, cursorEnd: 9, input: 'foobarbaz', value: 'baz' }),
        ],
        value: 'bar',
      })
    );
  });
});
