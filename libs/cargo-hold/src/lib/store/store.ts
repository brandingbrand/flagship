import type { Observable, Subscription } from 'rxjs';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { map, scan, switchMap, withLatestFrom } from 'rxjs/operators';

import type { AnyAction } from '../action-bus';
import { ActionBus } from '../action-bus';
import { accumulateToArray } from '../internal/util/operators';

import { combineActionReducers } from './reducer';
import type { AnyActionReducer, Effect, IStore } from './store.types';
import { UpdateReducersAction } from './update-reducers.action';

/**
 * `Store` provides the state container and facilitates effects & reducers upon state.
 *
 * @param initialState The initial state intended for the store.
 */
export class Store<StateType> extends ActionBus implements IStore<StateType> {
  constructor(public readonly initialState: StateType) {
    super();

    const reducerSubscription = this.reducer$
      .pipe(
        switchMap((reducer) =>
          this.action$.pipe(
            scan((state, action) => reducer(action)(state), initialState),
            withLatestFrom(this.action$)
          )
        )
      )
      .subscribe({
        next: ([state, action]) => {
          this.subject$.next(state);
          this.internalReducedAction$.next(action);
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

  /**
   * Current state subject at any given time.
   */
  private readonly subject$ = new BehaviorSubject(this.initialState);

  /**
   * A clone of the action$ that emits only once the state has been updated.
   * Used for effects to guarantee the order of operations.
   */
  private readonly internalReducedAction$ = new Subject<AnyAction>();

  private readonly internalReducer$ = new ReplaySubject<AnyActionReducer<StateType>>(
    Number.POSITIVE_INFINITY
  );

  /**
   * Registers a new reducer to the store.
   *
   * @param reducer The reducer that gets registered to the store.
   */
  public registerReducer = (reducer: AnyActionReducer<StateType>): void => {
    this.internalReducer$.next(reducer);
    this.dispatch(UpdateReducersAction.create());
  };

  public registerEffect = (effect: Effect<StateType>): Subscription => {
    const subscription = effect(this.internalReducedAction$, this.state$).subscribe({
      next: (value) => {
        this.dispatch(value);
      },
    });
    this.subscriptions.add(subscription);
    return subscription;
  };

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

  public get reducer$(): Observable<AnyActionReducer<StateType>> {
    // Concatenates the reducers into an observable array.
    return this.internalReducer$.asObservable().pipe(
      accumulateToArray(),
      map((reducers) => combineActionReducers(...reducers))
    );
  }

  /**
   * Registers a new effect to the store.
   *
   * @param effect The effect to register.
   * @return A subscription. Unsubscribe to the subscription to stop the effect from listening
   */
  public get reducedAction$(): Observable<AnyAction> {
    return this.internalReducedAction$.asObservable();
  }
}
