import { createLensCreator, IPathLens } from '@brandingbrand/standard-lens';
import { buildPayloadLens } from './async.builder.lens';
import { WithLensInstance, WithPayloadTypes } from './async.builder.types';
import { AsyncFailureState, AsyncState, AsyncStatus } from './async.types';

export function buildSelectPayload<SuccessType, FailureType, IdleType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>>
): (input: AsyncState<SuccessType, FailureType, IdleType>) => SuccessType | IdleType;
export function buildSelectPayload<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>> &
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType>
): (input: OuterStructureType) => SuccessType | IdleType;
export function buildSelectPayload<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<
    WithPayloadTypes<SuccessType, FailureType, IdleType> &
      WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType>
  >
) {
  return buildPayloadLens(builder).get;
}

export function buildSelectStatus<SuccessType, FailureType, IdleType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>>
): (input: AsyncState<SuccessType, FailureType, IdleType>) => AsyncStatus;
export function buildSelectStatus<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>> &
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType>
): (input: OuterStructureType) => AsyncStatus;
export function buildSelectStatus<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<
    WithPayloadTypes<SuccessType, FailureType, IdleType> &
      WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType>
  >
) {
  const statusLens =
    createLensCreator<AsyncState<SuccessType, FailureType, IdleType>>().fromPath('status');
  if (builder.lens) {
    return statusLens.withOuterLens(builder.lens).get;
  }
  return statusLens.get;
}

export function buildSelectFailure<SuccessType, FailureType, IdleType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>>
): (input: AsyncState<SuccessType, FailureType, IdleType>) => FailureType | undefined;
export function buildSelectFailure<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>> &
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType>
): (input: AsyncState<SuccessType, FailureType, IdleType>) => FailureType | undefined;
export function buildSelectFailure<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<
    WithPayloadTypes<SuccessType, FailureType, IdleType> &
      WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType>
  >
) {
  const failureLens =
    createLensCreator<AsyncFailureState<SuccessType | IdleType, FailureType>>().fromPath('failure');
  if (builder.lens) {
    return failureLens.withOuterLens(
      // this coercion is fine; the lens just gets 'failure' from it so if it's not a failure,
      // it'll return undefined, which is what we want.
      builder.lens as IPathLens<
        OuterStructureType,
        AsyncFailureState<SuccessType | IdleType, FailureType>
      >
    ).get;
  }
  return failureLens.get;
}
