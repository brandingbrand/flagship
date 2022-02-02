import type { Observable, Subscription } from 'rxjs';
import type { AnyAction } from '../action-bus';
import type { NonEmptyArray } from '../internal/util/functional/non-empty-array.types';

/**
 * A `StateReducer` is a function that takes state and returns state. This is typically returned
 * by an ActionReducer, which takes an Action. Incoming state should be considered immutable.
 */
export type StateReducer<State> = (state: State) => State;

/**
 * An `ActionReducer` is a curried function that takes an Action and the current State and returns
 * a new State. It should not mutate incoming actions or state.
 */
export type ActionReducer<State, ActionType extends AnyAction> = (
  action: ActionType
) => StateReducer<State>;

/**
 * An `AnyActionReducer` is the supertype for any `ActionReducer` where we do not care about the
 * type of action. Notably, it does still return a typed `StateReducer`.
 */
export type AnyActionReducer<State> = (action: AnyAction) => StateReducer<State>;

/**
 * An Effect is a function that takes an action observable and state observable, returning an
 * observable of Actions that would be considered "follow-ups" to the incoming ones.
 *
 * @param action$ The Action observable
 * @param state$ The State observable (which behaves like a ReplaySubject, emitting current state
 * immediately after subscription)
 * @returns An observable of any follow-up actions desired. Beware, Effects are not like reducers,
 * which return unchanged anything not handled. In contrast, Effects should only return actions that
 * are not already part of the incoming `action$` observable. Doing otherwise would result in an
 * infinite loop.
 */
export type Effect<State> = (
  action$: Observable<AnyAction>,
  state$: Observable<State>
) => Observable<AnyAction>;

/**
 * A `Source` is a string or symbol that allows any given reducer/effect to filter actions down to a
 * specific source.
 */
export type Source = string | symbol;

/**
 * A `SourcesList` defines the way to filter actions by 0 or more sources.
 * * The array may not be empty (instead, parameters of this type are typically optional, signifying
 * that no filtering of sources is desired)
 * * if `undefined` appears in the array, it signifies we desire there to be no source; any sourced
 * actions are rejected.
 * * if a `string | symbol` appears in the array, only actions that match that value will be passed
 * through.
 * * if multiple values are present in the array, they are OR'd together.
 *
 * @example [undefined, 'foo', Symbol('bar')]
 * // will allow either an unsourced action, one with
 * // 'foo' as it source, or one that exactly matches the Symbol value defined.
 */
export type SourcesList = NonEmptyArray<Source | undefined>;

export interface IStore<State = Record<PropertyKey, unknown>> {
  /**
   *
   */
  get state(): State;

  /**
   * The only way to get state out of a store. As it is an Observable, it must be subscribed to in
   * order to get this state. Its behavior is similar to that of an RXJS ReplaySubject(1), whereas upon
   * subscription, it will immediately emit current state. Additionally, it is effectively multicast,
   * as multiple subscriptions to `state$` will not force the reducers & effects to be re-evaluated.
   */
  get state$(): Observable<State>;

  /**
   *
   */
  get action$(): Observable<AnyAction>;

  /**
   * Dispatch actions in order to trigger effects and/or reducers.
   *
   * @param action The action to dispatch to trigger effects and/or reducers.
   */
  dispatch: (action: AnyAction) => void;

  /**
   * Register a new reducer with the store. When creating a store, there are no reducers registered
   * and thus there is no way to change state without registering at least one reducer.
   *
   * @param reducer An `ActionReducer` capable of taking any action dispatched and return resulting
   * state without error.
   */
  registerReducer: (reducer: AnyActionReducer<State>) => void;

  /**
   * Register a new effect with the store.
   *
   * @param effect An effect that can react to any subset of the dispatched actions and emit any
   * necessary actions in response.
   * @returns A Subscription object, as the effect is internally subscribed to.
   */
  registerEffect: (effect: Effect<State>) => Subscription;

  /**
   * Stores typically last the lifetime of an app, so worrying about leftover Observable
   * subscriptions is typically unnecessary, however if a store becomes out of scope and is about to
   * be garbage collected, call `dispose()` on it first. It will complete all internal observables,
   * effectively unsubscribing all state subscribers and all effects.
   */
  dispose: () => void;
}
