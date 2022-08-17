import * as FastCheck from 'fast-check';

import type { AsyncState } from '../async.types';

export const asyncStateArbitrary = <PayloadType, FailPayloadType>(
  payloadArbitrary: FastCheck.Arbitrary<PayloadType>,
  failPayloadArbitrary: FastCheck.Arbitrary<FailPayloadType>
): FastCheck.Arbitrary<AsyncState<PayloadType, FailPayloadType>> =>
  FastCheck.frequency(
    {
      arbitrary: FastCheck.record({
        status: FastCheck.constantFrom('idle' as const, 'loading' as const, 'success' as const),
        payload: payloadArbitrary,
      }),
      weight: 3,
    },
    {
      arbitrary: FastCheck.record({
        status: FastCheck.constant('failure' as const),
        payload: payloadArbitrary,
        failure: failPayloadArbitrary,
      }),
      weight: 1,
    }
  );

export const asyncActionCreatorTypeArbitrary = (): FastCheck.Arbitrary<
  'fail' | 'init' | 'load' | 'revert' | 'succeed'
> =>
  FastCheck.constantFrom(
    'init' as const,
    'load' as const,
    'succeed' as const,
    'fail' as const,
    'revert' as const
  );

export const sourceArbitrary = (): FastCheck.Arbitrary<string | symbol | undefined> =>
  FastCheck.option(FastCheck.oneof(FastCheck.string().map(Symbol), FastCheck.string()), {
    nil: undefined,
  });
