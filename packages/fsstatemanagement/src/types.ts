export interface Action {
  type: string;
}

export type ActionReducer<T> = (store: T, action: any) => T;

export interface SuccessAction<T> extends Action {
  value: T;
}
export interface ErrorAction<E> extends Action {
  error: E;
}


export interface AsyncActionType {
  start: string;
  done: string;
  fail: string;
}
export interface APIResult<T, E> {
  loading: boolean;
  error?: E;
  value?: T;
}

