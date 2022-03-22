import type { AnyActionReducer, Effect, IStore } from './store.types';
import { BehaviorSubject, Observable, ReplaySubject, Subject, Subscription } from 'rxjs';
import { map, scan, switchMap, withLatestFrom } from 'rxjs/operators';
import { ActionBus, AnyAction } from '../action-bus';
import { accumulateToArray } from '../internal/util/operators';

/**
 * `Store` provides the state container and facilitates effects & reducers upon state.
 *
 * @param initialState The initial state intended for the store.
 */
export class Store<State> extends ActionBus implements IStore<State> {
  private readonly _state$: BehaviorSubject<State>;
  private readonly _reducer$ = new ReplaySubject<AnyActionReducer<State>>();
  private readonly _reducedAction$ = new Subject<AnyAction>();

  constructor(initialState: State) {
    super();
    const allReducers$ = this._reducer$.pipe(accumulateToArray());
    this._state$ = new BehaviorSubject(initialState);
    const reducerSubscription = allReducers$
      .pipe(
        switchMap((reducers) =>
          this._action$.pipe(
            scan(
              (currentState, action) =>
                reducers.reduce((state, reducer) => reducer(action)(state), currentState),
              initialState
            ),
            withLatestFrom(this._action$)
          )
        )
      )
      .subscribe({
        next: ([state, action]) => {
          this._state$.next(state);
          this._reducedAction$.next(action);
        },
        complete: () => {
          this._state$.complete();
        },
        error: (err) => {
          this._state$.error(err);
        },
      });

    this.subscriptions.add(reducerSubscription);
  }

  public get state(): State {
    return this._state$.value;
  }

  public get state$(): Observable<State> {
    return this._state$;
  }

  public registerReducer = (reducer: AnyActionReducer<State>): void => {
    this._reducer$.next(reducer);
  };

  public registerEffect = (effect: Effect<State>): Subscription => {
    const subscription = effect(this._reducedAction$, this._state$).subscribe(this._action$);
    this.subscriptions.add(subscription);
    return subscription;
  };
}
