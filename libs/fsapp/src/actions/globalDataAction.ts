import { Action } from 'redux';

export const GlobalDataActionType = 'UPDATE_GLOBAL';

export interface GlobalDataAction extends Action {
  data: any;
}

export function setGlobalData(data: any): GlobalDataAction {
  return {
    type: GlobalDataActionType,
    data,
  };
}
