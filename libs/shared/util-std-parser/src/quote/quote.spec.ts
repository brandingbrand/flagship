import { parseFail, parseOk } from '../parser';

import { parseBetweenDoubleQuote, parseBetweenSingleQuote } from './quote.parser';

describe('parseBetweenDoubleQuote', () => {
  it('should extract values between quotes', () => {
    const result = parseBetweenDoubleQuote({ input: '"vitae eligendi voluptatem"   ', cursor: 0 });

    expect(result).toStrictEqual(
      parseOk({
        input: '"vitae eligendi voluptatem"   ',
        cursor: 0,
        cursorEnd: 25,
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
        cursorEnd: 28,
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
        cursorEnd: 29,
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
        cursorEnd: 25,
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
        cursorEnd: 28,
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
        cursorEnd: 29,
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
