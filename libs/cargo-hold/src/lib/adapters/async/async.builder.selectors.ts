import type { IPathLens } from '@brandingbrand/standard-lens';
import { createLensCreator } from '@brandingbrand/standard-lens';

import { buildPayloadLens } from './async.builder.lens';
import type {
  WithIdleType,
  WithLensInstance,
  WithPayloadTypes,
  WithSuccessType,
} from './async.builder.types';
import type { AsyncFailureState, AsyncState, AsyncStatus } from './async.types';

/**
 * Takes a builder and returns a selector that selects the payload.
 *
 * @param builder
 */
export function buildSelectPayload<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>> &
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType>
): (input: OuterStructureType) => IdleType | SuccessType;

/**
 * Takes a builder and returns a selector that selects the payload.
 *
 * @param builder
 */
export function buildSelectPayload<SuccessType, IdleType>(
  builder: WithIdleType<IdleType> & WithSuccessType<SuccessType>
): (input: AsyncState<SuccessType, unknown, IdleType>) => IdleType | SuccessType;

/**
 * Takes a builder and returns a selector that selects the payload.
 *
 * @param builder
 * @return
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions -- cant use arrow functions for overloading.
export function buildSelectPayload<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType> &
      WithPayloadTypes<SuccessType, FailureType, IdleType>
  >
): (
  input: AsyncState<SuccessType, unknown, IdleType> | OuterStructureType
) => IdleType | SuccessType {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any -- the any is limited in scope and not worth it to describe.
  return buildPayloadLens(builder).get as any;
}

/**
 * Takes a builder and returns a selector that selects the status.
 *
 * @param builder
 */
export function buildSelectStatus<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>> &
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType>
): (input: OuterStructureType) => AsyncStatus;

/**
 * Takes a builder and returns a selector that selects the status.
 *
 * @param builder
 */
export function buildSelectStatus<SuccessType, FailureType, IdleType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>>
): (input: AsyncState<SuccessType, FailureType, IdleType>) => AsyncStatus;

/**
 * Takes a builder and returns a selector that selects the status.
 *
 * @param builder
 * @return
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions -- cant use arrow functions for overloading.
export function buildSelectStatus<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType> &
      WithPayloadTypes<SuccessType, FailureType, IdleType>
  >
): (input: AsyncState<SuccessType, FailureType, IdleType> | OuterStructureType) => AsyncStatus {
  const statusLens =
    createLensCreator<AsyncState<SuccessType, FailureType, IdleType>>().fromPath('status');
  if (builder.lens) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any -- the any is limited in scope and not worth it to describe.
    return statusLens.withOuterLens(builder.lens).get as any;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any -- the any is limited in scope and not worth it to describe.
  return statusLens.get as any;
}

/**
 * Takes a builder and returns a selector that selects the failure data if available.
 *
 * @param builder
 * @return
 */
export function buildSelectFailure<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>> &
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType>
): (input: OuterStructureType) => FailureType | undefined;

/**
 * Takes a builder and returns a selector that selects the failure data if available.
 *
 * @param builder
 * @return
 */
export function buildSelectFailure<SuccessType, FailureType, IdleType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>>
): (input: AsyncState<SuccessType, FailureType, IdleType>) => FailureType | undefined;

/**
 * Takes a builder and returns a selector that selects the failure data if available.
 *
 * @param builder
 * @return
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions -- cant use arrow functions for overloading.
export function buildSelectFailure<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType> &
      WithPayloadTypes<SuccessType, FailureType, IdleType>
  >
): (
  input: AsyncState<SuccessType, FailureType, IdleType> | OuterStructureType
) => FailureType | undefined {
  const failureLens =
    createLensCreator<AsyncFailureState<IdleType | SuccessType, FailureType>>().fromPath('failure');
  if (builder.lens) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return -- the any is limited in scope and not worth it to describe.
    return failureLens.withOuterLens(
      // this coercion is fine; the lens just gets 'failure' from it so if it's not a failure,
      // it'll return undefined, which is what we want.
      builder.lens as IPathLens<
        OuterStructureType,
        AsyncFailureState<IdleType | SuccessType, FailureType>
      >
      // eslint-disable-next-line @typescript-eslint/no-explicit-any -- the any is limited in scope and not worth it to describe.
    ).get as any;
  }
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-explicit-any -- the any is limited in scope and not worth it to describe.
  return failureLens.get as any;
}
