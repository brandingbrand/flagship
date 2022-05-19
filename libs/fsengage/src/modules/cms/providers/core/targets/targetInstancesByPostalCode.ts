import type { Location } from '../../../requesters/ContentManagementSystemLocator';

const kUSZipCodeKey = 'US-Zipcodes';

const targetInstancesByPostalCode = (
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
  if (!location || !location.postalCode) {
    return false;
  }

  const instancePostalCodes =
    instance.targets && instance.targets[kUSZipCodeKey] && instance.targets[kUSZipCodeKey].zipcodes;

  const { campaign } = instance;
  const campaignPostalCodes =
    targets[campaign] &&
    targets[campaign][kUSZipCodeKey] &&
    targets[campaign][kUSZipCodeKey].zipcodes;

  if (instancePostalCodes && !instancePostalCodes.includes(location.postalCode)) {
    return false;
  }

  if (campaignPostalCodes && !campaignPostalCodes.includes(location.postalCode)) {
    return false;
  }

  return true;
};

export default targetInstancesByPostalCode;
