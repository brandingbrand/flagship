import type { Location } from '../../../requesters/ContentManagementSystemLocator';

const targetInstancesByRegion = (
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
  if (!location || location.latitude === null || location.longitude === null) {
    return false;
  }

  const instanceCoordinates =
    instance.targets && instance.targets.Region && instance.targets.Region.coordinates;

  const { campaign } = instance;
  const campaignCoordinates =
    targets[campaign] && targets[campaign].Region && targets[campaign].Region.coordinates;

  if (instanceCoordinates && !isLocationInsideCoordinates(location, instanceCoordinates)) {
    return false;
  }

  if (campaignCoordinates && !isLocationInsideCoordinates(location, campaignCoordinates)) {
    return false;
  }

  return true;
};

export default targetInstancesByRegion;

const isLocationInsideCoordinates = (location: Location, coordinates: any[]): boolean => {
  // Based on algorithm:
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html

  for (let index = coordinates.length - 1; index >= 0; --index) {
    const region = coordinates[index];

    if (!region || region.length === 0) {
      return false;
    }

    const { latitude } = location;
    const longituge = location.longitude;
    let isLocationInside = false;

    for (let index1 = 0, index2 = region.length - 1; index1 < region.length; index2 = index1++) {
      const latitudeIndex1 = region[index1][0];
      const longitugeIndex1 = region[index1][1];

      const latitudeIndex2 = region[index2][0];
      const longitugeIndex2 = region[index2][1];

      const didIntersect =
        longitugeIndex1 > longituge !== longitugeIndex2 > longituge &&
        latitude <
          ((latitudeIndex2 - latitudeIndex1) * (longituge - longitugeIndex1)) /
            (longitugeIndex2 - longitugeIndex1) +
            latitudeIndex1;

      if (didIntersect) {
        isLocationInside = !isLocationInside;
      }
    }

    return isLocationInside;
  }

  return false;
};
