/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { IPathLens } from '@brandingbrand/standard-lens';
import type { MaybePromise } from '@brandingbrand/types-utility';

import type { ActionSpecifier, AnyActionSpecifier, TypeGuard } from '../../action-bus';

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
export type WithActionKey<ActionKey extends string> = {
  actionKey: ActionKey;
};
export type WithMetadata<Metadata extends Record<string, unknown>> = {
  metadata: Metadata;
};
export type WithTriggerActionFilter<Specifier extends ActionSpecifier<string, any, unknown>> = {
  triggerActionFilter: TypeGuard<AnyActionSpecifier, Specifier>;
};
export type WithAsyncCallback<Input, Output> = {
  callback: (input: Input) => MaybePromise<Output>;
};
export type WithMapOnSuccess<Input, State, OutputState = State> = {
  mapOnSuccess: (input: Input) => (state: State) => OutputState;
};
export type WithMapOnFailure<Input, FailureType, Output = FailureType> = {
  mapOnFailure: (input: Input) => (oldFailure?: FailureType | undefined) => Output;
};
export type WithOptimisticUpdate<Input, State, OutputState = State> = {
  prediction: (input: Input) => (state: State) => OutputState;
};
export type WithEnableLoadingMore = {
  enableLoadMore: boolean;
};
