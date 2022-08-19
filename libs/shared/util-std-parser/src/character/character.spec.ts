import { parseFail, parseOk } from '../parser';

import { parseCharacter, parseNotCharacter } from './character.parser';

const parseA = parseCharacter('a');
const parseB = parseCharacter('b');

const parseNotA = parseNotCharacter('a');
const parseNotB = parseNotCharacter('b');

const args = { input: 'aba' };

describe('parseCharacter', () => {
  it('succeeds when expected', () => {
    expect(parseA(args)).toStrictEqual(parseOk({ ...args, cursor: 0, cursorEnd: 1, value: 'a' }));

    expect(parseB({ ...args, cursor: 1 })).toStrictEqual(
      parseOk({ ...args, cursor: 1, cursorEnd: 2, value: 'b' })
    );

    expect(parseA({ ...args, cursor: 2 })).toStrictEqual(
      parseOk({ ...args, cursor: 2, cursorEnd: 3, value: 'a' })
    );
  });

  it('fails when expected', () => {
    expect(parseB(args)).toStrictEqual(parseFail({ ...args, cursor: 0 }));

    expect(parseA({ ...args, cursor: 1 })).toStrictEqual(parseFail({ ...args, cursor: 1 }));

    expect(parseB({ ...args, cursor: 2 })).toStrictEqual(parseFail({ ...args, cursor: 2 }));

    expect(parseCharacter('foobar')(args)).toStrictEqual(
      parseFail({
        ...args,

        cursor: 0,
        fatal: `parseCharacter called with a string value that was not a single character: \`foobar\``,
      })
    );
  });
});

describe('parseNotCharacter', () => {
  it('fails when expected', () => {
    expect(parseNotB(args)).toStrictEqual(
      parseOk({ ...args, cursor: 0, cursorEnd: 1, value: 'a' })
    );

    expect(parseNotA({ ...args, cursor: 1 })).toStrictEqual(
      parseOk({ ...args, cursor: 1, cursorEnd: 2, value: 'b' })
    );

    expect(parseNotB({ ...args, cursor: 2 })).toStrictEqual(
      parseOk({ ...args, cursor: 2, cursorEnd: 3, value: 'a' })
    );
  });

  it('succeeds when expected', () => {
    expect(parseNotA(args)).toStrictEqual(parseFail({ ...args, cursor: 0 }));

    expect(parseNotB({ ...args, cursor: 1 })).toStrictEqual(parseFail({ ...args, cursor: 1 }));

    expect(parseNotA({ ...args, cursor: 2 })).toStrictEqual(parseFail({ ...args, cursor: 2 }));

    expect(parseNotCharacter('foobar')(args)).toStrictEqual(
      parseFail({
        ...args,

        cursor: 0,
        fatal: `parseCharacter called with a string value that was not a single character: \`foobar\``,
      })
    );
  });
});
