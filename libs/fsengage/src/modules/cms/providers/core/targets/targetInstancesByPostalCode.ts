import { Location } from '../../../requesters/ContentManagementSystemLocator';

const kUSZipCodeKey = 'US-Zipcodes';

// tslint:disable-next-line:cyclomatic-complexity
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

  // tslint:disable-next-line:no-magic-numbers
  if (instancePostalCodes && instancePostalCodes.indexOf(location.postalCode) === -1) {
    return false;
  }

  // tslint:disable-next-line:no-magic-numbers
  if (campaignPostalCodes && campaignPostalCodes.indexOf(location.postalCode) === -1) {
    return false;
  }

  return true;
}

