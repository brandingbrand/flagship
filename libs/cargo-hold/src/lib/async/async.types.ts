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

export type AsyncState<Payload, FailureType, EmptyPayload = Payload> =
  | AsyncIdleState<Payload | EmptyPayload>
  | AsyncLoadingState<Payload | EmptyPayload>
  | AsyncLoadingMoreState<Payload>
  | AsyncSuccessState<Payload>
  | AsyncFailureState<Payload | EmptyPayload, FailureType>;

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
  Payload | undefined
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
  Payload | undefined
>;
export type AsyncRevertAction<ActionKey extends string, Payload> = BaseAsyncAction<
  ActionKey,
  'async:revert',
  Payload | undefined
>;

export type AsyncAction<ActionKey extends string, Payload, FailPayload, EmptyPayload = Payload> =
  | AsyncInitAction<ActionKey, Payload | EmptyPayload>
  | AsyncLoadAction<ActionKey, Payload | EmptyPayload>
  | AsyncFailAction<ActionKey, FailPayload>
  | AsyncSucceedAction<ActionKey, Payload>
  | AsyncRevertAction<ActionKey, Payload | EmptyPayload>;

export type AsyncSubtypes = AsyncAction<string, unknown, unknown>['subtype'];

export interface AsyncReducers<Payload, FailPayload, Structure, EmptyPayload = Payload> {
  init: (payload: Payload | EmptyPayload) => StateReducer<Structure>;
  load: (payload: Payload | EmptyPayload) => StateReducer<Structure>;
  loadMore: (payload: Payload) => StateReducer<Structure>;
  succeed: (payload: Payload) => StateReducer<Structure>;
  fail: (failure: FailPayload) => StateReducer<Structure>;
  revert: (payload: Payload | EmptyPayload) => StateReducer<Structure>;
}

export interface AsyncSelectors<Payload, FailPayload, Structure, EmptyPayload> {
  selectPayload: (structure: Structure) => Payload | EmptyPayload;
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
  FailPayload,
  EmptyPayload = Payload
> {
  loadingMore?: boolean;
  when: TypeGuard<AnyActionSpecifier, DesiredActionSpecifier>;
  do: (...params: Params) => Promise<CallbackResult>;
  mapOnSuccess: (result: CallbackResult) => (currentPayload: Payload | EmptyPayload) => Payload;
  mapOnFail: (
    result: FailedCallbackResult
  ) => (currentPayload: Payload | EmptyPayload, currentFailure?: FailPayload) => FailPayload;
  predict?: (params: Params, state: Payload | EmptyPayload) => Payload;
}

export type CreateAsyncEffectOptions<
  DesiredActionSpecifier extends
    | ActionSpecifier<string, string | undefined, Params>
    | AnyAction<Params>,
  Params extends unknown[],
  CallbackResult,
  Payload,
  FailedCallbackResult,
  FailPayload,
  EmptyPayload = Payload
> = OptionalIfExtends<
  OptionalIfExtends<
    BaseCreateAsyncEffectOptions<
      DesiredActionSpecifier,
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
  Payload | EmptyPayload,
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
    initialPayload: Payload | EmptyPayload
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
  payloadLens: ILens<AsyncState<Payload, FailPayload, EmptyPayload>, Payload | EmptyPayload>;
  selectors: AsyncSelectors<Payload, FailPayload, Structure, EmptyPayload>;
  withLens: <OuterStructure>(
    lens: ILens<OuterStructure, Structure>
  ) => AsyncAdaptor<ActionKey, Payload, FailPayload, OuterStructure, EmptyPayload>;
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
      FailPayload,
      EmptyPayload
    >
  ) => Effect<Structure>;
}
