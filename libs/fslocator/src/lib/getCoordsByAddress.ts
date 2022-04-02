import Geocoder from 'react-native-geocoder';
import { GeoLocation } from '@brandingbrand/types-location';

export default async function getCoordsByAddress(
  address: string,
  googleMapsAPIKey?: string
): Promise<GeoLocation | undefined> {
  return Geocoder.geocodeAddress(address).then((res) => {
    const [firstRes] = res;
    if (firstRes) {
      return {
        latitude: firstRes.position.lat,
        longitude: firstRes.position.lng,
      };
    }
    return undefined;
  });
}
