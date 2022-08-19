import { pipe } from '@brandingbrand/standard-compose';

import { parseInteger } from '../integer/integer.parser';
import type { ParserArgs } from '../parser';
import { parseOk } from '../parser';
import { parseString } from '../string';

import { flatMapParse, flatMapParseFailure, mergeParse } from './compose';

describe('flatMapParser', () => {
  it('composes', () => {
    const composedParser = (args: ParserArgs) =>
      pipe(args, parseString('123'), flatMapParse(parseInteger(123)));

    const result = composedParser({ input: '123123' });

    expect(result).toStrictEqual(parseOk({ cursor: 3, cursorEnd: 6, input: '123123', value: 123 }));
  });
});

describe('flatMapParseFailure', () => {
  it('composes', () => {
    const composedParser = (args: ParserArgs) =>
      pipe(args, parseString('456'), flatMapParseFailure(parseInteger(123)));

    const result = composedParser({ input: '123' });

    expect(result).toStrictEqual(parseOk({ cursor: 0, cursorEnd: 3, input: '123', value: 123 }));
  });
});

describe('mergeParse', () => {
  it('composes', () => {
    const composedParser = (args: ParserArgs) =>
      pipe(args, parseString('123'), mergeParse(parseInteger(456)));

    const result = composedParser({ input: '123456' });

    expect(result).toStrictEqual(
      parseOk({ cursor: 0, cursorEnd: 6, input: '123456', value: ['123', 456] })
    );
  });
});
