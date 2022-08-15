/* eslint-disable @typescript-eslint/consistent-type-definitions -- These may need to be types */
import type { AnyAction, TypeGuard } from '@brandingbrand/cargo-hold';
import type { IPathLens } from '@brandingbrand/standard-lens';
import type { MaybePromise } from '@brandingbrand/standard-types';

import type { AsyncState } from './async.types';

const IDLE_SYMBOL = Symbol('IdleType');
const SUCCESS_SYMBOL = Symbol('SuccessType');
const FAILURE_SYMBOL = Symbol('FailureType');

export type AsyncBuilder = {};
export type WithIdleType<IdleType> = {
  [IDLE_SYMBOL]?: IdleType;
};
export type WithSuccessType<SuccessType> = {
  [SUCCESS_SYMBOL]?: SuccessType;
};
export type WithFailureType<FailureType> = {
  [FAILURE_SYMBOL]?: FailureType;
};
export type WithPayloadTypes<
  SuccessType,
  FailureType,
  IdleType = SuccessType
> = WithFailureType<FailureType> & WithIdleType<IdleType> & WithSuccessType<SuccessType>;

export type WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType> = {
  lens: IPathLens<OuterStructureType, AsyncState<SuccessType, FailureType, IdleType>>;
};
export type WithActionKey<ActionKeyType extends string> = {
  actionKey: ActionKeyType;
};
export type WithMetadata<MetadataType extends Record<string, unknown>> = {
  metadata: MetadataType;
};
export type WithTriggerActionFilter<ActionType extends AnyAction> = {
  triggerActionFilter: TypeGuard<AnyAction, ActionType>;
};
export type WithAsyncCallback<InputType, OutputType> = {
  callback: (input: InputType) => MaybePromise<OutputType>;
};
export type WithMapOnSuccess<InputType, StateType, OutputStateType = StateType> = {
  mapOnSuccess: (input: InputType) => (state: StateType) => OutputStateType;
};
export type WithMapOnFailure<InputType, FailureType, OutputType = FailureType> = {
  mapOnFailure: (input: InputType) => (oldFailure?: FailureType | undefined) => OutputType;
};
export type WithOptimisticUpdate<InputType, StateType, OutputStateType = StateType> = {
  prediction: (input: InputType) => (state: StateType) => OutputStateType;
};
export type WithEnableLoadingMore = {
  enableLoadMore: boolean;
};

/* eslint-enable @typescript-eslint/consistent-type-definitions -- These may need to be types */
