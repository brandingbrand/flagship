import { createLensCreator, IPathLens } from '@brandingbrand/standard-lens';
import { WithLensInstance, WithPayloadTypes } from './async.builder.types';
import { AsyncState } from './async.types';

export function buildPayloadLens<SuccessType, FailureType, IdleType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>>
): IPathLens<AsyncState<SuccessType, FailureType, IdleType>, SuccessType | IdleType>;
export function buildPayloadLens<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>> &
    WithLensInstance<SuccessType, FailureType, IdleType, OuterStructureType>
): IPathLens<OuterStructureType, SuccessType | IdleType>;
export function buildPayloadLens<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<
    WithPayloadTypes<SuccessType, FailureType, IdleType> &
      WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType>
  >
) {
  const innerPayloadLens =
    createLensCreator<AsyncState<SuccessType, FailureType, IdleType>>().fromPath('payload');
  if (builder.lens) {
    return innerPayloadLens.withOuterLens(builder.lens);
  }
  return innerPayloadLens;
}
