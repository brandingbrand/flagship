interface BaseAsyncState<Status extends string, T> {
  status: Status;
  payload: T;
}

export type AsyncIdleState<T> = BaseAsyncState<'idle', T>;
export type AsyncLoadingState<T> = BaseAsyncState<'loading', T>;
export type AsyncLoadingMoreState<T> = BaseAsyncState<'loading-more', T>;
export type AsyncSuccessState<T> = BaseAsyncState<'success', T>;
export type AsyncFailureState<T, FailureType> = BaseAsyncState<'failure', T> & {
  failure: FailureType;
};

export type AsyncState<SuccessType, FailureType, IdleType = SuccessType> =
  | AsyncFailureState<IdleType | SuccessType, FailureType>
  | AsyncIdleState<IdleType | SuccessType>
  | AsyncLoadingMoreState<SuccessType>
  | AsyncLoadingState<IdleType | SuccessType>
  | AsyncSuccessState<SuccessType>;

export type AsyncStatus = AsyncState<unknown, unknown>['status'];
