import { InitAction, UpdateReducersAction, createActionCreator } from '@brandingbrand/cargo-hold';
import type {
  ActionOf,
  ActionReducer,
  AnyAction,
  AnyActionReducer,
} from '@brandingbrand/cargo-hold';

import * as DevtoolsActions from './actions';
import { PerformAction } from './actions';
import type { StoreDevtoolsConfig } from './config';
import { difference, isActionFiltered } from './utils';

export type CoreActions = ActionOf<typeof InitAction> | ActionOf<typeof UpdateReducersAction>;
export type Actions = CoreActions | DevtoolsActions.All;

export const RecomputeAction = createActionCreator({
  actionKey: '@brandingbrand/cargo-hold-devtools/recompute',
});

export interface ComputedState {
  state: unknown;
  error: unknown;
}

export type LiftedAction = ActionOf<typeof PerformAction>;
export type LiftedActions = Record<number, LiftedAction>;

export interface LiftedState {
  nextActionId: number;
  actionsById: LiftedActions;
  stagedActionIds: number[];
  skippedActionIds: number[];
  committedState: unknown;
  currentStateIndex: number;
  computedStates: ComputedState[];
  isLocked: boolean;
  isPaused: boolean;
}

/**
 * Computes the next entry in the log by applying an action.
 *
 * @param reducer
 * @param action
 * @param state
 * @param error
 * @return
 */
const computeNextEntry = (
  reducer: ActionReducer<unknown, AnyAction>,
  action: AnyAction,
  state: unknown,
  error: unknown
): ComputedState => {
  if (error) {
    return {
      state,
      error: 'Interrupted by an error up the chain',
    };
  }

  let nextState = state;
  let nextError;
  try {
    nextState = reducer(action)(state);
  } catch (error_: unknown) {
    nextError = `${error_}`;
  }

  return {
    state: nextState,
    error: nextError,
  };
};

/**
 * Runs the reducer on invalidated actions to get a fresh computation log.
 *
 * @param computedStates
 * @param minInvalidatedStateIndex
 * @param reducer
 * @param committedState
 * @param actionsById
 * @param stagedActionIds
 * @param skippedActionIds
 * @param isPaused
 * @return
 */
const recomputeStates = (
  computedStates: ComputedState[],
  minInvalidatedStateIndex: number,
  reducer: AnyActionReducer,
  committedState: unknown,
  actionsById: LiftedActions,
  stagedActionIds: number[],
  skippedActionIds: number[],
  isPaused: boolean
): ComputedState[] => {
  // Optimization: exit early and return the same reference
  // if we know nothing could have changed.
  if (
    minInvalidatedStateIndex >= computedStates.length &&
    computedStates.length === stagedActionIds.length
  ) {
    return computedStates;
  }

  const nextComputedStates = computedStates.slice(0, minInvalidatedStateIndex);
  // If the recording is paused, recompute all states up until the pause state,
  // else recompute all states.
  const lastIncludedActionId = stagedActionIds.length - (isPaused ? 1 : 0);
  for (let i = minInvalidatedStateIndex; i < lastIncludedActionId; i += 1) {
    const actionId = stagedActionIds[i] as number;
    const { payload } = actionsById[actionId] as LiftedAction;

    const previousEntry = nextComputedStates[i - 1];
    const previousState = previousEntry ? previousEntry.state : committedState;
    const previousError = previousEntry ? previousEntry.error : undefined;

    const shouldSkip = skippedActionIds.includes(actionId);
    const entry = shouldSkip
      ? (previousEntry as ComputedState)
      : computeNextEntry(reducer, payload.action, previousState, previousError);

    nextComputedStates.push(entry);
  }
  // If the recording is paused, the last state will not be recomputed,
  // because it's essentially not part of the state history.
  if (isPaused) {
    nextComputedStates.push(computedStates[computedStates.length - 1] as ComputedState);
  }

  return nextComputedStates;
};

export const liftInitialState = (initialCommittedState?: unknown): LiftedState => ({
  nextActionId: 0,
  actionsById: {},
  stagedActionIds: [],
  skippedActionIds: [],
  committedState: initialCommittedState,
  currentStateIndex: 0,
  computedStates: [],
  isLocked: false,
  isPaused: false,
});

/**
 * Creates a history state reducer from an app's reducer.
 *
 * @param initialCommittedState
 * @param initialLiftedState
 * @param monitorReducer
 * @param options
 * @return
 */
/* eslint-disable max-lines-per-function */
export const liftReducerWith =
  (
    initialCommittedState: unknown,
    initialLiftedState: LiftedState,
    options: Partial<StoreDevtoolsConfig> = {}
  ) =>
  <T extends AnyActionReducer>(reducer: T): ActionReducer<LiftedState, Actions> =>
  (liftedAction) =>
  // eslint-disable-next-line max-statements
  (liftedState) => {
    let {
      actionsById,
      committedState,
      computedStates,
      currentStateIndex,
      isLocked,
      isPaused,
      nextActionId,
      skippedActionIds,
      stagedActionIds,
    } = liftedState ?? initialLiftedState;

    if (!liftedState) {
      // Prevent mutating initialLiftedState
      actionsById = Object.create(actionsById);
    }

    const commitExcessActions = (actionCount: number): void => {
      // Auto-commits n-number of excess actions.
      let excess = actionCount;
      let idsToDelete = stagedActionIds.slice(1, excess + 1);

      for (let i = 0; i < idsToDelete.length; i += 1) {
        if (computedStates[i + 1]?.error) {
          // Stop if error is found. Commit actions up to error.
          excess = i;
          idsToDelete = stagedActionIds.slice(1, excess + 1);
          break;
        } else {
          const idToDelete = idsToDelete[i];
          if (idToDelete !== undefined) {
            delete actionsById[idToDelete];
          }
        }
      }

      skippedActionIds = skippedActionIds.filter((id) => !idsToDelete.includes(id));
      stagedActionIds = [0, ...stagedActionIds.slice(excess + 1)];
      committedState = computedStates[excess]?.state;
      computedStates = computedStates.slice(excess);
      currentStateIndex = currentStateIndex > excess ? currentStateIndex - excess : 0;
    };

    const commitChanges = (): void => {
      // Consider the last committed state the new starting point.
      // Squash any staged actions into a single committed state.
      actionsById = {};
      nextActionId = 0;
      stagedActionIds = [];
      skippedActionIds = [];
      committedState = computedStates[currentStateIndex]?.state;
      currentStateIndex = 0;
      computedStates = [];
    };

    // By default, aggressively recompute every state whatever happens.
    // This has O(n) performance, so we'll override this to a sensible
    // value whenever we feel like we don't have to recompute the states.
    let minInvalidatedStateIndex = 0;

    switch (liftedAction.type) {
      case DevtoolsActions.LockChanges.type: {
        isLocked = liftedAction.payload.status;
        minInvalidatedStateIndex = Number.POSITIVE_INFINITY;
        break;
      }
      case DevtoolsActions.PauseRecording.type: {
        isPaused = liftedAction.payload.status;
        if (isPaused) {
          // Add a pause action to signal the devtools-user the recording is paused.
          // The corresponding state will be overwritten on each update to always contain
          // the latest state (see Actions.PERFORM_ACTION).
          stagedActionIds = [...stagedActionIds, nextActionId];
          actionsById[nextActionId] = PerformAction.create(
            {
              type: '@ngrx/devtools/pause',
              payload: {},
            },
            Number(Date.now())
          );
          nextActionId += 1;
          minInvalidatedStateIndex = stagedActionIds.length - 1;
          computedStates = computedStates.concat(
            computedStates[computedStates.length - 1] as ComputedState
          );

          if (currentStateIndex === stagedActionIds.length - 2) {
            currentStateIndex += 1;
          }
          minInvalidatedStateIndex = Number.POSITIVE_INFINITY;
        } else {
          commitChanges();
        }
        break;
      }
      case DevtoolsActions.Reset.type: {
        // Get back to the state the store was created with.
        actionsById = {};
        nextActionId = 0;
        stagedActionIds = [];
        skippedActionIds = [];
        committedState = initialCommittedState;
        currentStateIndex = 0;
        computedStates = [];
        break;
      }
      case DevtoolsActions.Commit.type: {
        commitChanges();
        break;
      }
      case DevtoolsActions.Rollback.type: {
        // Forget about any staged actions.
        // Start again from the last committed state.
        actionsById = {};
        nextActionId = 0;
        stagedActionIds = [];
        skippedActionIds = [];
        currentStateIndex = 0;
        computedStates = [];
        break;
      }
      case DevtoolsActions.ToggleAction.type: {
        // Toggle whether an action with given ID is skipped.
        // Being skipped means it is a no-op during the computation.
        const { id: actionId } = liftedAction.payload;

        const index = skippedActionIds.indexOf(actionId);
        skippedActionIds =
          index === -1
            ? [actionId, ...skippedActionIds]
            : skippedActionIds.filter((id) => id !== actionId);

        // Optimization: we know history before this action hasn't changed
        minInvalidatedStateIndex = stagedActionIds.indexOf(actionId);
        break;
      }
      case DevtoolsActions.SetActionsActive.type: {
        // Toggle whether an action with given ID is skipped.
        // Being skipped means it is a no-op during the computation.
        const { active, end, start } = liftedAction.payload;
        const actionIds = [];
        for (let i = start; i < end; i += 1) {
          actionIds.push(i);
        }
        skippedActionIds = active
          ? difference(skippedActionIds, actionIds)
          : [...skippedActionIds, ...actionIds];

        // Optimization: we know history before this action hasn't changed
        minInvalidatedStateIndex = stagedActionIds.indexOf(start);
        break;
      }
      case DevtoolsActions.JumpToState.type: {
        // Without recomputing anything, move the pointer that tell us
        // which state is considered the current one. Useful for sliders.
        currentStateIndex = liftedAction.payload.index;
        // Optimization: we know the history has not changed.
        minInvalidatedStateIndex = Number.POSITIVE_INFINITY;
        break;
      }
      case DevtoolsActions.JumpToAction.type: {
        // Jumps to a corresponding state to a specific action.
        // Useful when filtering actions.
        const index = stagedActionIds.indexOf(liftedAction.payload.actionId);
        if (index !== -1) {
          currentStateIndex = index;
        }
        minInvalidatedStateIndex = Number.POSITIVE_INFINITY;
        break;
      }
      case DevtoolsActions.Sweep.type: {
        // Forget any actions that are currently being skipped.
        stagedActionIds = difference(stagedActionIds, skippedActionIds);
        skippedActionIds = [];
        currentStateIndex = Math.min(currentStateIndex, stagedActionIds.length - 1);
        break;
      }
      case DevtoolsActions.PerformAction.type: {
        // Ignore action and return state as is if recording is locked
        if (isLocked) {
          return liftedState ?? initialLiftedState;
        }

        if (
          isPaused ||
          (liftedState &&
            isActionFiltered(
              liftedState.computedStates[currentStateIndex],
              liftedAction,
              options.predicate,
              options.actionsSafelist,
              options.actionsBlocklist
            ))
        ) {
          // If recording is paused or if the action should be ignored, overwrite the last state
          // (corresponds to the pause action) and keep everything else as is.
          // This way, the app gets the new current state while the devtools
          // do not record another action.
          const lastState = computedStates[computedStates.length - 1];
          computedStates = [
            ...computedStates.slice(0, -1),
            computeNextEntry(
              reducer,
              liftedAction.payload.action,
              lastState?.state,
              lastState?.error
            ),
          ];
          minInvalidatedStateIndex = Number.POSITIVE_INFINITY;
          break;
        }

        // Auto-commit as new actions come in.
        if (typeof options.maxAge === 'number' && stagedActionIds.length === options.maxAge) {
          commitExcessActions(1);
        }

        if (currentStateIndex === stagedActionIds.length - 1) {
          currentStateIndex += 1;
        }
        const actionId = nextActionId;
        nextActionId += 1;
        // Mutation! This is the hottest path, and we optimize on purpose.
        // It is safe because we set a new key in a cache dictionary.
        actionsById[actionId] = liftedAction;

        stagedActionIds = [...stagedActionIds, actionId];
        // Optimization: we know that only the new action needs computing.
        minInvalidatedStateIndex = stagedActionIds.length - 1;
        break;
      }
      case DevtoolsActions.ImportState.type: {
        // Completely replace everything.
        ({
          actionsById,
          committedState,
          computedStates,
          currentStateIndex,
          isLocked,
          isPaused,
          nextActionId,
          skippedActionIds,
          stagedActionIds,
        } = liftedAction.payload.nextLiftedState);
        break;
      }
      case InitAction.type: {
        // Always recompute states on hot reload and init.
        minInvalidatedStateIndex = 0;

        if (typeof options.maxAge === 'number' && stagedActionIds.length > options.maxAge) {
          // States must be recomputed before committing excess.
          computedStates = recomputeStates(
            computedStates,
            minInvalidatedStateIndex,
            reducer,
            committedState,
            actionsById,
            stagedActionIds,
            skippedActionIds,
            isPaused
          );

          commitExcessActions(stagedActionIds.length - options.maxAge);

          // Avoid double computation.
          minInvalidatedStateIndex = Number.POSITIVE_INFINITY;
        }

        break;
      }
      case UpdateReducersAction.type: {
        const stateHasErrors = computedStates.some((state) => state.error);

        if (stateHasErrors) {
          // Recompute all states
          minInvalidatedStateIndex = 0;

          if (typeof options.maxAge === 'number' && stagedActionIds.length > options.maxAge) {
            // States must be recomputed before committing excess.
            computedStates = recomputeStates(
              computedStates,
              minInvalidatedStateIndex,
              reducer,
              committedState,
              actionsById,
              stagedActionIds,
              skippedActionIds,
              isPaused
            );

            commitExcessActions(stagedActionIds.length - options.maxAge);

            // Avoid double computation.
            minInvalidatedStateIndex = Number.POSITIVE_INFINITY;
          }
        } else {
          // If not paused/locked, add a new action to signal devtools-user
          // that there was a reducer update.
          if (!isPaused && !isLocked) {
            if (currentStateIndex === stagedActionIds.length - 1) {
              currentStateIndex += 1;
            }

            // Add a new action to only recompute state
            const actionId = nextActionId;
            nextActionId += 1;
            actionsById[actionId] = PerformAction.create(liftedAction, Number(Date.now()));
            stagedActionIds = [...stagedActionIds, actionId];

            minInvalidatedStateIndex = stagedActionIds.length - 1;

            computedStates = recomputeStates(
              computedStates,
              minInvalidatedStateIndex,
              reducer,
              committedState,
              actionsById,
              stagedActionIds,
              skippedActionIds,
              isPaused
            );
          }

          // Recompute state history with latest reducer and update action
          computedStates = computedStates.map((cmp) => ({
            ...cmp,
            state: reducer(RecomputeAction.create())(cmp.state),
          }));

          currentStateIndex = stagedActionIds.length - 1;

          if (typeof options.maxAge === 'number' && stagedActionIds.length > options.maxAge) {
            commitExcessActions(stagedActionIds.length - options.maxAge);
          }

          // Avoid double computation.
          minInvalidatedStateIndex = Number.POSITIVE_INFINITY;
        }

        break;
      }
      default: {
        // If the action is not recognized, it's a monitor action.
        // Optimization: a monitor action can't change history.
        minInvalidatedStateIndex = Number.POSITIVE_INFINITY;
        break;
      }
    }

    computedStates = recomputeStates(
      computedStates,
      minInvalidatedStateIndex,
      reducer,
      committedState,
      actionsById,
      stagedActionIds,
      skippedActionIds,
      isPaused
    );

    return {
      actionsById,
      nextActionId,
      stagedActionIds,
      skippedActionIds,
      committedState,
      currentStateIndex,
      computedStates,
      isLocked,
      isPaused,
    };
  };
/* eslint-enable */
