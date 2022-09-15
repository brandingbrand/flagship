import type { Attribute } from '@brandingbrand/engagement-utils';

export const profileActions = {
  update: `PROFILE_UPDATE`,
};

export interface ProfileStore {
  attributes: Attribute[];
}
