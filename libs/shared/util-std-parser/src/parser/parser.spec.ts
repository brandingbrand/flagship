import { fail, ok } from '@brandingbrand/standard-result';

import { parseFail, parseOk } from './parser.result';

// eslint-disable-next-line @typescript-eslint/naming-convention -- Intentional usage of underscore
const tagged = { _tag: 'parser' };

describe('parseFail', () => {
  it('correctly constructs a `ParserFailure` object`', () => {
    expect(parseFail({ input: 'foobarbaz' })).toStrictEqual(
      fail({ ...tagged, cursor: 0, input: 'foobarbaz' })
    );

    expect(parseFail({ cursor: 5, input: 'bazbarfoo' })).toStrictEqual(
      fail({ ...tagged, cursor: 5, input: 'bazbarfoo' })
    );

    expect(parseFail({ cursor: 5, fatal: 'foobarbaz', input: 'bazbarfoo' })).toStrictEqual(
      fail({ ...tagged, cursor: 5, fatal: 'foobarbaz', input: 'bazbarfoo' })
    );
  });
});

describe('parseOk', () => {
  it('correctly constructs a `ParserOk` object', () => {
    expect(parseOk({ cursorEnd: 5, input: 'foobarbaz', value: 'fooba' })).toStrictEqual(
      ok({ ...tagged, cursor: 0, cursorEnd: 5, input: 'foobarbaz', value: 'fooba' })
    );

    expect(parseOk({ cursor: 3, cursorEnd: 8, input: 'foobarbaz', value: 'barbaz' })).toStrictEqual(
      ok({ ...tagged, cursor: 3, cursorEnd: 8, input: 'foobarbaz', value: 'barbaz' })
    );
  });
});
