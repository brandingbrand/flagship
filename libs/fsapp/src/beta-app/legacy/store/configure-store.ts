import type { Action, Middleware, PreloadedState, ReducersMapObject } from 'redux';
import { applyMiddleware, combineReducers, compose, createStore } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';

declare global {
  // eslint-disable-next-line no-var
  var __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose | undefined;
}

const middleware = __DEV__
  ? (() => {
      const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();
      const logger = createLogger({ collapsed: true });
      return [thunk, reduxImmutableStateInvariant, logger];
    })()
  : [thunk];

const composeEnhancers =
  __DEV__ && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
    : compose;

export const configureStore = <S, A extends Action>(
  initialState: PreloadedState<S> | undefined,
  reducers: ReducersMapObject<S, A>,
  customMiddleware?: Middleware[]
) =>
  createStore(
    combineReducers(reducers),
    initialState,
    composeEnhancers(applyMiddleware(...middleware, ...(customMiddleware ?? [])))
  );
