import { ILens } from '@brandingbrand/standard-lens';
import type {
  Action,
  ActionSpecifier,
  AnyAction,
  AnyActionSpecifier,
  TypeGuard,
} from '../action-bus';
import type { OptionalIfExtends } from '../internal/types';
import type { AnyActionReducer, Effect, StateReducer } from '../store';
import type { AsyncActionCreators } from './async.actions';

type BaseAsyncState<Status extends string, T> = {
  status: Status;
  payload: T;
};

export type AsyncIdleState<T> = BaseAsyncState<'idle', T>;
export type AsyncLoadingState<T> = BaseAsyncState<'loading', T>;
export type AsyncLoadingMoreState<T> = BaseAsyncState<'loading-more', T>;
export type AsyncSuccessState<T> = BaseAsyncState<'success', T>;
export type AsyncFailureState<T, FailureType> = BaseAsyncState<'failure', T> & {
  failure: FailureType;
};

export type AsyncState<Payload, FailureType> =
  | AsyncIdleState<Payload>
  | AsyncLoadingState<Payload>
  | AsyncLoadingMoreState<Payload>
  | AsyncSuccessState<Payload>
  | AsyncFailureState<Payload, FailureType>;

export type AsyncStatus = AsyncState<unknown, unknown>['status'];

export type AsyncStateReducer<T, FailureType> = StateReducer<AsyncState<T, FailureType>>;

type BaseAsyncAction<ActionKey extends string, TransitionKey extends string, Payload> = Action<
  ActionKey,
  Payload,
  TransitionKey
>;

export type AsyncLoadAction<ActionKey extends string, Payload> = BaseAsyncAction<
  ActionKey,
  'async:load',
  Payload
>;
export type AsyncFailAction<ActionKey extends string, Payload> = BaseAsyncAction<
  ActionKey,
  'async:fail',
  Payload
>;
export type AsyncSucceedAction<ActionKey extends string, Payload> = BaseAsyncAction<
  ActionKey,
  'async:succeed',
  Payload
>;
export type AsyncInitAction<ActionKey extends string, Payload> = BaseAsyncAction<
  ActionKey,
  'async:init',
  Payload
>;
export type AsyncRevertAction<ActionKey extends string, Payload> = BaseAsyncAction<
  ActionKey,
  'async:revert',
  Payload
>;

export type AsyncAction<ActionKey extends string, Payload, FailPayload> =
  | AsyncInitAction<ActionKey, Payload>
  | AsyncLoadAction<ActionKey, Payload>
  | AsyncFailAction<ActionKey, FailPayload>
  | AsyncSucceedAction<ActionKey, Payload>
  | AsyncRevertAction<ActionKey, Payload>;

export type AsyncSubtypes = AsyncAction<string, unknown, unknown>['subtype'];

export interface AsyncReducers<Payload, FailPayload, Structure> {
  init: (payload: Payload) => StateReducer<Structure>;
  load: (payload: Payload) => StateReducer<Structure>;
  loadMore: (payload: Payload) => StateReducer<Structure>;
  succeed: (payload: Payload) => StateReducer<Structure>;
  fail: (failure: FailPayload) => StateReducer<Structure>;
  revert: (payload: Payload) => StateReducer<Structure>;
}

export interface AsyncSelectors<Payload, FailPayload, Structure> {
  selectPayload: (structure: Structure) => Payload;
  selectStatus: (structure: Structure) => AsyncStatus;
  selectFailure: (structure: Structure) => FailPayload | undefined;
}

export interface BaseCreateAsyncEffectOptions<
  DesiredActionSpecifier extends
    | ActionSpecifier<string, string | undefined, Params>
    | AnyAction<Params>,
  Params extends unknown[],
  CallbackResult,
  Payload,
  FailedCallbackResult,
  FailPayload
> {
  loadingMore?: boolean;
  when: TypeGuard<AnyActionSpecifier, DesiredActionSpecifier>;
  do: (...params: Params) => Promise<CallbackResult>;
  mapOnSuccess: (result: CallbackResult) => (currentPayload: Payload) => Payload;
  mapOnFail: (
    result: FailedCallbackResult
  ) => (currentPayload: Payload, currentFailure?: FailPayload) => FailPayload;
  predict?: (params: Params, state: Payload) => Payload;
}

export type CreateAsyncEffectOptions<
  DesiredActionSpecifier extends
    | ActionSpecifier<string, string | undefined, Params>
    | AnyAction<Params>,
  Params extends unknown[],
  CallbackResult,
  Payload,
  FailedCallbackResult,
  FailPayload
> = OptionalIfExtends<
  OptionalIfExtends<
    BaseCreateAsyncEffectOptions<
      DesiredActionSpecifier,
      Params,
      CallbackResult,
      Payload,
      FailedCallbackResult,
      FailPayload
    >,
    FailPayload,
    FailedCallbackResult,
    'mapOnFail'
  >,
  Payload,
  CallbackResult,
  'mapOnSuccess'
>;
export interface AsyncAdaptor<ActionKey extends string, Payload, FailPayload, Structure> {
  createState: (initialPayload: Payload) => AsyncState<Payload, FailPayload>;
  actionCreators: AsyncActionCreators<ActionKey, Payload, FailPayload>;
  reducers: AsyncReducers<Payload, FailPayload, AsyncState<Payload, FailPayload>>;
  lensedReducers: AsyncReducers<Payload, FailPayload, Structure>;
  combinedReducer: AnyActionReducer<Structure>;
  payloadLens: ILens<AsyncState<Payload, FailPayload>, Payload>;
  selectors: AsyncSelectors<Payload, FailPayload, Structure>;
  withLens: <OuterStructure>(
    lens: ILens<OuterStructure, Structure>
  ) => AsyncAdaptor<ActionKey, Payload, FailPayload, OuterStructure>;
  createEffect: <
    DesiredActionSpecifier extends
      | ActionSpecifier<string, string | undefined, Params>
      | AnyAction<Params>,
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
      FailPayload
    >
  ) => Effect<Structure>;
}
