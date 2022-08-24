import { parseFail, parseOk } from '../parser';

import { parseAnyRegExp, parseRegExp } from './regex.parser';

describe('parseRegExp', () => {
  it('should parse simple regex', () => {
    const parseAnything = parseRegExp(/.*/);
    const result = parseAnything({ input: 'something 12345 something' });

    expect(result).toStrictEqual(
      parseOk({
        input: 'something 12345 something',
        cursor: 0,
        cursorEnd: 25,
        value: ['something 12345 something'],
      })
    );
  });

  it("should fail if the regex doesn't match", () => {
    const parseAnything = parseRegExp(/other/);
    const result = parseAnything({ input: 'something 12345 something' });

    expect(result).toStrictEqual(
      parseFail({
        input: 'something 12345 something',
        cursor: 0,
      })
    );
  });

  it('should return match groups', () => {
    const parseAnything = parseRegExp(/.* (.*) .*/);
    const result = parseAnything({ input: 'something 12345 something' });

    expect(result).toStrictEqual(
      parseOk({
        input: 'something 12345 something',
        cursor: 0,
        cursorEnd: 25,
        value: ['something 12345 something', '12345'],
      })
    );
  });
});

describe('parseAnyRegExp', () => {
  it('should find regexp', () => {
    const result = parseAnyRegExp({ input: '/something/' });

    expect(result).toStrictEqual(
      parseOk({
        input: '/something/',
        cursor: 0,
        cursorEnd: 11,
        value: /something/,
      })
    );
  });

  it('should start from cursor', () => {
    const result = parseAnyRegExp({ cursor: 5, input: '12345/something/' });

    expect(result).toStrictEqual(
      parseOk({
        input: '12345/something/',
        cursor: 5,
        cursorEnd: 16,
        value: /something/,
      })
    );
  });

  it('should handle trailing spaces', () => {
    const result = parseAnyRegExp({ input: '/something/   ' });

    expect(result).toStrictEqual(
      parseOk({
        input: '/something/   ',
        cursor: 0,
        cursorEnd: 11,
        value: /something/,
      })
    );
  });

  it('should handle trailing spaces with cursor', () => {
    const result = parseAnyRegExp({ cursor: 5, input: '12345/something/   ' });

    expect(result).toStrictEqual(
      parseOk({
        input: '12345/something/   ',
        cursor: 5,
        cursorEnd: 16,
        value: /something/,
      })
    );
  });

  it('should capture flags', () => {
    const result = parseAnyRegExp({ input: '/something/gi' });

    expect(result).toStrictEqual(
      parseOk({
        input: '/something/gi',
        cursor: 0,
        cursorEnd: 13,
        value: /something/gi,
      })
    );
  });

  it('should capture flags with cursor', () => {
    const result = parseAnyRegExp({ cursor: 5, input: '12345/something/gi' });

    expect(result).toStrictEqual(
      parseOk({
        input: '12345/something/gi',
        cursor: 5,
        cursorEnd: 18,
        value: /something/gi,
      })
    );
  });

  it('should capture flags with trailing spaces', () => {
    const result = parseAnyRegExp({ cursor: 0, input: '/something/gi  ' });

    expect(result).toStrictEqual(
      parseOk({
        input: '/something/gi  ',
        cursor: 0,
        cursorEnd: 13,
        value: /something/gi,
      })
    );
  });
});
