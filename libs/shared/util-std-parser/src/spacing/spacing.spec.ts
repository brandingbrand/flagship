import { parseFail, parseOk } from '../parser';

import { parseSpace, parseSpaces } from './spacing.parser';

describe('parseSpace', () => {
  it('should match exactly 1 space', () => {
    const result = parseSpace({ input: '    something' });

    expect(result).toStrictEqual(
      parseOk({ input: '    something', cursor: 0, cursorEnd: 1, value: ' ' })
    );
  });

  it('should not match characters', () => {
    const result = parseSpace({ input: 'something' });

    expect(result).toStrictEqual(parseFail({ input: 'something', cursor: 0 }));
  });

  it('should not match numbers', () => {
    const result = parseSpace({ input: '12345' });

    expect(result).toStrictEqual(parseFail({ input: '12345', cursor: 0 }));
  });
});

describe('parseSpaces', () => {
  it('should match 1 space', () => {
    const result = parseSpaces({ input: ' something' });

    expect(result).toStrictEqual(
      parseOk({
        input: ' something',
        cursor: 0,
        cursorEnd: 1,
        value: ' ',
      })
    );
  });

  it('should match more than one space', () => {
    const result = parseSpaces({ input: '    something' });

    expect(result).toStrictEqual(
      parseOk({
        input: '    something',
        cursor: 0,
        cursorEnd: 4,
        value: '    ',
      })
    );
  });

  it('should not match characters', () => {
    const result = parseSpaces({ input: 'something' });

    expect(result).toStrictEqual(
      parseFail({
        input: 'something',
        cursor: 0,
      })
    );
  });

  it('should not match numbers', () => {
    const result = parseSpaces({ input: '12345' });

    expect(result).toStrictEqual(
      parseFail({
        input: '12345',
        cursor: 0,
      })
    );
  });
});
