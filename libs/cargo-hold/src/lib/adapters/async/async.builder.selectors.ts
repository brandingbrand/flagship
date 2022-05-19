import type { IPathLens } from '@brandingbrand/standard-lens';
import { createLensCreator } from '@brandingbrand/standard-lens';

import { buildPayloadLens } from './async.builder.lens';
import type { WithLensInstance, WithPayloadTypes } from './async.builder.types';
import type { AsyncFailureState, AsyncState, AsyncStatus } from './async.types';

export function buildSelectPayload<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>> &
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType>
): (input: OuterStructureType) => IdleType | SuccessType;
export function buildSelectPayload<SuccessType, FailureType, IdleType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>>
): (input: AsyncState<SuccessType, FailureType, IdleType>) => IdleType | SuccessType;
/**
 *
 * @param builder
 */
export function buildSelectPayload<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType> &
      WithPayloadTypes<SuccessType, FailureType, IdleType>
  >
) {
  return buildPayloadLens(builder).get;
}

export function buildSelectStatus<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>> &
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType>
): (input: OuterStructureType) => AsyncStatus;
export function buildSelectStatus<SuccessType, FailureType, IdleType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>>
): (input: AsyncState<SuccessType, FailureType, IdleType>) => AsyncStatus;
/**
 *
 * @param builder
 */
export function buildSelectStatus<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType> &
      WithPayloadTypes<SuccessType, FailureType, IdleType>
  >
) {
  const statusLens =
    createLensCreator<AsyncState<SuccessType, FailureType, IdleType>>().fromPath('status');
  if (builder.lens) {
    return statusLens.withOuterLens(builder.lens).get;
  }
  return statusLens.get;
}

export function buildSelectFailure<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>> &
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType>
): (input: AsyncState<SuccessType, FailureType, IdleType>) => FailureType | undefined;
export function buildSelectFailure<SuccessType, FailureType, IdleType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>>
): (input: AsyncState<SuccessType, FailureType, IdleType>) => FailureType | undefined;
/**
 *
 * @param builder
 */
export function buildSelectFailure<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType> &
      WithPayloadTypes<SuccessType, FailureType, IdleType>
  >
) {
  const failureLens =
    createLensCreator<AsyncFailureState<IdleType | SuccessType, FailureType>>().fromPath('failure');
  if (builder.lens) {
    return failureLens.withOuterLens(
      // this coercion is fine; the lens just gets 'failure' from it so if it's not a failure,
      // it'll return undefined, which is what we want.
      builder.lens as IPathLens<
        OuterStructureType,
        AsyncFailureState<IdleType | SuccessType, FailureType>
      >
    ).get;
  }
  return failureLens.get;
}
