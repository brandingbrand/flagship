import { createLens } from '@brandingbrand/standard-lens';
import * as FastCheck from 'fast-check';
import { AsyncState } from '.';
import { asyncStateArbitrary } from '../../testing/fast-check-arbitraries.util';
import { createSelectors } from './async.selectors';

describe('createSelectors', () => {
  const lens = createLens<AsyncState<unknown, unknown>>().fromPath();
  const { selectPayload, selectStatus, selectFailure } = createSelectors(lens);

  describe('selectPayload', () => {
    it('selects an async payload', () => {
      FastCheck.assert(
        FastCheck.property(
          asyncStateArbitrary(FastCheck.anything(), FastCheck.anything()),
          (state) => {
            expect(selectPayload(state)).toBe(state.payload);
          }
        )
      );
    });
  });

  describe('selectStatus', () => {
    it('selects the status', () => {
      FastCheck.assert(
        FastCheck.property(
          asyncStateArbitrary(FastCheck.anything(), FastCheck.anything()),
          (state) => {
            expect(selectStatus(state)).toBe(state.status);
          }
        )
      );
    });
  });

  describe('selectFailure', () => {
    it('selects failure if available', () => {
      FastCheck.assert(
        FastCheck.property(
          asyncStateArbitrary(FastCheck.anything(), FastCheck.anything()),
          (state) => {
            expect(selectFailure(state)).toBe(
              state.status === 'failure' ? state.failure : undefined
            );
          }
        )
      );
    });
  });
});
