import type {
  AsyncFailureState,
  AsyncIdleState,
  AsyncLoadingMoreState,
  AsyncLoadingState,
  AsyncSuccessState,
} from './async.types';

export const createIdleState = <IdleType>(payload: IdleType): AsyncIdleState<IdleType> => ({
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

export const createFailureState = <Payload, FailureType, EmptyPayload = Payload>(
  payload: EmptyPayload | Payload,
  failure: FailureType
): AsyncFailureState<EmptyPayload | Payload, FailureType> => ({
  status: 'failure',
  payload,
  failure,
});
