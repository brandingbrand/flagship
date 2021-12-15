import { Location } from '../../../requesters/ContentManagementSystemLocator';

// eslint-disable-next-line complexity
export default function targetInstancesByCity(
  instance: any, targets: { [index: string]: any }, location: Location
): boolean {
  if (!instance) {
    return false;
  }

  if (!targets) {
    return true;
  }

  // If location is not available invalidates the instance.
  if (!location || !location.city) {
    return false;
  }

  const instanceUSCities = instance.targets &&
                           instance.targets['US-Cities'] &&
                           instance.targets['US-Cities'].cities;

  const campaign = instance.campaign;
  const campaignUSCities = targets[campaign] &&
                           targets[campaign]['US-Cities'] &&
                           targets[campaign]['US-Cities'].cities;

  if (instanceUSCities && instanceUSCities.indexOf(location.city) === -1) {
    return false;
  }

  if (campaignUSCities && campaignUSCities.indexOf(location.city) === -1) {
    return false;
  }

  return true;
}

