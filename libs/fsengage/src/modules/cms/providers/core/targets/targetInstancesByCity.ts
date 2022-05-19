import type { Location } from '../../../requesters/ContentManagementSystemLocator';

const targetInstancesByCity = (
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
  if (!location || !location.city) {
    return false;
  }

  const instanceUSCities =
    instance.targets && instance.targets['US-Cities'] && instance.targets['US-Cities'].cities;

  const { campaign } = instance;
  const campaignUSCities =
    targets[campaign] && targets[campaign]['US-Cities'] && targets[campaign]['US-Cities'].cities;

  if (instanceUSCities && !instanceUSCities.includes(location.city)) {
    return false;
  }

  if (campaignUSCities && !campaignUSCities.includes(location.city)) {
    return false;
  }

  return true;
};

export default targetInstancesByCity;
