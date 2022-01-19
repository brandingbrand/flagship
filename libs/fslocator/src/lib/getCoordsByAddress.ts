import Geocoder from 'react-native-geocoder';
import { GeoLocation } from '@brandingbrand/types-location';

export default async function getCoordsByAddress(
  address: string,
  googleMapsAPIKey?: string
): Promise<GeoLocation | undefined> {
  return Geocoder.geocodeAddress(address).then((res) => {
    if (res && res.length) {
      return {
        latitude: res[0].position.lat,
        longitude: res[0].position.lng,
      };
    }
    return undefined;
  });
}
