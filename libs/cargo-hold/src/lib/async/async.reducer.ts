import { ILens, withLens } from '@brandingbrand/standard-lens';
import { combineActionReducers, matches, on, StateReducer } from '../store';
import type { AsyncActionCreators } from './async.actions';
import type {
  AsyncFailureState,
  AsyncIdleState,
  AsyncLoadingMoreState,
  AsyncLoadingState,
  AsyncState,
  AsyncSuccessState,
} from './async.types';

export const createIdleState = <Payload>(payload: Payload): AsyncIdleState<Payload> => ({
  status: 'idle',
  payload,
});

export const createLoadingState = <Payload>(payload: Payload): AsyncLoadingState<Payload> => ({
  status: 'loading',
  payload,
});

export const createLoadingMoreState = <Payload>(
  payload: Payload
): AsyncLoadingMoreState<Payload> => ({
  status: 'loading-more',
  payload,
});

export const createSuccessState = <Payload>(payload: Payload): AsyncSuccessState<Payload> => ({
  status: 'success',
  payload,
});

export const createFailureState = <Payload, FailureType>(
  payload: Payload,
  failure: FailureType
): AsyncFailureState<Payload, FailureType> => ({
  status: 'failure',
  payload,
  failure,
});

export const createReducers = <Payload, FailPayload>() => ({
  init:
    (payload: Payload): StateReducer<AsyncState<Payload, FailPayload>> =>
    () =>
      createIdleState(payload),
  load:
    (payload: Payload): StateReducer<AsyncState<Payload, FailPayload>> =>
    () =>
      createLoadingState(payload),
  loadMore:
    (payload: Payload): StateReducer<AsyncState<Payload, FailPayload>> =>
    () =>
      createLoadingMoreState(payload),
  succeed:
    (payload: Payload): StateReducer<AsyncState<Payload, FailPayload>> =>
    () =>
      createSuccessState(payload),
  fail:
    (failure: FailPayload): StateReducer<AsyncState<Payload, FailPayload>> =>
    (state) =>
      createFailureState(state.payload, failure),
  revert:
    (payload: Payload): StateReducer<AsyncState<Payload, FailPayload>> =>
    (state) => ({ ...state, payload }),
});

export const createLensedReducers = <Payload, FailPayload, Structure>(
  lens: ILens<Structure, AsyncState<Payload, FailPayload>>
) => {
  const reducers = createReducers<Payload, FailPayload>();
  return {
    init: (payload: Payload) => withLens(lens)(reducers.init(payload)),
    load: (payload: Payload) => withLens(lens)(reducers.load(payload)),
    loadMore: (payload: Payload) => withLens(lens)(reducers.loadMore(payload)),
    succeed: (payload: Payload) => withLens(lens)(reducers.succeed(payload)),
    fail: (failure: FailPayload) => withLens(lens)(reducers.fail(failure)),
    revert: (payload: Payload) => withLens(lens)(reducers.revert(payload)),
  };
};

export const createCombinedReducer = <ActionKey extends string, Payload, FailPayload, Structure>(
  actionCreators: AsyncActionCreators<ActionKey, Payload, FailPayload>,
  lens: ILens<Structure, AsyncState<Payload, FailPayload>>
) => {
  const reducers = createLensedReducers(lens);
  return combineActionReducers(
    on(matches(actionCreators.init), (action) => reducers.init(action.payload)),
    on(matches(actionCreators.load), (action) => reducers.load(action.payload)),
    on(matches(actionCreators.loadMore), (action) => reducers.loadMore(action.payload)),
    on(matches(actionCreators.succeed), (action) => reducers.succeed(action.payload)),
    on(matches(actionCreators.fail), (action) => reducers.fail(action.payload)),
    on(matches(actionCreators.revert), (action) => reducers.revert(action.payload))
  );
};
