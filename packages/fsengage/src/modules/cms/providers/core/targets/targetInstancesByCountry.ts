import { Location } from '../../../requesters/ContentManagementSystemLocator';

// tslint:disable-next-line:cyclomatic-complexity
export default function targetInstancesByCountry(
  instance: any, targets: { [index: string]: any }, location: Location
): boolean {
  if (!instance) {
    return false;
  }

  if (!targets) {
    return true;
  }

  // If location is not available invalidates the instance.
  if (!location || !location.countryCode) {
    return false;
  }

  const instanceCountries = instance.targets &&
                            instance.targets.Country &&
                            instance.targets.Country.countries;

  const campaign = instance.campaign;
  const campaignCountries: any = targets[campaign] &&
    targets[campaign].Country &&
    targets[campaign].Country.countries;

  // tslint:disable-next-line:no-magic-numbers
  if (instanceCountries && Object.keys(instanceCountries).indexOf(location.countryCode) === -1) {
    return false;
  }

  // tslint:disable-next-line:no-magic-numbers
  if (campaignCountries && Object.keys(campaignCountries).indexOf(location.countryCode) === -1) {
    return false;
  }

  return true;
}

