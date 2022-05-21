import type { IPathLens } from '@brandingbrand/standard-lens';
import type { MaybePromise } from '@brandingbrand/types-utility';

import type { ActionSpecifier, AnyActionSpecifier, TypeGuard } from '../..';

import type {
  AsyncBuilder,
  WithActionKey,
  WithAsyncCallback,
  WithEnableLoadingMore,
  WithFailureType,
  WithIdleType,
  WithLensInstance,
  WithMapOnFailure,
  WithMapOnSuccess,
  WithMetadata,
  WithOptimisticUpdate,
  WithPayloadTypes,
  WithSuccessType,
  WithTriggerActionFilter,
} from './async.builder.types';
import type { AsyncState } from './async.types';

export function asyncBuilder(): AsyncBuilder;
export function asyncBuilder<SuccessType, IdleType = SuccessType>(): AsyncBuilder &
  WithIdleType<IdleType> &
  WithSuccessType<SuccessType>;
export function asyncBuilder<SuccessType, FailureType, IdleType>(): AsyncBuilder &
  WithFailureType<FailureType> &
  WithIdleType<IdleType> &
  WithSuccessType<SuccessType>;
/**
 *
 */
export function asyncBuilder() {
  return {};
}

export const asyncBuilderWithStructureLens = <
  SuccessType,
  FailureType,
  IdleType,
  OuterStructureType
>(
  lens: IPathLens<OuterStructureType, AsyncState<SuccessType, FailureType, IdleType>>
): WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType> &
  WithPayloadTypes<SuccessType, FailureType, IdleType> => ({
  lens,
});

export const withStructureLens =
  <OuterStructureType, SuccessType, FailureType, IdleType>(
    lens: IPathLens<OuterStructureType, AsyncState<SuccessType, FailureType, IdleType>>
  ) =>
  <BuilderType extends AsyncBuilder>(
    asyncBuilder: BuilderType
  ): BuilderType & WithLensInstance<IdleType, SuccessType, FailureType, OuterStructureType> => ({
    ...asyncBuilder,
    lens,
  });

export const withActionKey =
  <ActionKey extends string>(actionKey: ActionKey) =>
  <BuilderType extends AsyncBuilder>(
    builder: BuilderType
  ): BuilderType & WithActionKey<ActionKey> => ({
    ...builder,
    actionKey,
  });

export const withMetadata =
  <MetadataType extends Record<string, unknown>>(metadata: MetadataType) =>
  <BuilderType extends AsyncBuilder>(
    builder: BuilderType
  ): BuilderType & WithMetadata<MetadataType> => ({
    ...builder,
    metadata,
  });

export const withTriggerActionFilter =
  <Specifier extends ActionSpecifier<string, any, unknown>>(
    triggerActionFilter: TypeGuard<AnyActionSpecifier, Specifier>
  ) =>
  <BuilderType extends AsyncBuilder>(
    builder: BuilderType
  ): BuilderType & WithTriggerActionFilter<Specifier> => ({
    ...builder,
    triggerActionFilter,
  });

export const withAsyncCallback =
  <Input, CallbackResult>(callback: (input: Input) => MaybePromise<CallbackResult>) =>
  <BuilderType extends AsyncBuilder>(
    builder: BuilderType
  ): BuilderType & WithAsyncCallback<Input, CallbackResult> => ({
    ...builder,
    callback,
  });

export const withMapOnSuccess =
  <Input, PayloadType, StateType = PayloadType>(
    mapOnSuccess: (input: Input) => (oldPayload: StateType) => PayloadType
  ) =>
  <BuilderType extends AsyncBuilder>(
    builder: BuilderType
  ): BuilderType & WithMapOnSuccess<Input, StateType, PayloadType> => ({
    ...builder,
    mapOnSuccess,
  });

export const withMapOnFailure =
  <Input, FailureType>(mapOnFailure: (input: Input) => (oldFailure?: FailureType) => FailureType) =>
  <BuilderType extends AsyncBuilder>(
    builder: BuilderType
  ): BuilderType & WithMapOnFailure<Input, FailureType> => ({
    ...builder,
    mapOnFailure,
  });

export const withOptimisticUpdate =
  <Input, PayloadType, StateType = PayloadType>(
    prediction: (input: Input) => (oldPayload: StateType) => PayloadType
  ) =>
  <BuilderType extends AsyncBuilder>(
    builder: BuilderType
  ): BuilderType & WithOptimisticUpdate<Input, StateType, PayloadType> => ({
    ...builder,
    prediction,
  });

export const withEnableLoadingMore =
  (enableLoadMore: boolean) =>
  <BuilderType extends AsyncBuilder>(
    builder: BuilderType
  ): BuilderType & WithEnableLoadingMore => ({
    ...builder,
    enableLoadMore,
  });
