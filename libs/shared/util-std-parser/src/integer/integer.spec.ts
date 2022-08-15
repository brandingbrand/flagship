import { parseFail, parseOk } from '../parser';

import { parseInteger } from './integer.parser';

describe('parseInteger', () => {
  it('succeeds when expected', () => {
    expect(parseInteger(555)({ input: '555bar' })).toStrictEqual(
      parseOk({ cursor: 0, cursorEnd: 3, input: '555bar', value: 555 })
    );

    expect(parseInteger(555)({ cursor: 3, input: 'foo555bar' })).toStrictEqual(
      parseOk({ cursor: 3, cursorEnd: 6, input: 'foo555bar', value: 555 })
    );
  });

  it('fails when expected', () => {
    expect(parseInteger(555)({ input: 'foo555bar' })).toStrictEqual(
      parseFail({ cursor: 0, input: 'foo555bar' })
    );

    expect(parseInteger(555)({ cursor: 3, input: 'foo55.5bar' })).toStrictEqual(
      parseFail({ cursor: 3, input: 'foo55.5bar' })
    );

    expect(parseInteger(55.5)({ cursor: 6, input: 'foo555bar' })).toStrictEqual(
      parseFail({
        cursor: 6,
        fatal: `parseInteger called with a numeric value that was not an integer: \`55.5\``,
        input: 'foo555bar',
      })
    );

    expect(parseInteger(Number.NaN)({ cursor: 6, input: 'foo555bar' })).toStrictEqual(
      parseFail({
        cursor: 6,
        fatal: `parseInteger called with a numeric value that was not an integer: \`NaN\``,
        input: 'foo555bar',
      })
    );
  });
});
