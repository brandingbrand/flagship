import { Platform } from 'react-native';
import { GeoLocation } from '@brandingbrand/fsfoundation';
import { GeoLocationDelta, Location } from '../types/Location';
import promptToLink from './promptToLink';

const NOT_NUMBER_REGEX = /[^\d]/g;
const kDeltaLatitudePadding = 0.19;
const kDeltaLongitudePadding = 0.19;

export function getCenter(locations: Location[]): GeoLocation {
  const lat =
    (Math.max.apply(
      null,
      locations.map((s) => s.address.latlng.lat)
    ) +
      Math.min.apply(
        null,
        locations.map((s) => s.address.latlng.lat)
      )) /
    2;
  const lon =
    (Math.max.apply(
      null,
      locations.map((s) => s.address.latlng.lng)
    ) +
      Math.min.apply(
        null,
        locations.map((s) => s.address.latlng.lng)
      )) /
    2;
  return {
    latitude: lat,
    longitude: lon,
  };
}

export function getDelta(locations: any[]): GeoLocationDelta {
  const lat =
    Math.max.apply(
      null,
      locations.map((s) => s.address.latlng.lat)
    ) -
    Math.min.apply(
      null,
      locations.map((s) => s.address.latlng.lat)
    ) +
    kDeltaLatitudePadding;
  const lon =
    Math.max.apply(
      null,
      locations.map((s) => s.address.latlng.lng)
    ) -
    Math.min.apply(
      null,
      locations.map((s) => s.address.latlng.lng)
    ) +
    kDeltaLongitudePadding;
  return {
    latitudeDelta: lat,
    longitudeDelta: lon,
  };
}

export async function callPhone(phone: string): Promise<any> {
  return promptToLink({
    title: formatPhone(phone),
    subTitle: '',
    buttonText: 'Call',
    link: `tel:${phone}`,
  });
}

export async function startDirections(title: string, address: any): Promise<any> {
  const link = getMapLink(address);

  return promptToLink({
    title:
      [address.address1, address.address2].filter(Boolean).join(' ') +
      ` ${address.city}, ${address.state} ${address.zip}`,
    subTitle: '',
    buttonText: 'Start Navigation',
    link,
  });
}

export function getMapLink(address: any): string {
  const isIOSWeb = Platform.OS === 'web' && /(iPad|iPhone|iPod)/gi.test(navigator.userAgent);

  return Platform.OS === 'ios' || isIOSWeb
    ? 'https://maps.apple.com/maps?daddr=' +
        encodeURIComponent(address.latlng.lat) +
        ',' +
        encodeURIComponent(address.latlng.lng)
    : 'https://maps.google.com/maps?daddr=' +
        encodeURIComponent(address.latlng.lat) +
        ',' +
        encodeURIComponent(address.latlng.lng);
}

export function formatPhone(str: string = ''): string {
  str = (str + '').replace(NOT_NUMBER_REGEX, '');

  // TODO: support formatting international number
  if (str.length !== 10) {
    return str;
  }

  return `(${str.substring(0, 3)}) ${str.substring(3, 6)}-${str.substring(6, 10)}`;
}

// calculate distance between two geolocations in miles, with one decimal digit
// https://stackoverflow.com/a/21623206
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos.bind(undefined);
  const a =
    0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
  const miles = 12742 * 0.621371 * Math.asin(Math.sqrt(a)) * 10;

  return Math.round(miles) / 10;
}

export function isCoordinateChanged(coord1?: GeoLocation, coord2?: GeoLocation): boolean {
  if (coord1 && coord2) {
    if (coord1.latitude === coord2.latitude && coord1.longitude === coord2.longitude) {
      return false;
    } else {
      return true;
    }
  } else if (coord1 && !coord2) {
    return true;
  } else if (!coord1 && coord2) {
    return true;
  } else {
    return false;
  }
}
