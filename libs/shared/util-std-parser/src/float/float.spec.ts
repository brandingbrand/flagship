import { parseFail, parseOk } from '../parser';

import { parseFloat } from './float.parser';

describe('parseFloat', () => {
  it('succeeds when expected', () => {
    expect(parseFloat(55.5)({ input: '55.5bar' })).toStrictEqual(
      parseOk({ cursor: 0, cursorEnd: 4, input: '55.5bar', value: 55.5 })
    );

    expect(parseFloat(55.5)({ cursor: 3, input: 'foo55.5bar' })).toStrictEqual(
      parseOk({ cursor: 3, cursorEnd: 7, input: 'foo55.5bar', value: 55.5 })
    );
  });

  it('fails when expected', () => {
    expect(parseFloat(55.5)({ cursor: 0, input: 'foo55.5bar' })).toStrictEqual(
      parseFail({ cursor: 0, input: 'foo55.5bar' })
    );

    expect(parseFloat(55.5)({ cursor: 3, input: 'foo555bar' })).toStrictEqual(
      parseFail({ cursor: 3, input: 'foo555bar' })
    );

    expect(parseFloat(555)({ cursor: 6, input: 'foo55.5bar' })).toStrictEqual(
      parseFail({
        cursor: 6,
        fatal: `parseFloat called with a numeric value that was not an float: \`555\``,
        input: 'foo55.5bar',
      })
    );

    expect(parseFloat(Number.NaN)({ cursor: 6, input: 'foo55.5bar' })).toStrictEqual(
      parseFail({
        cursor: 6,
        fatal: `parseFloat called with a numeric value that was not an float: \`NaN\``,
        input: 'foo55.5bar',
      })
    );
  });
});
