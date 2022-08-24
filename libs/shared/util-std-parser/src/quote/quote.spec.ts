import { parseFail, parseOk } from '../parser';

import { parseBetweenDoubleQuote, parseBetweenSingleQuote } from './quote.parser';

describe('parseBetweenDoubleQuote', () => {
  it('should move the cursor to the end of the quote', () => {
    const result = parseBetweenDoubleQuote({ input: '""', cursor: 0 });

    expect(result).toStrictEqual(
      parseOk({
        input: '""',
        cursor: 0,
        cursorEnd: 2,
        value: '',
      })
    );
  });

  it('should extract values between quotes', () => {
    const result = parseBetweenDoubleQuote({ input: '"vitae eligendi voluptatem"   ', cursor: 0 });

    expect(result).toStrictEqual(
      parseOk({
        input: '"vitae eligendi voluptatem"   ',
        cursor: 0,
        cursorEnd: 27,
        value: 'vitae eligendi voluptatem',
      })
    );
  });

  it('should start from cursor', () => {
    const result = parseBetweenDoubleQuote({
      input: '   "vitae eligendi voluptatem"   ',
      cursor: 3,
    });

    expect(result).toStrictEqual(
      parseOk({
        input: '   "vitae eligendi voluptatem"   ',
        cursor: 3,
        cursorEnd: 30,
        value: 'vitae eligendi voluptatem',
      })
    );
  });

  it('should escape quotes', () => {
    const result = parseBetweenDoubleQuote({
      input: '"vitae \\"eligendi\\" voluptatem"   ',
      cursor: 0,
    });

    expect(result).toStrictEqual(
      parseOk({
        input: '"vitae \\"eligendi\\" voluptatem"   ',
        cursor: 0,
        cursorEnd: 31,
        value: 'vitae "eligendi" voluptatem',
      })
    );
  });

  it('fails on unterminated quote', () => {
    const result = parseBetweenDoubleQuote({ input: '"vitae eligendi voluptatem   ', cursor: 0 });

    expect(result).toStrictEqual(
      parseFail({
        input: '"vitae eligendi voluptatem   ',
        cursor: 0,
        fatal: 'Non terminated quote',
      })
    );
  });
});

describe('parseBetweenSingleQuote', () => {
  it('should extract values between quotes', () => {
    const result = parseBetweenSingleQuote({ input: "'vitae eligendi voluptatem'   ", cursor: 0 });

    expect(result).toStrictEqual(
      parseOk({
        input: "'vitae eligendi voluptatem'   ",
        cursor: 0,
        cursorEnd: 27,
        value: 'vitae eligendi voluptatem',
      })
    );
  });

  it('should start from cursor', () => {
    const result = parseBetweenSingleQuote({
      input: "   'vitae eligendi voluptatem'   ",
      cursor: 3,
    });

    expect(result).toStrictEqual(
      parseOk({
        input: "   'vitae eligendi voluptatem'   ",
        cursor: 3,
        cursorEnd: 30,
        value: 'vitae eligendi voluptatem',
      })
    );
  });

  it('should escape quotes', () => {
    const result = parseBetweenSingleQuote({
      input: "'vitae \\'eligendi\\' voluptatem'   ",
      cursor: 0,
    });

    expect(result).toStrictEqual(
      parseOk({
        input: "'vitae \\'eligendi\\' voluptatem'   ",
        cursor: 0,
        cursorEnd: 31,
        value: "vitae 'eligendi' voluptatem",
      })
    );
  });

  it('fails on unterminated quote', () => {
    const result = parseBetweenSingleQuote({ input: "'vitae eligendi voluptatem   ", cursor: 0 });

    expect(result).toStrictEqual(
      parseFail({
        input: "'vitae eligendi voluptatem   ",
        cursor: 0,
        fatal: 'Non terminated quote',
      })
    );
  });
});
