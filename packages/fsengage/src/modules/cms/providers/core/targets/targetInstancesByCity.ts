import { Location } from '../../../requesters/ContentManagementSystemLocator';

// tslint:disable-next-line:cyclomatic-complexity
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

  // tslint:disable-next-line:no-magic-numbers
  if (instanceUSCities && instanceUSCities.indexOf(location.city) === -1) {
    return false;
  }

  // tslint:disable-next-line:no-magic-numbers
  if (campaignUSCities && campaignUSCities.indexOf(location.city) === -1) {
    return false;
  }

  return true;
}

