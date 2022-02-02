import * as FastCheck from 'fast-check';
import { AsyncState } from '../lib/async/async.types';

export const asyncStateArbitrary = <Payload, FailPayload>(
  payloadArbitrary: FastCheck.Arbitrary<Payload>,
  failPayloadArbitrary: FastCheck.Arbitrary<FailPayload>
): FastCheck.Arbitrary<AsyncState<Payload, FailPayload>> =>
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

export const asyncActionCreatorTypeArbitrary = () =>
  FastCheck.constantFrom(
    'init' as const,
    'load' as const,
    'succeed' as const,
    'fail' as const,
    'revert' as const
  );

export const sourceArbitrary = () =>
  FastCheck.option(FastCheck.oneof(FastCheck.string().map(Symbol), FastCheck.string()), {
    nil: undefined,
  });
