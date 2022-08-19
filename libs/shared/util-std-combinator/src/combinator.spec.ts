import { parseFail, parseOk, parseString } from '@brandingbrand/standard-parser';

import { any, between } from './combinator';

describe('any', () => {
  it('does', () => {
    expect(any(parseString('foo'), parseString('bar'))({ input: 'far' })).toStrictEqual(
      parseFail({ cursor: 0, input: 'far' })
    );

    expect(any(parseString('foo'), parseString('bar'))({ input: 'foo' })).toStrictEqual(
      parseOk({
        cursor: 0,
        cursorEnd: 3,
        input: 'foo',
        value: 'foo',
      })
    );

    expect(any(parseString('foo'), parseString('bar'))({ input: 'bar' })).toStrictEqual(
      parseOk({
        cursor: 0,
        cursorEnd: 3,
        input: 'bar',
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
      parseOk({
        cursor: 3,
        cursorEnd: 12,
        input: 'foofantasticbar',
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
      parseFail({
        cursor: 0,
        input: 'foobarfoo',
      })
    );

    expect(
      between(parseString('foo'), parseString('baz'))(parseString('bar'))({ input: 'foobarbaz' })
    ).toStrictEqual(
      parseOk({
        cursor: 0,
        cursorEnd: 9,
        input: 'foobarbaz',
        value: 'bar',
      })
    );
  });
});
