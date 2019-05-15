import {
  Action,
  applyMiddleware,
  compose,
  createStore,
  ReducersMapObject,
  Store
} from 'redux';
import { DeepPartial } from '@brandingbrand/fsfoundation';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import setupReducers from '../reducers';

const anyWindow: any = window;
let middleware = [thunk];

if (__DEV__) {
  const reduxImmutableStateInvariant = require('redux-immutable-state-invariant').default();
  const logger = createLogger({ collapsed: true });
  middleware = [...middleware, reduxImmutableStateInvariant, logger];
}
const composeEnhancers =
  // tslint:disable-next-line
  (typeof anyWindow !== 'undefined' && anyWindow['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__']) || compose;

export default function configureStore<S, A extends Action, Ext, StateExt>(
  initialState: DeepPartial<S> = {},
  reducers: ReducersMapObject<S, A>
): Store<S & StateExt, A> & Ext {
  return createStore<S, A, Ext, StateExt>(
    setupReducers<S, A>(reducers),
    initialState,
    composeEnhancers(applyMiddleware(...middleware))
  );
}
