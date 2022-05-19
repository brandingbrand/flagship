import Geocoder from 'react-native-geocoder';

import type { GeoLocation } from '@brandingbrand/types-location';

const getCoordsByAddress = async (
  address: string,
  googleMapsAPIKey?: string
): Promise<GeoLocation | undefined> =>
  Geocoder.geocodeAddress(address).then((res) => {
    const [firstRes] = res;
    if (firstRes) {
      return {
        latitude: firstRes.position.lat,
        longitude: firstRes.position.lng,
      };
    }
    return undefined;
  });

export default getCoordsByAddress;
