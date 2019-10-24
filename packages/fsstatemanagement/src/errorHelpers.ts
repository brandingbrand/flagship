import { Dispatch, Reducer } from 'redux';
import {
  Action,
  ActionReducer,
  APIResult,
  AsyncActionType,
  ErrorAction,
  SuccessAction,
} from './types'

export function clearErrorResult<T, E>(value: APIResult<T, E>): APIResult<T, E> {
  return { ...value, error: undefined };
}
export function emptyAPIResult<T, E>(): APIResult<T, E> {
  return {
    loading: false,
    error: undefined,
    value: undefined
  };
}
export function errorAPIResult<T, E>(error: E): APIResult<T, E> {
  return {
    loading: false,
    error,
    value: undefined
  };
}
export function loadingAPIResult<T, E>(): APIResult<T, E> {
  return {
    loading: true,
    error: undefined,
    value: undefined
  };
}
export function successAPIResult<T, E>(value: T): APIResult<T, E> {
  return {
    loading: false,
    error: undefined,
    value
  };
}

export function isEmptyResult<T, E>(result: APIResult<T, E>): boolean {
  return !result.loading &&
    result.value === undefined &&
    result.error === undefined;
}

export function loadingReducer<T, K extends keyof T>(key: K):
  (store: T, action: Action) => T {
  /* tslint:disable-next-line:prefer-object-spread */
  return (store, _action) => Object.assign({}, store, { [key]: loadingAPIResult() });
}

export function isSuccessAction<V>(action: Action | SuccessAction<V>): action is SuccessAction<V> {
  return (<SuccessAction<V>>action).value !== undefined;
}

export function successReducer<T, K extends keyof T, V>(key: K):
  (store: T, action: Action | SuccessAction<V>) => T {
  return (store, action) => {
    if (isSuccessAction(action)) {
      /* tslint:disable-next-line:prefer-object-spread */
      return Object.assign({}, store, { [key]: successAPIResult(action.value) });
    }
    return store;
  };
}

function isErrorAction<E>(action: Action | ErrorAction<E>): action is ErrorAction<E> {
  return (<ErrorAction<E>>action).error !== undefined;
}

export function errorReducer<T, K extends keyof T, E>(key: K):
  (store: T, action: Action | ErrorAction<E>) => T {
  return (store, action) => {
    if (isErrorAction(action)) {
      /* tslint:disable-next-line:prefer-object-spread */
      return Object.assign({}, store, { [key]: errorAPIResult(action.error) });
    }
    return store;
  };
}

export function valueReducer<T, K extends keyof T>(key: K):
  (store: T, action: SuccessAction<T>) => T {
  /* tslint:disable-next-line:prefer-object-spread */
  return (store, action) => Object.assign({}, store, { [key]: action.value });
}

export function resetAsyncReducer<T, K extends keyof T>(key: K): (store: T) => T {
  // tslint:disable-next-line:prefer-object-spread
  return store => Object.assign({}, store, { [key]: emptyAPIResult() });
}

/**
 * helper to dispatch Promise values into asyncActions
 * will trigger start at beginning, done if promise resolves,
 *   or fail if promise is rejected
 *
 * @param {Promise<T>} promise - promise of expected values
 * @param {AsyncActionType} actionType - actionTypes to dispatch
 * @param {Dispatch<Action>} dispatch - redux dispatch
 */
export function asyncAction<T, E>(
  promise: Promise<T>,
  actionType: AsyncActionType,
  dispatch: Dispatch<Action>
): void {
  dispatch<Action>({ type: actionType.start });
  promise
    .then((value: T) => dispatch<SuccessAction<T>>({
      type: actionType.done,
      value
    }))
    .catch((error: E) => dispatch<ErrorAction<E>>({
      type: actionType.fail,
      error
    }));
}

export const actionTypeGenerator = (prefix: string) => {
  return {
    async: function asynTypeGenerator(action: string): AsyncActionType {
      return {
        start: `${prefix}_${action}_START`,
        done: `${prefix}_${action}_DONE`,
        fail: `${prefix}_${action}_FAIL`
      };
    },
    value: (action: string) => `${prefix}_${action}`
  };
};

export function mapReducers<T>(
  reducerMap: Map<string, ActionReducer<T>>,
  initialState: T
): Reducer<T, any> {
  return (store: T = initialState, action: Action) => {
    if (reducerMap.has(action.type)) {
      const reducer = reducerMap.get(action.type);
      if (reducer) {
        return reducer(store, action);
      }
    }
    return store;
  };
}

export type ReducerResult<T> = [string, ActionReducer<T>];

export type AsyncReducerResult<T> = ReducerResult<T>[];

export function asyncReducer<T, K extends keyof T>(
  actionType: AsyncActionType, key: K, override?: {
    loading?: any;
    success?: any;
    error?: any;
  }):
  AsyncReducerResult<T> {
  return [
    [actionType.start, (override && override.loading) || loadingReducer(key)],
    [actionType.done, (override && override.success) || successReducer(key)],
    [actionType.fail, (override && override.error) || errorReducer(key)]
  ];
}
export type ReducerArrayType<T> = ReducerResult<T> | AsyncReducerResult<T>;

export function mapReducersArray<T>(
  reducerArray: ReducerArrayType<T>[],
  initialState: T
): Reducer<T, any> {
  const reducerMap = (reducerArray || []).reduce(
    (acc: Map<string, ActionReducer<T>>, result: ReducerArrayType<T>) => {
      if (Array.isArray(result[0])) {
        (<AsyncReducerResult<T>>result).forEach(asyncResult => {
          acc.set(asyncResult[0], asyncResult[1]);
        });
      } else {
        acc.set((<ReducerResult<T>>result)[0], (<ReducerResult<T>>result)[1]);
      }
      return acc;
    }, new Map<string, ActionReducer<T>>());
  return mapReducers(reducerMap, initialState);
}
