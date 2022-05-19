import type { Location } from '../../../requesters/ContentManagementSystemLocator';

const targetInstancesByCountry = (
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
  if (!location || !location.countryCode) {
    return false;
  }

  const instanceCountries =
    instance.targets && instance.targets.Country && instance.targets.Country.countries;

  const { campaign } = instance;
  const campaignCountries: any =
    targets[campaign] && targets[campaign].Country && targets[campaign].Country.countries;

  if (instanceCountries && !Object.keys(instanceCountries).includes(location.countryCode)) {
    return false;
  }

  if (campaignCountries && !Object.keys(campaignCountries).includes(location.countryCode)) {
    return false;
  }

  return true;
};

export default targetInstancesByCountry;
