import { Platform } from 'react-native';

import type { GeoLocation } from '@brandingbrand/types-location';

import type { GeoLocationDelta, Location } from '../types/Location';

import promptToLink from './promptToLink';

const NOT_NUMBER_REGEX = /\D/g;
const kDeltaLatitudePadding = 0.19;
const kDeltaLongitudePadding = 0.19;

export const getCenter = (locations: Location[]): GeoLocation => {
  const lat =
    (Math.max.apply(
      null,
      locations.map((location) => location.address.latlng.lat)
    ) +
      Math.min.apply(
        null,
        locations.map((location) => location.address.latlng.lat)
      )) /
    2;
  const lon =
    (Math.max.apply(
      null,
      locations.map((location) => location.address.latlng.lng)
    ) +
      Math.min.apply(
        null,
        locations.map((location) => location.address.latlng.lng)
      )) /
    2;
  return {
    latitude: lat,
    longitude: lon,
  };
};

export const getDelta = (locations: any[]): GeoLocationDelta => {
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
};

export const callPhone = async (phone: string): Promise<unknown> =>
  promptToLink({
    title: formatPhone(phone),
    subTitle: '',
    buttonText: 'Call',
    link: `tel:${phone}`,
  });

export const startDirections = async (title: string, address: any): Promise<unknown> => {
  const link = getMapLink(address);

  return promptToLink({
    title: `${[address.address1, address.address2].filter(Boolean).join(' ')} ${address.city}, ${
      address.state
    } ${address.zip}`,
    subTitle: '',
    buttonText: 'Start Navigation',
    link,
  });
};

export const getMapLink = (address: any): string => {
  const isIOSWeb = Platform.OS === 'web' && /(ipad|iphone|ipod)/gi.test(navigator.userAgent);

  return Platform.OS === 'ios' || isIOSWeb
    ? `https://maps.apple.com/maps?daddr=${encodeURIComponent(
        address.latlng.lat
      )},${encodeURIComponent(address.latlng.lng)}`
    : `https://maps.google.com/maps?daddr=${encodeURIComponent(
        address.latlng.lat
      )},${encodeURIComponent(address.latlng.lng)}`;
};

export const formatPhone = (str = ''): string => {
  str = `${str}`.replace(NOT_NUMBER_REGEX, '');

  // TODO: support formatting international number
  if (str.length !== 10) {
    return str;
  }

  return `(${str.slice(0, 3)}) ${str.slice(3, 6)}-${str.slice(6, 10)}`;
};

// calculate distance between two geolocations in miles, with one decimal digit
// https://stackoverflow.com/a/21623206
export const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const p = 0.017453292519943295; // Math.PI / 180
  const c = Math.cos.bind(undefined);
  const a =
    0.5 - c((lat2 - lat1) * p) / 2 + (c(lat1 * p) * c(lat2 * p) * (1 - c((lon2 - lon1) * p))) / 2;
  const miles = 12742 * 0.621371 * Math.asin(Math.sqrt(a)) * 10;

  return Math.round(miles) / 10;
};

export const isCoordinateChanged = (coord1?: GeoLocation, coord2?: GeoLocation): boolean => {
  if (coord1 && coord2) {
    if (coord1.latitude === coord2.latitude && coord1.longitude === coord2.longitude) {
      return false;
    }
    return true;
  } else if (coord1 && !coord2) {
    return true;
  } else if (!coord1 && coord2) {
    return true;
  }
  return false;
};
