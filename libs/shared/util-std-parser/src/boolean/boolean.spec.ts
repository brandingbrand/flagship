import { parseFail, parseOk } from '../parser';

import { parseBoolean } from './boolean.parser';

describe('parseBoolean', () => {
  it('succeeds as expected', () => {
    expect(parseBoolean(true)({ input: 'truefoo' })).toStrictEqual(
      parseOk({ cursor: 0, cursorEnd: 4, input: 'truefoo', value: true })
    );

    expect(parseBoolean(false)({ input: 'falsefoo' })).toStrictEqual(
      parseOk({ cursor: 0, cursorEnd: 5, input: 'falsefoo', value: false })
    );

    expect(parseBoolean(true)({ cursor: 3, input: 'footruefoo' })).toStrictEqual(
      parseOk({ cursor: 3, cursorEnd: 7, input: 'footruefoo', value: true })
    );

    expect(parseBoolean(false)({ cursor: 3, input: 'foofalsebar' })).toStrictEqual(
      parseOk({ cursor: 3, cursorEnd: 8, input: 'foofalsebar', value: false })
    );
  });

  it('fails as expected', () => {
    expect(parseBoolean(true)({ input: 'footruebar' })).toStrictEqual(
      parseFail({ cursor: 0, input: 'footruebar' })
    );

    expect(parseBoolean(true)({ cursor: 2, input: 'footruebar' })).toStrictEqual(
      parseFail({ cursor: 2, input: 'footruebar' })
    );
  });
});
