import type { Location } from '../../../requesters/ContentManagementSystemLocator';

const targetInstancesByState = (
  instance: any,
  targets: Record<string, any>,
  location: Location
): boolean => {
  if (!instance) {
    return false;
  }

  if (!targets) {
    return true;
  }

  // If location is not available invalidates the instance.
  if (!location || !location.stateCode) {
    return false;
  }

  const instanceUSStates =
    instance.targets &&
    instance.targets['US-States'] &&
    instance.targets['US-States'].selected_states;

  const { campaign } = instance;
  const campaignUSStates =
    targets[campaign] &&
    targets[campaign]['US-States'] &&
    targets[campaign]['US-States'].selected_states;

  if (instanceUSStates && !instanceUSStates.includes(location.stateCode)) {
    return false;
  }

  if (campaignUSStates && !campaignUSStates.includes(location.stateCode)) {
    return false;
  }

  return true;
};

export default targetInstancesByState;
