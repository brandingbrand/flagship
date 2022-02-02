import * as FastCheck from 'fast-check';
import { AsyncActionCreators, createAsyncActionCreators } from './async.actions';
import type { AsyncAction } from './async.types';

describe('createAsyncActionCreators', () => {
  it('creates all actions', () => {
    FastCheck.assert(
      FastCheck.property(
        FastCheck.string(),
        FastCheck.option(FastCheck.oneof(FastCheck.string().map(Symbol), FastCheck.string()), {
          nil: undefined,
        }),
        FastCheck.constantFrom('init', 'load', 'succeed', 'fail', 'revert'),
        FastCheck.anything(),
        (key, source, asyncType, payload) => {
          const asyncKey = asyncType as keyof AsyncActionCreators<string, unknown, unknown>;
          const actionCreators = createAsyncActionCreators(key, source);
          expect(actionCreators).toHaveProperty('init');
          expect(actionCreators[asyncKey]).toHaveProperty('type');
          expect(actionCreators[asyncKey].type).toBe(key);
          expect(actionCreators[asyncKey].source).toBe(source);
          expect(actionCreators[asyncKey].subtype).toBe(`async:${asyncType}`);
          expect(actionCreators[asyncKey].create(payload)).toEqual<
            AsyncAction<typeof key, unknown, unknown>
          >({
            type: key,
            source,
            subtype: `async:${asyncType}` as AsyncAction<typeof key, unknown, unknown>['subtype'],
            payload,
          });
        }
      )
    );
  });
});
