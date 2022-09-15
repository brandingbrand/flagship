import type { Reducer } from 'redux';

export const isString = (value: any): value is string => typeof value === 'string';

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

export interface ActionWithId extends Action {
  id: string;
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

export const mapReducers =
  <T>(reducerMap: Map<string, ActionReducer<T>>, initialState: T): Reducer<T, any> =>
  (store: T = initialState, action: Action) => {
    if (reducerMap.has(action.type)) {
      const reducer = reducerMap.get(action.type);
      if (reducer) {
        return reducer(store, action);
      }
    }
    return store;
  };

export type ReducerResult<T> = [string, ActionReducer<T>];
export type AsyncReducerResult<T> = Array<ReducerResult<T>>;

export type ReducerArrayType<T> = AsyncReducerResult<T> | ReducerResult<T>;

export type ReducersMapObject<S = any, A extends Action = Action> = {
  [K in keyof S]: Reducer<S[K], A>;
};

export const mapReducersArray = <T>(
  reducerArray: Array<ReducerArrayType<T>>,
  initialState: T
): Reducer<T, any> => {
  const reducerMap = reducerArray.reduce(
    (acc: Map<string, ActionReducer<T>>, result: ReducerArrayType<T>) => {
      if (Array.isArray(result[0])) {
        for (const asyncResult of result as AsyncReducerResult<T>) {
          acc.set(asyncResult[0], asyncResult[1]);
        }
      } else {
        acc.set(result[0], result[1] as ActionReducer<T>);
      }
      return acc;
    },
    new Map<string, ActionReducer<T>>()
  );
  return mapReducers(reducerMap, initialState);
};
