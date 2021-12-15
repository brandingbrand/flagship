import { GlobalDataAction, GlobalDataActionType } from '../actions/globalDataAction';

export default (state = {}, action: GlobalDataAction) => {
  if (action.type === GlobalDataActionType) {
    return {
      ...state,
      ...action.data,
    };
  }

  return state;
};
