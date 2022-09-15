import type { ReducersMapObject } from 'redux';

import ProfileReducer from './reducer';

export const profileReducer: ReducersMapObject = {
  profile: ProfileReducer,
};
