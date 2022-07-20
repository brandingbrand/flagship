import type { ILens } from '@brandingbrand/standard-lens';

import type { ActionOf, ActionSpecifier, AnyAction, TypeGuard } from '../../../action-bus';
import type { OptionalIfExtends } from '../../../internal/types';
import type { AnyActionReducer, Effect, StateReducer } from '../../../store';
import type { AsyncState, AsyncStatus } from '../async.types';

import type { AsyncActionCreators } from './async.actions';

export type AsyncStateReducer<T, FailureType> = StateReducer<AsyncState<T, FailureType>>;

export interface AsyncReducers<Payload, FailPayload, Structure, EmptyPayload = Payload> {
  init: (payload: EmptyPayload | Payload) => StateReducer<Structure>;
  load: (payload: EmptyPayload | Payload) => StateReducer<Structure>;
  loadMore: (payload: Payload) => StateReducer<Structure>;
  succeed: (payload: Payload) => StateReducer<Structure>;
  fail: (failure: FailPayload) => StateReducer<Structure>;
  revert: (payload: EmptyPayload | Payload) => StateReducer<Structure>;
}

export interface AsyncSelectors<Payload, FailPayload, Structure, EmptyPayload> {
  selectPayload: (structure: Structure) => EmptyPayload | Payload;
  selectStatus: (structure: Structure) => AsyncStatus;
  selectFailure: (structure: Structure) => FailPayload | undefined;
}

export interface BaseCreateAsyncEffectOptions<
  DesiredActionType extends ActionSpecifier<string, string | undefined, Params>,
  Params extends unknown[],
  CallbackResult,
  Payload,
  FailedCallbackResult,
  FailPayload,
  EmptyPayload = Payload
> {
  loadingMore?: boolean;
  when: TypeGuard<AnyAction, ActionOf<DesiredActionType>>;
  do: (...params: Params) => Promise<CallbackResult>;
  mapOnSuccess: (result: CallbackResult) => (currentPayload: EmptyPayload | Payload) => Payload;
  mapOnFail: (
    result: FailedCallbackResult
  ) => (currentPayload: EmptyPayload | Payload, currentFailure?: FailPayload) => FailPayload;
  predict?: (params: Params, state: EmptyPayload | Payload) => typeof state;
}

export type CreateAsyncEffectOptions<
  DesiredActionType extends ActionSpecifier<string, string | undefined, Params>,
  Params extends unknown[],
  CallbackResult,
  Payload,
  FailedCallbackResult,
  FailPayload,
  EmptyPayload = Payload
> = OptionalIfExtends<
  OptionalIfExtends<
    BaseCreateAsyncEffectOptions<
      DesiredActionType,
      Params,
      CallbackResult,
      Payload,
      FailedCallbackResult,
      FailPayload,
      EmptyPayload
    >,
    FailPayload,
    FailedCallbackResult,
    'mapOnFail'
  >,
  EmptyPayload | Payload,
  CallbackResult,
  'mapOnSuccess'
>;
export interface AsyncAdaptor<
  ActionKey extends string,
  Payload,
  FailPayload,
  Structure,
  EmptyPayload = Payload
> {
  createState: (
    initialPayload: EmptyPayload | Payload
  ) => AsyncState<Payload, FailPayload, EmptyPayload>;
  actionCreators: AsyncActionCreators<ActionKey, Payload, FailPayload, EmptyPayload>;
  reducers: AsyncReducers<
    Payload,
    FailPayload,
    AsyncState<Payload, FailPayload, EmptyPayload>,
    EmptyPayload
  >;
  lensedReducers: AsyncReducers<Payload, FailPayload, Structure, EmptyPayload>;
  combinedReducer: AnyActionReducer<Structure>;
  payloadLens: ILens<AsyncState<Payload, FailPayload, EmptyPayload>, EmptyPayload | Payload>;
  selectors: AsyncSelectors<Payload, FailPayload, Structure, EmptyPayload>;
  withLens: <OuterStructure>(
    lens: ILens<OuterStructure, Structure>
  ) => AsyncAdaptor<ActionKey, Payload, FailPayload, OuterStructure, EmptyPayload>;
  createEffect: <
    DesiredActionSpecifier extends AnyAction<Params>,
    Params extends unknown[],
    CallbackResult = Payload,
    FailedCallbackResult = FailPayload
  >(
    effectOptions: CreateAsyncEffectOptions<
      DesiredActionSpecifier,
      Params,
      CallbackResult,
      Payload,
      FailedCallbackResult,
      FailPayload,
      EmptyPayload
    >
  ) => Effect<Structure>;
}
