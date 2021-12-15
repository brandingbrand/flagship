import FSNetwork from '@brandingbrand/fsnetwork';
import { GeoLocation } from '@brandingbrand/fsfoundation';

import {
  isGeolocationAllowed,
  requestGeolocationPermission,
} from './contentManagementSystemLocatorPermission';

export interface Location extends GeoLocation {
  timezone?: string;
  postalCode?: string;
  city?: string;
  stateCode?: string;
  countryCode?: string;
  continent?: string;
}

export default class ContentManagementSystemLocator {
  shouldPromptForGelolocationPermission: boolean;
  shouldFallbackToGeoIP: boolean;

  private readonly kStorcIPEndpoint: string = 'https://api.brandingbrand.com/storc/v2/geoip/';

  private readonly kLocationTimeout: number = 20 * 1000; // Milliseconds

  private readonly kMaximumAge: number = 1 * 1000; // Milliseconds

  private network: FSNetwork;

  constructor(
    shouldPromptForGelolocationPermission: boolean = false,
    shouldFallbackToGeoIP: boolean = false
  ) {
    this.shouldPromptForGelolocationPermission = shouldPromptForGelolocationPermission;
    this.shouldFallbackToGeoIP = shouldFallbackToGeoIP;
    this.network = new FSNetwork();
  }

  // Public functions

  async getCurrentLocation(): Promise<Location> {
    // Checks first if we already have geolocation permission.
    if (await isGeolocationAllowed()) {
      return this.getGeolocation();
    }

    // Requests permission and retrieves geolocation details if we are allowed.
    if (this.shouldPromptForGelolocationPermission && (await requestGeolocationPermission())) {
      return this.getGeolocation();
    }

    // Requests permission and retrieves geoIP details if we are allowed.
    if (this.shouldFallbackToGeoIP) {
      return this.getGeoIPlocation();
    }

    return Promise.reject(new Error('Unable to get current location'));
  }

  // Private functions

  private async getGeoIPlocation(): Promise<Location> {
    return (
      this.network
        .get(this.kStorcIPEndpoint)
        // eslint-disable-next-line complexity
        .then((response) => {
          const data = response.data;

          return {
            latitude: data && data.location && data.location.latitude,
            longitude: data && data.location && data.location.longitude,
            timezone: data && data.location && data.location.time_zone,
            postalCode: data && data.postal && data.postal.code,
            city: data && data.city && data.city.names && data.city.names.en,

            // TODO | BD: Check for other subdivisions.
            stateCode:
              data && data.subdivisions && data.subdivisions[0] && data.subdivisions[0].iso_code,

            countryCode: data && data.country && data.country.iso_code,
            continent: data && data.continent && data.continent.names && data.continent.names.en,
          };
        })
    );
  }

  private async getGeolocation(): Promise<Location> {
    return new Promise<Location>((resolve, reject) => {
      return navigator.geolocation.getCurrentPosition(
        (position) => {
          // TODO | BD: Retrieve more location details
          return resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        reject,
        {
          enableHighAccuracy: true,
          timeout: this.kLocationTimeout,
          maximumAge: this.kMaximumAge,
        }
      );
    });
  }
}
