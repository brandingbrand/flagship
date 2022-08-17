import { parseFail, parseOk } from '@brandingbrand/standard-parser';
import { fail, ok } from '@brandingbrand/standard-result';

import { combinateFail, combinateOk } from './combinator.result';

// eslint-disable-next-line @typescript-eslint/naming-convention -- Intentional usage of underscore
const tagged = { _tag: 'combinator' };

describe('combinateFail', () => {
  it('correctly constructs a `CombinatorFail` object', () => {
    expect(
      combinateFail({
        input: 'foo',
        results: [parseFail({ input: 'foo' })],
      })
    ).toStrictEqual(
      fail({
        ...tagged,
        cursor: 0,
        input: 'foo',
        results: [parseFail({ input: 'foo' })],
      })
    );

    expect(
      combinateFail({
        cursor: 3,
        input: 'foobar',
        results: [parseFail({ cursor: 3, input: 'foobar' })],
      })
    ).toStrictEqual(
      fail({
        ...tagged,
        cursor: 3,
        input: 'foobar',
        results: [parseFail({ cursor: 3, input: 'foobar' })],
      })
    );
  });
});

describe('combinateOk', () => {
  it('correctly constructs a `CombinatorOk` object', () => {
    expect(
      combinateOk<string>({
        cursorEnd: 3,
        input: 'foo',
        results: [parseOk({ cursor: 0, cursorEnd: 3, input: 'foo', value: 'foo' })],
        value: 'foo',
      })
    ).toStrictEqual(
      ok({
        ...tagged,
        cursor: 0,
        cursorEnd: 3,
        input: 'foo',
        results: [parseOk({ cursor: 0, cursorEnd: 3, input: 'foo', value: 'foo' })],
        value: 'foo',
      })
    );

    expect(
      combinateOk<string>({
        cursor: 3,
        cursorEnd: 6,
        input: 'foobar',
        results: [parseOk({ cursor: 3, cursorEnd: 6, input: 'foobar', value: 'bar' })],
        value: 'bar',
      })
    ).toStrictEqual(
      ok({
        ...tagged,
        cursor: 3,
        cursorEnd: 6,
        input: 'foobar',
        results: [parseOk({ cursor: 3, cursorEnd: 6, input: 'foobar', value: 'bar' })],
        value: 'bar',
      })
    );
  });
});
