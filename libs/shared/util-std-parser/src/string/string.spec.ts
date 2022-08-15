import { parseFail, parseOk } from '../parser';

import { parseString } from './string.parser';

const parseBar = parseString('bar');
const parseFoo = parseString('foo');

describe('parseString', () => {
  it('succeeds when expected', () => {
    expect(parseFoo({ input: 'foobar' })).toStrictEqual(
      parseOk({ cursor: 0, cursorEnd: 3, input: 'foobar', value: 'foo' })
    );

    expect(parseBar({ cursor: 3, input: 'foobar' })).toStrictEqual(
      parseOk({ cursor: 3, cursorEnd: 6, input: 'foobar', value: 'bar' })
    );
  });

  it('fails when expected', () => {
    expect(parseFoo({ cursor: 3, input: 'foobar' })).toStrictEqual(
      parseFail({ cursor: 3, input: 'foobar' })
    );

    expect(parseBar({ cursor: 6, input: 'foobar' })).toStrictEqual(
      parseFail({ cursor: 6, input: 'foobar' })
    );
  });
});
