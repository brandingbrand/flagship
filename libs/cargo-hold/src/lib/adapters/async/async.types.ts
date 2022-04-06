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

export type AsyncState<SuccessType, FailureType, IdleType = SuccessType> =
  | AsyncIdleState<SuccessType | IdleType>
  | AsyncLoadingState<SuccessType | IdleType>
  | AsyncLoadingMoreState<SuccessType>
  | AsyncSuccessState<SuccessType>
  | AsyncFailureState<SuccessType | IdleType, FailureType>;

export type AsyncStatus = AsyncState<unknown, unknown>['status'];
