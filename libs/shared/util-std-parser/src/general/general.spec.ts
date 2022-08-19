import { parseOk } from '../parser';

import { parseAlphaNumeric, parseAnything } from './general.parser';

const REALLY_LONG_INPUT = `Harum animi et sunt molestiae quidem. Nihil hic assumenda magni. Id ipsam sed eius fugiat eius fugit in.
Quibusdam est et quibusdam quibusdam velit velit alias in. Libero quo eum quis. Praesentium iusto et tenetur architecto reiciendis fugiat natus accusantium.
Iure voluptas quaerat nemo quia sint nisi corrupti quia consequatur. Corporis excepturi asperiores et commodi fugiat dignissimos praesentium. Eveniet nisi eum itaque et. Quasi saepe repellat. Ab rerum aperiam. Reprehenderit distinctio odit omnis qui.`;

describe('parseAnything', () => {
  it('should extract the whole input as a value', () => {
    const result = parseAnything({
      input: REALLY_LONG_INPUT,
    });

    expect(result).toStrictEqual(
      parseOk({
        cursor: 0,
        cursorEnd: REALLY_LONG_INPUT.length,
        input: REALLY_LONG_INPUT,
        value: REALLY_LONG_INPUT,
      })
    );
  });

  it('should start at cursor', () => {
    const result = parseAnything({
      input: '123456789',
      cursor: 3,
    });

    expect(result).toStrictEqual(
      parseOk({
        cursor: 3,
        cursorEnd: 9,
        input: '123456789',
        value: '456789',
      })
    );
  });
});

describe('parseAlphaNumeric', () => {
  it('should parse until alpha numeric text ends', () => {
    const result = parseAlphaNumeric({
      input: 'abcdefghijklmopqrstuvwxyzABCDEFGHIJKLNMOPQRSTUVWXYZ0123456789.',
    });

    expect(result).toStrictEqual(
      parseOk({
        input: 'abcdefghijklmopqrstuvwxyzABCDEFGHIJKLNMOPQRSTUVWXYZ0123456789.',
        cursor: 0,
        cursorEnd: 61,
        value: 'abcdefghijklmopqrstuvwxyzABCDEFGHIJKLNMOPQRSTUVWXYZ0123456789',
      })
    );
  });

  it('should parse from cursor', () => {
    const result = parseAlphaNumeric({
      cursor: 3,
      input: '   abcdefghijklmopqrstuvwxyzABCDEFGHIJKLNMOPQRSTUVWXYZ0123456789.',
    });

    expect(result).toStrictEqual(
      parseOk({
        input: '   abcdefghijklmopqrstuvwxyzABCDEFGHIJKLNMOPQRSTUVWXYZ0123456789.',
        cursor: 3,
        cursorEnd: 64,
        value: 'abcdefghijklmopqrstuvwxyzABCDEFGHIJKLNMOPQRSTUVWXYZ0123456789',
      })
    );
  });
});
