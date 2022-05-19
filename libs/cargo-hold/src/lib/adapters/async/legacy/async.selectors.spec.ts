import { createLensCreator } from '@brandingbrand/standard-lens';

import * as FastCheck from 'fast-check';

import { asyncStateArbitrary } from '../../../../testing/fast-check-arbitraries.util';
import type { AsyncState } from '../async.types';

import { createSelectors } from './async.selectors';

describe('createSelectors', () => {
  const lens = createLensCreator<AsyncState<unknown, unknown>>().fromPath();
  const { selectFailure, selectPayload, selectStatus } = createSelectors(lens);

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
