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
export class Store<StateType> extends ActionBus implements IStore<StateType> {
  constructor(initialState: StateType) {
    super();
    // Concatenates the reducers into an observable array.
    const allReducers$ = this.reducer$.pipe(accumulateToArray());
    // Current state subject at any given time.
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

  private readonly subject$: BehaviorSubject<StateType>;
  private readonly reducer$ = new ReplaySubject<AnyActionReducer<StateType>>(
    Number.POSITIVE_INFINITY
  );

  /**
   * A clone of the action$ that emits only once the state has been updated.
   * Used for effects to guarantee the order of operations.
   */
  private readonly reducedAction$ = new Subject<AnyAction>();

  /**
   * Synchronous getter for current state. Use `state$` when possible.
   *
   * @return Current state
   */
  public get state(): StateType {
    return this.subject$.value;
  }

  /**
   * Getter for the state observable
   *
   * @return The state observable
   */
  public get state$(): Observable<StateType> {
    return this.subject$.asObservable();
  }

  /**
   * Registers a new reducer to the store.
   *
   * @param reducer The reducer that gets registered to the store.
   */
  public registerReducer = (reducer: AnyActionReducer<StateType>): void => {
    this.reducer$.next(reducer);
  };

  /**
   * Registers a new effect to the store.
   *
   * @param effect The effect to register.
   * @return A subscription. Unsubscribe to the subscription to stop the effect from listening
   */
  public registerEffect = (effect: Effect<StateType>): Subscription => {
    const subscription = effect(this.reducedAction$, this.state$).subscribe({
      next: (value) => {
        this._action$.next(value);
      },
    });
    this.subscriptions.add(subscription);
    return subscription;
  };
}
