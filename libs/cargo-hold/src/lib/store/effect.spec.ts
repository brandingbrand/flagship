import { filter, firstValueFrom, map, switchMap, tap, withLatestFrom } from 'rxjs';
import { Effect } from './store.types';
import { createActionCreator, ofType } from '../action-bus';
import { combineActionReducers, matches, on } from './reducer';
import { Store } from './store';

jest.setTimeout(300);

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
    // keeping these here because optimizing this is a fast follow
    // tap((input) => console.log('SEEN BY EFFECT1:', input)),
    ofType(actionCreators.setBoolToTrue),
    switchMap(() => [
      actionCreators.intermediateAction.create(),
      actionCreators.intermediateAction2.create(),
    ])
    // tap((input) => console.log('OUTPUT BY EFFECT1:', input))
  );
const effect2: Effect<State> = (action$, state$) =>
  action$.pipe(
    // tap((input) => console.log('SEEN BY EFFECT2:', input)),
    ofType(actionCreators.intermediateAction),
    withLatestFrom(state$),
    filter(([, state]) => state.bool),
    map(() => actionCreators.callOnlyIfBoolIsTrue.create())
    // tap((input) => console.log('PROCESSED BY EFFECT2:', input)),
  );

describe('effects happen one at a time', () => {
  it('happens one at a time', async () => {
    const store = new Store(initialState);
    store.registerEffect(effect1);
    store.registerEffect(effect2);
    store.registerReducer(reducer);
    store.dispatch(actionCreators.setBoolToTrue.create());

    const result = await firstValueFrom(
      store.action$.pipe(ofType(actionCreators.callOnlyIfBoolIsTrue))
    );
    expect(result).toBeTruthy();
  });
});
