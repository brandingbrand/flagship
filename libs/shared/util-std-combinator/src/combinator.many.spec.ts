import { parseFail, parseOk, parseString } from '@brandingbrand/standard-parser';

import { many } from './combinator.many';
import { combinateFail, combinateOk } from './combinator.result';

describe('many', () => {
  it('correctly constructs a `CombinatorFail` object', () => {
    expect(many(parseString('bar'))({ input: 'foo' })).toStrictEqual(
      combinateFail({
        input: 'foo',
        results: [parseFail({ cursor: 0, input: 'foo' })],
      })
    );

    expect(many(parseString('foo'), parseString('bar'))({ input: 'foofoo' })).toStrictEqual(
      combinateFail({
        input: 'foofoo',
        results: [
          parseOk({ cursor: 0, cursorEnd: 3, input: 'foofoo', value: 'foo' }),
          parseFail({ cursor: 3, input: 'foofoo' }),
        ],
      })
    );

    expect(many(parseString('foo'), parseString('bar'))({ input: 'foobar' })).toStrictEqual(
      combinateOk<string, string[]>({
        cursorEnd: 6,
        input: 'foobar',
        results: [
          parseOk({ cursor: 0, cursorEnd: 3, input: 'foobar', value: 'foo' }),
          parseOk({ cursor: 3, cursorEnd: 6, input: 'foobar', value: 'bar' }),
        ],
        value: ['foo', 'bar'],
      })
    );

    expect(
      many(parseString('foo'), parseString('bar'), parseString('baz'))({ input: 'foobarbaz' })
    ).toStrictEqual(
      combinateOk<string, string[]>({
        cursorEnd: 9,
        input: 'foobarbaz',
        results: [
          parseOk({ cursor: 0, cursorEnd: 3, input: 'foobarbaz', value: 'foo' }),
          parseOk({ cursor: 3, cursorEnd: 6, input: 'foobarbaz', value: 'bar' }),
          parseOk({ cursor: 6, cursorEnd: 9, input: 'foobarbaz', value: 'baz' }),
        ],
        value: ['foo', 'bar', 'baz'],
      })
    );
  });
});
