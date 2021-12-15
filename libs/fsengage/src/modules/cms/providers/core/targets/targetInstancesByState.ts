import { Location } from '../../../requesters/ContentManagementSystemLocator';

// eslint-disable-next-line complexity
export default function targetInstancesByState(
  instance: any, targets: { [index: string]: any }, location: Location
): boolean {
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

  const instanceUSStates = instance.targets &&
                           instance.targets['US-States'] &&
                           instance.targets['US-States'].selected_states;

  const campaign = instance.campaign;
  const campaignUSStates = targets[campaign] &&
                           targets[campaign]['US-States'] &&
                           targets[campaign]['US-States'].selected_states;

  if (instanceUSStates && instanceUSStates.indexOf(location.stateCode) === -1) {
    return false;
  }

  if (campaignUSStates && campaignUSStates.indexOf(location.stateCode) === -1) {
    return false;
  }

  return true;
}

