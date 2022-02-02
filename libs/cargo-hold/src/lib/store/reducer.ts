import type { NonEmptyArray } from '../internal/util/functional/non-empty-array.types';
import type {
  ActionSpecifier,
  ActionOf,
  AnyActionSpecifier,
  AnyAction,
  TypeGuard,
} from '../action-bus';
import type { AnyActionReducer, SourcesList, ActionReducer, StateReducer } from './store.types';

export const combineActionReducers =
  <State extends {}>(...reducers: AnyActionReducer<State>[]): AnyActionReducer<State> =>
  (action) =>
  (state) =>
    reducers.reduce((currentState, reducer) => reducer(action)(currentState), state);

export const on =
  <State, DesiredActionSpecifier extends ActionSpecifier<string, any, unknown>>(
    filter: TypeGuard<ActionSpecifier<string, any, unknown>, DesiredActionSpecifier>,
    reducer: ActionReducer<State, ActionOf<DesiredActionSpecifier>>
  ): AnyActionReducer<State> =>
  (action) => {
    if (filter(action)) {
      // sorry for coercion. TS can't detect the typeguard logic through the ActionOf<> type.
      return reducer(action as ActionOf<DesiredActionSpecifier>);
    }
    return (state) => state;
  };

export const requireSource =
  (...sources: (string | symbol | undefined)[]) =>
  <ActionType extends ActionSpecifier<string, any, unknown>>(
    action: ActionType
  ): action is ActionType =>
    !sources.length || sources.includes(action.source);

export const optionalSource =
  (...sources: (string | symbol | undefined)[]) =>
  <ActionType extends ActionSpecifier<string, any, unknown>>(
    action: ActionType
  ): action is ActionType =>
    !sources.length || !action.source || sources.includes(action.source);

export const isType =
  <ActionType extends ActionSpecifier<string, any, unknown>>(
    ...actionTypes: NonEmptyArray<ActionType['type']>
  ) =>
  (action: ActionSpecifier<string, any, unknown>): action is ActionType =>
    actionTypes.includes(action.type);

export const isSubtype =
  <ActionType extends AnyAction>(...actionSubtypes: NonEmptyArray<ActionType['subtype']>) =>
  (action: AnyAction): action is ActionType =>
    actionSubtypes.includes(action.subtype);

export const matches =
  <DesiredActionSpecifier extends AnyActionSpecifier>(
    action: DesiredActionSpecifier,
    extraSources?: SourcesList
  ): TypeGuard<AnyActionSpecifier, DesiredActionSpecifier> =>
  (inputAction): inputAction is DesiredActionSpecifier => {
    return (
      action.type === inputAction.type &&
      action.subtype === inputAction.subtype &&
      requireSource(action.source, ...(extraSources ?? []))(inputAction)
    );
  };

export const and =
  <
    RefinedActionType extends ActionType,
    ActionType extends OuterActionType,
    OuterActionType extends AnyActionSpecifier = AnyActionSpecifier
  >(
    outerTypeguard: TypeGuard<OuterActionType, ActionType>,
    innerTypeguard: TypeGuard<ActionType, RefinedActionType>
  ): TypeGuard<OuterActionType, RefinedActionType> =>
  (action): action is RefinedActionType =>
    outerTypeguard(action) && innerTypeguard(action);

export const or =
  <
    ActionTypeA extends OuterActionType,
    ActionTypeB extends OuterActionType,
    OuterActionType extends AnyActionSpecifier = AnyActionSpecifier
  >(
    typeguardA: TypeGuard<OuterActionType, ActionTypeA>,
    typeguardB: TypeGuard<OuterActionType, ActionTypeB>
  ): TypeGuard<OuterActionType, ActionTypeA | ActionTypeB> =>
  (action): action is ActionTypeB | ActionTypeA =>
    typeguardA(action) || typeguardB(action);

export const composeStateReducers =
  <T>(outerReducer: StateReducer<T>) =>
  (innerReducer: StateReducer<T>): StateReducer<T> =>
  (state) =>
    outerReducer(innerReducer(state));
