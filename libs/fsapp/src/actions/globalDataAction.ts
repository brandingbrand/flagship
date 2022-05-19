import type { Action } from 'redux';

export const GlobalDataActionType = 'UPDATE_GLOBAL';

export interface GlobalDataAction extends Action {
  data: any;
}

export const setGlobalData = (data: unknown): GlobalDataAction => ({
  type: GlobalDataActionType,
  data,
});
