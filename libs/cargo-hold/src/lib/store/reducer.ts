import equal from 'fast-deep-equal';

import type {
  ActionOf,
  ActionSpecifier,
  ActionSpecifierOf,
  AnyAction,
  AnyActionSpecifier,
  TypeGuard,
} from '../action-bus';
import type { NonEmptyArray } from '../internal/util/functional/non-empty-array.types';

import type { ActionReducer, AnyActionReducer, SourcesList, StateReducer } from './store.types';

/**
 * Combines action reducers by calling each of them in succession
 *
 * @param reducers Reducers to combine
 * @return Action reducer that combines all effects
 */
export const combineActionReducers =
  <StateType extends {}>(
    ...reducers: Array<AnyActionReducer<StateType>>
  ): AnyActionReducer<StateType> =>
  (action) =>
  (state) =>
    reducers.reduce((currentState, reducer) => reducer(action)(currentState), state);

/**
 * Makes it easier to build reducers by filtering actions first, narrowing their type.
 * If the type matches it then calls the given reducer
 *
 * @param filter A function that filters the action down to the desired actions.
 * @param reducer A reducer that operates on the desired action.
 * @return A reducer that operates on any action.
 */
export const on =
  <StateType, DesiredActionType extends AnyAction>(
    filter: TypeGuard<AnyAction, DesiredActionType>,
    reducer: ActionReducer<StateType, DesiredActionType>
  ): AnyActionReducer<StateType> =>
  (action) => {
    if (filter(action)) {
      return reducer(action);
    }
    return (state) => state;
  };

/**
 * Filters actions based on the desired source. Actions that do no have a source will fail
 * this filter.
 *
 * @param sources The list of acceptable sources that you want to filter for.
 * @return True if the action has an acceptable source: false if otherwise.
 * @deprecated
 */
export const requireSource =
  (...sources: Array<string | symbol | undefined>) =>
  <ActionType extends AnyAction>(action: ActionType): action is ActionType =>
    sources.length === 0 || sources.includes(action.source);

/**
 * Filters actions based on the desired source. Actions that do no have a source will pass
 * this filter.
 *
 * @param sources The list of acceptable sources that you want to filter for.
 * @return True if the action has an acceptable source or no source: false if otherwise.
 * @deprecated
 */
export const optionalSource =
  (...sources: Array<string | symbol | undefined>) =>
  <ActionType extends AnyAction>(action: ActionType): action is ActionType =>
    sources.length === 0 || !action.source || sources.includes(action.source);

/**
 * Filters actions by the desired type
 *
 * @param actionTypes The desired action types.
 * @return True if the type is one of the desired action types: false if otherwise.
 */
export const isType =
  <ActionType extends AnyAction>(...actionTypes: NonEmptyArray<ActionType['type']>) =>
  (action: ActionSpecifier<string, any, unknown>): action is ActionType =>
    actionTypes.includes(action.type);

/**
 * Filters actions by the desired subtype
 *
 * @param actionSubtypes The desired action subtypes.
 * @return True if the subtype is one of the desired action types: false if otherwise.
 */
export const isSubtype =
  <ActionType extends AnyAction>(...actionSubtypes: NonEmptyArray<ActionType['subtype']>) =>
  (action: AnyAction): action is ActionType =>
    actionSubtypes.includes(action.subtype);
/**
 * Type guard that tells you whether an action matches a given action specifier.
 *
 * @param specifier Action specifier to match
 * @param extraSources Possible extra values of the source field that are allowed. (Deprecated)
 * @return True if the action matches the specifier: false if not.
 */
export const matches =
  <DesiredActionSpecifierType extends AnyActionSpecifier>(
    specifier: DesiredActionSpecifierType,
    extraSources?: SourcesList
  ): TypeGuard<AnyAction, ActionOf<DesiredActionSpecifierType>> =>
  (inputAction): inputAction is ActionOf<DesiredActionSpecifierType> =>
    specifier.type === inputAction.type &&
    specifier.subtype === inputAction.subtype &&
    (extraSources === undefined || requireSource(specifier.source, ...extraSources)(inputAction)) &&
    equal(specifier.filterMetadata, inputAction.filterMetadata);

/**
 * Combines two type guards such that an action must comply with both.
 *
 * @param outerTypeguard First type guard to be called.
 * @param innerTypeguard Second type guard to be called if the outer returns true.
 * @return True if the action matches both specifiers: false if not.
 */
export const and =
  <
    RefinedActionType extends ActionType,
    ActionType extends OuterActionType,
    OuterActionType extends AnyAction = AnyAction
  >(
    outerTypeguard: TypeGuard<OuterActionType, ActionType>,
    innerTypeguard: TypeGuard<ActionType, RefinedActionType>
  ): TypeGuard<OuterActionType, RefinedActionType> =>
  (action): action is RefinedActionType =>
    outerTypeguard(action) && innerTypeguard(action);

/**
 * Combines two type guards such that an action must comply with either.
 *
 * @param typeguardA First type guard to be called.
 * @param typeguardB Second type guard to be called if the first returns false.
 * @return True if the action matches either specifiers: false if not.
 */
export const or =
  <
    ActionTypeA extends OuterActionType,
    ActionTypeB extends OuterActionType,
    OuterActionType extends AnyAction = AnyAction
  >(
    typeguardA: TypeGuard<OuterActionType, ActionTypeA>,
    typeguardB: TypeGuard<OuterActionType, ActionTypeB>
  ): TypeGuard<OuterActionType, ActionTypeA | ActionTypeB> =>
  (action): action is ActionTypeA | ActionTypeB =>
    typeguardA(action) || typeguardB(action);

/**
 * Combines two state reducers calling the inner and then the outer.
 *
 * @param outerReducer The state reducer
 * @return A function that takes another reducer and returns the combined state reducer.
 */
export const composeStateReducers =
  <T>(outerReducer: StateReducer<T>) =>
  (innerReducer: StateReducer<T>): StateReducer<T> =>
  (state) =>
    outerReducer(innerReducer(state));
