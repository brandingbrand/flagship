import { filter, map, switchMap, withLatestFrom } from 'rxjs';
import { Effect } from './store.types';
import { createActionCreator, ofType } from '../action-bus';
import { combineActionReducers, matches, on } from './reducer';
import { Store } from './store';

jest.setTimeout(700);

type State = {
  bool: boolean;
};

const initialState = {
  bool: false,
};

const actionCreators = {
  setBoolToTrue: createActionCreator({
    actionKey: 'setBoolToTrue',
    callback: () => undefined,
  }),
  intermediateAction: createActionCreator({
    actionKey: 'intermediateAction',
    callback: () => undefined,
  }),
  intermediateAction2: createActionCreator({
    actionKey: 'intermediateAction2',
    callback: () => undefined,
  }),
  callOnlyIfBoolIsTrue: createActionCreator({
    actionKey: 'callOnlyIfBoolIsTrue',
    callback: () => undefined,
  }),
};

const reducer = combineActionReducers<State>(
  on(matches(actionCreators.setBoolToTrue), () => (state) => ({ ...state, bool: true }))
);

const effect1: Effect<State> = (action$) =>
  action$.pipe(
    ofType(actionCreators.setBoolToTrue),
    switchMap(() => [
      actionCreators.intermediateAction.create(),
      actionCreators.intermediateAction2.create(),
    ])
  );
const effect2: Effect<State> = (action$, state$) =>
  action$.pipe(
    ofType(actionCreators.intermediateAction),
    withLatestFrom(state$),
    filter(([, state]) => state.bool),
    map(() => actionCreators.callOnlyIfBoolIsTrue.create())
  );

describe('effects happen one at a time', () => {
  it('happens one at a time', (done) => {
    const store = new Store(initialState);
    store.registerReducer(reducer);
    store.registerEffect(effect1);
    store.registerEffect(effect2);
    store.action$.pipe(ofType(actionCreators.callOnlyIfBoolIsTrue)).subscribe((action) => {
      expect(action.type).toBe('callOnlyIfBoolIsTrue');
      done();
    });
    store.dispatch(actionCreators.setBoolToTrue.create());
  });
});
