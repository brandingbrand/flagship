import type { Observable, Subscription } from 'rxjs';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { scan, switchMap, withLatestFrom } from 'rxjs/operators';

import type { AnyAction } from '../action-bus';
import { ActionBus } from '../action-bus';
import { accumulateToArray } from '../internal/util/operators';

import type { AnyActionReducer, Effect, IStore } from './store.types';

/**
 * `Store` provides the state container and facilitates effects & reducers upon state.
 *
 * @param initialState The initial state intended for the store.
 */
export class Store<State> extends ActionBus implements IStore<State> {
  constructor(initialState: State) {
    super();
    const allReducers$ = this.reducer$.pipe(accumulateToArray());
    this.subject$ = new BehaviorSubject(initialState);
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
          this.subject$.next(state);
          this.reducedAction$.next(action);
        },
        complete: () => {
          this.subject$.complete();
        },
        error: (err: unknown) => {
          this.subject$.error(err);
        },
      });

    this.subscriptions.add(reducerSubscription);
  }

  private readonly subject$: BehaviorSubject<State>;
  private readonly reducer$ = new ReplaySubject<AnyActionReducer<State>>(Number.POSITIVE_INFINITY);
  private readonly reducedAction$ = new Subject<AnyAction>();

  public get state(): State {
    return this.subject$.value;
  }

  public get state$(): Observable<State> {
    return this.subject$.asObservable();
  }

  public registerReducer = (reducer: AnyActionReducer<State>): void => {
    this.reducer$.next(reducer);
  };

  public registerEffect = (effect: Effect<State>): Subscription => {
    const subscription = effect(this.reducedAction$, this.state$).subscribe(this._action$);
    this.subscriptions.add(subscription);
    return subscription;
  };
}
