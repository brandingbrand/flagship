import type { Attribute } from '@brandingbrand/engagement-utils';

import type { SuccessAction } from '../helpers';
import { mapReducersArray } from '../helpers';

import type { ProfileStore } from './types';
import { profileActions } from './types';

const INITIAL_STATE: ProfileStore = {
  attributes: [],
};

// this will combine the current and updated attributes,
// then filter out duplicates, keeping the new one
export default mapReducersArray<ProfileStore>(
  [
    [
      profileActions.update,
      (store: ProfileStore, action: SuccessAction<Attribute[]>) => ({
        ...store,
        attributes: [...action.value, ...store.attributes].filter(
          (attribute, index, self) => index === self.findIndex((a) => a.key === attribute.key)
        ),
      }),
    ],
  ],
  INITIAL_STATE
);
