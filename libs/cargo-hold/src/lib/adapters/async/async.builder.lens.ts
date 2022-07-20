import type { IPathLens } from '@brandingbrand/standard-lens';
import { createLensCreator } from '@brandingbrand/standard-lens';

import type { WithLensInstance, WithPayloadTypes } from './async.builder.types';
import type { AsyncState } from './async.types';

/**
 * Builds a lens that goes from an async state to its payload.
 *
 * @param builder
 */
export function buildPayloadLens<SuccessType, FailureType, IdleType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>>
): IPathLens<AsyncState<SuccessType, FailureType, IdleType>, IdleType | SuccessType>;

/**
 * Builds a lens that goes from the outer structure to the payload of an async state.
 *
 * @param builder
 */
export function buildPayloadLens<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<WithPayloadTypes<SuccessType, FailureType, IdleType>> &
    WithLensInstance<SuccessType, FailureType, IdleType, OuterStructureType>
): IPathLens<OuterStructureType, IdleType | SuccessType>;

/**
 * If we input a lens it outputs a lens that goes from the outer structure of the input
 * lens to the async state's payload. If we do not input a lens it outputs a lens that goes
 * from the async state to its payload.
 *
 * @param builder
 * @return
 */
// eslint-disable-next-line prefer-arrow/prefer-arrow-functions -- we're using overloads
export function buildPayloadLens<SuccessType, FailureType, IdleType, OuterStructureType>(
  builder: Partial<
    WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType> &
      WithPayloadTypes<SuccessType, FailureType, IdleType>
  >
):
  | IPathLens<AsyncState<SuccessType, FailureType, IdleType>, IdleType | SuccessType>
  | IPathLens<OuterStructureType, IdleType | SuccessType> {
  const innerPayloadLens =
    createLensCreator<AsyncState<SuccessType, FailureType, IdleType>>().fromPath('payload');
  if (builder.lens) {
    return innerPayloadLens.withOuterLens(builder.lens);
  }
  return innerPayloadLens;
}
