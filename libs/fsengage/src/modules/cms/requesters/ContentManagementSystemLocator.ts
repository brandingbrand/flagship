import { FSNetwork } from '@brandingbrand/fsnetwork';
import type { GeoLocation } from '@brandingbrand/types-location';

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
  constructor(shouldPromptForGelolocationPermission = false, shouldFallbackToGeoIP = false) {
    this.shouldPromptForGelolocationPermission = shouldPromptForGelolocationPermission;
    this.shouldFallbackToGeoIP = shouldFallbackToGeoIP;
    this.network = new FSNetwork();
  }

  private readonly kStorcIPEndpoint: string = 'https://api.brandingbrand.com/storc/v2/geoip/';
  private readonly kLocationTimeout: number = 20 * 1000; // Milliseconds
  private readonly kMaximumAge: number = 1 * 1000; // Milliseconds
  private readonly network: FSNetwork;

  public shouldPromptForGelolocationPermission: boolean;
  public shouldFallbackToGeoIP: boolean;

  private async getGeoIPlocation(): Promise<Location> {
    return this.network
      .get(this.kStorcIPEndpoint)

      .then((response) => {
        const { data } = response;

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
      });
  }

  private async getGeolocation(): Promise<Location> {
    return new Promise<Location>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (position) =>
          // TODO | BD: Retrieve more location details
          {
            resolve({
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

  public async getCurrentLocation(): Promise<Location> {
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

    throw new Error('Unable to get current location');
  }
}
