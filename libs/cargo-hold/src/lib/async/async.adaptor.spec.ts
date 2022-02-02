import * as FastCheck from 'fast-check';
import { createAsyncAdaptor } from '.';
import { LensCreator } from '..';
import { asyncStateArbitrary } from '../../testing/fast-check-arbitraries.util';

describe('createAsyncAdaptor', () => {
  describe('withLens', () => {
    it('composes with a lens correctly', () => {
      FastCheck.assert(
        FastCheck.property(
          FastCheck.string(),
          FastCheck.anything(),
          FastCheck.dictionary(
            FastCheck.string(),
            asyncStateArbitrary(FastCheck.anything(), FastCheck.anything())
            // { minKeys: 2 }
            // TODO: upon update to upcoming fast-check version, use the config object instead of
            // filter. @dtwiers 2022-01-28
          ).filter((value) => Object.keys(value).length >= 1),
          (actionKey, newState, state) => {
            const stateKey = Object.keys(state)[0];
            const lens = new LensCreator<typeof state>().fromProp(stateKey);
            const adaptor = createAsyncAdaptor({ actionKey }).withLens(lens);
            expect(adaptor.selectors.selectPayload(state)).toBe(state[stateKey].payload);
            expect(adaptor.lensedReducers.init(newState)(state)).toEqual({
              ...state,
              [stateKey]: {
                status: 'idle',
                payload: newState,
              },
            });
          }
        )
      );
    });

    it('works without a lens correctly', () => {
      FastCheck.assert(
        FastCheck.property(
          FastCheck.string(),
          asyncStateArbitrary(FastCheck.anything(), FastCheck.anything()),
          asyncStateArbitrary(FastCheck.anything(), FastCheck.anything()),
          (actionKey, newState, state) => {
            const adaptor = createAsyncAdaptor({ actionKey });
            expect(adaptor.selectors.selectPayload(state)).toBe(state.payload);
            expect(adaptor.lensedReducers.init(newState.payload)(state)).toEqual({
              status: 'idle',
              payload: newState.payload,
            });
          }
        )
      );
    });
  });

  describe('createState', () => {
    it('creates an idle state', () => {
      FastCheck.assert(
        FastCheck.property(FastCheck.string(), FastCheck.anything(), (actionKey, payload) => {
          const adaptor = createAsyncAdaptor({ actionKey });
          expect(adaptor.createState(payload)).toEqual({
            status: 'idle',
            payload,
          });
        })
      );
    });
  });
});
