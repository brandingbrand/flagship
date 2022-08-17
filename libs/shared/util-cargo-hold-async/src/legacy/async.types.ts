import type {
  ActionOf,
  ActionSpecifier,
  AnyAction,
  AnyActionReducer,
  Effect,
  StateReducer,
  TypeGuard,
} from '@brandingbrand/cargo-hold';
import type { ILens } from '@brandingbrand/standard-lens';
import type { OptionalIfExtends } from '@brandingbrand/standard-types';

import type { AsyncState, AsyncStatus } from '../async.types';

import type { AsyncActionCreators } from './async.actions';

export type AsyncStateReducer<T, FailureType> = StateReducer<AsyncState<T, FailureType>>;

export interface AsyncReducers<
  PayloadType,
  FailPayloadType,
  StructureType,
  EmptyPayloadType = PayloadType
> {
  init: (payload: EmptyPayloadType | PayloadType) => StateReducer<StructureType>;
  load: (payload: EmptyPayloadType | PayloadType) => StateReducer<StructureType>;
  loadMore: (payload: PayloadType) => StateReducer<StructureType>;
  succeed: (payload: PayloadType) => StateReducer<StructureType>;
  fail: (failure: FailPayloadType) => StateReducer<StructureType>;
  revert: (payload: EmptyPayloadType | PayloadType) => StateReducer<StructureType>;
}

export interface AsyncSelectors<PayloadType, FailPayloadType, StructureType, EmptyPayloadtype> {
  selectPayload: (structure: StructureType) => EmptyPayloadtype | PayloadType;
  selectStatus: (structure: StructureType) => AsyncStatus;
  selectFailure: (structure: StructureType) => FailPayloadType | undefined;
}

export interface BaseCreateAsyncEffectOptions<
  DesiredActionType extends ActionSpecifier<string, string | undefined, ParamsType>,
  ParamsType extends unknown[],
  CallbackResultType,
  PayloadType,
  FailedCallbackResultType,
  FailPayloadType,
  EmptyPayloadType = PayloadType
> {
  loadingMore?: boolean;
  when: TypeGuard<AnyAction, ActionOf<DesiredActionType>>;
  do: (...params: ParamsType) => Promise<CallbackResultType>;
  mapOnSuccess: (
    result: CallbackResultType
  ) => (currentPayload: EmptyPayloadType | PayloadType) => PayloadType;
  mapOnFail: (
    result: FailedCallbackResultType
  ) => (
    currentPayload: EmptyPayloadType | PayloadType,
    currentFailure?: FailPayloadType
  ) => FailPayloadType;
  predict?: (params: ParamsType, state: EmptyPayloadType | PayloadType) => typeof state;
}

export type CreateAsyncEffectOptions<
  DesiredActionType extends ActionSpecifier<string, string | undefined, ParamsType>,
  ParamsType extends unknown[],
  CallbackResultType,
  PayloadType,
  FailedCallbackResultType,
  FailPayloadType,
  EmptyPayloadType = PayloadType
> = OptionalIfExtends<
  OptionalIfExtends<
    BaseCreateAsyncEffectOptions<
      DesiredActionType,
      ParamsType,
      CallbackResultType,
      PayloadType,
      FailedCallbackResultType,
      FailPayloadType,
      EmptyPayloadType
    >,
    FailPayloadType,
    FailedCallbackResultType,
    'mapOnFail'
  >,
  EmptyPayloadType | PayloadType,
  CallbackResultType,
  'mapOnSuccess'
>;
export interface AsyncAdaptor<
  ActionKeyType extends string,
  PayloadType,
  FailPayloadType,
  StructureType,
  EmptyPayloadType = PayloadType
> {
  createState: (
    initialPayload: EmptyPayloadType | PayloadType
  ) => AsyncState<PayloadType, FailPayloadType, EmptyPayloadType>;
  actionCreators: AsyncActionCreators<
    ActionKeyType,
    PayloadType,
    FailPayloadType,
    EmptyPayloadType
  >;
  reducers: AsyncReducers<
    PayloadType,
    FailPayloadType,
    AsyncState<PayloadType, FailPayloadType, EmptyPayloadType>,
    EmptyPayloadType
  >;
  lensedReducers: AsyncReducers<PayloadType, FailPayloadType, StructureType, EmptyPayloadType>;
  combinedReducer: AnyActionReducer<StructureType>;
  payloadLens: ILens<
    AsyncState<PayloadType, FailPayloadType, EmptyPayloadType>,
    EmptyPayloadType | PayloadType
  >;
  selectors: AsyncSelectors<PayloadType, FailPayloadType, StructureType, EmptyPayloadType>;
  withLens: <OuterStructure>(
    lens: ILens<OuterStructure, StructureType>
  ) => AsyncAdaptor<ActionKeyType, PayloadType, FailPayloadType, OuterStructure, EmptyPayloadType>;
  createEffect: <
    DesiredActionSpecifier extends AnyAction<Params>,
    Params extends unknown[],
    CallbackResult = PayloadType,
    FailedCallbackResult = FailPayloadType
  >(
    effectOptions: CreateAsyncEffectOptions<
      DesiredActionSpecifier,
      Params,
      CallbackResult,
      PayloadType,
      FailedCallbackResult,
      FailPayloadType,
      EmptyPayloadType
    >
  ) => Effect<StructureType>;
}
