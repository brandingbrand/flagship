import FSNetwork from '@brandingbrand/fsnetwork';
import { GeoLocation } from '@brandingbrand/fsfoundation';

const client = new FSNetwork();
const GOOGLE_GEOCODER_URL = `https://maps.google.com/maps/api/geocode/json`;

export default async function getCoordsByAddress(
  address: string,
  googleMapsAPIKey?: string
): Promise<GeoLocation | undefined> {
  if (!googleMapsAPIKey) {
    throw new Error('googleMapsAPIKey is required.');
  }

  return client.get(
    `${GOOGLE_GEOCODER_URL}?key=${googleMapsAPIKey}&address=${encodeURIComponent(
      address
    )}`
  ).then(({ data }) => {
    if (data && data.results && data.results.length) {
      const loc = data.results[0].geometry.location;
      return {
        latitude: loc.lat,
        longitude: loc.lng
      };
    } else {
      return undefined;
    }
  });
}
