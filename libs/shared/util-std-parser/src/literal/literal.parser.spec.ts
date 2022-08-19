import { parseFail, parseOk } from '../parser';

import { parseNull, parseUndefined } from './literal.parser';

describe('parseUndefined', () => {
  it('should parse `undefined` string', () => {
    const result = parseUndefined({ input: 'undefined' });

    expect(result).toStrictEqual(
      parseOk({ input: 'undefined', cursor: 0, cursorEnd: 9, value: undefined })
    );
  });

  it('should not parse `null` string', () => {
    const result = parseUndefined({ input: 'null' });

    expect(result).toStrictEqual(parseFail({ input: 'null', cursor: 0 }));
  });

  it('should not parse random string', () => {
    const result = parseUndefined({ input: 'random' });

    expect(result).toStrictEqual(parseFail({ input: 'random', cursor: 0 }));
  });

  it('should not parse partial string', () => {
    const result = parseUndefined({ input: 'undefin' });

    expect(result).toStrictEqual(parseFail({ input: 'undefin', cursor: 0 }));
  });

  it('should prase from cursor', () => {
    const result = parseUndefined({ input: '    undefined', cursor: 4 });

    expect(result).toStrictEqual(
      parseOk({ input: '    undefined', cursor: 4, cursorEnd: 13, value: undefined })
    );
  });
});

describe('parseNull', () => {
  it('should parse `null` string', () => {
    const result = parseNull({ input: 'null' });

    expect(result).toStrictEqual(parseOk({ input: 'null', cursor: 0, cursorEnd: 4, value: null }));
  });

  it('should not parse `undefined` string', () => {
    const result = parseNull({ input: 'undefined' });

    expect(result).toStrictEqual(parseFail({ input: 'undefined', cursor: 0 }));
  });

  it('should not parse random string', () => {
    const result = parseNull({ input: 'random' });

    expect(result).toStrictEqual(parseFail({ input: 'random', cursor: 0 }));
  });

  it('should not parse partial string', () => {
    const result = parseNull({ input: 'nul' });

    expect(result).toStrictEqual(parseFail({ input: 'nul', cursor: 0 }));
  });

  it('should prase from cursor', () => {
    const result = parseNull({ input: '    null', cursor: 4 });

    expect(result).toStrictEqual(
      parseOk({ input: '    null', cursor: 4, cursorEnd: 8, value: null })
    );
  });
});
