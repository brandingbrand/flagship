import type { AnyAction } from '@brandingbrand/cargo-hold';
import { matches } from '@brandingbrand/cargo-hold';

import * as Actions from './actions';
import type { ActionSanitizer, Predicate, StateSanitizer, StoreDevtoolsConfig } from './config';
import type { ExtensionLiftedAction } from './extension';
import type { ComputedState, LiftedAction, LiftedActions, LiftedState } from './reducer';

export const difference = <T>(first: T[], second: T[]): T[] =>
  first.filter((item) => !second.includes(item));

/**
 * Provides an app's view into the state of the lifted store.
 *
 * @param liftedState
 * @return
 */
export const unliftState = (liftedState: LiftedState): unknown => {
  const { computedStates, currentStateIndex } = liftedState;

  // At start up NgRx dispatches init actions,
  // When these init actions are being filtered out by the predicate or safe/block list options
  // we don't have a complete computed states yet.
  // At this point it could happen that we're out of bounds, when this happens we fall back to the last known state
  if (currentStateIndex >= computedStates.length) {
    const { state } = computedStates[computedStates.length - 1] ?? {};
    return state;
  }

  const { state } = computedStates[currentStateIndex] ?? {};
  return state;
};

export const unliftAction = (liftedState: LiftedState): LiftedAction | undefined =>
  liftedState.actionsById[liftedState.nextActionId - 1];

/**
 * Lifts an app's action into an action on the lifted store.
 *
 * @param action
 * @return
 */
export const liftAction = (action: AnyAction): Actions.PerformActionType =>
  Actions.PerformAction.create(action, Number(Date.now()));

/**
 * Sanitizes given action with given function.
 *
 * @param actionSanitizer
 * @param action
 * @param actionIdx
 * @return
 */
export const sanitizeAction = (
  actionSanitizer: ActionSanitizer,
  action: LiftedAction,
  actionIdx: number
): LiftedAction => ({
  ...action,
  payload: {
    ...action.payload,
    action: actionSanitizer(action.payload.action, actionIdx),
  },
});

/**
 * Sanitizes given actions with given function.
 *
 * @param actionSanitizer
 * @param actions
 * @return
 */
export const sanitizeActions = (
  actionSanitizer: ActionSanitizer,
  actions: LiftedActions
): LiftedActions =>
  Object.keys(actions).reduce<LiftedActions>((sanitizedActions, actionIdx) => {
    const idx = Number(actionIdx);
    sanitizedActions[idx] = sanitizeAction(actionSanitizer, actions[idx] as LiftedAction, idx);
    return sanitizedActions;
  }, {});

export const extensionAction = (action: LiftedAction): ExtensionLiftedAction => ({
  type: action.type,
  action: action.payload.action,
  timestamp: action.payload.timestamp,
});

/**
 * Sanitizes given state with given function.
 *
 * @param stateSanitizer
 * @param state
 * @param stateIdx
 * @return
 */
export const sanitizeState = (
  stateSanitizer: StateSanitizer,
  state: unknown,
  stateIdx: number
): unknown => stateSanitizer(state, stateIdx);

/**
 * Sanitizes given states with given function.
 *
 * @param stateSanitizer
 * @param states
 * @return
 */
export const sanitizeStates = (
  stateSanitizer: StateSanitizer,
  states: ComputedState[]
): ComputedState[] =>
  states.map((computedState, idx) => ({
    state: sanitizeState(stateSanitizer, computedState.state, idx),
    error: computedState.error,
  }));

/**
 * Read the config and tell if actions should be filtered
 *
 * @param config
 * @return
 */
export const shouldFilterActions = (config: StoreDevtoolsConfig): boolean =>
  Boolean(config.predicate || config.actionsSafelist || config.actionsBlocklist);

/**
 * Return true is the action should be ignored
 *
 * @param state
 * @param action
 * @param predicate
 * @param safelist
 * @param blockedlist
 * @return
 */
export const isActionFiltered = (
  state: unknown,
  action: LiftedAction,
  predicate?: Predicate,
  safelist?: string[],
  blockedlist?: string[]
): boolean => {
  const isPredicateMatch = predicate && !predicate(state, action.payload.action);

  const isSafelistMatch =
    safelist &&
    !new RegExp(safelist.map((safe) => escapeRegExp(safe)).join('|')).test(
      action.payload.action.type
    );

  const isBlocklistMatch =
    blockedlist &&
    new RegExp(blockedlist.map((safe) => escapeRegExp(safe)).join('|')).exec(
      action.payload.action.type
    ) !== null;

  return Boolean(isPredicateMatch ?? isSafelistMatch ?? isBlocklistMatch);
};

/**
 * Return a full filtered lifted state
 *
 * @param liftedState
 * @param predicate
 * @param safelist
 * @param blocklist
 * @return
 */
export const filterLiftedState = (
  liftedState: LiftedState,
  predicate?: Predicate,
  safelist?: string[],
  blocklist?: string[]
): LiftedState => {
  const filteredStagedActionIds: number[] = [];
  const filteredActionsById: LiftedActions = {};
  const filteredComputedStates: ComputedState[] = [];
  for (const [idx, id] of liftedState.stagedActionIds.entries()) {
    const liftedAction = liftedState.actionsById[id];
    if (!liftedAction) {
      continue;
    }
    if (
      idx &&
      isActionFiltered(
        liftedState.computedStates[idx],
        liftedAction,
        predicate,
        safelist,
        blocklist
      )
    ) {
      continue;
    }
    filteredActionsById[id] = liftedAction;
    filteredStagedActionIds.push(id);
    const filteredComputedState = liftedState.computedStates[idx];
    if (filteredComputedState) {
      filteredComputedStates.push(filteredComputedState);
    }
  }
  return {
    ...liftedState,
    stagedActionIds: filteredStagedActionIds,
    actionsById: filteredActionsById,
    computedStates: filteredComputedStates,
  };
};

/**
 * Return string with escaped RegExp special characters
 * https://stackoverflow.com/a/6969486/1337347
 *
 * @param regExp
 * @return
 */
const escapeRegExp = (regExp: string): string => regExp.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&');

export const isLiftedAction = matches(Actions.PerformAction);
