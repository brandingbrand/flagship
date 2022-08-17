import type { ActionOf, AnyAction } from '@brandingbrand/cargo-hold';
import { createActionCreator } from '@brandingbrand/cargo-hold';

export const PerformAction = createActionCreator({
  actionKey: 'PERFORM_ACTION',
  callback: (action: AnyAction, timestamp: number) => {
    if (typeof action.type === 'undefined') {
      throw new TypeError(
        'Actions may not have an undefined "type" property. ' + 'Have you misspelled a constant?'
      );
    }

    return { action, timestamp };
  },
});
export type PerformActionType = ActionOf<typeof PerformAction>;

export const Refresh = createActionCreator({ actionKey: 'REFRESH' });
export type RefreshType = ActionOf<typeof Refresh>;

export const Reset = createActionCreator({
  actionKey: 'RESET',
  callback: (timestamp: number) => ({ timestamp }),
});
export type ResetType = ActionOf<typeof Reset>;

export const Rollback = createActionCreator({
  actionKey: 'ROLLBACK',
  callback: (timestamp: number) => ({ timestamp }),
});
export type RollbackType = ActionOf<typeof Rollback>;

export const Commit = createActionCreator({
  actionKey: 'COMMIT',
  callback: (timestamp: number) => ({ timestamp }),
});
export type CommitType = ActionOf<typeof Commit>;

export const Sweep = createActionCreator({
  actionKey: 'SWEEP',
});
export type SweepType = ActionOf<typeof Sweep>;

export const ToggleAction = createActionCreator({
  actionKey: 'TOGGLE_ACTION',
  callback: (id: number) => ({ id }),
});
export type ToggleActionType = ActionOf<typeof ToggleAction>;

export const SetActionsActive = createActionCreator({
  actionKey: 'SET_ACTIONS_ACTIVE',
  callback: (
    start: number,
    end: number,
    // eslint-disable-next-line @typescript-eslint/no-inferrable-types -- Create Action Creator inference doesn't work well with TypeScript 4.7+
    active: boolean = true
  ): { start: number; end: number; active: boolean } => ({ start, end, active }),
});
export type SetActionsActiveType = ActionOf<typeof SetActionsActive>;

export const JumpToState = createActionCreator({
  actionKey: 'JUMP_TO_STATE',
  callback: (index: number) => ({ index }),
});
export type JumpToStateType = ActionOf<typeof JumpToState>;

export const JumpToAction = createActionCreator({
  actionKey: 'JUMP_TO_ACTION',
  callback: (actionId: number) => ({ actionId }),
});
export type JumpToActionType = ActionOf<typeof JumpToAction>;

export const ImportState = createActionCreator({
  actionKey: 'IMPORT_STATE',
  callback: (nextLiftedState: any) => ({ nextLiftedState }),
});
export type ImportStateType = ActionOf<typeof ImportState>;

export const LockChanges = createActionCreator({
  actionKey: 'LOCK_CHANGES',
  callback: (status: boolean) => ({ status }),
});
export type LockChangesType = ActionOf<typeof LockChanges>;

export const PauseRecording = createActionCreator({
  actionKey: 'PAUSE_RECORDING',
  callback: (status: boolean) => ({ status }),
});
export type PauseRecordingType = ActionOf<typeof PauseRecording>;

export type All =
  | CommitType
  | ImportStateType
  | JumpToActionType
  | JumpToStateType
  | LockChangesType
  | PauseRecordingType
  | PerformActionType
  | RefreshType
  | ResetType
  | RollbackType
  | SetActionsActiveType
  | SweepType
  | ToggleActionType;
