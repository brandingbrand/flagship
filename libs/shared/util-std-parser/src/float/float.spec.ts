import { parseFail, parseOk } from '../parser';

import { parseAnyFloat, parseFloat } from './float.parser';

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

describe('parseAnyFloat', () => {
  it('should parse integers with more than one character', () => {
    const results = parseAnyFloat({ input: '123.456789 ' });

    expect(results).toStrictEqual(
      parseOk({ input: '123.456789 ', cursor: 0, cursorEnd: 10, value: 123.456789 })
    );
  });

  it('should start from cursor', () => {
    const results = parseAnyFloat({ input: '123.456789 ', cursor: 3 });

    expect(results).toStrictEqual(
      parseOk({ input: '123.456789 ', cursor: 3, cursorEnd: 10, value: 0.456789 })
    );
  });
});
