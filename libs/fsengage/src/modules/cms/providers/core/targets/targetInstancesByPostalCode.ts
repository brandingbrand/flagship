import { Location } from '../../../requesters/ContentManagementSystemLocator';

const kUSZipCodeKey = 'US-Zipcodes';

// eslint-disable-next-line complexity
export default function targetInstancesByPostalCode(
  instance: any, targets: { [index: string]: any }, location: Location
): boolean {
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

  const instancePostalCodes = instance.targets &&
                            instance.targets[kUSZipCodeKey] &&
                            instance.targets[kUSZipCodeKey].zipcodes;

  const campaign = instance.campaign;
  const campaignPostalCodes = targets[campaign] &&
                            targets[campaign][kUSZipCodeKey] &&
                            targets[campaign][kUSZipCodeKey].zipcodes;

  if (instancePostalCodes && instancePostalCodes.indexOf(location.postalCode) === -1) {
    return false;
  }

  if (campaignPostalCodes && campaignPostalCodes.indexOf(location.postalCode) === -1) {
    return false;
  }

  return true;
}

