import { parseFail, parseOk, parseString } from '@brandingbrand/standard-parser';

import { many } from './combinator.many';

describe('many', () => {
  it('correctly constructs a `CombinatorFail` object', () => {
    expect(many(parseString('bar'))({ input: 'foo' })).toStrictEqual(
      parseFail({
        input: 'foo',
      })
    );

    expect(many(parseString('foo'), parseString('bar'))({ input: 'foofoo' })).toStrictEqual(
      parseFail({
        input: 'foofoo',
      })
    );

    expect(many(parseString('foo'), parseString('bar'))({ input: 'foobar' })).toStrictEqual(
      parseOk({
        cursorEnd: 6,
        input: 'foobar',
        value: ['foo', 'bar'],
      })
    );

    expect(
      many(parseString('foo'), parseString('bar'), parseString('baz'))({ input: 'foobarbaz' })
    ).toStrictEqual(
      parseOk({
        cursorEnd: 9,
        input: 'foobarbaz',
        value: ['foo', 'bar', 'baz'],
      })
    );
  });
});
