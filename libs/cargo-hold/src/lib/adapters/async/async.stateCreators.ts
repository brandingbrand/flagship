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

export const createLoadingState = <PayloadType>(
  payload: PayloadType
): AsyncLoadingState<PayloadType> => ({
  status: 'loading',
  payload,
});

export const createLoadingMoreState = <PayloadType>(
  payload: PayloadType
): AsyncLoadingMoreState<PayloadType> => ({
  status: 'loading-more',
  payload,
});

export const createSuccessState = <PayloadType>(
  payload: PayloadType
): AsyncSuccessState<PayloadType> => ({
  status: 'success',
  payload,
});

export const createFailureState = <PayloadType, FailureType, EmptyPayloadType = PayloadType>(
  payload: EmptyPayloadType | PayloadType,
  failure: FailureType
): AsyncFailureState<EmptyPayloadType | PayloadType, FailureType> => ({
  status: 'failure',
  payload,
  failure,
});
