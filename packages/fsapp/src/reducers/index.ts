import { Action, combineReducers, Reducer, ReducersMapObject } from 'redux';
import globalDataReducer from './globalDataReducer';

export type GenericAction = Action;

export default function setupReducers<S, A extends Action>(
  reducers?: ReducersMapObject<S, A>
): Reducer<S, A> {
  if (reducers && (reducers as any).global) {
    throw new Error(`Reducer clashes with FLAGSHIP reducer on key [global]`);
  }

  return combineReducers<S, A>({
    ...reducers as any, // spread types may only be created from object types
    global: globalDataReducer
  });
}
