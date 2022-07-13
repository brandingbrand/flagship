import type { Failure, Ok } from '@brandingbrand/standard-result';
import { fail, ok } from '@brandingbrand/standard-result';

import Chance from 'chance';

import type {
  ParserFailure,
  ParserOk,
  ParserResult,
  ParserResultFailure,
  ParserResultSuccess,
} from '../parser';
import { isParserFailure } from '../parser';

import type { CombinatorParserResults } from './types';
import { lastResult, toCombinatorResult } from './util';

const chance = new Chance();

const mockParserSuccess = (...params: [cursor?: number, input?: string]): Ok<ParserOk> => {
  const input = params[1] ?? chance.sentence().split(' ').join(' ');
  const cursor = params[0] ?? chance.integer({ min: 0, max: input.length - 1 });
  const cursorEnd = chance.integer({ min: cursor, max: input.length });

  return ok({
    cursor,
    cursorEnd,
    input,
  });
};

const mockParserFailure = (): Failure<ParserFailure> => {
  const input = chance.sentence().split(' ').join(' ');
  const cursor = chance.integer({ min: 0, max: input.length - 1 });

  return fail({
    cursor,
    input,
  });
};

const mockParserResults = (count?: number, shouldFail = false): CombinatorParserResults =>
  chance
    .sentence({ words: count ?? chance.integer({ max: 10, min: 1 }) })
    .split(' ')
    // eslint-disable-next-line unicorn/no-array-reduce -- This is a spec file and I like reduce.
    .reduce<ParserResult[]>((acc, value, index, original) => {
      const last = acc[acc.length - 1];
      const input = original.join('');

      if (!last) {
        return [ok({ cursor: 0, cursorEnd: value.length, input })];
      }

      if (isParserFailure(last)) {
        return acc;
      }

      if (shouldFail && index === original.length - 1) {
        acc.push(fail({ cursor: last.ok.cursorEnd, input }));
      } else {
        acc.push(
          ok({
            cursor: last.ok.cursorEnd,
            cursorEnd: last.ok.cursorEnd + value.length,
            input,
          })
        );
      }

      return acc;
    }, []) as CombinatorParserResults;

describe('lastResult', () => {
  it('returns the last result in the array', () => {
    const [foo, bar, baz] = mockParserResults(3) as [
      ParserResultSuccess,
      ParserResultSuccess,
      ParserResultFailure
    ];

    expect(lastResult([foo])).toStrictEqual(foo);
    expect(lastResult([foo, bar])).toStrictEqual(bar);
    expect(lastResult([foo, bar, baz])).toStrictEqual(baz);
  });
});

describe('toCombinatorResult', () => {
  it('correctly handles a success', () => {
    const result = mockParserSuccess();
    const combinatorResult = toCombinatorResult(result);

    expect(combinatorResult).toStrictEqual({ ...result, ok: { ...result.ok, results: [result] } });
  });

  it('correctly handles a failure', () => {
    const result = mockParserFailure();
    const combinatorResult = toCombinatorResult(result);

    expect(combinatorResult).toStrictEqual({
      ...result,
      failure: { ...result.failure, results: [result] },
    });
  });
});
